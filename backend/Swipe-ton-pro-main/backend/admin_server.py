# --- Config Achat de crédits (admin modifiable) ---
DEFAULT_CREDIT_UNIT_PRICE = 100  # 1€ par crédit
DEFAULT_CREDIT_LABEL = "Acheter des crédits (1€ / crédit)"

async def get_credit_config():
    conf = await db.credit_config.find_one({"_id": "global"})
    if conf:
        return conf
    return {"unit_price": DEFAULT_CREDIT_UNIT_PRICE, "label": DEFAULT_CREDIT_LABEL}

async def set_credit_config(unit_price: int = None, label: str = None):
    update = {}
    if unit_price is not None:
        update["unit_price"] = unit_price
    if label is not None:
        update["label"] = label
    if not update:
        return
    await db.credit_config.update_one({"_id": "global"}, {"$set": update}, upsert=True)

# Ces endpoints doivent être placés après la déclaration de app et des imports FastAPI
import stripe
from fastapi.security import OAuth2PasswordBearer
from fastapi import Request

# Fonction utilitaire pour récupérer l’admin courant (exemple simplifié)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
async def get_current_admin(token: str = Depends(oauth2_scheme)):
    # À adapter selon votre logique JWT
    # Ici, on suppose que le token contient l’ID admin
    from jose import jwt, JWTError
    from backend.init_admin import SECRET_KEY, ALGORITHM
    from backend.init_admin import get_admin_by_id
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("sub")
        if admin_id is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        admin = await get_admin_by_id(admin_id)
        if not admin:
            raise HTTPException(status_code=401, detail="Admin introuvable")
        return admin
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide")
from fastapi import Body, Depends, HTTPException, status
from collections import defaultdict
import time

# Dictionnaire en mémoire pour la démo (à remplacer par Redis ou MongoDB en prod)
LOGIN_ATTEMPTS = defaultdict(list)  # {key: [timestamps]}
MAX_ATTEMPTS = 5
WINDOW_SECONDS = 15 * 60  # 15 minutes

def is_blocked(key: str) -> bool:
    now = time.time()
    # Nettoyer les anciennes tentatives
    LOGIN_ATTEMPTS[key] = [t for t in LOGIN_ATTEMPTS[key] if now - t < WINDOW_SECONDS]
    return len(LOGIN_ATTEMPTS[key]) >= MAX_ATTEMPTS

def register_attempt(key: str):
    LOGIN_ATTEMPTS[key].append(time.time())

def check_admin_permission(admin, required_role=None, required_permission=None):
    if required_role and admin.get("role") != required_role:
        raise HTTPException(status_code=403, detail=f"Action réservée au rôle {required_role}")
    if required_permission and required_permission not in admin.get("permissions", []):
        raise HTTPException(status_code=403, detail=f"Permission requise : {required_permission}")

"""
Version simplifiée du serveur admin fonctionnel
"""

from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import uuid
import os

from typing import List, Optional, Dict, Any

from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import uuid


# --- Configuration Sécurisée (Stripe & SMTP OVH) ---
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")

# Stripe
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY", "pk_test_51S5NKA2U7rU4qakSy8VqMAKcGIGJsl6vHtrSz7fmcmnUk4LUBxE7N8SgAHqLzMShOBURXeaLVDxlNpcPZzj1sCSy00mlb4RgVp")

# SMTP OVH
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.swipetonpro.fr")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "contact@swipetonpro.fr")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "ContactSwipeTonPro123")
EMAIL_FROM = "contact@swipetonpro.fr"
EMAIL_SUPPORT = "support@swipetonpro.fr"
EMAIL_ADMIN = "admin@swipetonpro.fr"

# Connexion MongoDB
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# --- Configuration Boost Swipe ---
DEFAULT_BOOST_COST = 5  # crédits
DEFAULT_BOOST_ENABLED = False

# Collection de configuration boost (1 document global, ou par pro)
async def get_boost_config(pro_id: Optional[str] = None):
    if pro_id:
        conf = await db.boost_configs.find_one({"pro_id": pro_id})
        if conf:
            return conf
    conf = await db.boost_configs.find_one({"pro_id": None})
    if conf:
        return conf
    # Valeurs par défaut si rien en base
    return {"cost": DEFAULT_BOOST_COST, "enabled": DEFAULT_BOOST_ENABLED}

