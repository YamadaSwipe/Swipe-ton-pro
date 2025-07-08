#!/usr/bin/env python3
"""
Script pour peupler la base de données avec des données de test
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def seed_data():
    print("🌱 Seeding database with test data...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.artisan_profiles.delete_many({})
    await db.projects.delete_many({})
    await db.matches.delete_many({})
    await db.swipes.delete_many({})
    
    # Create test users
    users = [
        # Admin
        {
            "id": str(uuid.uuid4()),
            "email": "admin@swipetonpro.fr",
            "first_name": "Admin",
            "last_name": "SwipeTonPro",
            "phone": "+33123456789",
            "user_type": "admin",
            "password_hash": get_password_hash("admin123"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Particuliers
        {
            "id": str(uuid.uuid4()),
            "email": "part1@gmail.com",
            "first_name": "Marie",
            "last_name": "Dupont",
            "phone": "+33123456701",
            "user_type": "particulier",
            "password_hash": get_password_hash("pat1pat1"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "part2@gmail.com",
            "first_name": "Pierre",
            "last_name": "Martin",
            "phone": "+33123456702",
            "user_type": "particulier",
            "password_hash": get_password_hash("pat2pat2"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "part3@gmail.com",
            "first_name": "Sophie",
            "last_name": "Bernard",
            "phone": "+33123456703",
            "user_type": "particulier",
            "password_hash": get_password_hash("pat3pat3"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Artisans
        {
            "id": str(uuid.uuid4()),
            "email": "art1@gmail.com",
            "first_name": "Jean",
            "last_name": "Électricien",
            "phone": "+33123456801",
            "user_type": "artisan",
            "password_hash": get_password_hash("art1art1"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "art2@gmail.com",
            "first_name": "Michel",
            "last_name": "Menuisier",
            "phone": "+33123456802",
            "user_type": "artisan",
            "password_hash": get_password_hash("art2art2"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "art3@gmail.com",
            "first_name": "François",
            "last_name": "Chauffagiste",
            "phone": "+33123456803",
            "user_type": "artisan",
            "password_hash": get_password_hash("art3art3"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "art4@gmail.com",
            "first_name": "Antoine",
            "last_name": "Carreleur",
            "phone": "+33123456804",
            "user_type": "artisan",
            "password_hash": get_password_hash("art4art4"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert users
    await db.users.insert_many(users)
    print(f"✅ Created {len(users)} users")
    
    # Get artisan IDs
    artisan_users = [u for u in users if u["user_type"] == "artisan"]
    
    # Create artisan profiles
    artisan_profiles = [
        {
            "id": str(uuid.uuid4()),
            "user_id": artisan_users[0]["id"],
            "profession": "electricien",
            "description": "Électricien expérimenté spécialisé dans les installations résidentielles et commerciales. Intervention rapide et travail soigné garantis.",
            "experience_years": 8,
            "rating": 4.8,
            "reviews_count": 127,
            "hourly_rate": 45.0,
            "location": "Paris",
            "portfolio_images": [],
            "certifications": ["Habilitation électrique", "Certification RGE"],
            "availability": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": artisan_users[1]["id"],
            "profession": "menuisier",
            "description": "Menuisier passionné créant des meubles sur mesure et réalisant tous types d'aménagements intérieurs. Matériaux de qualité et finitions parfaites.",
            "experience_years": 12,
            "rating": 4.9,
            "reviews_count": 89,
            "hourly_rate": 40.0,
            "location": "Lyon",
            "portfolio_images": [],
            "certifications": ["CAP Menuiserie", "Certification Éco-artisan"],
            "availability": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": artisan_users[2]["id"],
            "profession": "chauffagiste",
            "description": "Chauffagiste certifié spécialisé dans les systèmes de chauffage modernes et écologiques. Installation, dépannage et maintenance.",
            "experience_years": 15,
            "rating": 4.7,
            "reviews_count": 156,
            "hourly_rate": 55.0,
            "location": "Marseille",
            "portfolio_images": [],
            "certifications": ["Certification RGE", "Qualification PG"],
            "availability": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": artisan_users[3]["id"],
            "profession": "carreleur",
            "description": "Carreleur expert en pose de carrelage, faïence et revêtements. Travail précis et soigné pour salles de bains, cuisines et terrasses.",
            "experience_years": 10,
            "rating": 4.6,
            "reviews_count": 73,
            "hourly_rate": 38.0,
            "location": "Toulouse",
            "portfolio_images": [],
            "certifications": ["CAP Carrelage", "Formation pose naturelle"],
            "availability": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Insert artisan profiles
    await db.artisan_profiles.insert_many(artisan_profiles)
    print(f"✅ Created {len(artisan_profiles)} artisan profiles")
    
    # Get particulier IDs
    particulier_users = [u for u in users if u["user_type"] == "particulier"]
    
    # Create test projects
    projects = [
        {
            "id": str(uuid.uuid4()),
            "user_id": particulier_users[0]["id"],
            "title": "Rénovation électrique complète",
            "description": "Refaire l'installation électrique de mon appartement de 80m². Tableaux à changer, nouvelles prises, éclairage LED.",
            "budget": 3500.0,
            "profession_needed": "electricien",
            "location": "Paris 11ème",
            "urgency": "normal",
            "images": [],
            "created_at": datetime.utcnow(),
            "status": "active"
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": particulier_users[1]["id"],
            "title": "Cuisine sur mesure",
            "description": "Création d'une cuisine sur mesure avec îlot central. Bois massif, finitions haut de gamme.",
            "budget": 8000.0,
            "profession_needed": "menuisier",
            "location": "Lyon 3ème",
            "urgency": "flexible",
            "images": [],
            "created_at": datetime.utcnow(),
            "status": "active"
        },
        {
            "id": str(uuid.uuid4()),
            "user_id": particulier_users[2]["id"],
            "title": "Installation chauffage pompe à chaleur",
            "description": "Remplacement de l'ancienne chaudière par une pompe à chaleur air-eau. Maison 120m².",
            "budget": 12000.0,
            "profession_needed": "chauffagiste",
            "location": "Marseille 8ème",
            "urgency": "urgent",
            "images": [],
            "created_at": datetime.utcnow(),
            "status": "active"
        }
    ]
    
    # Insert projects
    await db.projects.insert_many(projects)
    print(f"✅ Created {len(projects)} projects")
    
    # Create some matches
    matches = [
        {
            "id": str(uuid.uuid4()),
            "particulier_id": particulier_users[0]["id"],
            "artisan_id": artisan_users[0]["id"],
            "created_at": datetime.utcnow(),
            "last_message_at": None,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "particulier_id": particulier_users[1]["id"],
            "artisan_id": artisan_users[1]["id"],
            "created_at": datetime.utcnow(),
            "last_message_at": None,
            "is_active": True
        }
    ]
    
    # Insert matches
    await db.matches.insert_many(matches)
    print(f"✅ Created {len(matches)} matches")
    
    print("\n🎉 Database seeded successfully!")
    print("\n📋 Test accounts created:")
    print("  Admin: admin@swipetonpro.fr / admin123")
    print("  Particuliers: part1@gmail.com / pat1pat1, part2@gmail.com / pat2pat2, part3@gmail.com / pat3pat3")
    print("  Artisans: art1@gmail.com / art1art1, art2@gmail.com / art2art2, art3@gmail.com / art3art3, art4@gmail.com / art4art4")
    print("\n🚀 Application ready to use!")

if __name__ == "__main__":
    asyncio.run(seed_data())