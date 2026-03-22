from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models.cart import CartItemModel, CartModel
from app.models.dish import DishModel
from app.repositories.cart import CartItemRepository, CartRepository
from app.repositories.dish import DishRepository
from app.services.cart import CartService


@pytest.fixture
def cart_repo():
    return AsyncMock(spec=CartRepository)


@pytest.fixture
def cart_item_repo():
    return AsyncMock(spec=CartItemRepository)


@pytest.fixture
def dish_repo():
    return AsyncMock(spec=DishRepository)


@pytest.fixture
def cart_service(mock_session, cart_repo, cart_item_repo, dish_repo):
    return CartService(
        session=mock_session,
        cart_repo=cart_repo,
        cart_item_repo=cart_item_repo,
        dish_repo=dish_repo,
    )


async def test_get_items_by_user_id(cart_service, cart_repo, cart_item_repo):
    user_id = 1
    cart_id = 10

    # Мокаем корзину
    cart_repo.get_or_create_by_user_id.return_value = CartModel(id=cart_id, user_id=user_id)

    # Мокаем товары в корзине с инфой о блюдах
    dish1 = DishModel(id=1, name="Dish 1", price=100)
    dish2 = DishModel(id=2, name="Dish 2", price=200)

    item1 = MagicMock(spec=CartItemModel)
    item1.dish = dish1
    item1.quantity = 2

    item2 = MagicMock(spec=CartItemModel)
    item2.dish = dish2
    item2.quantity = 1

    cart_item_repo.get_all_with_info.return_value = [item1, item2]

    # Вызов
    result = await cart_service.get_items_by_user_id(user_id)

    # Проверки
    assert result["cart_id"] == cart_id
    assert result["total_price"] == 400  # (100*2) + (200*1)
    assert len(result["items"]) == 2
    assert result["items"][0]["total_dish_price"] == 200


async def test_add_dish_to_cart(cart_service, cart_repo, dish_repo, cart_item_repo):
    user_id = 1
    dish_id = 1

    cart_repo.get_or_create_by_user_id.return_value = CartModel(id=10)
    dish_repo.get_by_id.return_value = DishModel(id=dish_id, name="Test")

    await cart_service.add_dish(user_id, dish_id, quantity=2)

    cart_item_repo.add_item_to_cart.assert_called_once_with(cart_id=10, dish_id=dish_id, quantity=2)
