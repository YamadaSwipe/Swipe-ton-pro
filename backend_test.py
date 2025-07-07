#!/usr/bin/env python3
import requests
import json
import base64
import time
import os
import sys
from typing import Dict, List, Any, Optional, Tuple
import random
import string

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

API_URL = f"{BACKEND_URL}/api"
print(f"Testing API at: {API_URL}")

# Test users
TEST_USERS = {
    "freelancer": {
        "email": f"freelancer_{int(time.time())}@example.com",
        "password": "password123",
        "first_name": "Jean",
        "last_name": "Dupont",
        "user_type": "freelancer",
        "company_status": "auto_entrepreneur",
        "phone": "+33612345678",
        "description": "Développeur web freelance avec 5 ans d'expérience"
    },
    "company": {
        "email": f"company_{int(time.time())}@example.com",
        "password": "password123",
        "first_name": "Marie",
        "last_name": "Martin",
        "user_type": "company",
        "company_status": "sarl",
        "company_name": "Tech Solutions SARL",
        "phone": "+33687654321",
        "description": "Entreprise de développement logiciel"
    },
    "admin": {
        "email": "admin@swipetonpro.com",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "User",
        "user_type": "admin"
    }
}

# Store tokens and IDs
tokens = {}
user_ids = {}
profile_ids = {}
document_ids = {}
match_ids = {}

# Test results
results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name: str, success: bool, response: Optional[requests.Response] = None, error: Optional[str] = None):
    """Log test results"""
    results["total"] += 1
    
    test_result = {
        "name": name,
        "success": success,
        "timestamp": time.time()
    }
    
    if success:
        results["passed"] += 1
        print(f"✅ {name}")
    else:
        results["failed"] += 1
        print(f"❌ {name}")
        
        if error:
            test_result["error"] = error
            print(f"   Error: {error}")
        
        if response:
            try:
                test_result["response"] = response.json()
                print(f"   Response: {json.dumps(response.json(), indent=2)}")
            except:
                test_result["response"] = response.text
                print(f"   Response: {response.text}")
            
            print(f"   Status code: {response.status_code}")
            test_result["status_code"] = response.status_code
    
    results["tests"].append(test_result)
    return success

def make_request(method: str, endpoint: str, data: Optional[Dict] = None, 
                token: Optional[str] = None, expected_status: int = 200) -> Tuple[bool, requests.Response]:
    """Make a request to the API and check the status code"""
    url = f"{API_URL}{endpoint}"
    headers = {}
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    try:
        if method.lower() == "get":
            response = requests.get(url, headers=headers)
        elif method.lower() == "post":
            headers["Content-Type"] = "application/json"
            response = requests.post(url, json=data, headers=headers)
        elif method.lower() == "put":
            headers["Content-Type"] = "application/json"
            response = requests.put(url, json=data, headers=headers)
        elif method.lower() == "delete":
            response = requests.delete(url, headers=headers)
        else:
            return False, None
        
        if response.status_code == expected_status:
            return True, response
        else:
            return False, response
    except Exception as e:
        print(f"Request error: {str(e)}")
        return False, None

def generate_base64_image() -> str:
    """Generate a simple base64 encoded image for testing"""
    # Create a 1x1 pixel red image
    pixel_data = bytes([255, 0, 0])  # RGB for red
    
    # Convert to base64
    base64_data = base64.b64encode(pixel_data).decode('utf-8')
    return f"data:image/png;base64,{base64_data}"

def test_register_user(user_type: str) -> bool:
    """Test user registration"""
    test_name = f"Register {user_type} user"
    
    success, response = make_request(
        "post", 
        "/auth/register", 
        data=TEST_USERS[user_type],
        expected_status=200
    )
    
    if success:
        user_data = response.json()
        user_ids[user_type] = user_data["id"]
    
    return log_test(test_name, success, response)

def test_login_user(user_type: str) -> bool:
    """Test user login"""
    test_name = f"Login {user_type} user"
    
    login_data = {
        "email": TEST_USERS[user_type]["email"],
        "password": TEST_USERS[user_type]["password"]
    }
    
    success, response = make_request(
        "post", 
        "/auth/login", 
        data=login_data,
        expected_status=200
    )
    
    if success:
        token_data = response.json()
        tokens[user_type] = token_data["access_token"]
    
    return log_test(test_name, success, response)

