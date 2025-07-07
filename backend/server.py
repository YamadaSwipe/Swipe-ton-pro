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

# Profile endpoints
@api_router.post("/profiles", response_model=ProfileResponse)
async def create_profile(profile_data: ProfileCreate, current_user: dict = Depends(get_current_user)):
    # Check if user already has a profile
    existing_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    profile_dict = profile_data.dict()
    profile_dict["id"] = str(uuid.uuid4())
    profile_dict["user_id"] = current_user["id"]
    profile_dict["created_at"] = datetime.utcnow()
    profile_dict["updated_at"] = datetime.utcnow()
    
    await db.profiles.insert_one(profile_dict)
    return ProfileResponse(**profile_dict)

@api_router.get("/profiles/me", response_model=Optional[ProfileResponse])
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    profile = await db.profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        return None
    return ProfileResponse(**profile)

@api_router.put("/profiles/me", response_model=ProfileResponse)
async def update_my_profile(profile_data: ProfileCreate, current_user: dict = Depends(get_current_user)):
    profile_dict = profile_data.dict()
    profile_dict["updated_at"] = datetime.utcnow()
    
    result = await db.profiles.update_one(
        {"user_id": current_user["id"]},
        {"$set": profile_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    updated_profile = await db.profiles.find_one({"user_id": current_user["id"]})
    return ProfileResponse(**updated_profile)

@api_router.get("/profiles/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str, current_user: dict = Depends(get_current_user)):
    profile = await db.profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    return ProfileResponse(**profile)

# Document endpoints
@api_router.post("/documents", response_model=DocumentResponse)
async def upload_document(document_data: DocumentCreate, current_user: dict = Depends(get_current_user)):
    document_dict = document_data.dict()
    document_dict["id"] = str(uuid.uuid4())
    document_dict["user_id"] = current_user["id"]
    document_dict["status"] = DocumentStatus.PENDING
    document_dict["created_at"] = datetime.utcnow()
    document_dict["updated_at"] = datetime.utcnow()
    
    await db.documents.insert_one(document_dict)
    return DocumentResponse(**document_dict)

@api_router.get("/documents/me", response_model=List[DocumentResponse])
async def get_my_documents(current_user: dict = Depends(get_current_user)):
    documents = await db.documents.find({"user_id": current_user["id"]}).to_list(100)
    return [DocumentResponse(**doc) for doc in documents]

# Swipe endpoints
@api_router.post("/swipes", response_model=SwipeResponse)
async def create_swipe(swipe_data: SwipeCreate, current_user: dict = Depends(get_current_user)):
    # Check if user already swiped this profile
    existing_swipe = await db.swipes.find_one({
        "user_id": current_user["id"],
        "target_user_id": swipe_data.target_user_id
    })
    if existing_swipe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already swiped this profile"
        )
    
    swipe_dict = swipe_data.dict()
    swipe_dict["id"] = str(uuid.uuid4())
    swipe_dict["user_id"] = current_user["id"]
    swipe_dict["created_at"] = datetime.utcnow()
    
    await db.swipes.insert_one(swipe_dict)
    
    # Check for mutual match if it's a LIKE
    if swipe_data.action == SwipeAction.LIKE:
        mutual_swipe = await db.swipes.find_one({
            "user_id": swipe_data.target_user_id,
            "target_user_id": current_user["id"],
            "action": SwipeAction.LIKE
        })
        
        if mutual_swipe:
            # Create match
            match_dict = {
                "id": str(uuid.uuid4()),
                "user1_id": current_user["id"],
                "user2_id": swipe_data.target_user_id,
                "created_at": datetime.utcnow(),
                "is_chat_unlocked": False
            }
            await db.matches.insert_one(match_dict)
    
    return SwipeResponse(**swipe_dict)

@api_router.get("/swipes/candidates", response_model=List[UserResponse])
async def get_swipe_candidates(current_user: dict = Depends(get_current_user)):
    # Get users that haven't been swiped yet
    swiped_user_ids = await db.swipes.find(
        {"user_id": current_user["id"]},
        {"target_user_id": 1}
    ).to_list(1000)
    swiped_ids = [swipe["target_user_id"] for swipe in swiped_user_ids]
    swiped_ids.append(current_user["id"])  # Exclude self
    
    candidates = await db.users.find({
        "id": {"$nin": swiped_ids},
        "status": UserStatus.VALIDATED
    }).to_list(50)
    
    return [UserResponse(**{k: v for k, v in user.items() if k != "password"}) for user in candidates]

# Match endpoints
@api_router.get("/matches", response_model=List[MatchResponse])
async def get_my_matches(current_user: dict = Depends(get_current_user)):
    matches = await db.matches.find({
        "$or": [
            {"user1_id": current_user["id"]},
            {"user2_id": current_user["id"]}
        ]
    }).to_list(100)
    return [MatchResponse(**match) for match in matches]

@api_router.post("/matches/{match_id}/unlock", response_model=MatchResponse)
async def unlock_match_chat(match_id: str, current_user: dict = Depends(get_current_user)):
    match = await db.matches.find_one({"id": match_id})
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    # Check if user is part of this match
    if current_user["id"] not in [match["user1_id"], match["user2_id"]]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your match"
        )
    
    # Here you would integrate with Stripe for payment
    # For now, just unlock the chat
    await db.matches.update_one(
        {"id": match_id},
        {"$set": {
            "is_chat_unlocked": True,
            "unlocked_by": current_user["id"]
        }}
    )
    
    updated_match = await db.matches.find_one({"id": match_id})
    return MatchResponse(**updated_match)

# Message endpoints
@api_router.post("/messages", response_model=MessageResponse)
async def send_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
    # Check if match exists and chat is unlocked
    match = await db.matches.find_one({"id": message_data.match_id})
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    if not match["is_chat_unlocked"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat is locked. Payment required."
        )
    
    # Check if user is part of this match
    if current_user["id"] not in [match["user1_id"], match["user2_id"]]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your match"
        )
    
    message_dict = message_data.dict()
    message_dict["id"] = str(uuid.uuid4())
    message_dict["sender_id"] = current_user["id"]
    message_dict["created_at"] = datetime.utcnow()
    message_dict["is_read"] = False
    
    await db.messages.insert_one(message_dict)
    return MessageResponse(**message_dict)

