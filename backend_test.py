#!/usr/bin/env python3
import requests
import json
import time
from datetime import datetime
import sys

# Base URL for the API
BASE_URL = "https://c5d2d6b0-9f85-4474-b5d4-b3e1bc77006d.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "admin@careertinder.com"
ADMIN_PASSWORD = "admin123"

# Test invitation email
TEST_INVITATION_EMAIL = "test@example.com"

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

def print_response(response):
    try:
        print_info(f"Status Code: {response.status_code}")
        print_info(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print_info(f"Response: {response.text}")

def test_admin_login():
    print_test_header("Admin Login")
    
    url = f"{BASE_URL}/admin/login"
    payload = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(url, json=payload)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "admin" in data:
                print_success("Admin login successful")
                return data["access_token"], data["admin"]
            else:
                print_failure("Admin login response missing token or admin data")
                return None, None
        else:
            print_failure(f"Admin login failed with status code {response.status_code}")
            return None, None
    except Exception as e:
        print_failure(f"Exception during admin login: {str(e)}")
        return None, None

def test_get_admin_profile(token):
    print_test_header("Get Admin Profile")
    
    url = f"{BASE_URL}/admin/me"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "email" in data:
                print_success("Successfully retrieved admin profile")
                return True
            else:
                print_failure("Admin profile response missing expected fields")
                return False
        else:
            print_failure(f"Failed to get admin profile with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during get admin profile: {str(e)}")
        return False

def test_get_platform_stats(token):
    print_test_header("Get Platform Statistics")
    
    url = f"{BASE_URL}/admin/stats"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            expected_fields = ["total_users", "total_professionals", "total_admins", 
                              "total_reports", "pending_reports", "stats_generated_at"]
            
            missing_fields = [field for field in expected_fields if field not in data]
            
            if not missing_fields:
                print_success("Successfully retrieved platform statistics")
                return True
            else:
                print_failure(f"Platform stats response missing expected fields: {missing_fields}")
                return False
        else:
            print_failure(f"Failed to get platform stats with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during get platform stats: {str(e)}")
        return False

def test_list_admins(token):
    print_test_header("List Admins")
    
    url = f"{BASE_URL}/admin/list"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Successfully retrieved admin list with {len(data)} admins")
                return True
            else:
                print_failure("Admin list response is not a list")
                return False
        else:
            print_failure(f"Failed to get admin list with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during list admins: {str(e)}")
        return False

def test_list_invitations(token):
    print_test_header("List Invitations")
    
    url = f"{BASE_URL}/admin/invitations"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_success(f"Successfully retrieved invitations list with {len(data)} invitations")
                return True
            else:
                print_failure("Invitations list response is not a list")
                return False
        else:
            print_failure(f"Failed to get invitations list with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during list invitations: {str(e)}")
        return False

def test_list_users(token):
    print_test_header("List Users")
    
    url = f"{BASE_URL}/admin/users"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if "users" in data and "total" in data:
                print_success(f"Successfully retrieved users list with {data['total']} total users")
                return True
            else:
                print_failure("Users list response missing expected fields")
                return False
        else:
            print_failure(f"Failed to get users list with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during list users: {str(e)}")
        return False

def test_list_reports(token):
    print_test_header("List Reports")
    
    url = f"{BASE_URL}/admin/reports"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if "reports" in data and "total" in data:
                print_success(f"Successfully retrieved reports list with {data['total']} total reports")
                return True
            else:
                print_failure("Reports list response missing expected fields")
                return False
        else:
            print_failure(f"Failed to get reports list with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during list reports: {str(e)}")
        return False

def test_invite_admin(token, admin_data):
    print_test_header("Invite Admin")
    
    url = f"{BASE_URL}/admin/invite"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "email": TEST_INVITATION_EMAIL,
        "role": "admin",
        "permissions": ["view_users", "view_stats"]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "invitation_id" in data:
                print_success("Successfully sent admin invitation")
                return True
            else:
                print_failure("Invite admin response missing expected fields")
                return False
        else:
            print_failure(f"Failed to invite admin with status code {response.status_code}")
            return False
    except Exception as e:
        print_failure(f"Exception during invite admin: {str(e)}")
        return False

def run_all_tests():
    print(f"\n{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}  CAREER TINDER ADMIN API TEST SUITE  {Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}======================================{Colors.ENDC}\n")
    
    print_info(f"Testing API at: {BASE_URL}")
    print_info(f"Admin account: {ADMIN_EMAIL}")
    print_info(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test results tracking
    results = {
        "total": 0,
        "passed": 0,
        "failed": 0
    }
    
    # Step 1: Admin Login
    token, admin_data = test_admin_login()
    results["total"] += 1
    if token:
        results["passed"] += 1
        
        # Step 2: Get Admin Profile
        profile_result = test_get_admin_profile(token)
        results["total"] += 1
        if profile_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 3: Get Platform Stats
        stats_result = test_get_platform_stats(token)
        results["total"] += 1
        if stats_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 4: List Admins
        admins_result = test_list_admins(token)
        results["total"] += 1
        if admins_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 5: List Invitations
        invitations_result = test_list_invitations(token)
        results["total"] += 1
        if invitations_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 6: List Users
        users_result = test_list_users(token)
        results["total"] += 1
        if users_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 7: List Reports
        reports_result = test_list_reports(token)
        results["total"] += 1
        if reports_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
        
        # Step 8: Invite Admin
        invite_result = test_invite_admin(token, admin_data)
        results["total"] += 1
        if invite_result:
            results["passed"] += 1
        else:
            results["failed"] += 1
    else:
        results["failed"] += 1
        print_warning("Skipping remaining tests due to login failure")
    
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
    sys.exit(run_all_tests())