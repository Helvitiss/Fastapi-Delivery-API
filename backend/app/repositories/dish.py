from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DishModel
from app.core.exceptions import NotFoundError


class DishRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, dish: DishModel) -> DishModel:
        self.session.add(dish)
        await self.session.flush()
        return dish

    async def get_by_id(self, dish_id: int, include_inactive: bool = False) -> DishModel:
        stmt = select(DishModel).where(DishModel.id == dish_id)
        if not include_inactive:
            stmt = stmt.where(DishModel.is_available)
        
        result = await self.session.execute(stmt)
        dish = result.scalar_one_or_none()

        if dish is None:
            raise NotFoundError(f"Dish not found or not available: {dish_id}")
        return dish

    async def get_all(self, include_inactive: bool = False) -> list[DishModel]:
        stmt = select(DishModel)
        if not include_inactive:
            stmt = stmt.where(DishModel.is_available)
        
        result = await self.session.scalars(stmt)
        return result.all()

    async def delete(self, dish_id: int) -> None:
        dish = await self.get_by_id(dish_id, include_inactive=True)
        await self.session.delete(dish)
        await self.session.flush()
