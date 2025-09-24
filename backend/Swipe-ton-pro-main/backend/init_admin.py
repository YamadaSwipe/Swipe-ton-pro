#!/usr/bin/env python3
"""
Script pour initialiser un super admin dans le système
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

async def init_super_admin():
    """Initialise un super admin dans le système"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Vérifier si un admin par défaut existe déjà
    existing_admin = await db.admins.find_one({"id": "admin"})
    if existing_admin:
        print("Un admin par défaut existe déjà dans le système.")
        return

    # Créer l’admin par défaut
    admin_data = {
        "id": "admin",
        "email": "admin@swipetonpro.fr",
        "name": "Administrateur",
        "password_hash": pwd_context.hash("admin123"),
        "role": "admin",
        "permissions": [
            "invite_admins",
            "view_admins",
            "view_invitations",
            "view_users",
            "modify_users",
            "delete_users",
            "view_stats",
            "view_reports",
            "resolve_reports",
            "manage_credit_config"
        ],
        "created_by": None,
        "created_at": datetime.utcnow(),
        "last_login": None,
        "is_active": True
    }

    await db.admins.insert_one(admin_data)
    print("Admin par défaut créé avec succès!")
    print("ID: admin")
    print("Email: admin@swipetonpro.fr")
    print("Mot de passe: admin123")
    print("⚠️  N'oubliez pas de changer le mot de passe après la première connexion!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_super_admin())