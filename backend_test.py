import requests
import json
import unittest
import sys
import os
import time
import uuid
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
    
    def test_05_data_persistence(self):
        """Test if data is persisted in MongoDB"""
        try:
            # Create a unique client name with timestamp
            unique_client = f"persistence_test_{int(time.time())}"
            
            # Post new status check
            payload = {"client_name": unique_client}
            post_response = requests.post(f"{API_URL}/status", json=payload)
            self.assertEqual(post_response.status_code, 200)
            post_data = post_response.json()
            created_id = post_data["id"]
            
            # Get all status checks and verify our entry exists
            get_response = requests.get(f"{API_URL}/status")
            self.assertEqual(get_response.status_code, 200)
            get_data = get_response.json()
            
            # Find our entry in the response
            found = False
            for item in get_data:
                if item["id"] == created_id:
                    self.assertEqual(item["client_name"], unique_client)
                    found = True
                    break
            
            self.assertTrue(found, "Created entry was not found in GET response")
            print("✅ Data persistence test passed")
        except Exception as e:
            print(f"❌ Data persistence test failed: {str(e)}")
            raise
    
    def test_06_stripe_checkout_session_creation(self):
        """Test the creation of a Stripe checkout session"""
        try:
            # Create a payment request with test data
            user_id = str(uuid.uuid4())
            match_id = str(uuid.uuid4())
            
            payload = {
                "user_id": user_id,
                "user_type": "client",
                "match_id": match_id,
                "origin_url": BACKEND_URL  # Use backend URL as origin for testing
            }
            
            response = requests.post(f"{API_URL}/payments/checkout/session", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            
            # Verify response structure
            self.assertTrue("checkout_url" in data)
            self.assertTrue("session_id" in data)
            self.assertTrue(data["checkout_url"].startswith("https://checkout.stripe.com/"))
            
            # Store session_id for status check test
            self.session_id = data["session_id"]
            
            print("✅ Stripe checkout session creation test passed")
            print(f"Created session ID: {self.session_id}")
            return self.session_id
            
        except Exception as e:
            print(f"❌ Stripe checkout session creation test failed: {str(e)}")
            raise
    
    def test_07_stripe_checkout_status(self):
        """Test checking the status of a Stripe checkout session"""
        try:
            # First create a session if we don't have one
            if not hasattr(self, 'session_id'):
                self.session_id = self.test_06_stripe_checkout_session_creation()
            
            # Check the status of the session
            response = requests.get(f"{API_URL}/payments/checkout/status/{self.session_id}")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            
            # Verify response structure
            self.assertTrue("session_id" in data)
            self.assertTrue("payment_status" in data)
            self.assertTrue("status" in data)
            self.assertTrue("amount_total" in data)
            self.assertTrue("currency" in data)
            
            # The payment status will likely be "unpaid" since we didn't complete the checkout
            # But the API should still return a valid response
            self.assertEqual(data["session_id"], self.session_id)
            
            print("✅ Stripe checkout status check test passed")
            print(f"Payment status: {data['payment_status']}")
            print(f"Session status: {data['status']}")
            
        except Exception as e:
            print(f"❌ Stripe checkout status check test failed: {str(e)}")
            raise
    
    def test_08_stripe_checkout_with_invalid_data(self):
        """Test error handling with invalid data for checkout session creation"""
        try:
            # Test with missing required fields
            invalid_payload = {
                "user_id": str(uuid.uuid4()),
                # Missing user_type, match_id, and origin_url
            }
            
            response = requests.post(f"{API_URL}/payments/checkout/session", json=invalid_payload)
            
            # Should return a 422 Unprocessable Entity for validation errors
            self.assertIn(response.status_code, [400, 422])
            
            print("✅ Stripe checkout with invalid data test passed")
            
        except Exception as e:
            print(f"❌ Stripe checkout with invalid data test failed: {str(e)}")
            raise
    
    def test_09_stripe_checkout_status_with_invalid_session(self):
        """Test error handling with invalid session ID for status check"""
        try:
            # Use a non-existent session ID
            invalid_session_id = "sess_" + str(uuid.uuid4()).replace("-", "")
            
            response = requests.get(f"{API_URL}/payments/checkout/status/{invalid_session_id}")
            
            # Should return an error status code
            self.assertGreaterEqual(response.status_code, 400)
            
            print("✅ Stripe checkout status with invalid session test passed")
            
        except Exception as e:
            print(f"❌ Stripe checkout status with invalid session test failed: {str(e)}")
            raise
    
    def test_10_payment_amount_verification(self):
        """Test that the payment amount is correctly set to 70€"""
        try:
            # First create a session if we don't have one
            if not hasattr(self, 'session_id'):
                self.session_id = self.test_06_stripe_checkout_session_creation()
            
            # Check the status of the session to get the amount
            response = requests.get(f"{API_URL}/payments/checkout/status/{self.session_id}")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            
            # Verify the amount is 70€ (7000 cents)
            self.assertEqual(data["amount_total"], 7000)
            self.assertEqual(data["currency"], "eur")
            
            print("✅ Payment amount verification test passed")
            
        except Exception as e:
            print(f"❌ Payment amount verification test failed: {str(e)}")
            raise

if __name__ == "__main__":
    unittest.main(argv=['first-arg-is-ignored'], exit=False)