from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
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
import base64

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
    COUVREUR = "couvreur"
    SERRURERIE = "serrurerie"
    JARDINAGE = "jardinage"
    NETTOYAGE = "nettoyage"
    DEMENAGEMENT = "demenagement"

class ValidationStatus(str, Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    REJECTED = "rejected"

class CompanyType(str, Enum):
    ENTREPRISE_INDIVIDUELLE = "entreprise_individuelle"
    SARL = "sarl"
    SAS = "sas"
    SASU = "sasu"
    MICRO_ENTREPRISE = "micro_entreprise"
    AUTO_ENTREPRENEUR = "auto_entrepreneur"

class ProjectBudgetRange(str, Enum):
    MOINS_500 = "moins_500"
    ENTRE_500_1500 = "500_1500"
    ENTRE_1500_5000 = "1500_5000"
    ENTRE_5000_15000 = "5000_15000"
    PLUS_15000 = "plus_15000"

class SubscriptionPack(str, Enum):
    STARTER = "starter"      # 10 crédits - 49€
    PROFESSIONAL = "professional"  # 50 crédits - 149€
    PREMIUM = "premium"      # 150 crédits - 299€
    UNLIMITED = "unlimited"  # Illimité - 499€

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
    validation_status: Optional[ValidationStatus] = None
    credits: int = 0  # Crédits pour les artisans
    subscription_pack: Optional[SubscriptionPack] = None
    subscription_expires: Optional[datetime] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    pack: SubscriptionPack
    credits_included: int
    price: float
    purchased_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    is_active: bool = True

class SubscriptionCreate(BaseModel):
    pack: SubscriptionPack

class PackInfo(BaseModel):
    pack: SubscriptionPack
    name: str
    credits: int
    price: float
    features: List[str]
    popular: bool = False

class CompanyInfo(BaseModel):
    company_name: str
    siret: str
    company_type: CompanyType
    address: str
    city: str
    postal_code: str
    insurance_number: Optional[str] = None
    website: Optional[str] = None

class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # "kbis", "insurance", "certification", "rge", "other"
    file_data: str  # base64 encoded file
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    validated: bool = False

class ArtisanProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    professions: List[ProfessionType]  # Multi-choix métiers
    description: str
    experience_years: int
    rating: float = 0.0
    reviews_count: int = 0
    hourly_rate_min: Optional[float] = None
    hourly_rate_max: Optional[float] = None
    location: str
    radius_km: int = 50  # Rayon d'intervention
    portfolio_images: List[str] = []
    certifications: List[str] = []
    availability: bool = True
    company_info: CompanyInfo
    documents: List[Document] = []
    validation_status: ValidationStatus = ValidationStatus.PENDING
    validated_at: Optional[datetime] = None
    rejected_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ArtisanProfileCreate(BaseModel):
    professions: List[ProfessionType]
    description: str
    experience_years: int
    hourly_rate_min: Optional[float] = None
    hourly_rate_max: Optional[float] = None
    location: str
    radius_km: int = 50
    portfolio_images: List[str] = []
    certifications: List[str] = []
    company_info: CompanyInfo

class ParticulierProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    address: str
    city: str
    postal_code: str
    property_type: str  # "maison", "appartement", "local_commercial", "autre"
    property_size: Optional[int] = None  # m²
    preferred_contact: str = "email"  # "email", "phone", "both"
    availability_schedule: str = "flexible"  # "matin", "apres_midi", "soir", "weekend", "flexible"
    project_details: Dict[str, Any] = {}  # Détails projets visibles aux artisans
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ParticulierProfileCreate(BaseModel):
    address: str
    city: str
    postal_code: str
    property_type: str
    property_size: Optional[int] = None
    preferred_contact: str = "email"
    availability_schedule: str = "flexible"

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
    project_details_shared: bool = False  # Si détails projet partagés
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    is_active: bool = True

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Particulier
    title: str
    description: str
    budget_range: ProjectBudgetRange
    professions_needed: List[ProfessionType]  # Multi-choix métiers
    location: str
    urgency: str = "normal"  # normal, urgent, flexible
    images: List[str] = []
    technical_details: Dict[str, Any] = {}  # Détails techniques visibles aux artisans
    preferred_timeline: str = "flexible"  # "1_semaine", "1_mois", "3_mois", "flexible"
    access_constraints: str = ""  # Contraintes d'accès
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"  # active, completed, cancelled

class ProjectCreate(BaseModel):
    title: str
    description: str
    budget_range: ProjectBudgetRange
    professions_needed: List[ProfessionType]
    location: str
    urgency: str = "normal"
    images: List[str] = []
    technical_details: Dict[str, Any] = {}
    preferred_timeline: str = "flexible"
    access_constraints: str = ""

class DocumentUpload(BaseModel):
    name: str
    type: str
    file_data: str  # base64

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
        "validation_status": ValidationStatus.PENDING if user.user_type == UserType.ARTISAN else None,
        "credits": 0,  # Initialiser avec 0 crédits
        "subscription_pack": None,
        "subscription_expires": None,
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
    profile_dict["validation_status"] = ValidationStatus.PENDING
    profile_dict["created_at"] = datetime.utcnow()
    profile_dict["updated_at"] = datetime.utcnow()
    
    await db.artisan_profiles.insert_one(profile_dict)
    return ArtisanProfile(**profile_dict)

@api_router.post("/artisan/profile/document")
async def upload_document(
    document: DocumentUpload,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans can upload documents")
    
    # Get artisan profile
    profile = await db.artisan_profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Artisan profile not found")
    
    # Create document
    doc = Document(
        name=document.name,
        type=document.type,
        file_data=document.file_data,
        uploaded_at=datetime.utcnow(),
        validated=False
    )
    
    # Add document to profile
    await db.artisan_profiles.update_one(
        {"user_id": current_user["id"]},
        {
            "$push": {"documents": doc.dict()},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    return {"message": "Document uploaded successfully", "document_id": doc.id}

@api_router.get("/artisan/profiles", response_model=List[ArtisanProfile])
async def get_artisan_profiles(
    professions: Optional[List[ProfessionType]] = None,
    location: Optional[str] = None,
    validated_only: bool = True,
    current_user: dict = Depends(get_current_user)
):
    query = {"availability": True}
    
    # Pour les particuliers, ne montrer que les profils validés
    if current_user["user_type"] == UserType.PARTICULIER and validated_only:
        query["validation_status"] = ValidationStatus.VALIDATED
    
    if professions:
        query["professions"] = {"$in": professions}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    profiles = await db.artisan_profiles.find(query).to_list(100)
    return [ArtisanProfile(**profile) for profile in profiles]

# Particulier profile endpoints
@api_router.post("/particulier/profile", response_model=ParticulierProfile)
async def create_particulier_profile(
    profile: ParticulierProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.PARTICULIER:
        raise HTTPException(status_code=403, detail="Only particuliers can create profiles")
    
    # Check if profile already exists
    existing_profile = await db.particulier_profiles.find_one({"user_id": current_user["id"]})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    
    profile_dict = profile.dict()
    profile_dict["id"] = str(uuid.uuid4())
    profile_dict["user_id"] = current_user["id"]
    profile_dict["created_at"] = datetime.utcnow()
    profile_dict["updated_at"] = datetime.utcnow()
    
    await db.particulier_profiles.insert_one(profile_dict)
    return ParticulierProfile(**profile_dict)

@api_router.get("/particulier/profile", response_model=ParticulierProfile)
async def get_particulier_profile(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != UserType.PARTICULIER:
        raise HTTPException(status_code=403, detail="Only particuliers can access this endpoint")
    
    profile = await db.particulier_profiles.find_one({"user_id": current_user["id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return ParticulierProfile(**profile)

@api_router.put("/particulier/profile/project-details")
async def update_project_details(
    project_details: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.PARTICULIER:
        raise HTTPException(status_code=403, detail="Only particuliers can update project details")
    
    result = await db.particulier_profiles.update_one(
        {"user_id": current_user["id"]},
        {
            "$set": {
                "project_details": project_details,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"message": "Project details updated successfully"}

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
    
    # Verify target is a validated artisan
    artisan_profile = await db.artisan_profiles.find_one({
        "id": swipe_data.target_id,
        "validation_status": ValidationStatus.VALIDATED
    })
    if not artisan_profile:
        raise HTTPException(status_code=404, detail="Artisan profile not found or not validated")
    
    # For LIKE swipes from ARTISANS, check credits
    if swipe_data.action == SwipeAction.LIKE:
        artisan_user = await db.users.find_one({"id": artisan_profile["user_id"]})
        if artisan_user and artisan_user["user_type"] == UserType.ARTISAN:
            credits = artisan_user.get("credits", 0)
            if credits <= 0:
                raise HTTPException(
                    status_code=402, 
                    detail="Insufficient credits. Please purchase a subscription pack to continue liking profiles."
                )
            
            # Deduct credit
            await db.users.update_one(
                {"id": artisan_profile["user_id"]},
                {"$inc": {"credits": -1}}
            )
    
    # Create swipe record
    swipe_record = SwipeRecord(
        user_id=current_user["id"],
        target_id=swipe_data.target_id,
        action=swipe_data.action
    )
    
    await db.swipes.insert_one(swipe_record.dict())
    
    # Check for match if it's a like
    if swipe_data.action == SwipeAction.LIKE:
        match = Match(
            particulier_id=current_user["id"],
            artisan_id=artisan_profile["user_id"]
        )
        await db.matches.insert_one(match.dict())
        
        # Share project details automatically when matched
        await db.matches.update_one(
            {"id": match.id},
            {"$set": {"project_details_shared": True}}
        )
        
        return {"message": "It's a match!", "match_id": match.id}
    
    return {"message": "Swipe recorded"}

@api_router.get("/artisan/swipe")
async def artisan_swipe(
    current_user: dict = Depends(get_current_user)
):
    """Endpoint pour que les artisans puissent swiper sur les projets"""
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans can use this endpoint")
    
    # Vérifier que l'artisan est validé
    artisan_profile = await db.artisan_profiles.find_one({
        "user_id": current_user["id"],
        "validation_status": ValidationStatus.VALIDATED
    })
    if not artisan_profile:
        raise HTTPException(status_code=403, detail="Artisan profile not validated")
    
    # Récupérer les projets non swipés correspondant aux métiers de l'artisan
    swiped_projects = await db.swipes.find({"user_id": current_user["id"]}).to_list(1000)
    swiped_project_ids = [swipe["target_id"] for swipe in swiped_projects]
    
    query = {
        "status": "active",
        "professions_needed": {"$in": artisan_profile["professions"]},
        "id": {"$nin": swiped_project_ids}
    }
    
    projects = await db.projects.find(query).to_list(50)
    return [Project(**project) for project in projects]

@api_router.post("/artisan/swipe-project")
async def artisan_swipe_project(
    project_id: str,
    action: SwipeAction,
    current_user: dict = Depends(get_current_user)
):
    """Endpoint pour qu'un artisan swipe sur un projet"""
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans can swipe on projects")
    
    # Vérifier que l'artisan est validé
    artisan_profile = await db.artisan_profiles.find_one({
        "user_id": current_user["id"],
        "validation_status": ValidationStatus.VALIDATED
    })
    if not artisan_profile:
        raise HTTPException(status_code=403, detail="Artisan profile not validated")
    
    # Pour les LIKE, vérifier les crédits
    if action == SwipeAction.LIKE:
        credits = current_user.get("credits", 0)
        if credits <= 0:
            raise HTTPException(
                status_code=402, 
                detail="Insufficient credits. Please purchase a subscription pack to continue liking projects."
            )
        
        # Déduire un crédit
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$inc": {"credits": -1}}
        )
    
    # Vérifier que le projet existe
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Créer le swipe
    swipe_record = SwipeRecord(
        user_id=current_user["id"],
        target_id=project_id,
        action=action
    )
    
    await db.swipes.insert_one(swipe_record.dict())
    
    # Si c'est un like, créer un match
    if action == SwipeAction.LIKE:
        match = Match(
            particulier_id=project["user_id"],
            artisan_id=current_user["id"],
            project_details_shared=True
        )
        await db.matches.insert_one(match.dict())
        
        return {"message": "It's a match!", "match_id": match.id}
    
    return {"message": "Swipe recorded"}

# Subscription endpoints
@api_router.get("/subscription/packs", response_model=List[PackInfo])
async def get_subscription_packs():
    """Récupérer tous les packs d'abonnement disponibles"""
    packs = [
        PackInfo(
            pack=SubscriptionPack.STARTER,
            name="Starter",
            credits=10,
            price=49.0,
            features=[
                "10 crédits de matching",
                "Profil standard",
                "Support email",
                "Valable 30 jours"
            ]
        ),
        PackInfo(
            pack=SubscriptionPack.PROFESSIONAL,
            name="Professionnel",
            credits=50,
            price=149.0,
            features=[
                "50 crédits de matching",
                "Profil mis en avant",
                "Support prioritaire",
                "Statistiques avancées",
                "Valable 60 jours"
            ],
            popular=True
        ),
        PackInfo(
            pack=SubscriptionPack.PREMIUM,
            name="Premium",
            credits=150,
            price=299.0,
            features=[
                "150 crédits de matching",
                "Profil premium",
                "Support téléphonique",
                "Recommandations personnalisées",
                "Badge premium",
                "Valable 90 jours"
            ]
        ),
        PackInfo(
            pack=SubscriptionPack.UNLIMITED,
            name="Illimité",
            credits=999999,
            price=499.0,
            features=[
                "Crédits illimités",
                "Tous les avantages premium",
                "Manager dédié",
                "Formation personnalisée",
                "Priorité absolue",
                "Valable 365 jours"
            ]
        )
    ]
    return packs

@api_router.post("/subscription/purchase")
async def purchase_subscription(
    subscription_data: SubscriptionCreate,
    current_user: dict = Depends(get_current_user)
):
    """Acheter un pack d'abonnement"""
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans can purchase subscriptions")
    
    # Définir les détails des packs
    pack_details = {
        SubscriptionPack.STARTER: {"credits": 10, "price": 49.0, "days": 30},
        SubscriptionPack.PROFESSIONAL: {"credits": 50, "price": 149.0, "days": 60},
        SubscriptionPack.PREMIUM: {"credits": 150, "price": 299.0, "days": 90},
        SubscriptionPack.UNLIMITED: {"credits": 999999, "price": 499.0, "days": 365}
    }
    
    pack_info = pack_details.get(subscription_data.pack)
    if not pack_info:
        raise HTTPException(status_code=400, detail="Invalid subscription pack")
    
    # Créer l'abonnement
    subscription = Subscription(
        user_id=current_user["id"],
        pack=subscription_data.pack,
        credits_included=pack_info["credits"],
        price=pack_info["price"],
        expires_at=datetime.utcnow() + timedelta(days=pack_info["days"])
    )
    
    await db.subscriptions.insert_one(subscription.dict())
    
    # Ajouter les crédits à l'utilisateur
    await db.users.update_one(
        {"id": current_user["id"]},
        {
            "$inc": {"credits": pack_info["credits"]},
            "$set": {
                "subscription_pack": subscription_data.pack,
                "subscription_expires": subscription.expires_at
            }
        }
    )
    
    return {
        "message": "Subscription purchased successfully",
        "subscription_id": subscription.id,
        "credits_added": pack_info["credits"]
    }

@api_router.get("/subscription/current")
async def get_current_subscription(current_user: dict = Depends(get_current_user)):
    """Récupérer l'abonnement actuel de l'utilisateur"""
    if current_user["user_type"] != UserType.ARTISAN:
        raise HTTPException(status_code=403, detail="Only artisans have subscriptions")
    
    subscription = await db.subscriptions.find_one({
        "user_id": current_user["id"],
        "is_active": True
    }, sort=[("purchased_at", -1)])
    
    user_credits = current_user.get("credits", 0)
    
    return {
        "subscription": Subscription(**subscription) if subscription else None,
        "current_credits": user_credits,
        "subscription_pack": current_user.get("subscription_pack"),
        "subscription_expires": current_user.get("subscription_expires")
    }

@api_router.get("/matches")
async def get_matches(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] == UserType.PARTICULIER:
        matches = await db.matches.find({"particulier_id": current_user["id"]}).to_list(100)
    else:
        matches = await db.matches.find({"artisan_id": current_user["id"]}).to_list(100)
    
    # Enrichir avec les détails des profils
    enriched_matches = []
    for match in matches:
        match_obj = Match(**match)
        
        # Ajouter détails du particulier si artisan connecté
        if current_user["user_type"] == UserType.ARTISAN and match_obj.project_details_shared:
            particulier_profile = await db.particulier_profiles.find_one({"user_id": match_obj.particulier_id})
            if particulier_profile:
                match_obj.particulier_details = particulier_profile.get("project_details", {})
        
        enriched_matches.append(match_obj)
    
    return enriched_matches

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
async def get_projects(
    professions: Optional[List[ProfessionType]] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] == UserType.PARTICULIER:
        projects = await db.projects.find({"user_id": current_user["id"]}).to_list(100)
    else:
        # Artisans voient tous les projets actifs
        query = {"status": "active"}
        if professions:
            query["professions_needed"] = {"$in": professions}
        projects = await db.projects.find(query).to_list(100)
    
    return [Project(**project) for project in projects]

# Admin endpoints
@api_router.get("/admin/pending-artisans")
async def get_pending_artisans(current_user: dict = Depends(get_current_user)):
    if current_user["user_type"] != UserType.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    pending_profiles = await db.artisan_profiles.find({
        "validation_status": ValidationStatus.PENDING
    }).to_list(100)
    
    return [ArtisanProfile(**profile) for profile in pending_profiles]

@api_router.post("/admin/validate-artisan/{artisan_id}")
async def validate_artisan(
    artisan_id: str,
    action: str,  # "validate" or "reject"
    reason: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    if current_user["user_type"] != UserType.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if action not in ["validate", "reject"]:
        raise HTTPException(status_code=400, detail="Action must be 'validate' or 'reject'")
    
    status = ValidationStatus.VALIDATED if action == "validate" else ValidationStatus.REJECTED
    
    update_data = {
        "validation_status": status,
        "validated_at": datetime.utcnow() if action == "validate" else None,
        "rejected_reason": reason if action == "reject" else None,
        "updated_at": datetime.utcnow()
    }
    
    result = await db.artisan_profiles.update_one(
        {"id": artisan_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Artisan profile not found")
    
    # Valider les documents automatiquement si validation
    if action == "validate":
        await db.artisan_profiles.update_one(
            {"id": artisan_id},
            {"$set": {"documents.$[].validated": True}}
        )
    
    return {"message": f"Artisan {action}d successfully"}

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