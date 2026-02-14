from typing import Any, Coroutine, Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.exceptions import NotFoundException
from app.models import OrderModel, OrderItemModel


class OrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, order: OrderModel) -> OrderModel:
        self.session.add(order)
        await self.session.flush()
        return order

    async def get_by_id(self, order_id: int) -> OrderModel:
        obj = await self.session.execute(
            select(OrderModel).where(OrderModel.id == order_id)
        )
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundException('Order not found')
        return result

    async def get_user_orders(self, user_id: int) -> list[OrderModel]:
        result = await self.session.scalars(
            select(OrderModel).where(OrderModel.user_id == user_id)
        )
        return result.all()


    async def create_item(self, item: OrderItemModel) -> OrderItemModel:
        self.session.add(item)
        await self.session.flush()
        return item
