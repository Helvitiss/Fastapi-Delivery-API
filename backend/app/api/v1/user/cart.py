from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.models import UserModel
from app.schemas.cart import CartRead, CartWithItemsResponse, CartItemCreate, CartItemRead
from app.services.cart import CartService
from app.schemas.user import UserRead
from app.dependencies.main import get_cart_service

router = APIRouter(prefix="/cart", tags=["user: cart"])


@router.get("/", response_model=CartRead)
async def get_cart(user: UserModel = Depends(get_current_user), cart_service: CartService = Depends(get_cart_service)):
    cart = await cart_service.get_or_create_by_user_id(user.id)
    return cart


@router.delete("/", status_code=204)
async def cart_clear(user: UserModel = Depends(get_current_user), cart_service: CartService = Depends(get_cart_service)):
    await cart_service.clear(user_id=user.id)


@router.get("/items/", response_model=CartWithItemsResponse)
async def get_cart_items(user: UserModel = Depends(get_current_user),
                         cart_service: CartService = Depends(get_cart_service)):
    result = await cart_service.get_items_by_user_id(user.id)
    return result


@router.post('/items/', status_code=201, response_model=CartItemRead)
async def add_dish_to_cart(
        data: CartItemCreate,
        cart_service: CartService = Depends(get_cart_service),
        user: UserModel = Depends(get_current_user)
):
    item = await cart_service.add_dish(user_id=user.id, **data.model_dump())
    return item

@router.patch("/items/{dish_id}")
async def update_dish_in_cart(dish_id: int, quantity: int, user: UserModel = Depends(get_current_user),
                              cart_service: CartService = Depends(get_cart_service)):
    await cart_service.update(user_id=user.id, dish_id=dish_id, quantity=quantity)


@router.delete("/items/{dish_id}", status_code=204)
async def delete_dish_from_cart(dish_id: int, user: UserModel = Depends(get_current_user),
                                cart_service: CartService = Depends(get_cart_service)):
    await cart_service.remove_dish(user_id=user.id, dish_id=dish_id)