async def set_boost_config(cost: int = None, enabled: bool = None, pro_id: Optional[str] = None):
    update = {}
    if cost is not None:
        update["cost"] = cost
    if enabled is not None:
        update["enabled"] = enabled
    if not update:
        return
    await db.boost_configs.update_one({"pro_id": pro_id}, {"$set": update}, upsert=True)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# App
app = FastAPI(title="Career Tinder Admin", docs_url="/docs", redoc_url="/redoc")

# --- Endpoint Achat de crédits supplémentaire (Stripe Checkout) ---
from fastapi import Query


# Endpoint achat de crédits (utilise la config admin)
@app.post("/credits/purchase")
async def purchase_credits(
    credits: int = Body(..., embed=True, ge=1, le=1000),
    request: Request = None,
    current_admin = Depends(get_current_admin)
):
    """
    Crée une session Stripe Checkout pour l’achat de crédits supplémentaires par un pro.
    """
    pro_id = current_admin["id"]
    pro = await db.users.find_one({"id": pro_id, "is_professional": True})
    if not pro:
        await log_action(pro_id, "purchase_credits_forbidden", {"credits": credits}, request=request, status_code=403)
        raise HTTPException(status_code=403, detail="Seuls les pros peuvent acheter des crédits.")

    # Récupérer la config admin
    credit_conf = await get_credit_config()
    CREDIT_UNIT_PRICE = credit_conf.get("unit_price", DEFAULT_CREDIT_UNIT_PRICE)
    CREDIT_LABEL = credit_conf.get("label", DEFAULT_CREDIT_LABEL)
    amount = credits * CREDIT_UNIT_PRICE

    # Créer la session Stripe Checkout
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {
                        "name": f"{CREDIT_LABEL} : {credits} crédits",
                    },
                    "unit_amount": CREDIT_UNIT_PRICE,
                },
                "quantity": credits,
            }],
            mode="payment",
            success_url="https://swipetonpro.fr/credits/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://swipetonpro.fr/credits/cancel",
            metadata={
                "pro_id": pro_id,
                "credits": str(credits)
            }
        )
        await log_action(pro_id, "purchase_credits_checkout_created", {"credits": credits, "amount": amount, "session_id": session.id}, request=request, status_code=200)
        return {"checkout_url": session.url, "unit_price": CREDIT_UNIT_PRICE, "label": CREDIT_LABEL}
    except Exception as e:
        await log_action(pro_id, "purchase_credits_checkout_error", {"credits": credits, "error": str(e)}, request=request, status_code=500)
        raise HTTPException(status_code=500, detail="Erreur lors de la création de la session de paiement.")

# --- Gestion centralisée des erreurs ---
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIValidationError
import logging

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logging.exception(f"Erreur serveur: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "internal_server_error",
            "message": "Une erreur interne est survenue. Merci de réessayer plus tard."
        },
    )

@app.exception_handler(FastAPIValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "validation_error",
            "message": "Erreur de validation des données.",
            "details": exc.errors()
        },
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail if isinstance(exc.detail, str) else "http_error",
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail)
        },
    )

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

import secrets

# Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str


from fastapi import Request

def get_log_action():
    # Pour éviter les problèmes d'import, on définit la fonction après l'init de db
    async def log_action(user_id: str, action: str, details: dict = None, request: Request = None, status_code: int = None):
        meta = {}
        if request:
            meta["ip"] = request.client.host if request.client else None
            meta["user_agent"] = request.headers.get("user-agent")
            meta["endpoint"] = request.url.path
            meta["method"] = request.method
        if status_code:
            meta["status_code"] = status_code
        await db.logs.insert_one({
            "user_id": user_id,
            "action": action,
            "details": details or {},
            "meta": meta,
            "timestamp": datetime.utcnow()
        })
    return log_action

log_action = get_log_action()

# --- Route login avec anti-bruteforce et logs ---
from fastapi import Request

