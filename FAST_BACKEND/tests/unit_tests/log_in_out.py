import pytest
from httpx import AsyncClient
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings


@pytest.mark.asyncio
async def test_sign_out(app: FastAPI, session: AsyncSession, client: AsyncClient):
    # Step 1: User sign-up
    sign_up_response = await client.post(
        "/api/v1/auth/sign-up",
        json={"email": "test@test.com", "password": "testpass", "name": "testname"},
    )
    assert sign_up_response.status_code == 200
    sign_up_data = sign_up_response.json()
    assert sign_up_data["email"] == "test@test.com"

    # Step 2: User sign-in to obtain token
    sign_in_response = await client.post(
        "/api/v1/auth/sign-in",
        json={"email__eq": "test@test.com", "password": "testpass"},
    )
    assert sign_in_response.status_code == 200
    sign_in_data = sign_in_response.json()
    token = sign_in_data["access_token"]

    # Step 3: User sign-out
    sign_out_response = await client.post(
        "/api/v1/auth/sign-out",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert sign_out_response.status_code == 204

    # Step 4: Verify token is blacklisted by trying to access protected route
    protected_route_response = await client
