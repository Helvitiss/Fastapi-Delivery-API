from fastapi import APIRouter, Depends, Body
from app.dependencies.auth import get_current_user
from app.models import UserModel
from app.schemas.cart import CartWithItemsResponse, CartItemCreate, CartItemRead, CartRead
from app.services.cart import CartService
from app.dependencies.main import get_cart_service

router = APIRouter(prefix="/cart", tags=["Корзина"])


@router.get(
    "/", 
    response_model=CartWithItemsResponse,
    summary="Просмотр корзины"
)
async def get_cart(
    cart_service: CartService = Depends(get_cart_service),
    user: UserModel = Depends(get_current_user)
):
    return await cart_service.get_items_by_user_id(user.id)


@router.delete(
    "/", 
    status_code=204,
    summary="Очистить корзину"
)
async def clear_cart(
    user: UserModel = Depends(get_current_user), 
    cart_service: CartService = Depends(get_cart_service)
):
    await cart_service.clear(user_id=user.id)


@router.post(
    "/items", 
    status_code=201, 
    response_model=CartItemRead,
    summary="Добавить блюдо"
)
async def add_item_to_cart(
    data: CartItemCreate, 
    cart_service: CartService = Depends(get_cart_service),
    user: UserModel = Depends(get_current_user)
):
    return await cart_service.add_dish(user_id=user.id, **data.model_dump())


@router.patch(
    "/items", 
    status_code=204,
    summary="Обновить количество"
)
async def update_cart_item(
    data: CartItemCreate, 
    cart_service: CartService = Depends(get_cart_service),
    user: UserModel = Depends(get_current_user)
):
    await cart_service.update(user_id=user.id, dish_id=data.dish_id, quantity=data.quantity)


@router.delete(
    "/items/{dish_id}", 
    status_code=204,
    summary="Удалить из корзины"
)
async def delete_item_from_cart(
    dish_id: int, 
    cart_service: CartService = Depends(get_cart_service),
    user: UserModel = Depends(get_current_user)
):
    await cart_service.remove_dish(user_id=user.id, dish_id=dish_id)