@app.post("/login")
async def login_admin(data: AdminLogin, request: Request):
    if is_blocked(data.email.lower()):
        await log_action(None, "login_blocked", {"email": data.email}, request=request, status_code=429)
        raise HTTPException(status_code=429, detail="Trop de tentatives. Réessayez dans 15 minutes.")
    admin = await db.admins.find_one({"email": data.email})
    if not admin or not verify_password(data.password, admin["password_hash"]):
        register_attempt(data.email.lower())
        await log_action(None, "login_failed", {"email": data.email}, request=request, status_code=401)
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    # Reset les tentatives en cas de succès
    LOGIN_ATTEMPTS[data.email.lower()] = []
    access_token = create_access_token({"sub": admin["id"]})
    await log_action(admin["id"], "login_success", {"email": data.email}, request=request, status_code=200)
    return {"access_token": access_token, "token_type": "bearer"}

# --- Endpoint admin pour consulter les logs ---
from fastapi import Depends
from typing import Optional

# Endpoint admin pour consulter les logs (après la définition de get_current_admin)
def setup_logs_endpoint():
    @app.get("/admin/logs")
    async def get_logs(
        action: Optional[str] = None,
        user_id: Optional[str] = None,
        limit: int = 50,
        current_admin = Depends(get_current_admin)
    ):
        check_admin_permission(current_admin, required_role="super_admin")
        query = {}
        if action:
            query["action"] = action
        if user_id:
            query["user_id"] = user_id
        logs = await db.logs.find(query).sort("timestamp", -1).to_list(limit)
        return [{"user_id": l.get("user_id"), "action": l.get("action"), "details": l.get("details"), "timestamp": l.get("timestamp")} for l in logs]


setup_logs_endpoint()



# --- Gestion des documents utilisateurs ---
from enum import Enum

class DocumentStatus(str, Enum):
    pending = "pending"
    validated = "validated"
    refused = "refused"

class DocumentValidationRequest(BaseModel):
    status: DocumentStatus
    comment: str = ""

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

# Models
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminInvite(BaseModel):
    email: EmailStr
    role: str = "support"
    permissions: Optional[List[str]] = []

# Modèle pour modification des droits
class AdminPermissionsUpdate(BaseModel):
    permissions: List[str]

# --- Gestion des documents utilisateurs ---
from enum import Enum

class DocumentStatus(str, Enum):
    pending = "pending"
    validated = "validated"
    refused = "refused"

class DocumentValidationRequest(BaseModel):
    status: DocumentStatus
    comment: str = ""
    



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



# Création d'un admin support avec droits personnalisés
@app.post("/admins/create")
async def create_support_admin(invite_data: AdminInvite, request: Request, current_admin = Depends(get_current_admin)):
    check_admin_permission(current_admin, required_role="super_admin")
    existing_admin = await db.admins.find_one({"email": invite_data.email})
    if existing_admin:
        await log_action(current_admin["id"], "admin_create_exists", {"email": invite_data.email}, request=request, status_code=400)
        raise HTTPException(status_code=400, detail="Un admin avec cet email existe déjà")
    admin_id = str(uuid.uuid4())
    new_admin = {
        "id": admin_id,
        "email": invite_data.email,
        "name": invite_data.email.split("@")[0],
        "role": invite_data.role,
        "permissions": invite_data.permissions or [],
        "created_at": datetime.utcnow(),
        "is_active": True,
        "password_hash": pwd_context.hash(str(uuid.uuid4())) # mot de passe temporaire à réinitialiser
    }
    await db.admins.insert_one(new_admin)
    await log_action(
        current_admin["id"],
        "admin_create",
        {
            "target_admin_id": admin_id,
            "email": invite_data.email,
            "role": invite_data.role,
            "permissions": invite_data.permissions
        },
        request=request, status_code=201
    )
    return {"message": f"Profil support créé pour {invite_data.email}", "admin_id": admin_id}

