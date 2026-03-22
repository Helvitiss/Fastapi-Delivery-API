from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError
from app.models import OrderItemModel, OrderModel
from app.repositories.cart import CartItemRepository, CartRepository
from app.repositories.order import OrderRepository
from app.repositories.user import UserRepository
from app.schemas.order import OrderStatusSchema
from app.tasks.order import send_sms_for_customer


class OrderService:
    def __init__(
        self,
        session: AsyncSession,
        order_repo: OrderRepository,
        cart_repo: CartRepository,
        cart_item_repo: CartItemRepository,
        user_repo: UserRepository,
    ):
        self.session = session
        self.order_repo = order_repo
        self.cart_repo = cart_repo
        self.cart_item_repo = cart_item_repo
        self.user_repo = user_repo

    async def create_order(
        self, user_id: int, address_id: int, comment: str | None = None
    ) -> OrderModel:

        cart = await self.cart_repo.get_or_create_by_user_id(user_id)
        items = await self.cart_item_repo.get_all_with_info(cart.id)
        if cart is None or not items:
            raise BadRequestError("Cart is empty")

        total_price = 0
        for item in items:
            if not item.dish.is_available:
                raise BadRequestError(f"Item {item.dish.name} is not available")
            total_price += item.dish.price * item.quantity

        order = OrderModel(
            user_id=user_id, address_id=address_id, total_price=total_price, comment=comment
        )
        await self.order_repo.create(order)

        item_list = [
            OrderItemModel(
                order_id=order.id,
                dish_id=item.dish.id,
                quantity=item.quantity,
                price=item.dish.price,
                dish_name=item.dish.name,
            )
            for item in items
        ]
        await self.order_repo.create_items(item_list)
        await self.cart_repo.clear(user_id)
        user = await self.user_repo.get_by_id(user_id)
        send_sms_for_customer.delay(user.phone, order.id)

        return order

    async def get_order_by_id_and_user(self, order_id: int, user_id: int) -> OrderModel:
        return await self.order_repo.get_by_id_and_user(order_id, user_id)

    async def get_order_by_id(self, order_id: int) -> OrderModel:
        return await self.order_repo.get_by_id(order_id)

    async def get_all_user_orders(self, user_id: int) -> list[OrderModel]:
        return await self.order_repo.get_user_orders(user_id=user_id)

    async def get_all_orders(self):
        return await self.order_repo.get_all()

    async def update_status(self, order_id: int, schema: OrderStatusSchema) -> OrderModel:
        return await self.order_repo.update_status(order_id, schema.status)
