import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime
from app.dependencies.auth import get_current_user, is_admin
from app.dependencies.main import get_category_service, get_dish_service, get_order_service
from app.main import app
from app.models import UserModel, CategoryModel, OrderModel
from app.models.enums import UserRole, OrderStatus

@pytest.fixture
def admin_user():
    return UserModel(id=1, phone="79998887766", role=UserRole.ADMIN)

@pytest.fixture
def mock_category_service():
    return AsyncMock()

@pytest.fixture
def mock_dish_service():
    return AsyncMock()

@pytest.fixture
def mock_order_service():
    return AsyncMock()

@pytest.mark.asyncio
async def test_admin_create_category(client, admin_user, mock_category_service):
    app.dependency_overrides[get_current_user] = lambda: admin_user
    app.dependency_overrides[is_admin] = lambda: admin_user 
    app.dependency_overrides[get_category_service] = lambda: mock_category_service
    
    cat = MagicMock(spec=CategoryModel)
    cat.id = 1
    cat.name = "Admin Cat"
    cat.description = None
    mock_category_service.create_category.return_value = cat
    
    response = await client.post(
        "/admin/categories/", 
        json={"name": "Admin Cat"}
    )
    
    app.dependency_overrides.clear()
    assert response.status_code == 201
    assert response.json()["name"] == "Admin Cat"

@pytest.mark.asyncio
async def test_admin_update_order_status(client, admin_user, mock_order_service):
    app.dependency_overrides[get_current_user] = lambda: admin_user
    app.dependency_overrides[is_admin] = lambda: admin_user
    app.dependency_overrides[get_order_service] = lambda: mock_order_service
    
    order = MagicMock(spec=OrderModel)
    order.id = 1
    order.status = OrderStatus.completed # В модели enums.py это lowercase
    order.user_id = 1
    order.address_id = 1
    order.total_price = 100
    order.comment = None
    order.items = []
    order.created_at = datetime.now()
    
    mock_order_service.update_status.return_value = order
    
    response = await client.patch(
        "/admin/orders/1/status", 
        json={"status": "completed"}
    )
    
    app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json()["status"] == "completed"

@pytest.mark.asyncio
async def test_admin_upload_dish_photo(client, admin_user, mock_dish_service):
    app.dependency_overrides[get_current_user] = lambda: admin_user
    app.dependency_overrides[is_admin] = lambda: admin_user
    app.dependency_overrides[get_dish_service] = lambda: mock_dish_service
    
    mock_dish_service.upload_image.return_value = "http://test.com/img.jpg"
    
    files = {'file': ('test.jpg', b'data', 'image/jpeg')}
    response = await client.post(
        "/admin/dishes/1/photo", 
        files=files
    )
    
    app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json() == {"image_url": "http://test.com/img.jpg"}
