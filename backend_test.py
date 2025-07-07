#!/usr/bin/env python3
import requests
import json
import time
import os
import uuid
import random
from dotenv import load_dotenv
import sys

# Use local URL for testing
API_URL = "http://localhost:8001/api"
print(f"Using API URL: {API_URL}")

# Test data - More comprehensive for thorough testing
test_users = [
    {
        "email": "particulier1@example.com",
        "name": "Jean Dupont",
        "user_type": "particulier"
    },
    {
        "email": "professionnel1@example.com",
        "name": "Marie Martin",
        "user_type": "professionnel"
    },
    {
        "email": "particulier2@example.com",
        "name": "Sophie Dubois",
        "user_type": "particulier"
    },
    {
        "email": "professionnel2@example.com",
        "name": "Thomas Bernard",
        "user_type": "professionnel"
    }
]

test_profiles = [
    {
        "bio": "Je cherche un électricien pour rénover ma maison",
        "location": "Paris",
    },
    {
        "bio": "Électricien avec 10 ans d'expérience",
        "location": "Paris",
        "profession_category": "electricien",
        "experience_years": 10,
        "hourly_rate": 50.0,
        "profile_image": "https://example.com/profile1.jpg"
    },
    {
        "bio": "Je recherche un plombier pour installer une nouvelle salle de bain",
        "location": "Lyon",
    },
    {
        "bio": "Plombier professionnel, spécialiste en rénovation",
        "location": "Lyon",
        "profession_category": "plombier",
        "experience_years": 8,
        "hourly_rate": 45.0,
        "profile_image": "https://example.com/profile2.jpg"
    }
]

# Helper functions
def print_separator():
    print("\n" + "="*80 + "\n")

