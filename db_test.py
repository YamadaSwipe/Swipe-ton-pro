#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime
import sys
from pymongo import MongoClient
import os
from passlib.context import CryptContext
import uuid

# Base URL for the API
BASE_URL = "https://c5d2d6b0-9f85-4474-b5d4-b3e1bc77006d.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "admin@careertinder.com"
ADMIN_PASSWORD = "admin123"

# MongoDB setup
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "test_database"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_test_header(test_name):
    print(f"\n{Colors.HEADER}{Colors.BOLD}===== Testing {test_name} ====={Colors.ENDC}")

def print_success(message):
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")

def print_failure(message):
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.OKBLUE}ℹ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.WARNING}⚠ {message}{Colors.ENDC}")

def setup_admin_user():
    print_test_header("Setting up Admin User")
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # Check if admin user exists
        admin = db.admins.find_one({"email": ADMIN_EMAIL})
        
        if admin:
            print_info(f"Admin user {ADMIN_EMAIL} already exists")
            print_info(f"Admin ID: {admin['id']}")
            print_info(f"Admin Role: {admin['role']}")
            print_info(f"Admin Permissions: {admin.get('permissions', [])}")
            return True
        
        # Create admin user if it doesn't exist
        admin_id = str(uuid.uuid4())
        admin_data = {
            "id": admin_id,
            "email": ADMIN_EMAIL,
            "name": "Super Admin",
            "password_hash": get_password_hash(ADMIN_PASSWORD),
            "role": "super_admin",
            "permissions": ["view_users", "view_stats", "view_admins", "view_invitations", 
                           "view_reports", "invite_admins", "modify_users", "delete_users", 
                           "resolve_reports"],
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        db.admins.insert_one(admin_data)
        print_success(f"Created super admin user: {ADMIN_EMAIL}")
        print_info(f"Admin ID: {admin_id}")
        print_info(f"Admin Role: super_admin")
        return True
        
    except Exception as e:
        print_failure(f"Failed to setup admin user: {str(e)}")
        return False

def test_direct_db_access():
    print_test_header("Testing Direct DB Access")
    
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URL)
        db = client[DB_NAME]
        
        # List collections
        collections = db.list_collection_names()
        print_info(f"Collections in database: {collections}")
        
        # Count documents in each collection
        for collection in collections:
            count = db[collection].count_documents({})
            print_info(f"Collection '{collection}' has {count} documents")
        
        # Check admin users
        admins = list(db.admins.find())
        print_info(f"Found {len(admins)} admin users")
        for admin in admins:
            print_info(f"Admin: {admin['email']}, Role: {admin['role']}")
        
        print_success("Successfully accessed MongoDB directly")
        return True
        
    except Exception as e:
        print_failure(f"Failed to access MongoDB: {str(e)}")
        return False

def run_tests():
    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}  CAREER TINDER ADMIN DB TEST SUITE   {Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}\n")
    
    print_info(f"MongoDB URL: {MONGO_URL}")
    print_info(f"Database: {DB_NAME}")
    print_info(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test results tracking
    results = {
        "total": 0,
        "passed": 0,
        "failed": 0
    }
    
    # Test direct DB access
    db_result = test_direct_db_access()
    results["total"] += 1
    if db_result:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Setup admin user
    setup_result = setup_admin_user()
    results["total"] += 1
    if setup_result:
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Print summary
    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}           TEST SUMMARY              {Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}")
    print(f"Total tests: {results['total']}")
    print(f"{Colors.OKGREEN}Passed: {results['passed']}{Colors.ENDC}")
    print(f"{Colors.FAIL}Failed: {results['failed']}{Colors.ENDC}")
    
    success_rate = (results['passed'] / results['total']) * 100 if results['total'] > 0 else 0
    print(f"Success rate: {success_rate:.2f}%")
    
    if results['failed'] == 0:
        print(f"\n{Colors.OKGREEN}{Colors.BOLD}All tests passed successfully!{Colors.ENDC}")
        return 0
    else:
        print(f"\n{Colors.FAIL}{Colors.BOLD}Some tests failed. Please check the logs above.{Colors.ENDC}")
        return 1

if __name__ == "__main__":
    sys.exit(run_tests())