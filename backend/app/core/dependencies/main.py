from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.services.cart import CartService
from app.services.dish import DishService
from app.services.category import CategoryService


async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db

async def get_category_service(db: AsyncSession = Depends(get_async_db)) -> CategoryService:
        return CategoryService(db)


async def get_dish_service(db: AsyncSession = Depends(get_async_db)) -> DishService:
    return DishService(db)


async def get_cart_service(db: AsyncSession = Depends(get_async_db)) -> CartService:
    return CartService(db)
