from fastapi import APIRouter

from .address import router as address_router
from .auth import router as auth_router
from .cart import router as cart_router
from .category import router as category_router
from .dish import router as dish_router
from .orders import router as order_router

user_router = APIRouter()

#
user_router.include_router(dish_router)
user_router.include_router(category_router)
user_router.include_router(auth_router)
user_router.include_router(cart_router)
user_router.include_router(order_router)
user_router.include_router(address_router)

__all__ = ["user_router"]
