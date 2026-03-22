from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError
from app.models import OrderItemModel, OrderModel


class OrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, order: OrderModel) -> OrderModel:
        self.session.add(order)
        await self.session.flush()
        return order

    async def create_items(self, items: list[OrderItemModel]) -> None:
        self.session.add_all(items)
        await self.session.flush()

    async def get_by_id(self, order_id: int) -> OrderModel:
        stmt = (
            select(OrderModel)
            .where(OrderModel.id == order_id)
            .options(selectinload(OrderModel.items))
        )
        result = await self.session.execute(stmt)
        order = result.scalar_one_or_none()
        if order is None:
            raise NotFoundError("Order not found")
        return order

    async def get_by_id_and_user(self, order_id: int, user_id: int) -> OrderModel:
        stmt = (
            select(OrderModel)
            .where(OrderModel.id == order_id, OrderModel.user_id == user_id)
            .options(selectinload(OrderModel.items))
        )
        result = await self.session.execute(stmt)
        order = result.scalar_one_or_none()
        if order is None:
            raise NotFoundError("Order not found")
        return order

    async def get_user_orders(self, user_id: int) -> list[OrderModel]:
        stmt = select(OrderModel).where(OrderModel.user_id == user_id)
        result = await self.session.scalars(stmt)
        return result.all()

    async def get_all(self) -> list[OrderModel]:
        stmt = select(OrderModel)
        result = await self.session.scalars(stmt)
        return result.all()

    async def update_status(self, order_id: int, status: str) -> OrderModel:
        order = await self.get_by_id(order_id)
        order.status = status
        await self.session.flush()
        return order
