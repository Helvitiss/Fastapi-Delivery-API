
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.repositories.main_repos import DishRepo
from app.repositories.main_repos import CategoryRepo

async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db


async def get_dish_repo(db: AsyncSession = Depends(get_async_db)) -> DishRepo:
    return DishRepo(db)


async def get_category_repo(db: AsyncSession = Depends(get_async_db)):
    return CategoryRepo(db)
