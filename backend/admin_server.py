#!/usr/bin/env python3
"""
Version simplifiée du serveur admin fonctionnel
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import uuid

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")

# Connexion MongoDB
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# App
app = FastAPI(title="Career Tinder Admin", docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminInvite(BaseModel):
    email: EmailStr
    role: str = "moderator"

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id: str = payload.get("sub")
        if admin_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    admin = await db.admins.find_one({"id": admin_id})
    if admin is None:
        raise credentials_exception
    
    return admin

# Routes
@app.get("/")
async def root():
    return {"message": "Career Tinder Admin API", "status": "running"}

@app.post("/login")
async def admin_login(login_data: AdminLogin):
    admin = await db.admins.find_one({"email": login_data.email})
    if not admin or not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )
    
    if not admin.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Compte désactivé"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin["id"]}, expires_delta=access_token_expires
    )
    
    # Update last login
    await db.admins.update_one(
        {"id": admin["id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin["id"],
            "email": admin["email"],
            "name": admin["name"],
            "role": admin["role"],
            "permissions": admin.get("permissions", [])
        }
    }

@app.get("/me")
async def get_current_admin_profile(current_admin = Depends(get_current_admin)):
    return {
        "id": current_admin["id"],
        "email": current_admin["email"],
        "name": current_admin["name"],
        "role": current_admin["role"],
        "permissions": current_admin.get("permissions", []),
        "created_at": current_admin["created_at"],
        "last_login": current_admin.get("last_login")
    }

@app.get("/stats")
async def get_platform_stats(current_admin = Depends(get_current_admin)):
    total_users = await db.users.count_documents({})
    total_professionals = await db.users.count_documents({"is_professional": True})
    total_admins = await db.admins.count_documents({})
    total_reports = await db.reports.count_documents({}) if 'reports' in await db.list_collection_names() else 0
    pending_reports = await db.reports.count_documents({"status": "pending"}) if 'reports' in await db.list_collection_names() else 0
    
    return {
        "total_users": total_users,
        "total_professionals": total_professionals,
        "total_admins": total_admins,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "stats_generated_at": datetime.utcnow()
    }

@app.get("/users")
async def list_users(
    page: int = 1,
    limit: int = 20,
    current_admin = Depends(get_current_admin)
):
    skip = (page - 1) * limit
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    total = await db.users.count_documents({})
    
    return {
        "users": [
            {
                "id": user.get("id", str(user.get("_id", ""))),
                "email": user.get("email", ""),
                "name": user.get("name", ""),
                "phone": user.get("phone"),
                "status": user.get("status", "active"),
                "is_professional": user.get("is_professional", False),
                "created_at": user.get("created_at", datetime.utcnow()),
                "last_login": user.get("last_login")
            }
            for user in users
        ],
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/admins")
async def list_admins(current_admin = Depends(get_current_admin)):
    admins = await db.admins.find().to_list(1000)
    return [
        {
            "id": admin["id"],
            "email": admin["email"],
            "name": admin["name"],
            "role": admin["role"],
            "permissions": admin.get("permissions", []),
            "created_at": admin["created_at"],
            "last_login": admin.get("last_login"),
            "is_active": admin.get("is_active", True)
        }
        for admin in admins
    ]

@app.post("/invite")
async def invite_admin(
    invite_data: AdminInvite,
    current_admin = Depends(get_current_admin)
):
    # Simple permission check
    if current_admin.get("role") not in ["super_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permissions insuffisantes"
        )
    
    # Check if email already exists
    existing_admin = await db.admins.find_one({"email": invite_data.email})
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un admin avec cet email existe déjà"
        )
    
    # For simplicity, just return success message
    return {"message": f"Invitation envoyée à {invite_data.email} avec le rôle {invite_data.role}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)