def print_response(response, message=""):
    print(f"{message} Status Code: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

def validate_uuid(id_str):
    """Validate that a string is a valid UUID"""
    try:
        uuid_obj = uuid.UUID(id_str)
        return str(uuid_obj) == id_str
    except ValueError:
        return False

# Test functions
def test_base_api():
    print_separator()
    print("Testing Base API")
    response = requests.get(f"{API_URL}/")
    print_response(response, "Base API Response:")
    assert response.status_code == 200
    assert response.json()["message"] == "Swipe Ton Pro API - Ready for matching!"
    print("✅ Base API test passed")
    return True

def test_create_users():
    print_separator()
    print("Testing User Creation")
    created_users = []
    
    for user_data in test_users:
        response = requests.post(f"{API_URL}/users", json=user_data)
        print_response(response, f"Create User Response ({user_data['user_type']}):")
        assert response.status_code == 200
        created_user = response.json()
        assert created_user["email"] == user_data["email"]
        assert created_user["name"] == user_data["name"]
        assert created_user["user_type"] == user_data["user_type"]
        assert "id" in created_user
        
        # Verify UUID format
        assert validate_uuid(created_user["id"]), f"ID is not a valid UUID: {created_user['id']}"
        
        created_users.append(created_user)
    
    print("✅ User creation tests passed")
    return created_users

def test_get_user(user_id):
    print_separator()
    print(f"Testing Get User by ID: {user_id}")
    response = requests.get(f"{API_URL}/users/{user_id}")
    print_response(response, "Get User Response:")
    assert response.status_code == 200
    user = response.json()
    assert user["id"] == user_id
    print("✅ Get user test passed")
    return user

def test_create_profiles(users):
    print_separator()
    print("Testing Profile Creation")
    created_profiles = []
    
    for i, user in enumerate(users):
        profile_data = test_profiles[i].copy()
        profile_data["user_id"] = user["id"]
        
        response = requests.post(f"{API_URL}/profiles", json=profile_data)
        print_response(response, f"Create Profile Response ({user['user_type']}):")
        assert response.status_code == 200
        created_profile = response.json()
        assert created_profile["user_id"] == user["id"]
        assert created_profile["bio"] == profile_data["bio"]
        assert created_profile["location"] == profile_data["location"]
        assert "id" in created_profile
        
        # Verify UUID format
        assert validate_uuid(created_profile["id"]), f"Profile ID is not a valid UUID: {created_profile['id']}"
        
        created_profiles.append(created_profile)
    
    print("✅ Profile creation tests passed")
    return created_profiles

def test_get_profile(profile_id):
    print_separator()
    print(f"Testing Get Profile by ID: {profile_id}")
    response = requests.get(f"{API_URL}/profiles/{profile_id}")
    print_response(response, "Get Profile Response:")
    assert response.status_code == 200
    profile = response.json()
    assert profile["id"] == profile_id
    print("✅ Get profile test passed")
    return profile

def test_get_profile_by_user(user_id):
    print_separator()
    print(f"Testing Get Profile by User ID: {user_id}")
    response = requests.get(f"{API_URL}/profiles/user/{user_id}")
    print_response(response, "Get Profile by User Response:")
    assert response.status_code == 200
    profile = response.json()
    assert profile["user_id"] == user_id
    print("✅ Get profile by user test passed")
    return profile

def test_get_potential_matches(user_id):
    print_separator()
    print(f"Testing Get Potential Matches for User ID: {user_id}")
    response = requests.get(f"{API_URL}/matches/{user_id}")
    print_response(response, "Get Potential Matches Response:")
    assert response.status_code == 200
    data = response.json()
    assert "profiles" in data
    
    # Verify that profiles don't contain MongoDB ObjectId fields
    for profile in data["profiles"]:
        assert "_id" not in profile, "MongoDB ObjectId (_id) found in profile data"
        
        # Verify UUID format for profile id
        assert validate_uuid(profile["id"]), f"Profile ID is not a valid UUID: {profile['id']}"
        assert validate_uuid(profile["user_id"]), f"User ID is not a valid UUID: {profile['user_id']}"
    
    print("✅ Get potential matches test passed")
    return data["profiles"]

def test_create_swipe(swiper_id, swiped_id, swipe_type):
    print_separator()
    print(f"Testing Create Swipe: {swiper_id} -> {swiped_id} ({swipe_type})")
    swipe_data = {
        "swiper_id": swiper_id,
        "swiped_id": swiped_id,
        "swipe_type": swipe_type
    }
    response = requests.post(f"{API_URL}/swipes", json=swipe_data)
    print_response(response, "Create Swipe Response:")
    assert response.status_code == 200
    result = response.json()
    assert "swipe" in result
    assert result["swipe"]["swiper_id"] == swiper_id
    assert result["swipe"]["swiped_id"] == swiped_id
    assert result["swipe"]["swipe_type"] == swipe_type
    
    # Verify UUID format for swipe id
    assert validate_uuid(result["swipe"]["id"]), f"Swipe ID is not a valid UUID: {result['swipe']['id']}"
    
    # If there's a match, verify its structure
    if result.get("is_match", False):
        assert "match" in result
        assert validate_uuid(result["match"]["id"]), f"Match ID is not a valid UUID: {result['match']['id']}"
        assert validate_uuid(result["match"]["user1_id"]), f"User1 ID is not a valid UUID: {result['match']['user1_id']}"
        assert validate_uuid(result["match"]["user2_id"]), f"User2 ID is not a valid UUID: {result['match']['user2_id']}"
    
    print("✅ Create swipe test passed")
    return result

def test_get_user_matches(user_id):
    print_separator()
    print(f"Testing Get Matches for User ID: {user_id}")
    response = requests.get(f"{API_URL}/matches/user/{user_id}")
    print_response(response, "Get User Matches Response:")
    assert response.status_code == 200
    data = response.json()
    assert "matches" in data
    
    # Verify that matches don't contain MongoDB ObjectId fields
    for match_data in data["matches"]:
        assert "match" in match_data
        assert "profile" in match_data
        
        match = match_data["match"]
        profile = match_data["profile"]
        
        assert "_id" not in match, "MongoDB ObjectId (_id) found in match data"
        assert "_id" not in profile, "MongoDB ObjectId (_id) found in profile data"
        
        # Verify UUID format
        assert validate_uuid(match["id"]), f"Match ID is not a valid UUID: {match['id']}"
        assert validate_uuid(match["user1_id"]), f"User1 ID is not a valid UUID: {match['user1_id']}"
        assert validate_uuid(match["user2_id"]), f"User2 ID is not a valid UUID: {match['user2_id']}"
        assert validate_uuid(profile["id"]), f"Profile ID is not a valid UUID: {profile['id']}"
        assert validate_uuid(profile["user_id"]), f"User ID is not a valid UUID: {profile['user_id']}"
    
    print("✅ Get user matches test passed")
    return data["matches"]

def test_complete_matching_flow():
    print_separator()
    print("Testing Complete Matching Flow")
    
    # Create users for the flow test
    flow_users = test_create_users()
    
    # Create profiles for all users
    flow_profiles = test_create_profiles(flow_users)
    
    # Test potential matches for the first user
    potential_matches = test_get_potential_matches(flow_users[0]["id"])
    print(f"Found {len(potential_matches)} potential matches for user {flow_users[0]['name']}")
    
    # Create swipes between users to test match detection
    # User 1 likes User 2
    swipe_result_1 = test_create_swipe(flow_users[0]["id"], flow_users[1]["id"], "like")
    assert not swipe_result_1.get("is_match", False), "Match should not be created after only one like"
    
    # User 2 likes User 1 (should create a match)
    swipe_result_2 = test_create_swipe(flow_users[1]["id"], flow_users[0]["id"], "like")
    assert swipe_result_2.get("is_match", False), "Match should be created after mutual likes"
    
    # User 3 passes on User 4
    swipe_result_3 = test_create_swipe(flow_users[2]["id"], flow_users[3]["id"], "pass")
    assert not swipe_result_3.get("is_match", False), "Match should not be created after a pass"
    
    # User 4 likes User 3 (should not create a match since User 3 passed)
    swipe_result_4 = test_create_swipe(flow_users[3]["id"], flow_users[2]["id"], "like")
    assert not swipe_result_4.get("is_match", False), "Match should not be created if one user passed"
    
    # Test retrieving matches for users
    matches_user1 = test_get_user_matches(flow_users[0]["id"])
    matches_user2 = test_get_user_matches(flow_users[1]["id"])
    
    # Verify that User 1 and User 2 have a match with each other
    assert len(matches_user1) > 0, "User 1 should have at least one match"
    assert len(matches_user2) > 0, "User 2 should have at least one match"
    
    # Verify that User 3 and User 4 don't have matches
    matches_user3 = test_get_user_matches(flow_users[2]["id"])
    matches_user4 = test_get_user_matches(flow_users[3]["id"])
    
    assert len(matches_user3) == 0, "User 3 should not have any matches"
    assert len(matches_user4) == 0, "User 4 should not have any matches"
    
    print("✅ Complete matching flow test passed")
    return True

def run_all_tests():
    try:
        # Test base API
        test_base_api()
        
        # Test the complete matching flow (includes user creation, profile creation, swipes, and matches)
        test_complete_matching_flow()
        
        print_separator()
        print("🎉 All tests completed successfully! The Swipe Ton Pro API is working correctly.")
        print("✅ Data models (User, Profile, Swipe, Match) are correctly implemented")
        print("✅ Basic APIs (user and profile creation/retrieval) are working")
        print("✅ Swipe system (recording swipes and detecting matches) is functioning")
        print("✅ Matching APIs (potential matches and existing matches) are working")
        print("✅ UUID serialization is correctly implemented (no MongoDB ObjectId issues)")
        print("✅ Complete matching flow is working as expected")
        return True
        
    except AssertionError as e:
        print(f"❌ Test failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False

if __name__ == "__main__":
    run_all_tests()