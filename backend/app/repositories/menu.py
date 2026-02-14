from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DishModel, CategoryModel
from app.core.exceptions import NotFoundException


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
            raise NotFoundException(f"Category not found: {category_id}")
        return result


    async def delete(self, category_id: int) -> None:
        category = await self.get_by_id(category_id)
        await self.session.delete(category)


class DishRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, dish: DishModel) -> DishModel:
        self.session.add(dish)
        await self.session.flush()
        return dish

    async def get_by_id(self, dish_id: int) -> DishModel:
        obj = await self.session.execute(select(DishModel).where(DishModel.id == dish_id))
        result = obj.scalar_one_or_none()

        if result is None:
            raise NotFoundException(f"Dish not found: {dish_id}")
        return result

    async def get_all(self) -> list[DishModel]:
        result = await self.session.scalars(select(DishModel))
        return result.all()


    async def delete(self, dish_id: int) -> None:
        dish = await self.get_by_id(dish_id)

        await self.session.delete(dish)
