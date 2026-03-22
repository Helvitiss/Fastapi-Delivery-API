from unittest.mock import AsyncMock

import pytest

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_address_service
from app.main import app
from app.models import UserModel


@pytest.fixture
def mock_user():
    return UserModel(id=1, phone="79998887766")


@pytest.fixture
def mock_address_service():
    return AsyncMock()


@pytest.mark.asyncio
async def test_get_addresses_endpoint(client, mock_user, mock_address_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_address_service] = lambda: mock_address_service

    mock_address_service.get_by_user_id.return_value = []

    response = await client.get("/address/")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_address_endpoint(client, mock_user, mock_address_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_address_service] = lambda: mock_address_service

    mock_address_service.create.return_value = AsyncMock(id=1, address="Test St", user_id=1)

    response = await client.post("/address/", json={"address": "Test St"})

    app.dependency_overrides.clear()

    assert response.status_code == 201
    mock_address_service.create.assert_called_once()
