from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from enum import Enum
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
INVITATION_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Career Tinder Admin API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Admin router for admin-specific endpoints
admin_router = APIRouter(prefix="/admin")

# Enums
class AdminRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MODERATOR = "moderator"

class UserStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    BANNED = "banned"

class InvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    EXPIRED = "expired"

# Define Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: Optional[str] = None
    status: UserStatus = UserStatus.ACTIVE
    is_professional: bool = False
    profile_data: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    password_hash: str
    role: AdminRole
    permissions: List[str] = []
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    is_active: bool = True

class Invitation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: AdminRole
    permissions: List[str] = []
    invited_by: str
    token: str
    expires_at: datetime
    status: InvitationStatus = InvitationStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Report(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reporter_id: str
    reported_user_id: str
    reason: str
    description: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None

# Request Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: AdminRole
    permissions: List[str] = []

class AdminInvite(BaseModel):
    email: EmailStr
    role: AdminRole
    permissions: List[str] = []

class AdminAcceptInvitation(BaseModel):
    token: str
    name: str
    password: str

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[UserStatus] = None

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_invitation_token(email: str, role: str):
    expire = datetime.utcnow() + timedelta(hours=INVITATION_TOKEN_EXPIRE_HOURS)
    to_encode = {"email": email, "role": role, "exp": expire}
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
    
    return Admin(**admin)

def check_permission(admin: Admin, required_permission: str):
    if admin.role == AdminRole.SUPER_ADMIN:
        return True
    return required_permission in admin.permissions

async def send_invitation_email(email: str, token: str, invited_by: str):
    # Mock implementation - in production, use real email service
    print(f"Sending invitation email to {email}")
    print(f"Invitation token: {token}")
    print(f"Invited by: {invited_by}")
    # In production, integrate with services like SendGrid, SES, etc.
    return True
@app.on_event("startup")
async def startup_event():
    # Print all registered routes
    for route in app.routes:
        print(f"Route: {route.path}, Methods: {route.methods}")
    
    # Print all registered routes in the API router
    for route in api_router.routes:
        print(f"API Router Route: {route.path}, Methods: {route.methods}")

@api_router.get("/test")
async def test_route():
    return {"message": "Test route works!"}

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the routers in the main app
app.include_router(api_router)
api_router.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Admin Authentication Routes
@admin_router.post("/login")
async def admin_login(login_data: AdminLogin):
    admin = await db.admins.find_one({"email": login_data.email})
    if not admin or not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not admin.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
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

@admin_router.get("/me")
async def get_current_admin_profile(current_admin: Admin = Depends(get_current_admin)):
    return {
        "id": current_admin.id,
        "email": current_admin.email,
        "name": current_admin.name,
        "role": current_admin.role,
        "permissions": current_admin.permissions,
        "created_at": current_admin.created_at,
        "last_login": current_admin.last_login
    }

# Admin Management Routes
@admin_router.post("/invite")
async def invite_admin(
    invite_data: AdminInvite,
    current_admin: Admin = Depends(get_current_admin)
):
    # Check permissions
    if not check_permission(current_admin, "invite_admins"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Check if email already exists
    existing_admin = await db.admins.find_one({"email": invite_data.email})
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists"
        )
    
    # Check if invitation already exists
    existing_invitation = await db.invitations.find_one({
        "email": invite_data.email,
        "status": InvitationStatus.PENDING
    })
    if existing_invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation already sent to this email"
        )
    
    # Create invitation token
    token = create_invitation_token(invite_data.email, invite_data.role.value)
    
    # Create invitation record
    invitation = Invitation(
        email=invite_data.email,
        role=invite_data.role,
        permissions=invite_data.permissions,
        invited_by=current_admin.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=INVITATION_TOKEN_EXPIRE_HOURS)
    )
    
    await db.invitations.insert_one(invitation.dict())
    
    # Send invitation email
    await send_invitation_email(invite_data.email, token, current_admin.name)
    
    return {"message": "Invitation sent successfully", "invitation_id": invitation.id}

