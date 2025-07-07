#!/usr/bin/env python3
"""
Script de test direct de l'API déployée
"""

import requests
import json

API_BASE = "https://career-tinder.preview.emergentagent.com/api"

def test_api():
    print("🧪 Test de l'API déployée...")
    
    # Test 1: API de base
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        print(f"✅ API de base: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ API de base échouée: {e}")
        return
    
    # Test 2: Login admin
    try:
        login_data = {
            "email": "admin@careertinder.com",
            "password": "admin123"
        }
        response = requests.post(f"{API_BASE}/admin/login", 
                               json=login_data, 
                               timeout=10)
        print(f"🔐 Login admin: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Connexion réussie!")
            print(f"   Admin: {data['admin']['name']} ({data['admin']['role']})")
            
            # Test route protégée
            token = data['access_token']
            headers = {'Authorization': f'Bearer {token}'}
            
            stats_response = requests.get(f"{API_BASE}/admin/stats", 
                                        headers=headers, 
                                        timeout=10)
            print(f"📊 Stats: {stats_response.status_code}")
            
            if stats_response.status_code == 200:
                stats = stats_response.json()
                print(f"✅ Statistiques récupérées:")
                print(f"   Utilisateurs: {stats.get('total_users', 0)}")
                print(f"   Admins: {stats.get('total_admins', 0)}")
            else:
                print(f"❌ Erreur stats: {stats_response.text}")
                
        elif response.status_code == 404:
            print("❌ Route admin/login non trouvée (404)")
            print("   Vérification des routes disponibles...")
            
            # Test OpenAPI
            try:
                openapi_response = requests.get(f"{API_BASE}/openapi.json", timeout=10)
                if openapi_response.status_code == 200:
                    paths = openapi_response.json().get('paths', {})
                    print(f"   Routes disponibles: {list(paths.keys())}")
                else:
                    print(f"   OpenAPI non disponible: {openapi_response.status_code}")
            except:
                print("   Impossible d'accéder à OpenAPI")
                
        else:
            print(f"❌ Connexion échouée: {response.text}")
            
    except Exception as e:
        print(f"❌ Test login échoué: {e}")

if __name__ == "__main__":
    test_api()