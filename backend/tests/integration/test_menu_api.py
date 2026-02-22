import pytest
from unittest.mock import AsyncMock
from app.dependencies.main import get_dish_service, get_category_service
from app.main import app

@pytest.fixture
def mock_dish_service():
    return AsyncMock()

@pytest.fixture
def mock_category_service():
    return AsyncMock()

@pytest.mark.asyncio
async def test_list_dishes_endpoint(client, mock_dish_service):
    app.dependency_overrides[get_dish_service] = lambda: mock_dish_service
    mock_dish_service.get_list_dishes.return_value = []
    
    response = await client.get("/dishes/")
    
    app.dependency_overrides.clear()
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_list_categories_endpoint(client, mock_category_service):
    app.dependency_overrides[get_category_service] = lambda: mock_category_service
    mock_category_service.get_all_categories.return_value = []
    
    response = await client.get("/categories/")
    
    app.dependency_overrides.clear()
    assert response.status_code == 200
