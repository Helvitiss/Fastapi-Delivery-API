import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime
from app.dependencies.main import get_order_service
from app.dependencies.auth import get_current_user
from app.main import app
from app.models import UserModel, OrderModel
from app.models.enums import OrderStatus

@pytest.fixture
def mock_user():
    return UserModel(id=1, phone="79998887766")

@pytest.fixture
def mock_order_service():
    return AsyncMock()

@pytest.mark.asyncio
async def test_get_my_orders_endpoint(client, mock_user, mock_order_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_order_service] = lambda: mock_order_service
    
    mock_order_service.get_all_user_orders.return_value = []
    
    response = await client.get("/orders/")
    
    app.dependency_overrides.clear()
    
    assert response.status_code == 200
    assert response.json() == []
    mock_order_service.get_all_user_orders.assert_called_once_with(user_id=1)

@pytest.mark.asyncio
async def test_create_order_endpoint(client, mock_user, mock_order_service):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_order_service] = lambda: mock_order_service
    
    # Мокаем результат со всеми обязательными полями для OrderRead
    order = MagicMock(spec=OrderModel)
    order.id = 1
    order.user_id = 1
    order.address_id = 10
    order.total_price = 500
    order.status = OrderStatus.new
    order.items = []
    order.comment = None
    order.created_at = datetime.now()
    
    mock_order_service.create_order.return_value = order
    
    response = await client.post(
        "/orders/", 
        json={"address_id": 10}
    )
    
    app.dependency_overrides.clear()
    
    assert response.status_code == 201
    mock_order_service.create_order.assert_called_once()
