from unittest.mock import AsyncMock, MagicMock

import pytest

from app.dependencies.auth import get_current_user
from app.dependencies.main import get_cart_service
from app.main import app
from app.models import UserModel


@pytest.fixture
def mock_user():
    return UserModel(id=1, phone="79998887766")


@pytest.fixture
def mock_cart_service():
    service = AsyncMock()
    service.get_items_by_user_id.return_value = {"cart_id": 1, "total_price": 500, "items": []}
    return service


@pytest.mark.asyncio
async def test_get_cart_endpoint(client, mock_user, mock_cart_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_cart_service] = lambda: mock_cart_service

    response = await client.get("/cart/")

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["total_price"] == 500
    mock_cart_service.get_items_by_user_id.assert_called_once_with(1)


@pytest.mark.asyncio
async def test_add_item_to_cart_endpoint(client, mock_user, mock_cart_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_cart_service] = lambda: mock_cart_service

    mock_cart_service.add_dish.return_value = MagicMock(id=1, dish_id=1, quantity=2)

    response = await client.post("/cart/items", json={"dish_id": 1, "quantity": 2})

    app.dependency_overrides.clear()

    assert response.status_code == 201
    mock_cart_service.add_dish.assert_called_once()
