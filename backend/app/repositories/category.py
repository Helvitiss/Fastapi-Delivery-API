from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CategoryModel
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[CategoryModel]:
        result = await self.db.scalars(select(CategoryModel))
        return result.all()


    async def get_by_id(self, category_id) -> CategoryModel:
        stmt = select(CategoryModel).where(CategoryModel.id == category_id)
        result = await self.db.scalar(stmt)
        return result

    async def create(self, category: CategoryCreate) -> CategoryModel:
        new_category = CategoryModel(**category.model_dump())
        self.db.add(new_category)
        await self.db.commit()
        await self.db.refresh(new_category)
        return new_category

    async def update(self, category_id: int, new_category: CategoryUpdate) -> CategoryModel:
        category = await self.get_by_id(category_id)
        for k, v in new_category.model_dump(exclude_unset=True).items():
            setattr(category, k, v)
        await self.db.commit()
        await self.db.refresh(category)
        return category


    async def delete(self, category_id: int):
        category = await self.get_by_id(category_id)
        await self.db.delete(category)
        await self.db.commit()
        return category
