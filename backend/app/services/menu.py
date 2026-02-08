
from typing import Sequence

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CategoryModel, DishModel
from app.repositories.menu import CategoryRepository, DishRepository
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.dish import DishCreate, DishUpdate





class CategoryService:
    def __init__(self, cat_repo: CategoryRepository):
        self.cat_repo = cat_repo

    async def get_all(self) -> Sequence[CategoryModel]:
        result = await self.cat_repo.get_all()
        return result

    async def get_by_id(self, category_id) -> CategoryModel:
        result = await self.cat_repo.get_by_id(category_id)
        if result is None:
            raise HTTPException(status_code=404, detail="category not found")
        return result

    async def create(self, category_data: CategoryCreate) -> CategoryModel:
        result = await self.cat_repo.create(category_data)
        return result

    async def update(self,cat_id:int, category_data: CategoryUpdate) -> CategoryModel:
        await self.get_by_id(category_data.category_id)

        result = await self.cat_repo.update(category_id=cat_id, new_category=category_data)
        return result

    async def delete(self, category_id) -> CategoryModel:
        await self.get_by_id(category_id)

        result = await self.cat_repo.delete(category_id)
        return result



class DishService:
    def __init__(self, dish_repo: DishRepository, cat_repo: CategoryRepository):
        self.dish_repo = dish_repo
        self.cat_repo = cat_repo

    async def get_all(self) -> Sequence[DishModel]:
        result = await self.dish_repo.get_all()
        return result

    async def get_by_id(self, dish_id) -> DishModel:

        result = await self.dish_repo.get_by_id(dish_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Disssh not found")
        return result

    async def create(self, dish_data: DishCreate) -> DishModel:
        cat = await self.cat_repo.get_by_id(dish_data.category_id)
        if cat is None:
            raise HTTPException(status_code=404, detail="Category not found")
        result = await self.dish_repo.create(dish_data)
        return result

    async def update(self, dish_id:int, dish_data: DishUpdate) -> DishModel:
        await self.get_by_id(dish_id)
        result = await self.dish_repo.update(dish_id, dish_data)
        return result

    async def delete(self, dish_id) -> DishModel | None:
        await self.get_by_id(dish_id)

        result = await self.dish_repo.delete(dish_id)

        return result