@admin_router.post("/accept-invitation")
async def accept_invitation(accept_data: AdminAcceptInvitation):
    try:
        payload = jwt.decode(accept_data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        role = payload.get("role")
        
        if not email or not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid invitation token"
            )
        
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired invitation token"
        )
    
    # Find invitation
    invitation = await db.invitations.find_one({
        "email": email,
        "token": accept_data.token,
        "status": InvitationStatus.PENDING
    })
    
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation not found or already accepted"
        )
    
    # Check if invitation is expired
    if datetime.utcnow() > invitation["expires_at"]:
        await db.invitations.update_one(
            {"id": invitation["id"]},
            {"$set": {"status": InvitationStatus.EXPIRED}}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation has expired"
        )
    
    # Create admin account
    admin = Admin(
        email=email,
        name=accept_data.name,
        password_hash=get_password_hash(accept_data.password),
        role=AdminRole(role),
        permissions=invitation.get("permissions", []),
        created_by=invitation["invited_by"]
    )
    
    await db.admins.insert_one(admin.dict())
    
    # Update invitation status
    await db.invitations.update_one(
        {"id": invitation["id"]},
        {"$set": {"status": InvitationStatus.ACCEPTED}}
    )
    
    return {"message": "Account created successfully", "admin_id": admin.id}

@admin_router.get("/list")
async def list_admins(current_admin: Admin = Depends(get_current_admin)):
    if not check_permission(current_admin, "view_admins"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
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

@admin_router.get("/invitations")
async def list_invitations(current_admin: Admin = Depends(get_current_admin)):
    if not check_permission(current_admin, "view_invitations"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    invitations = await db.invitations.find().to_list(1000)
    return [
        {
            "id": invitation["id"],
            "email": invitation["email"],
            "role": invitation["role"],
            "permissions": invitation.get("permissions", []),
            "invited_by": invitation["invited_by"],
            "status": invitation["status"],
            "created_at": invitation["created_at"],
            "expires_at": invitation["expires_at"]
        }
        for invitation in invitations
    ]

# User Management Routes
@admin_router.get("/users")
async def list_users(
    page: int = 1,
    limit: int = 20,
    current_admin: Admin = Depends(get_current_admin)
):
    if not check_permission(current_admin, "view_users"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    skip = (page - 1) * limit
    users = await db.users.find().skip(skip).limit(limit).to_list(limit)
    total = await db.users.count_documents({})
    
    return {
        "users": [
            {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "phone": user.get("phone"),
                "status": user.get("status", "active"),
                "is_professional": user.get("is_professional", False),
                "created_at": user["created_at"],
                "last_login": user.get("last_login")
            }
            for user in users
        ],
        "total": total,
        "page": page,
        "limit": limit
    }

@api_router.put("/admin/users/{user_id}")
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_admin: Admin = Depends(get_current_admin)
):
    if not check_permission(current_admin, "modify_users"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = {}
    if user_update.name is not None:
        update_data["name"] = user_update.name
    if user_update.phone is not None:
        update_data["phone"] = user_update.phone
    if user_update.status is not None:
        update_data["status"] = user_update.status.value
    
    if update_data:
        await db.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )
    
    return {"message": "User updated successfully"}

@api_router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    if not check_permission(current_admin, "delete_users"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.users.delete_one({"id": user_id})
    return {"message": "User deleted successfully"}

# Statistics Routes
@api_router.get("/admin/stats")
async def get_platform_stats(current_admin: Admin = Depends(get_current_admin)):
    if not check_permission(current_admin, "view_stats"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    total_users = await db.users.count_documents({})
    total_professionals = await db.users.count_documents({"is_professional": True})
    total_admins = await db.admins.count_documents({})
    total_reports = await db.reports.count_documents({})
    pending_reports = await db.reports.count_documents({"status": "pending"})
    
    return {
        "total_users": total_users,
        "total_professionals": total_professionals,
        "total_admins": total_admins,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "stats_generated_at": datetime.utcnow()
    }

# Reports Management Routes
@api_router.get("/admin/reports")
async def list_reports(
    page: int = 1,
    limit: int = 20,
    status: Optional[str] = None,
    current_admin: Admin = Depends(get_current_admin)
):
    if not check_permission(current_admin, "view_reports"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    query = {}
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    reports = await db.reports.find(query).skip(skip).limit(limit).to_list(limit)
    total = await db.reports.count_documents(query)
    
    return {
        "reports": [
            {
                "id": report["id"],
                "reporter_id": report["reporter_id"],
                "reported_user_id": report["reported_user_id"],
                "reason": report["reason"],
                "description": report["description"],
                "status": report["status"],
                "created_at": report["created_at"],
                "resolved_by": report.get("resolved_by"),
                "resolved_at": report.get("resolved_at")
            }
            for report in reports
        ],
        "total": total,
        "page": page,
        "limit": limit
    }

@api_router.put("/admin/reports/{report_id}/resolve")
async def resolve_report(
    report_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    if not check_permission(current_admin, "resolve_reports"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    report = await db.reports.find_one({"id": report_id})
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    await db.reports.update_one(
        {"id": report_id},
        {"$set": {
            "status": "resolved",
            "resolved_by": current_admin.id,
            "resolved_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Report resolved successfully"}

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
