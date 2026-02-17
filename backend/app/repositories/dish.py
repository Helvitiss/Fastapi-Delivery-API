from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models import DishModel


class DishRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, dish: DishModel) -> DishModel:
        self.session.add(dish)
        await self.session.flush()
        return dish

    async def get_by_id(self, dish_id: int, include_inactive=False) -> DishModel:
        stmt = select(DishModel).where(DishModel.id==dish_id, DishModel.is_available==True)
        if include_inactive:
            stmt = select(DishModel).where(DishModel.id==dish_id)
        obj = await self.session.execute(stmt)
        result = obj.scalar_one_or_none()

        if result is None:
            raise NotFoundError(f"Dish not found on not available: {dish_id}")
        return result

    async def get_all(self,include_inactive=False) -> list[DishModel]:
        stmt = select(DishModel).where(DishModel.is_available==True)
        if include_inactive:
            stmt = select(DishModel)
        result = await self.session.scalars(stmt)
        return result.all()


    async def delete(self, dish_id: int) -> None:
        dish = await self.get_by_id(dish_id)

        await self.session.delete(dish)
