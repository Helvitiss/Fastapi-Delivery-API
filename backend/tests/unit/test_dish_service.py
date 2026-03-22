from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models import DishModel
from app.repositories.category import CategoryRepository
from app.repositories.dish import DishRepository
from app.schemas.dish import DishCreate
from app.services.dish import DishService
from app.services.storage import LocalStorageService


@pytest.fixture
def dish_repo():
    return AsyncMock(spec=DishRepository)


@pytest.fixture
def category_repo():
    return AsyncMock(spec=CategoryRepository)


@pytest.fixture
def storage_service():
    return AsyncMock(spec=LocalStorageService)


@pytest.fixture
def dish_service(mock_session, dish_repo, category_repo, storage_service):
    return DishService(
        session=mock_session,
        dish_repo=dish_repo,
        category_repo=category_repo,
        storage_service=storage_service,
    )


async def test_create_dish(dish_service, dish_repo, category_repo):
    schema = DishCreate(name="Pizza", price=500, category_id=1)

    # Мокаем проверку категории
    category_repo.get_by_id.return_value = MagicMock()
    dish_repo.create.return_value = DishModel(id=1, name="Pizza")

    result = await dish_service.create_dish(schema)

    assert result.name == "Pizza"
    category_repo.get_by_id.assert_called_once_with(1)
    dish_repo.create.assert_called_once()


async def test_upload_image(dish_service, dish_repo, storage_service):
    dish_id = 1
    mock_file = MagicMock()

    # Мокаем существующее блюдо
    dish = DishModel(id=dish_id, image_url="old.jpg")
    dish_repo.get_by_id.return_value = dish
    storage_service.save_dish_image.return_value = "new.jpg"

    url = await dish_service.upload_image(dish_id, mock_file)

    assert url == "new.jpg"
    assert dish.image_url == "new.jpg"
    storage_service.delete_file.assert_called_once_with("old.jpg")
    storage_service.save_dish_image.assert_called_once_with(mock_file)


async def test_get_list_dishes(dish_service, dish_repo):
    dish_repo.get_all.return_value = [DishModel(id=1)]
    result = await dish_service.get_list_dishes()
    assert len(result) == 1
    dish_repo.get_all.assert_called_once()
