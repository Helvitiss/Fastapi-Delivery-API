from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.repositories.dish import DishRepository
from app.repositories.category import CategoryRepository
from app.repositories.user import UserRepository
from app.services.dish import DishService
from app.services.category import CategoryService
from app.services.auth import AuthService


async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db


async def get_dish_repo(db: AsyncSession = Depends(get_async_db)) -> DishRepository:
    return DishRepository(db)


async def get_category_repo(db: AsyncSession = Depends(get_async_db)):
    return CategoryRepository(db)


async def get_category_service(cat_repo: CategoryRepository = Depends(get_category_repo)):
    return CategoryService(cat_repo=cat_repo)


async def get_dish_service(dish_repo: DishRepository = Depends(get_dish_repo),
                           cat_repo: CategoryRepository = Depends(get_category_service)):
    return DishService(dish_repo=dish_repo, cat_repo=cat_repo)


async def get_user_repo(db: AsyncSession = Depends(get_async_db)):
    return UserRepository(db)


async def get_auth_service(user_repo: UserRepository = Depends(get_user_repo)):
    return AuthService(user_repo=user_repo)
