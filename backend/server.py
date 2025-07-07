from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class UserType(str, Enum):
    PARTICULIER = "particulier"
    PROFESSIONNEL = "professionnel"

class ProfessionCategory(str, Enum):
    ELECTRICIEN = "electricien"
    PLOMBIER = "plombier"
    MENUISIER = "menuisier"
    PEINTRE = "peintre"
    MACON = "macon"
    CHAUFFAGISTE = "chauffagiste"
    CARRELEUR = "carreleur"
    AUTRE = "autre"

class SwipeType(str, Enum):
    LIKE = "like"  # swipe vers le haut
    PASS = "pass"  # swipe vers le bas


# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    user_type: UserType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class UserCreate(BaseModel):
    email: str
    name: str
    user_type: UserType

class Profile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    bio: str
    location: str
    rating: float = 0.0
    reviews_count: int = 0
    profile_image: Optional[str] = None
    portfolio_images: List[str] = []
    # Specific to professionals
    profession_category: Optional[ProfessionCategory] = None
    experience_years: Optional[int] = None
    hourly_rate: Optional[float] = None
    availability: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProfileCreate(BaseModel):
    user_id: str
    bio: str
    location: str
    profession_category: Optional[ProfessionCategory] = None
    experience_years: Optional[int] = None
    hourly_rate: Optional[float] = None
    profile_image: Optional[str] = None

class Swipe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    swiper_id: str  # qui fait le swipe
    swiped_id: str  # qui se fait swiper
    swipe_type: SwipeType
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SwipeCreate(BaseModel):
    swiper_id: str
    swiped_id: str
    swipe_type: SwipeType

class Match(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user1_id: str
    user2_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# Helper functions
async def check_for_match(swiper_id: str, swiped_id: str) -> Optional[Match]:
    """Check if there's a mutual like and create a match if so"""
    # Check if the other user also liked this user
    mutual_like = await db.swipes.find_one({
        "swiper_id": swiped_id,
        "swiped_id": swiper_id,
        "swipe_type": SwipeType.LIKE
    })
    
    if mutual_like:
        # Create a match
        match = Match(user1_id=swiper_id, user2_id=swiped_id)
        await db.matches.insert_one(match.dict())
        return match
    return None

async def get_potential_matches(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Get potential profiles to swipe on"""
    # Get user's previous swipes to exclude them
    previous_swipes = await db.swipes.find({"swiper_id": user_id}).to_list(1000)
    swiped_ids = [swipe["swiped_id"] for swipe in previous_swipes]
    
    # Get user's profile to determine matching logic
    user_profile = await db.profiles.find_one({"user_id": user_id})
    if not user_profile:
        return []
    
    # Build query to exclude already swiped profiles and same user
    exclude_ids = swiped_ids + [user_id]
    query = {
        "user_id": {"$nin": exclude_ids},
        "availability": True
    }
    
    # Get potential matches
    potential_matches = await db.profiles.find(query).limit(limit).to_list(limit)
    
    # Convert ObjectId to string for JSON serialization
    for match in potential_matches:
        if '_id' in match:
            match['_id'] = str(match['_id'])
    
    return potential_matches


# API Routes
@api_router.get("/")
async def root():
    return {"message": "Swipe Ton Pro API - Ready for matching!"}

# User routes
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# Profile routes
@api_router.post("/profiles", response_model=Profile)
async def create_profile(profile: ProfileCreate):
    profile_dict = profile.dict()
    profile_obj = Profile(**profile_dict)
    await db.profiles.insert_one(profile_obj.dict())
    return profile_obj

@api_router.get("/profiles/{profile_id}", response_model=Profile)
async def get_profile(profile_id: str):
    profile = await db.profiles.find_one({"id": profile_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(**profile)

@api_router.get("/profiles/user/{user_id}", response_model=Profile)
async def get_profile_by_user(user_id: str):
    profile = await db.profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(**profile)

# Matching routes
@api_router.get("/matches/{user_id}")
async def get_potential_matches_for_user(user_id: str, limit: int = 10):
    """Get potential profiles to swipe on for a user"""
    matches = await get_potential_matches(user_id, limit)
    return {"profiles": matches}

@api_router.post("/swipes")
async def create_swipe(swipe: SwipeCreate):
    """Create a swipe and check for match"""
    # Save the swipe
    swipe_dict = swipe.dict()
    swipe_obj = Swipe(**swipe_dict)
    await db.swipes.insert_one(swipe_obj.dict())
    
    # Check for match if it's a like
    match = None
    if swipe.swipe_type == SwipeType.LIKE:
        match = await check_for_match(swipe.swiper_id, swipe.swiped_id)
    
    return {
        "swipe": swipe_obj,
        "match": match.dict() if match else None,
        "is_match": match is not None
    }

@api_router.get("/matches/user/{user_id}")
async def get_user_matches(user_id: str):
    """Get all matches for a user"""
    matches = await db.matches.find({
        "$or": [
            {"user1_id": user_id},
            {"user2_id": user_id}
        ],
        "is_active": True
    }).to_list(1000)
    
    # Get profile info for each match
    enriched_matches = []
    for match in matches:
        other_user_id = match["user2_id"] if match["user1_id"] == user_id else match["user1_id"]
        other_profile = await db.profiles.find_one({"user_id": other_user_id})
        if other_profile:
            enriched_matches.append({
                "match": match,
                "profile": other_profile
            })
    
    return {"matches": enriched_matches}

# Legacy status check routes (keeping for compatibility)
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
