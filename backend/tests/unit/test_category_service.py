import pytest
from unittest.mock import AsyncMock
from app.services.category import CategoryService
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate
from app.models import CategoryModel

@pytest.fixture
def category_repo():
    return AsyncMock(spec=CategoryRepository)

@pytest.fixture
def category_service(mock_session, category_repo):
    return CategoryService(session=mock_session, category_repo=category_repo)

async def test_create_category(category_service, category_repo):
    # Данные для теста
    data = {"name": "Test Category", "description": "Test Description"}
    schema = CategoryCreate(**data)
    
    # Мокаем результат репозитория
    expected_category = CategoryModel(id=1, **data)
    category_repo.create.return_value = expected_category
    
    # Вызов метода
    result = await category_service.create_category(schema)
    
    # Проверки
    assert result.id == 1
    assert result.name == "Test Category"
    category_repo.create.assert_called_once()

async def test_get_all_categories(category_service, category_repo):
    # Мокаем результат
    category_repo.get_all.return_value = [
        CategoryModel(id=1, name="Cat 1"),
        CategoryModel(id=2, name="Cat 2")
    ]
    
    result = await category_service.get_all_categories()
    
    assert len(result) == 2
    assert result[0].name == "Cat 1"
    category_repo.get_all.assert_called_once()
