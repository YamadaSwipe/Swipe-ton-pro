import requests
import json
import unittest
import sys
import os
from datetime import datetime

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("Error: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_URL = f"{BACKEND_URL}/api"
print(f"Testing backend API at: {API_URL}")

class BackendAPITest(unittest.TestCase):
    
    def test_01_server_health(self):
        """Test if the server is running and responding to requests"""
        try:
            response = requests.get(f"{API_URL}/")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["message"], "Hello World")
            print("✅ Server health check passed")
        except Exception as e:
            print(f"❌ Server health check failed: {str(e)}")
            raise
    
    def test_02_status_endpoint_post(self):
        """Test the POST /status endpoint"""
        try:
            payload = {"client_name": "test_client"}
            response = requests.post(f"{API_URL}/status", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["client_name"], "test_client")
            self.assertTrue("id" in data)
            self.assertTrue("timestamp" in data)
            print("✅ POST /status endpoint test passed")
        except Exception as e:
            print(f"❌ POST /status endpoint test failed: {str(e)}")
            raise
    
    def test_03_status_endpoint_get(self):
        """Test the GET /status endpoint"""
        try:
            response = requests.get(f"{API_URL}/status")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertTrue(isinstance(data, list))
            if len(data) > 0:
                self.assertTrue("client_name" in data[0])
                self.assertTrue("id" in data[0])
                self.assertTrue("timestamp" in data[0])
            print("✅ GET /status endpoint test passed")
        except Exception as e:
            print(f"❌ GET /status endpoint test failed: {str(e)}")
            raise
    
    def test_04_cors_headers(self):
        """Test if CORS headers are properly set"""
        try:
            headers = {
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "Content-Type"
            }
            response = requests.options(f"{API_URL}/", headers=headers)
            self.assertEqual(response.status_code, 200)
            self.assertTrue("access-control-allow-origin" in response.headers)
            # The server is configured to reflect the Origin header value rather than using "*"
            self.assertEqual(response.headers["access-control-allow-origin"], "http://localhost:3000")
            self.assertTrue("access-control-allow-methods" in response.headers)
            print("✅ CORS headers test passed")
        except Exception as e:
            print(f"❌ CORS headers test failed: {str(e)}")
            raise

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)