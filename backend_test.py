#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://50d2463b-8540-4634-be7d-c4da33d09e2d.preview.emergentagent.com/api"

# Test data
TEST_USERS = {
    "particuliers": [
        {"email": "part1@gmail.com", "password": "pat1pat1"},
        {"email": "part2@gmail.com", "password": "pat2pat2"},
        {"email": "part3@gmail.com", "password": "pat3pat3"}
    ],
    "artisans": [
        {"email": "art1@gmail.com", "password": "art1art1"},
        {"email": "art2@gmail.com", "password": "art2art2"},
        {"email": "art3@gmail.com", "password": "art3art3"},
        {"email": "art4@gmail.com", "password": "art4art4"}
    ],
    "admin": {"email": "admin@swipetonpro.fr", "password": "admin123"}
}

# Test data for new users
NEW_USERS = {
    "particulier": {
        "email": f"test_part_{int(time.time())}@example.com",
        "password": "testpassword",
        "first_name": "Test",
        "last_name": "Particulier",
        "phone": "0123456789",
        "user_type": "particulier"
    },
    "artisan": {
        "email": f"test_art_{int(time.time())}@example.com",
        "password": "testpassword",
        "first_name": "Test",
        "last_name": "Artisan",
        "phone": "0123456789",
        "user_type": "artisan"
    }
}

# Test data for artisan profile
ARTISAN_PROFILE = {
    "profession": "electricien",
    "description": "Électricien professionnel avec 10 ans d'expérience",
    "experience_years": 10,
    "hourly_rate": 50.0,
    "location": "Paris",
    "portfolio_images": ["https://example.com/image1.jpg"],
    "certifications": ["Certification Électricien"]
}

# Test data for project
PROJECT = {
    "title": "Rénovation électrique",
    "description": "Rénovation complète de l'installation électrique d'une maison",
    "budget": 5000.0,
    "profession_needed": "electricien",
    "location": "Paris",
    "urgency": "normal",
    "images": ["https://example.com/project1.jpg"]
}

# Store tokens and user IDs
tokens = {}
user_ids = {}
artisan_profile_ids = {}
project_ids = {}

def print_separator():
    print("\n" + "="*80 + "\n")