def test_get_current_user(user_type: str) -> bool:
    """Test getting current user profile"""
    test_name = f"Get current user profile ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        "/users/me", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_get_featured_user() -> bool:
    """Test getting featured user"""
    test_name = "Get featured user"
    
    success, response = make_request(
        "get", 
        "/users/featured",
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_create_profile(user_type: str) -> bool:
    """Test creating a profile"""
    test_name = f"Create profile for {user_type}"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    profile_data = {
        "title": f"Profil de {TEST_USERS[user_type]['first_name']}",
        "description": f"Description du profil de {TEST_USERS[user_type]['first_name']}",
        "skills": ["Python", "JavaScript", "React", "FastAPI"] if user_type == "freelancer" else ["Recrutement", "Management", "Marketing"],
        "experience_years": 5,
        "location": "Paris, France",
        "hourly_rate": 75.0 if user_type == "freelancer" else None,
        "availability": "Disponible dès maintenant" if user_type == "freelancer" else "Recherche active",
        "portfolio_images": [generate_base64_image(), generate_base64_image()]
    }
    
    success, response = make_request(
        "post", 
        "/profiles", 
        data=profile_data,
        token=tokens[user_type],
        expected_status=200
    )
    
    if success:
        profile_data = response.json()
        profile_ids[user_type] = profile_data["id"]
    
    return log_test(test_name, success, response)

def test_get_my_profile(user_type: str) -> bool:
    """Test getting user's own profile"""
    test_name = f"Get own profile ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        "/profiles/me", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_update_profile(user_type: str) -> bool:
    """Test updating a profile"""
    test_name = f"Update profile for {user_type}"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    profile_data = {
        "title": f"Profil mis à jour de {TEST_USERS[user_type]['first_name']}",
        "description": f"Description mise à jour du profil de {TEST_USERS[user_type]['first_name']}",
        "skills": ["Python", "JavaScript", "React", "FastAPI", "MongoDB"] if user_type == "freelancer" else ["Recrutement", "Management", "Marketing", "Business Development"],
        "experience_years": 6,
        "location": "Lyon, France",
        "hourly_rate": 80.0 if user_type == "freelancer" else None,
        "availability": "Disponible dans 2 semaines" if user_type == "freelancer" else "Recherche active",
        "portfolio_images": [generate_base64_image(), generate_base64_image(), generate_base64_image()]
    }
    
    success, response = make_request(
        "put", 
        "/profiles/me", 
        data=profile_data,
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_get_profile_by_id(user_type: str, profile_id: str) -> bool:
    """Test getting a profile by ID"""
    test_name = f"Get profile by ID ({user_type} viewing profile {profile_id})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        f"/profiles/{profile_id}", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_upload_document(user_type: str, document_type: str) -> bool:
    """Test uploading a document"""
    test_name = f"Upload {document_type} document ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    document_data = {
        "name": f"{document_type.capitalize()} de {TEST_USERS[user_type]['first_name']}",
        "document_type": document_type,
        "content": generate_base64_image()
    }
    
    success, response = make_request(
        "post", 
        "/documents", 
        data=document_data,
        token=tokens[user_type],
        expected_status=200
    )
    
    if success:
        document_data = response.json()
        if user_type not in document_ids:
            document_ids[user_type] = {}
        document_ids[user_type][document_type] = document_data["id"]
    
    return log_test(test_name, success, response)

def test_get_my_documents(user_type: str) -> bool:
    """Test getting user's documents"""
    test_name = f"Get own documents ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        "/documents/me", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_get_swipe_candidates(user_type: str) -> bool:
    """Test getting swipe candidates"""
    test_name = f"Get swipe candidates ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        "/swipes/candidates", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_create_swipe(from_user: str, to_user: str, action: str) -> bool:
    """Test creating a swipe"""
    test_name = f"Create swipe: {from_user} {action}s {to_user}"
    
    if from_user not in tokens or to_user not in user_ids:
        return log_test(test_name, False, error="Missing token or user ID")
    
    swipe_data = {
        "target_user_id": user_ids[to_user],
        "action": action
    }
    
    success, response = make_request(
        "post", 
        "/swipes", 
        data=swipe_data,
        token=tokens[from_user],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_get_matches(user_type: str) -> bool:
    """Test getting user's matches"""
    test_name = f"Get matches ({user_type})"
    
    if user_type not in tokens:
        return log_test(test_name, False, error="No token available")
    
    success, response = make_request(
        "get", 
        "/matches", 
        token=tokens[user_type],
        expected_status=200
    )
    
    if success and response.json():
        match_ids[user_type] = response.json()[0]["id"]
    
    return log_test(test_name, success, response)

def test_unlock_match_chat(user_type: str) -> bool:
    """Test unlocking a match chat"""
    test_name = f"Unlock match chat ({user_type})"
    
    if user_type not in tokens or user_type not in match_ids:
        return log_test(test_name, False, error="Missing token or match ID")
    
    success, response = make_request(
        "post", 
        f"/matches/{match_ids[user_type]}/unlock", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_send_message(user_type: str, content: str) -> bool:
    """Test sending a message"""
    test_name = f"Send message ({user_type})"
    
    if user_type not in tokens or user_type not in match_ids:
        return log_test(test_name, False, error="Missing token or match ID")
    
    message_data = {
        "match_id": match_ids[user_type],
        "content": content,
        "message_type": "text"
    }
    
    success, response = make_request(
        "post", 
        "/messages", 
        data=message_data,
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_get_match_messages(user_type: str) -> bool:
    """Test getting messages for a match"""
    test_name = f"Get match messages ({user_type})"
    
    if user_type not in tokens or user_type not in match_ids:
        return log_test(test_name, False, error="Missing token or match ID")
    
    success, response = make_request(
        "get", 
        f"/messages/{match_ids[user_type]}", 
        token=tokens[user_type],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_get_all_users() -> bool:
    """Test admin getting all users"""
    test_name = "Admin: Get all users"
    
    if "admin" not in tokens:
        return log_test(test_name, False, error="No admin token available")
    
    success, response = make_request(
        "get", 
        "/admin/users", 
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_validate_user(user_type: str) -> bool:
    """Test admin validating a user"""
    test_name = f"Admin: Validate {user_type} user"
    
    if "admin" not in tokens or user_type not in user_ids:
        return log_test(test_name, False, error="Missing admin token or user ID")
    
    success, response = make_request(
        "put", 
        f"/admin/users/{user_ids[user_type]}/validate", 
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_feature_user(user_type: str) -> bool:
    """Test admin featuring a user"""
    test_name = f"Admin: Feature {user_type} user"
    
    if "admin" not in tokens or user_type not in user_ids:
        return log_test(test_name, False, error="Missing admin token or user ID")
    
    success, response = make_request(
        "put", 
        f"/admin/users/{user_ids[user_type]}/feature", 
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_get_pending_documents() -> bool:
    """Test admin getting pending documents"""
    test_name = "Admin: Get pending documents"
    
    if "admin" not in tokens:
        return log_test(test_name, False, error="No admin token available")
    
    success, response = make_request(
        "get", 
        "/admin/documents", 
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_approve_document(user_type: str, document_type: str) -> bool:
    """Test admin approving a document"""
    test_name = f"Admin: Approve {document_type} document for {user_type}"
    
    if "admin" not in tokens or user_type not in document_ids or document_type not in document_ids[user_type]:
        return log_test(test_name, False, error="Missing admin token or document ID")
    
    success, response = make_request(
        "put", 
        f"/admin/documents/{document_ids[user_type][document_type]}/approve", 
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def test_admin_reject_document(user_type: str, document_type: str) -> bool:
    """Test admin rejecting a document"""
    test_name = f"Admin: Reject {document_type} document for {user_type}"
    
    if "admin" not in tokens or user_type not in document_ids or document_type not in document_ids[user_type]:
        return log_test(test_name, False, error="Missing admin token or document ID")
    
    success, response = make_request(
        "put", 
        f"/admin/documents/{document_ids[user_type][document_type]}/reject", 
        data={"admin_comment": "Document non conforme"},
        token=tokens["admin"],
        expected_status=200
    )
    
    return log_test(test_name, success, response)

def run_tests():
    """Run all tests"""
    print("Starting API tests...")
    
    # Authentication tests
    test_register_user("freelancer")
    test_register_user("company")
    
    test_login_user("freelancer")
    test_login_user("company")
    
    test_get_current_user("freelancer")
    test_get_current_user("company")
    
    test_get_featured_user()
    
    # Profile tests
    test_create_profile("freelancer")
    test_create_profile("company")
    
    test_get_my_profile("freelancer")
    test_get_my_profile("company")
    
    test_update_profile("freelancer")
    test_update_profile("company")
    
    if "freelancer" in profile_ids and "company" in profile_ids:
        test_get_profile_by_id("freelancer", profile_ids["company"])
        test_get_profile_by_id("company", profile_ids["freelancer"])
    
    # Document tests
    test_upload_document("freelancer", "kbis")
    test_upload_document("freelancer", "carte_identite")
    test_upload_document("company", "kbis")
    
    test_get_my_documents("freelancer")
    test_get_my_documents("company")
    
    # Admin tests - try to login as admin
    test_login_user("admin")
    
    if "admin" in tokens:
        test_admin_get_all_users()
        test_admin_validate_user("freelancer")
        test_admin_validate_user("company")
        test_admin_feature_user("freelancer")
        test_admin_get_pending_documents()
        
        if "freelancer" in document_ids and "kbis" in document_ids["freelancer"]:
            test_admin_approve_document("freelancer", "kbis")
        
        if "freelancer" in document_ids and "carte_identite" in document_ids["freelancer"]:
            test_admin_reject_document("freelancer", "carte_identite")
    
    # Swipe tests
    test_get_swipe_candidates("freelancer")
    test_get_swipe_candidates("company")
    
    test_create_swipe("freelancer", "company", "like")
    test_create_swipe("company", "freelancer", "like")
    
    # Match tests
    test_get_matches("freelancer")
    test_get_matches("company")
    
    if "freelancer" in match_ids:
        test_unlock_match_chat("freelancer")
        test_send_message("freelancer", "Bonjour, je suis intéressé par votre profil !")
        test_get_match_messages("freelancer")
    
    if "company" in match_ids:
        test_send_message("company", "Bonjour, nous sommes intéressés par votre candidature.")
        test_get_match_messages("company")
    
    # Print summary
    print("\n=== Test Summary ===")
    print(f"Total tests: {results['total']}")
    print(f"Passed: {results['passed']}")
    print(f"Failed: {results['failed']}")
    print(f"Success rate: {(results['passed'] / results['total']) * 100:.2f}%")
    
    if results['failed'] > 0:
        print("\nFailed tests:")
        for test in results['tests']:
            if not test['success']:
                print(f"- {test['name']}")
    
    return results

if __name__ == "__main__":
    run_tests()