@api_router.get("/messages/{match_id}", response_model=List[MessageResponse])
async def get_match_messages(match_id: str, current_user: dict = Depends(get_current_user)):
    # Check if match exists and user is part of it
    match = await db.matches.find_one({"id": match_id})
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match not found"
        )
    
    if current_user["id"] not in [match["user1_id"], match["user2_id"]]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not your match"
        )
    
    messages = await db.messages.find({"match_id": match_id}).sort("created_at", 1).to_list(100)
    return [MessageResponse(**msg) for msg in messages]

# Admin endpoints
@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(admin_user: dict = Depends(get_admin_user)):
    users = await db.users.find({}).to_list(1000)
    return [UserResponse(**{k: v for k, v in user.items() if k != "password"}) for user in users]

@api_router.put("/admin/users/{user_id}/validate", response_model=UserResponse)
async def validate_user(user_id: str, admin_user: dict = Depends(get_admin_user)):
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"status": UserStatus.VALIDATED, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    updated_user = await db.users.find_one({"id": user_id})
    updated_user.pop("password", None)
    return UserResponse(**updated_user)

@api_router.put("/admin/users/{user_id}/feature", response_model=UserResponse)
async def set_featured_user(user_id: str, admin_user: dict = Depends(get_admin_user)):
    # Remove featured status from all users
    await db.users.update_many({}, {"$set": {"is_featured": False}})
    
    # Set featured status for the specified user
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_featured": True, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    updated_user = await db.users.find_one({"id": user_id})
    updated_user.pop("password", None)
    return UserResponse(**updated_user)

@api_router.get("/admin/documents", response_model=List[DocumentResponse])
async def get_pending_documents(admin_user: dict = Depends(get_admin_user)):
    documents = await db.documents.find({"status": DocumentStatus.PENDING}).to_list(100)
    return [DocumentResponse(**doc) for doc in documents]

@api_router.put("/admin/documents/{document_id}/approve", response_model=DocumentResponse)
async def approve_document(document_id: str, admin_comment: Optional[str] = None, admin_user: dict = Depends(get_admin_user)):
    result = await db.documents.update_one(
        {"id": document_id},
        {"$set": {
            "status": DocumentStatus.APPROVED,
            "admin_comment": admin_comment,
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    updated_document = await db.documents.find_one({"id": document_id})
    return DocumentResponse(**updated_document)

@api_router.put("/admin/documents/{document_id}/reject", response_model=DocumentResponse)
async def reject_document(document_id: str, admin_comment: str, admin_user: dict = Depends(get_admin_user)):
    result = await db.documents.update_one(
        {"id": document_id},
        {"$set": {
            "status": DocumentStatus.REJECTED,
            "admin_comment": admin_comment,
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    updated_document = await db.documents.find_one({"id": document_id})
    return DocumentResponse(**updated_document)

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
