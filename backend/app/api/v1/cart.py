from fastapi import APIRouter, Depends

from app.dependencies import get_cart_service
from app.dependencies.auth import get_current_user
from app.services.cart import CartService
from app.schemas.user import UserRead

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/")
async def get_cart(user: UserRead = Depends(get_current_user), cart_service: CartService = Depends(get_cart_service)):
    cart = await cart_service.get_by_user_id(user.id)
    print(cart, user.id)
    return cart

@router.delete("/")
async def cart_clear(user: UserRead = Depends(get_current_user), cart_service: CartService = Depends(get_cart_service)):
    await cart_service.clear(user.id)
    return 'ok'
@router.get("/items/")
async def get_cart_items(user: UserRead = Depends(get_current_user),
                         cart_service: CartService = Depends(get_cart_service)):
    result = await cart_service.get_items_by_user_id(user.id)
    return result


@router.post('/items/{dish_id}')
async def add_dish_to_cart(
        dish_id: int,
        quantity: int = 1,
        cart_service: CartService = Depends(get_cart_service),
        user=Depends(get_current_user)
):
    """Добавляем блюдо в корзину"""
    await cart_service.add_dish(user_id=user.id, dish_id=dish_id, quantity=quantity)
    return 'OK'


@router.patch("/items/{dish_id}")
async def update_dish_in_cart(dish_id: int, quantity: int = 1, user: UserRead = Depends(get_current_user),
                              cart_service: CartService = Depends(get_cart_service)):
    await cart_service.update(user_id=user.id, dish_id=dish_id, quantity=quantity)


@router.delete("/items/{dish_id}")
async def delete_dish_from_cart(dish_id: int, user: UserRead = Depends(get_current_user),
                                cart_service: CartService = Depends(get_cart_service)):
    await cart_service.remove_dish(user_id=user.id, dish_id=dish_id)
    return 'OK'

