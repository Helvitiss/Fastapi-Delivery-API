from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import CategoryModel


class CategoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, category: CategoryModel) -> CategoryModel:
        self.session.add(category)
        await self.session.flush()
        return category

    async def get_all(self) -> list[CategoryModel]:
        result = await self.session.scalars(select(CategoryModel))
        return result.all()

    async def get_by_id(self, category_id) -> CategoryModel:
        obj = await self.session.execute(select(CategoryModel).where(CategoryModel.id == category_id))
        result = obj.scalar_one_or_none()

        if result is None:
            raise NotFoundError(f"Category not found: {category_id}")
        return result


    async def delete(self, category_id: int) -> None:
        category = await self.get_by_id(category_id)
        await self.session.delete(category)
