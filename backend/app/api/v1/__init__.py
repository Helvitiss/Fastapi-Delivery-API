from fastapi import APIRouter

from .admin import admin_router
from .user import user_router

base_router = APIRouter()

base_router.include_router(user_router)
base_router.include_router(admin_router)
__all__ = ["base_router"]
