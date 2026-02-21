from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.services.address import AddressService
from app.services.cart import CartService
from app.services.category import CategoryService
from app.services.dish import DishService
from app.services.order import OrderService


async def get_async_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
            await db.commit()
        except:
            await db.rollback()
            raise






async def get_dish_service(session: AsyncSession = Depends(get_async_db)):
    return DishService(session)

async def get_category_service(session: AsyncSession = Depends(get_async_db)):
    return CategoryService(session)

async def get_cart_service(session: AsyncSession = Depends(get_async_db)):
    return CartService(session)


async def get_order_service(session: AsyncSession = Depends(get_async_db)):
    return OrderService(session)

async def get_address_service(session: AsyncSession = Depends(get_async_db)):
    return AddressService(session)