# Modifier les droits d'un admin support
@app.put("/admins/{admin_id}/permissions")
async def update_admin_permissions(admin_id: str, update: AdminPermissionsUpdate, request: Request, current_admin = Depends(get_current_admin)):
    check_admin_permission(current_admin, required_role="super_admin")
    result = await db.admins.update_one({"id": admin_id}, {"$set": {"permissions": update.permissions}})
    if result.matched_count == 0:
        await log_action(current_admin["id"], "admin_update_permissions_not_found", {"target_admin_id": admin_id}, request=request, status_code=404)
        raise HTTPException(status_code=404, detail="Admin non trouvé")
    await log_action(
        current_admin["id"],
        "admin_update_permissions",
        {
            "target_admin_id": admin_id,
            "permissions": update.permissions
        },
        request=request, status_code=200
    )
    return {"message": "Droits mis à jour"}

# Supprimer un admin support
@app.delete("/admins/{admin_id}")
async def delete_admin(admin_id: str, request: Request, current_admin = Depends(get_current_admin)):
    check_admin_permission(current_admin, required_role="super_admin")
    result = await db.admins.delete_one({"id": admin_id})
    if result.deleted_count == 0:
        await log_action(current_admin["id"], "admin_delete_not_found", {"target_admin_id": admin_id}, request=request, status_code=404)
        raise HTTPException(status_code=404, detail="Admin non trouvé")
    await log_action(
        current_admin["id"],
        "admin_delete",
        {"target_admin_id": admin_id},
        request=request, status_code=200
    )
    return {"message": "Admin supprimé"}

# Lister les documents à valider
@app.get("/documents/pending")
async def list_pending_documents(current_admin = Depends(get_current_admin)):
    # Vérification permission (exemple: doit avoir le droit 'validate_documents')
    if "validate_documents" not in current_admin.get("permissions", []) and current_admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Droit insuffisant pour valider les documents.")
    docs = await db.documents.find({"status": "pending"}).to_list(100)
    return docs

# Valider ou refuser un document
@app.put("/documents/{document_id}/validate")
async def validate_document(document_id: str, req: DocumentValidationRequest, request: Request, current_admin = Depends(get_current_admin)):
    if "validate_documents" not in current_admin.get("permissions", []) and current_admin.get("role") != "super_admin":
        await log_action(current_admin["id"], "document_validate_forbidden", {"document_id": document_id}, request=request, status_code=403)
        raise HTTPException(status_code=403, detail="Droit insuffisant pour valider/refuser les documents.")
    result = await db.documents.update_one(
        {"_id": document_id},
        {"$set": {"status": req.status, "validated_by": current_admin["id"], "validation_comment": req.comment, "validated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        await log_action(current_admin["id"], "document_validate_not_found", {"document_id": document_id}, request=request, status_code=404)
        raise HTTPException(status_code=404, detail="Document non trouvé")
    await log_action(current_admin["id"], "document_validate", {"document_id": document_id, "status": req.status, "comment": req.comment}, request=request, status_code=200)
    return {"message": f"Document {req.status}"}

# Lister les documents à valider
@app.get("/documents/pending")
async def list_pending_documents(current_admin = Depends(get_current_admin)):
    # Vérification permission (exemple: doit avoir le droit 'validate_documents')
    if "validate_documents" not in current_admin.get("permissions", []) and current_admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Droit insuffisant pour valider les documents.")
    docs = await db.documents.find({"status": "pending"}).to_list(100)
    return docs

# Valider ou refuser un document
@app.put("/documents/{document_id}/validate")
async def validate_document(document_id: str, req: DocumentValidationRequest, current_admin = Depends(get_current_admin)):
    if "validate_documents" not in current_admin.get("permissions", []) and current_admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Droit insuffisant pour valider/refuser les documents.")
    result = await db.documents.update_one(
        {"_id": document_id},
        {"$set": {"status": req.status, "validated_by": current_admin["id"], "validation_comment": req.comment, "validated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    return {"message": f"Document {req.status}"}
    if current_admin.get("role") != "super_admin":
        raise HTTPException(status_code=403, detail="Seul le super_admin peut supprimer un admin.")
    result = await db.admins.delete_one({"id": admin_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Admin non trouvé")
    return {"message": "Admin supprimé"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)