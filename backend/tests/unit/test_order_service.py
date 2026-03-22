from unittest.mock import AsyncMock, MagicMock

import pytest

from app.core.exceptions import BadRequestError
from app.models.dish import DishModel
from app.repositories.cart import CartItemRepository, CartRepository
from app.repositories.order import OrderRepository
from app.repositories.user import UserRepository
from app.services.order import OrderService


@pytest.fixture
def order_repo():
    return AsyncMock(spec=OrderRepository)


@pytest.fixture
def cart_repo():
    return AsyncMock(spec=CartRepository)


@pytest.fixture
def cart_item_repo():
    return AsyncMock(spec=CartItemRepository)


@pytest.fixture
def user_repo():
    return AsyncMock(spec=UserRepository)


@pytest.fixture
def order_service(mock_session, order_repo, cart_repo, cart_item_repo, user_repo):
    return OrderService(
        session=mock_session,
        order_repo=order_repo,
        cart_repo=cart_repo,
        cart_item_repo=cart_item_repo,
        user_repo=user_repo,
    )


async def test_create_order_success(
    order_service, order_repo, cart_repo, cart_item_repo, user_repo
):
    user_id = 1
    address_id = 10

    # Мокаем корзину с товарами
    cart_repo.get_or_create_by_user_id.return_value = MagicMock(id=100)

    dish1 = DishModel(id=1, name="Dish 1", price=100, is_available=True)
    item1 = MagicMock()
    item1.dish = dish1
    item1.quantity = 2

    cart_item_repo.get_all_with_info.return_value = [item1]
    user_repo.get_by_id.return_value = MagicMock(phone="79998887766")

    # Мокаем сохранение заказа
    order_repo.create.side_effect = lambda x: setattr(x, "id", 1) or x

    # Вызов
    order = await order_service.create_order(user_id, address_id)

    # Проверки
    assert order.total_price == 200
    assert order.user_id == user_id
    order_repo.create.assert_called_once()
    order_repo.create_items.assert_called_once()
    cart_repo.clear.assert_called_once_with(user_id)


async def test_create_order_empty_cart(order_service, cart_repo, cart_item_repo):
    user_id = 1
    cart_repo.get_or_create_by_user_id.return_value = MagicMock(id=100)
    cart_item_repo.get_all_with_info.return_value = []

    with pytest.raises(BadRequestError, match="Cart is empty"):
        await order_service.create_order(user_id, 10)


async def test_create_order_item_not_available(order_service, cart_repo, cart_item_repo):
    user_id = 1
    cart_repo.get_or_create_by_user_id.return_value = MagicMock(id=100)

    dish1 = DishModel(id=1, name="Hidden Dish", price=100, is_available=False)
    item1 = MagicMock()
    item1.dish = dish1
    item1.quantity = 2

    cart_item_repo.get_all_with_info.return_value = [item1]

    with pytest.raises(BadRequestError, match="Item Hidden Dish is not available"):
        await order_service.create_order(user_id, 10)
