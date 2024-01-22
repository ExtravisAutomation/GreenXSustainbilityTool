import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_scoped_session
from sqlalchemy.orm import sessionmaker
from app.main import app

db_user = "root"
db_password = "root"
db_host = "dcs_db"
db_port = "3306"
db_name = "fca"

TEST_DATABASE_URL = f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


@pytest.fixture
def app() -> FastAPI:
    return app



@pytest.fixture
async def session():
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    async_session_factory = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    async with async_session_factory() as session:
        yield session
    await engine.dispose()


@pytest.fixture
async def client(app: FastAPI):
    async with AsyncClient(app=app, base_url="http://test") as test_client:
        yield test_client


@pytest.mark.asyncio
async def test_sign_out(app: FastAPI, session: AsyncSession, client: AsyncClient):
    # Step 1: User sign-up
    sign_up_response = await client.post(
        "/api/v1/auth/sign-up",
        json={"email": "aziz12@gmail.com", "password": "aziz12", "name": "aziz12"},
    )
    assert sign_up_response.status_code == 200
    sign_up_data = sign_up_response.json()
    assert sign_up_data["email"] == "aziz12@gmail.com"

    # Step 2: User sign-in to obtain token
    sign_in_response = await client.post(
        "/api/v1/auth/sign-in",
        json={"user_name": "aziz12", "password": "aziz12"},
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

    protected_route_response = await client.get(
        "/api/v1/protected-route",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert protected_route_response.status_code == 401
