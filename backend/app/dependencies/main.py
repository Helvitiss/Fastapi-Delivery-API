from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.services.auth import AuthService
from app.services.cart import CartService
from app.services.menu import MenuService
from app.services.order import OrderService


async def get_async_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
            await db.commit()
        except:
            await db.rollback()
            raise






async def get_menu_service(session: AsyncSession = Depends(get_async_db)):
    return MenuService(session)


async def get_auth_service(session: AsyncSession = Depends(get_async_db)):
    return AuthService(session)


async def get_cart_service(session: AsyncSession = Depends(get_async_db)):
    return CartService(session)


async def get_order_servise(session: AsyncSession = Depends(get_async_db)):
    return OrderService(session)