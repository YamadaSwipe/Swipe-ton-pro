#!/usr/bin/env python3
import requests
import json

BASE_URL = "https://c5d2d6b0-9f85-4474-b5d4-b3e1bc77006d.preview.emergentagent.com"

# Test different URL formats
urls = [
    f"{BASE_URL}/api/admin/login",
    f"{BASE_URL}/api/admin/login/",
    f"{BASE_URL}/admin/login",
    f"{BASE_URL}/admin/login/",
    f"{BASE_URL}/api/test",
    f"{BASE_URL}/api/",
    f"{BASE_URL}/api"
]

payload = {
    "email": "admin@careertinder.com",
    "password": "admin123"
}

for url in urls:
    print(f"\nTesting URL: {url}")
    try:
        if url.endswith("login") or url.endswith("login/"):
            response = requests.post(url, json=payload)
        else:
            response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")