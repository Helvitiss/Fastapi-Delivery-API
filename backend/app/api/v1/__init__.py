from fastapi import APIRouter
from .category import router as category_router
from .dish import router as dish_router
from .auth import router as auth_router


base_router = APIRouter()


base_router.include_router(dish_router)
base_router.include_router(category_router)
base_router.include_router(auth_router)


__all__ = ['base_router']