def test_health_check():
    print("Testing Health Check Endpoint...")
    response = requests.get(f"{BACKEND_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("✅ Health Check Test Passed")
    return True

def test_register(user_type="particulier"):
    print(f"Testing Register Endpoint for {user_type}...")
    user_data = NEW_USERS[user_type]
    
    response = requests.post(f"{BACKEND_URL}/auth/register", json=user_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        tokens[user_type] = data["access_token"]
        user_ids[user_type] = data["user"]["id"]
        print(f"✅ Register Test Passed for {user_type}")
        print(f"Token: {tokens[user_type][:20]}...")
        print(f"User ID: {user_ids[user_type]}")
        return True
    else:
        print(f"❌ Register Test Failed for {user_type}")
        print(f"Response: {response.text}")
        return False

def test_login(user_type="particulier", use_existing=False):
    print(f"Testing Login Endpoint for {user_type}...")
    
    if use_existing:
        if user_type == "admin":
            user_data = TEST_USERS["admin"]
        elif user_type == "artisan":
            user_data = TEST_USERS["artisans"][0]
        else:
            user_data = TEST_USERS["particuliers"][0]
    else:
        user_data = {
            "email": NEW_USERS[user_type]["email"],
            "password": NEW_USERS[user_type]["password"]
        }
    
    response = requests.post(f"{BACKEND_URL}/auth/login", json=user_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        tokens[user_type] = data["access_token"]
        user_ids[user_type] = data["user"]["id"]
        print(f"✅ Login Test Passed for {user_type}")
        print(f"Token: {tokens[user_type][:20]}...")
        print(f"User ID: {user_ids[user_type]}")
        return True
    else:
        print(f"❌ Login Test Failed for {user_type}")
        print(f"Response: {response.text}")
        return False

def test_get_current_user(user_type="particulier"):
    print(f"Testing Get Current User Endpoint for {user_type}...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/auth/me", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Current User Test Passed for {user_type}")
        print(f"User: {data['first_name']} {data['last_name']} ({data['email']})")
        return True
    else:
        print(f"❌ Get Current User Test Failed for {user_type}")
        print(f"Response: {response.text}")
        return False

def test_create_artisan_profile(use_new_artisan=False):
    print("Testing Create Artisan Profile Endpoint...")
    
    if use_new_artisan:
        # Register a new artisan
        new_artisan = {
            "email": f"new_art_{int(time.time())}@example.com",
            "password": "testpassword",
            "first_name": "New",
            "last_name": "Artisan",
            "phone": "0123456789",
            "user_type": "artisan"
        }
        
        response = requests.post(f"{BACKEND_URL}/auth/register", json=new_artisan)
        if response.status_code == 200:
            data = response.json()
            tokens["new_artisan"] = data["access_token"]
            user_ids["new_artisan"] = data["user"]["id"]
            print(f"✅ Registered new artisan for profile creation")
            print(f"Token: {tokens['new_artisan'][:20]}...")
            
            headers = {"Authorization": f"Bearer {tokens['new_artisan']}"}
        else:
            print(f"❌ Failed to register new artisan for profile creation")
            print(f"Response: {response.text}")
            return False
    else:
        headers = {"Authorization": f"Bearer {tokens['artisan']}"}
    
    response = requests.post(f"{BACKEND_URL}/artisan/profile", json=ARTISAN_PROFILE, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        artisan_profile_ids["artisan"] = data["id"]
        print(f"✅ Create Artisan Profile Test Passed")
        print(f"Profile ID: {artisan_profile_ids['artisan']}")
        return True
    else:
        print(f"❌ Create Artisan Profile Test Failed")
        print(f"Response: {response.text}")
        return False

def test_get_artisan_profiles(user_type="particulier"):
    print("Testing Get Artisan Profiles Endpoint...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/artisan/profiles", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Artisan Profiles Test Passed")
        print(f"Number of profiles: {len(data)}")
        if len(data) > 0:
            print(f"First profile: {data[0]['profession']} in {data[0]['location']}")
        return True
    else:
        print(f"❌ Get Artisan Profiles Test Failed")
        print(f"Response: {response.text}")
        return False

def test_swipe(user_type="particulier", target_id=None, action="like"):
    print(f"Testing Swipe Endpoint ({action})...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    
    # If no target_id is provided, use the artisan profile ID
    if not target_id:
        # Try to get an artisan profile ID
        response = requests.get(f"{BACKEND_URL}/artisan/profiles", headers=headers)
        if response.status_code == 200 and len(response.json()) > 0:
            target_id = response.json()[0]["id"]
        else:
            print("❌ No artisan profiles found to swipe on")
            return False
    
    swipe_data = {
        "target_id": target_id,
        "action": action
    }
    
    response = requests.post(f"{BACKEND_URL}/swipe", json=swipe_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Swipe Test Passed")
        print(f"Response: {data}")
        return True
    else:
        print(f"❌ Swipe Test Failed")
        print(f"Response: {response.text}")
        return False

def test_get_matches(user_type="particulier"):
    print(f"Testing Get Matches Endpoint for {user_type}...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/matches", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Matches Test Passed")
        print(f"Number of matches: {len(data)}")
        return True
    else:
        print(f"❌ Get Matches Test Failed")
        print(f"Response: {response.text}")
        return False

def test_create_project(user_type="particulier"):
    print("Testing Create Project Endpoint...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.post(f"{BACKEND_URL}/projects", json=PROJECT, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        project_ids[user_type] = data["id"]
        print(f"✅ Create Project Test Passed")
        print(f"Project ID: {project_ids[user_type]}")
        return True
    else:
        print(f"❌ Create Project Test Failed")
        print(f"Response: {response.text}")
        return False

def test_get_projects(user_type="particulier"):
    print(f"Testing Get Projects Endpoint for {user_type}...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/projects", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Projects Test Passed")
        print(f"Number of projects: {len(data)}")
        if len(data) > 0:
            print(f"First project: {data[0]['title']}")
        return True
    else:
        print(f"❌ Get Projects Test Failed")
        print(f"Response: {response.text}")
        return False

def run_all_tests():
    results = {}
    
    print_separator()
    print("STARTING SWIPETONPRO API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_separator()
    
    # Health Check
    results["health_check"] = test_health_check()
    print_separator()
    
    # Authentication - Register
    results["register_particulier"] = test_register("particulier")
    print_separator()
    results["register_artisan"] = test_register("artisan")
    print_separator()
    
    # Authentication - Login (with existing users)
    results["login_existing_particulier"] = test_login("particulier", use_existing=True)
    print_separator()
    results["login_existing_artisan"] = test_login("artisan", use_existing=True)
    print_separator()
    results["login_admin"] = test_login("admin", use_existing=True)
    print_separator()
    
    # Authentication - Get Current User
    results["get_current_user_particulier"] = test_get_current_user("particulier")
    print_separator()
    results["get_current_user_artisan"] = test_get_current_user("artisan")
    print_separator()
    
    # Artisan Profiles
    results["create_artisan_profile"] = test_create_artisan_profile()
    print_separator()
    results["create_artisan_profile_new_user"] = test_create_artisan_profile(use_new_artisan=True)
    print_separator()
    results["get_artisan_profiles"] = test_get_artisan_profiles("particulier")
    print_separator()
    
    # Swipe System
    results["swipe_like"] = test_swipe("particulier", action="like")
    print_separator()
    results["swipe_pass"] = test_swipe("particulier", action="pass")
    print_separator()
    results["get_matches_particulier"] = test_get_matches("particulier")
    print_separator()
    results["get_matches_artisan"] = test_get_matches("artisan")
    print_separator()
    
    # Projects
    results["create_project"] = test_create_project("particulier")
    print_separator()
    results["get_projects_particulier"] = test_get_projects("particulier")
    print_separator()
    results["get_projects_artisan"] = test_get_projects("artisan")
    print_separator()
    
    # Summary
    print("TEST SUMMARY")
    print("="*80)
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    # Overall result
    all_passed = all(results.values())
    print("="*80)
    if all_passed:
        print("🎉 ALL TESTS PASSED! 🎉")
    else:
        print("❌ SOME TESTS FAILED ❌")
    
    return all_passed

if __name__ == "__main__":
    run_all_tests()