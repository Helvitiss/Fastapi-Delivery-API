from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError
from app.models import OrderModel, OrderItemModel
from app.repositories.cart import CartRepository, CartItemRepository
from app.repositories.order import OrderRepository
from app.schemas.order import OrderStatusSchema


class OrderService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.order_repo = OrderRepository(session)
        self.cart_repo = CartRepository(session)
        self.cart_item_repo = CartItemRepository(session)

    async def create_order(self, user_id: int, address_id: int, comment:str | None = None) -> OrderModel:

        cart = await self.cart_repo.get_or_create_by_user_id(user_id)
        items = await self.cart_item_repo.get_all_with_info(cart.id)
        if cart is None or not items:
            raise BadRequestError('Cart is empty')

        total_price = 0
        for item in items:
            total_price += item.dish.price * item.quantity


        order = OrderModel(
            user_id = user_id,
            address_id = address_id,
            total_price=total_price,
            comment = comment
        )
        await self.order_repo.create(order)

        for item in items:
            order_item = OrderItemModel(
                order_id = order.id,
                dish_id=item.dish.id,
                quantity=item.quantity,
                price=item.dish.price,
                dish_name=item.dish.name,
            )
            await self.order_repo.create_item(order_item)
            await self.cart_item_repo.delete(item)
        return order

    async def get_order_by_id_and_user(self, order_id: int, user_id: int) -> OrderModel:
        return await self.order_repo.get_by_id_and_user(order_id, user_id)

    async def get_order_by_id(self, order_id: int) -> OrderModel:
        return await self.order_repo.get_by_id(order_id)

    async def get_all_user_orders(self, user_id: int) -> list[OrderModel]:
        return await self.order_repo.get_user_orders(user_id=user_id)


    async def get_all_orders(self):
        return await self.order_repo.get_all_orders()


    async def update_status(self, order_id: int, schema: OrderStatusSchema) -> OrderModel:
        return await self.order_repo.update_status(order_id, schema.status)