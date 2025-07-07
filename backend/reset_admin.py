#!/usr/bin/env python3
"""
Script pour réinitialiser le super admin
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime
import uuid

# Configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test_database")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def reset_super_admin():
    """Reset et crée un nouveau super admin"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Supprimer l'ancien admin s'il existe
    await db.admins.delete_many({"email": "admin@careertinder.com"})
    
    # Créer le nouveau super admin
    admin_data = {
        "id": str(uuid.uuid4()),
        "email": "admin@careertinder.com",
        "name": "Super Admin",
        "password_hash": pwd_context.hash("admin123"),
        "role": "super_admin",
        "permissions": [
            "invite_admins",
            "view_admins",
            "view_invitations",
            "view_users",
            "modify_users",
            "delete_users",
            "view_stats",
            "view_reports",
            "resolve_reports"
        ],
        "created_by": None,
        "created_at": datetime.utcnow(),
        "last_login": None,
        "is_active": True
    }
    
    await db.admins.insert_one(admin_data)
    print("Super admin réinitialisé avec succès!")
    print("Email: admin@careertinder.com")
    print("Mot de passe: admin123")
    
    # Vérifier
    admin = await db.admins.find_one({"email": "admin@careertinder.com"})
    print(f"Admin trouvé: {admin['name']} - {admin['role']}")
    
    # Test du mot de passe
    if pwd_context.verify("admin123", admin["password_hash"]):
        print("✅ Mot de passe vérifié avec succès!")
    else:
        print("❌ Erreur de vérification du mot de passe!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(reset_super_admin())