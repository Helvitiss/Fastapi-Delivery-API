from typing import Sequence

from app.models import DishModel
from app.schemas.dish import DishCreate, DishUpdate
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


class DishRepository:
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

