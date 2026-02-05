from typing import Any, Coroutine, Sequence

from app.models import DishModel, CategoryModel
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.dish import DishCreate, DishUpdate, Dish
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

class DishRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self)-> Sequence[DishModel]:
        result = await self.db.scalars(select(DishModel))

        return result.all()


    async def get_by_id(self, dish_id) -> DishModel | None:
        stmt = select(DishModel).where(DishModel.id == dish_id)
        result = await self.db.scalars(stmt)
        return result.first()


    async def create(self, dish: DishCreate) -> DishModel:
        new_dish = DishModel(**dish.model_dump())
        self.db.add(new_dish)
        await self.db.commit()
        await self.db.refresh(new_dish)
        return new_dish

    async def update(self, dish_id: int, new_dish: DishUpdate | DishCreate):
        dish = await self.get_by_id(dish_id)
        for k, v in new_dish.model_dump(exclude_unset=True).items():
            setattr(dish, k, v)

        await self.db.commit()
        await self.db.refresh(dish)
        return dish

    async def delete(self, dish_id: int) -> DishModel | None:
        dish = await self.get_by_id(dish_id)
        if dish is None:
            return None
        await self.db.delete(dish)
        await self.db.commit()
        return dish

class CategoryRepo:
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

