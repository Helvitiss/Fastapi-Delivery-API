
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DishModel, CategoryModel



class CategoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, category: dict) -> CategoryModel:
        new_category = CategoryModel(**category)
        self.session.add(new_category)
        await self.session.flush()
        return new_category


    async def get_all(self) -> list[CategoryModel]:
        result = await self.session.scalars(select(CategoryModel))
        return result.all()

    async def get_by_id(self, category_id) -> CategoryModel:
        stmt = select(CategoryModel).where(CategoryModel.id == category_id)
        result = await self.session.scalar(stmt)
        if result is None:
            raise ValueError(f"Category not found: {category_id}")
        return result

    async def update(self, category_id: int, new_category: dict) -> CategoryModel:
        category = await self.get_by_id(category_id)
        for k, v in new_category.items():
            setattr(category, k, v)
        await self.session.flush()
        return category


    async def delete(self, category_id: int) -> None:
        category = await self.get_by_id(category_id)
        await self.session.delete(category)


class DishRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, dish: dict) -> DishModel:
        new_dish = DishModel(**dish)
        self.session.add(new_dish)
        await self.session.flush()
        return new_dish


    async def get_by_id(self, dish_id: int) -> DishModel:
        stmt = select(DishModel).where(DishModel.id == dish_id)
        result = await self.session.scalar(stmt)
        if result is None:
            raise ValueError(f"Dish not found: {dish_id}")
        return result


    async def get_all(self)-> list[DishModel]:
        result = await self.session.scalars(select(DishModel))
        return result.all()

    async def update(self, dish_id: int, new_dish: dict) -> DishModel:
        dish = await self.get_by_id(dish_id)
        for k, v in new_dish.items():
            setattr(dish, k, v)

        await self.session.flush()
        return dish

    async def delete(self, dish_id: int) -> None:
        dish = await self.get_by_id(dish_id)

        await self.session.delete(dish)

