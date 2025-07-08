#!/usr/bin/env python3
import requests
import json
import time
import base64
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
    "professions": ["electricien", "plombier"],  # Multi-profession support
    "description": "Électricien professionnel avec 10 ans d'expérience",
    "experience_years": 10,
    "hourly_rate_min": 40.0,
    "hourly_rate_max": 60.0,
    "location": "Paris",
    "radius_km": 50,
    "portfolio_images": ["https://example.com/image1.jpg"],
    "certifications": ["Certification Électricien"],
    "company_info": {
        "company_name": "Électricité Pro",
        "siret": "12345678901234",
        "company_type": "auto_entrepreneur",
        "address": "123 Rue de l'Électricité",
        "city": "Paris",
        "postal_code": "75001",
        "insurance_number": "INS123456",
        "website": "https://electricite-pro.fr"
    }
}

# Test data for project
PROJECT = {
    "title": "Rénovation électrique",
    "description": "Rénovation complète de l'installation électrique d'une maison",
    "budget_range": "1500_5000",
    "professions_needed": ["electricien", "plombier"],  # Multi-profession support
    "location": "Paris",
    "urgency": "normal",
    "images": ["https://example.com/project1.jpg"],
    "technical_details": {"surface": 120, "age_installation": "plus_15_ans"},
    "preferred_timeline": "1_mois",
    "access_constraints": "Accès difficile, 3ème étage sans ascenseur"
}

# Store tokens and user IDs
tokens = {}
user_ids = {}
artisan_profile_ids = {}
project_ids = {}
document_ids = {}
subscription_ids = {}

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
            print(f"First profile professions: {data[0]['professions']} in {data[0]['location']}")
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

def test_get_subscription_packs():
    print("Testing Get Subscription Packs Endpoint...")
    
    response = requests.get(f"{BACKEND_URL}/subscription/packs")
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Subscription Packs Test Passed")
        print(f"Number of packs: {len(data)}")
        for pack in data:
            print(f"Pack: {pack['name']} - {pack['credits']} credits - {pack['price']}€")
        return True
    else:
        print(f"❌ Get Subscription Packs Test Failed")
        print(f"Response: {response.text}")
        return False

