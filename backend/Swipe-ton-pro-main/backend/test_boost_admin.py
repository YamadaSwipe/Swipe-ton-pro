import pytest
from httpx import AsyncClient
from backend.admin_server import app

import asyncio
import uuid

import pytest

@pytest.mark.asyncio
async def test_boost_requires_pro(monkeypatch):
    # Simule un admin non pro
    async def fake_get_current_admin():
        return {"id": "admin1", "role": "admin", "permissions": ["boost"]}
    app.dependency_overrides = {"get_current_admin": fake_get_current_admin}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/swipe/boost", json={"target_user_id": "userX"})
        assert resp.status_code == 403
        assert "Seuls les pros" in resp.text

@pytest.mark.asyncio
async def test_boost_insufficient_credits(monkeypatch):
    # Simule un pro avec 0 crédit
    async def fake_get_current_admin():
        return {"id": "pro1", "role": "pro", "is_professional": True, "credits": 0}
    app.dependency_overrides = {"get_current_admin": fake_get_current_admin}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.post("/swipe/boost", json={"target_user_id": "userY"})
        assert resp.status_code == 402
        assert "Crédits insuffisants" in resp.text

@pytest.mark.asyncio
async def test_admin_permission_required(monkeypatch):
    # Simule un admin sans permission
    async def fake_get_current_admin():
        return {"id": "admin2", "role": "support", "permissions": []}
    app.dependency_overrides = {"get_current_admin": fake_get_current_admin}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        resp = await ac.put("/admin/boost-config", json={"cost": 10, "enabled": True})
        assert resp.status_code == 403
        assert "Action réservée au rôle" in resp.text

# D'autres tests d'intégration peuvent être ajoutés pour la gestion des crédits, logs, notifications, etc.
