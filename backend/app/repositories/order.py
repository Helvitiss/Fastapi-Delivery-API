
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError
from app.models import OrderModel, OrderItemModel


class OrderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, order: OrderModel) -> OrderModel:
        self.session.add(order)
        await self.session.flush()
        return order

    async def create_item(self, item: OrderItemModel) -> OrderItemModel:
        self.session.add(item)
        await self.session.flush()
        return item

    async def get_by_id(self, order_id: int) -> OrderModel:
        obj = await self.session.execute(
            select(OrderModel).where(OrderModel.id == order_id).options(selectinload(OrderModel.items))
        )
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundError('Order not found')
        return result

    async def get_by_id_and_user(self, order_id: int, user_id: int) -> OrderModel:
        obj = await self.session.execute(
            select(OrderModel).where(OrderModel.id == order_id, OrderModel.user_id == user_id).options(selectinload(OrderModel.items))
        )
        result = obj.scalar_one_or_none()
        if result is None:
            raise NotFoundError('Order not found')
        return result

    async def get_user_orders(self, user_id: int) -> list[OrderModel]:
        result = await self.session.scalars(
            select(OrderModel).where(OrderModel.user_id == user_id)
        )
        return result.all()


    async def get_all_orders(self) -> list[OrderModel]:
        result = await self.session.scalars(select(OrderModel))
        return result.all()

    async def update_status(self, order_id: int, status: str):
        order = await self.get_by_id(order_id)
        order.status = status
        await self.session.flush()
        return order