def test_purchase_subscription(user_type="artisan", pack="starter"):
    print(f"Testing Purchase Subscription Endpoint for {pack}...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    subscription_data = {
        "pack": pack
    }
    
    response = requests.post(f"{BACKEND_URL}/subscription/purchase", json=subscription_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        subscription_ids[user_type] = data.get("subscription_id")
        print(f"✅ Purchase Subscription Test Passed")
        print(f"Subscription ID: {subscription_ids.get(user_type)}")
        print(f"Credits Added: {data.get('credits_added')}")
        return True
    else:
        print(f"❌ Purchase Subscription Test Failed")
        print(f"Response: {response.text}")
        return False

def test_get_current_subscription(user_type="artisan"):
    print("Testing Get Current Subscription Endpoint...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/subscription/current", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Current Subscription Test Passed")
        print(f"Current Credits: {data.get('current_credits')}")
        print(f"Subscription Pack: {data.get('subscription_pack')}")
        print(f"Expires: {data.get('subscription_expires')}")
        return True
    else:
        print(f"❌ Get Current Subscription Test Failed")
        print(f"Response: {response.text}")
        return False

def test_upload_document(user_type="artisan", doc_type="kbis"):
    print(f"Testing Upload Document Endpoint for {doc_type}...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    
    # Create a simple base64 document
    sample_doc = base64.b64encode(b"This is a sample document for testing").decode('utf-8')
    
    document_data = {
        "name": f"Test {doc_type.upper()} Document",
        "type": doc_type,
        "file_data": sample_doc
    }
    
    response = requests.post(f"{BACKEND_URL}/artisan/profile/document", json=document_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        document_ids[doc_type] = data.get("document_id")
        print(f"✅ Upload Document Test Passed")
        print(f"Document ID: {document_ids.get(doc_type)}")
        return True
    else:
        print(f"❌ Upload Document Test Failed")
        print(f"Response: {response.text}")
        return False

def test_get_pending_artisans(user_type="admin"):
    print("Testing Get Pending Artisans Endpoint...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/admin/pending-artisans", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Get Pending Artisans Test Passed")
        print(f"Number of pending artisans: {len(data)}")
        if len(data) > 0:
            print(f"First pending artisan: {data[0]['id']}")
            # Store the first pending artisan ID for validation test
            artisan_profile_ids["pending"] = data[0]["id"]
        return True
    else:
        print(f"❌ Get Pending Artisans Test Failed")
        print(f"Response: {response.text}")
        return False

def test_validate_artisan(user_type="admin", action="validate"):
    print(f"Testing Validate Artisan Endpoint ({action})...")
    
    if "pending" not in artisan_profile_ids:
        print("❌ No pending artisan ID found to validate")
        return False
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    params = {"action": action}
    if action == "reject":
        params["reason"] = "Test rejection reason"
    
    response = requests.post(
        f"{BACKEND_URL}/admin/validate-artisan/{artisan_profile_ids['pending']}", 
        params=params, 
        headers=headers
    )
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Validate Artisan Test Passed")
        print(f"Response: {data}")
        return True
    else:
        print(f"❌ Validate Artisan Test Failed")
        print(f"Response: {response.text}")
        return False

def test_artisan_swipe_endpoint(user_type="artisan"):
    print("Testing Artisan Swipe Endpoint...")
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/artisan/swipe", headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Artisan Swipe Endpoint Test Passed")
        print(f"Number of projects to swipe: {len(data)}")
        if len(data) > 0:
            print(f"First project: {data[0]['title']}")
            # Store the first project ID for artisan swipe test
            project_ids["to_swipe"] = data[0]["id"]
        return True
    else:
        print(f"❌ Artisan Swipe Endpoint Test Failed")
        print(f"Response: {response.text}")
        return False

def test_artisan_swipe_project(user_type="artisan", action="like"):
    print(f"Testing Artisan Swipe Project Endpoint ({action})...")
    
    if "to_swipe" not in project_ids:
        print("❌ No project ID found to swipe on")
        return False
    
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    params = {
        "project_id": project_ids["to_swipe"],
        "action": action
    }
    
    response = requests.post(f"{BACKEND_URL}/artisan/swipe-project", params=params, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Artisan Swipe Project Test Passed")
        print(f"Response: {data}")
        return True
    else:
        print(f"❌ Artisan Swipe Project Test Failed")
        print(f"Response: {response.text}")
        return False

def test_swipe_with_credit_check(user_type="artisan", action="like"):
    """Test swipe with credit consumption check"""
    print(f"Testing Swipe with Credit Consumption ({action})...")
    
    # First, get current credits
    headers = {"Authorization": f"Bearer {tokens[user_type]}"}
    response = requests.get(f"{BACKEND_URL}/subscription/current", headers=headers)
    
    if response.status_code != 200:
        print("❌ Failed to get current credits")
        return False
    
    initial_credits = response.json().get("current_credits", 0)
    print(f"Initial credits: {initial_credits}")
    
    # Get a profile to swipe on
    response = requests.get(f"{BACKEND_URL}/artisan/profiles", headers=headers)
    if response.status_code != 200 or len(response.json()) == 0:
        print("❌ No profiles found to swipe on")
        return False
    
    target_id = response.json()[0]["id"]
    
    # Perform swipe
    swipe_data = {
        "target_id": target_id,
        "action": action
    }
    
    response = requests.post(f"{BACKEND_URL}/swipe", json=swipe_data, headers=headers)
    print(f"Swipe Status Code: {response.status_code}")
    
    # Check credits after swipe
    response = requests.get(f"{BACKEND_URL}/subscription/current", headers=headers)
    
    if response.status_code != 200:
        print("❌ Failed to get updated credits")
        return False
    
    final_credits = response.json().get("current_credits", 0)
    print(f"Final credits: {final_credits}")
    
    if action == "like" and final_credits < initial_credits:
        print(f"✅ Credit consumption verified: {initial_credits} -> {final_credits}")
        return True
    elif action == "pass" and final_credits == initial_credits:
        print(f"✅ No credit consumed for pass action: {initial_credits} -> {final_credits}")
        return True
    else:
        print(f"❌ Credit consumption test failed. Expected: {initial_credits-1 if action=='like' else initial_credits}, Got: {final_credits}")
        return False

def test_multi_profession_search():
    """Test searching artisans by multiple professions"""
    print("Testing Multi-Profession Search...")
    
    # Login as particulier
    if "particulier" not in tokens:
        test_login("particulier", use_existing=True)
    
    headers = {"Authorization": f"Bearer {tokens['particulier']}"}
    
    # Search with multiple professions
    professions = ["electricien", "plombier"]
    params = {"professions": ",".join(professions)}
    
    response = requests.get(f"{BACKEND_URL}/artisan/profiles", params=params, headers=headers)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Multi-Profession Search Test Passed")
        print(f"Number of profiles matching {professions}: {len(data)}")
        
        # Verify profiles have at least one of the requested professions
        valid_profiles = 0
        for profile in data:
            has_profession = any(prof in profile.get("professions", []) for prof in professions)
            if has_profession:
                valid_profiles += 1
        
        print(f"Profiles with requested professions: {valid_profiles}/{len(data)}")
        return valid_profiles > 0
    else:
        print(f"❌ Multi-Profession Search Test Failed")
        print(f"Response: {response.text}")
        return False

def run_new_feature_tests():
    results = {}
    
    print_separator()
    print("STARTING SWIPETONPRO NEW FEATURES TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print_separator()
    
    # Login with existing users
    results["login_existing_particulier"] = test_login("particulier", use_existing=True)
    print_separator()
    results["login_existing_artisan"] = test_login("artisan", use_existing=True)
    print_separator()
    results["login_admin"] = test_login("admin", use_existing=True)
    print_separator()
    
    # 1. Subscription System
    results["get_subscription_packs"] = test_get_subscription_packs()
    print_separator()
    results["purchase_subscription"] = test_purchase_subscription("artisan", "starter")
    print_separator()
    results["get_current_subscription"] = test_get_current_subscription("artisan")
    print_separator()
    
    # 2. Document Upload
    results["upload_document"] = test_upload_document("artisan", "kbis")
    print_separator()
    
    # 3. Artisan Validation
    results["get_pending_artisans"] = test_get_pending_artisans("admin")
    print_separator()
    if "pending" in artisan_profile_ids:
        results["validate_artisan"] = test_validate_artisan("admin", "validate")
        print_separator()
    
    # 4. Swipe with Credit Consumption
    results["swipe_with_credit_check"] = test_swipe_with_credit_check("artisan", "like")
    print_separator()
    
    # 5. Artisan Swipe on Projects
    results["artisan_swipe_endpoint"] = test_artisan_swipe_endpoint("artisan")
    print_separator()
    if "to_swipe" in project_ids:
        results["artisan_swipe_project"] = test_artisan_swipe_project("artisan", "like")
        print_separator()
    
    # 6. Multi-Profession Support
    results["multi_profession_search"] = test_multi_profession_search()
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
        print("🎉 ALL NEW FEATURE TESTS PASSED! 🎉")
    else:
        print("❌ SOME NEW FEATURE TESTS FAILED ❌")
    
    return all_passed

if __name__ == "__main__":
    run_new_feature_tests()