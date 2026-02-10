from typing import Sequence

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CategoryModel
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.cat_repo = CategoryRepository(db)

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
