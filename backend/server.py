from fastapi import FastAPI, APIRouter, Depends, HTTPException, File, UploadFile, status
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
import jwt
import bcrypt
from enum import Enum
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-here')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# Stripe Configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Create the main app without a prefix
app = FastAPI(title="Swipe-ton-pro API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Enums
class UserType(str, Enum):
    FREELANCER = "freelancer"
    COMPANY = "company"
    INDIVIDUAL = "individual"

class CompanyStatus(str, Enum):
    MICRO_ENTREPRISE = "micro_entreprise"
    SARL = "sarl"
    SAS = "sas"
    EURL = "eurl"
    AUTO_ENTREPRENEUR = "auto_entrepreneur"
    ASSOCIATION = "association"
    OTHER = "other"

class DocumentType(str, Enum):
    KBIS = "kbis"
    CARTE_IDENTITE = "carte_identite"
    JUSTIFICATIF_DOMICILE = "justificatif_domicile"
    DIPLOME = "diplome"
    PORTFOLIO = "portfolio"
    OTHER = "other"

class DocumentStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class UserStatus(str, Enum):
    GHOST = "ghost"  # Mode fantôme
    VALIDATED = "validated"  # Validé
    SUSPENDED = "suspended"  # Suspendu

class SwipeAction(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"

class MessageType(str, Enum):
    TEXT = "text"
    QUOTE_REQUEST = "quote_request"
    MEETING_REQUEST = "meeting_request"

# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    user_type: UserType
    company_status: Optional[CompanyStatus] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    description: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    status: UserStatus
    is_featured: bool = False
    created_at: datetime
    updated_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ProfileBase(BaseModel):
    title: str
    description: str
    skills: List[str] = []
    experience_years: Optional[int] = None
    location: Optional[str] = None
    hourly_rate: Optional[float] = None
    availability: Optional[str] = None
    portfolio_images: List[str] = []  # Base64 encoded images

class ProfileCreate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

class DocumentBase(BaseModel):
    name: str
    document_type: DocumentType
    content: str  # Base64 encoded file

class DocumentCreate(DocumentBase):
    pass

class DocumentResponse(DocumentBase):
    id: str
    user_id: str
    status: DocumentStatus
    admin_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class SwipeBase(BaseModel):
    target_user_id: str
    action: SwipeAction

class SwipeCreate(SwipeBase):
    pass

class SwipeResponse(SwipeBase):
    id: str
    user_id: str
    created_at: datetime

class MatchResponse(BaseModel):
    id: str
    user1_id: str
    user2_id: str
    created_at: datetime
    is_chat_unlocked: bool = False
    unlocked_by: Optional[str] = None

class MessageBase(BaseModel):
    content: str
    message_type: MessageType = MessageType.TEXT
    quote_amount: Optional[float] = None
    meeting_date: Optional[datetime] = None

class MessageCreate(MessageBase):
    match_id: str

class MessageResponse(MessageBase):
    id: str
    match_id: str
    sender_id: str
    created_at: datetime
    is_read: bool = False

class PaymentBase(BaseModel):
    amount: float
    currency: str = "EUR"
    match_id: str

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: str
    user_id: str
    stripe_payment_intent_id: Optional[str] = None
    status: str
    created_at: datetime

# Utility functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("user_type") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Routes
@api_router.get("/")
async def root():
    return {"message": "Swipe-ton-pro API"}

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = user_data.dict()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["id"] = str(uuid.uuid4())
    user_dict["status"] = UserStatus.GHOST
    user_dict["is_featured"] = False
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    await db.users.insert_one(user_dict)
    
    # Remove password from response
    user_dict.pop("password")
    return UserResponse(**user_dict)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user["id"]})
    user.pop("password")
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(**user)
    )

@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

@api_router.get("/users/featured", response_model=Optional[UserResponse])
async def get_featured_user():
    """Get the featured user profile for homepage"""
    featured_user = await db.users.find_one({"is_featured": True})
    if not featured_user:
        return None
    featured_user.pop("password", None)
    return UserResponse(**featured_user)

# Include the router in the main app
app.include_router(api_router)

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
