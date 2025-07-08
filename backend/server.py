from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import uuid
import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field, EmailStr
import bcrypt
from enum import Enum

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-this')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI(title="SwipeTonPro API")
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class UserType(str, Enum):
    PARTICULIER = "particulier"
    ARTISAN = "artisan"
    ADMIN = "admin"

class SwipeAction(str, Enum):
    LIKE = "like"
    PASS = "pass"

class ProfessionType(str, Enum):
    ELECTRICIEN = "electricien"
    PLOMBIER = "plombier"
    MENUISIER = "menuisier"
    PEINTRE = "peintre"
    MACON = "macon"
    CHAUFFAGISTE = "chauffagiste"
    CARRELEUR = "carreleur"

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    user_type: UserType
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ArtisanProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    profession: ProfessionType
    description: str
    experience_years: int
    rating: float = 0.0
    reviews_count: int = 0
    hourly_rate: Optional[float] = None
    location: str
    portfolio_images: List[str] = []
    certifications: List[str] = []
    availability: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ArtisanProfileCreate(BaseModel):
    profession: ProfessionType
    description: str
    experience_years: int
    hourly_rate: Optional[float] = None
    location: str
    portfolio_images: List[str] = []
    certifications: List[str] = []

class SwipeRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Particulier qui swipe
    target_id: str  # Artisan qui est swipé
    action: SwipeAction
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SwipeCreate(BaseModel):
    target_id: str
    action: SwipeAction

class Match(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    particulier_id: str
    artisan_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    is_active: bool = True

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Particulier
    title: str
    description: str
    budget: Optional[float] = None
    profession_needed: ProfessionType
    location: str
    urgency: str = "normal"  # normal, urgent, flexible
    images: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"  # active, completed, cancelled

class ProjectCreate(BaseModel):
    title: str
    description: str
    budget: Optional[float] = None
    profession_needed: ProfessionType
    location: str
    urgency: str = "normal"
    images: List[str] = []

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

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    
    user_dict = {
        "id": user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "user_type": user.user_type,
        "password_hash": hashed_password,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user_dict)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    user = await db.users.find_one({"email": user_credentials.email})
    if not user or not verify_password(user_credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# Artisan profile endpoints
@api_router.post("/artisan/profile", response_model=ArtisanProfile)
async def create_artisan_profile(
    profile: ArtisanProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans can create profiles")
    
    # Check if profile already exists
    existing_profile = await db.artisan_profiles.find_one({"user_id": current_user["id"]})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    profile_dict = profile.dict()
    profile_dict["id"] = str(uuid.uuid4())
    profile_dict["user_id"] = current_user["id"]
    profile_dict["created_at"] = datetime.utcnow()
    profile_dict["updated_at"] = datetime.utcnow()
    
    await db.artisan_profiles.insert_one(profile_dict)
    return ArtisanProfile(**profile_dict)

@api_router.get("/artisan/profiles", response_model=List[ArtisanProfile])
async def get_artisan_profiles(
    profession: Optional[ProfessionType] = None,
    location: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {"availability": True}
    if profession:
        query["profession"] = profession
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    profiles = await db.artisan_profiles.find(query).to_list(50)
    return [ArtisanProfile(**profile) for profile in profiles]

# Swipe endpoints
@api_router.post("/swipe")
async def swipe(
    swipe_data: SwipeCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.PARTICULIER:
        raise HTTPException(status_code=403, detail="Only particuliers can swipe")
    
    # Check if already swiped
    existing_swipe = await db.swipes.find_one({
        "user_id": current_user["id"],
        "target_id": swipe_data.target_id
    })
    if existing_swipe:
        raise HTTPException(status_code=400, detail="Already swiped on this profile")
    
    # Create swipe record
    swipe_record = SwipeRecord(
        user_id=current_user["id"],
        target_id=swipe_data.target_id,
        action=swipe_data.action
    )
    
    await db.swipes.insert_one(swipe_record.dict())
    
    # Check for match if it's a like
    if swipe_data.action == SwipeAction.LIKE:
        # Check if artisan has liked this particulier back (future feature)
        # For now, we'll assume any like creates a match
        match = Match(
            particulier_id=current_user["id"],
            artisan_id=swipe_data.target_id
        )
        await db.matches.insert_one(match.dict())
        return {"message": "It's a match!", "match_id": match.id}
    
    return {"message": "Swipe recorded"}

@api_router.get("/matches")
async def get_matches(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] == UserType.PARTICULIER:
        matches = await db.matches.find({"particulier_id": current_user["id"]}).to_list(100)
    else:
        matches = await db.matches.find({"artisan_id": current_user["id"]}).to_list(100)
    
    return [Match(**match) for match in matches]

# Project endpoints
@api_router.post("/projects", response_model=Project)
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.PARTICULIER:
        raise HTTPException(status_code=403, detail="Only particuliers can create projects")
    
    project_dict = project.dict()
    project_dict["id"] = str(uuid.uuid4())
    project_dict["user_id"] = current_user["id"]
    project_dict["created_at"] = datetime.utcnow()
    
    await db.projects.insert_one(project_dict)
    return Project(**project_dict)

@api_router.get("/projects", response_model=List[Project])
async def get_projects(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] == UserType.PARTICULIER:
        projects = await db.projects.find({"user_id": current_user["id"]}).to_list(100)
    else:
        projects = await db.projects.find({"status": "active"}).to_list(100)
    
    return [Project(**project) for project in projects]

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include router
app.include_router(api_router)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)