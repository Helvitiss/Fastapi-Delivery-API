
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.repositories.main_repos import DishRepo
from app.repositories.main_repos import CategoryRepo
from app.services.main_service import CategoryService, DishService


async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db


async def get_dish_repo(db: AsyncSession = Depends(get_async_db)) -> DishRepo:
    return DishRepo(db)


async def get_category_repo(db: AsyncSession = Depends(get_async_db)):
    return CategoryRepo(db)


async def get_category_service(cat_repo: CategoryRepo = Depends(get_category_repo)):
    return CategoryService(cat_repo=cat_repo)


async def get_dish_service(dish_repo: DishRepo = Depends(get_dish_repo), cat_repo: CategoryRepo = Depends(get_category_service)):
    return DishService(dish_repo=dish_repo, cat_repo=cat_repo)




