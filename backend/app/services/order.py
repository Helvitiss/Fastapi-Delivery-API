from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import OrderModel, OrderItemModel, OrderStatus
from app.repositories.cart import CartRepository, CartItemRepository
from app.repositories.order import OrderItemRepository, OrderRepository
from app.schemas.order import OrderCreate
from app.services.cart import CartService


class OrderService:
    def __init__(
        self,
        session: AsyncSession,
        order_repo: OrderRepository,
        order_item_repo: OrderItemRepository,
        cart_service: CartService,

    ):
        self.session = session
        self.order_repo = order_repo
        self.order_item_repo = order_item_repo
        self.cart_service = cart_service
    async def create_from_cart(self, user_id: int, order: OrderCreate):
        async with self.session.begin():
            cart_with_items = await self.cart_service.get_items_by_user_id(user_id)
            if not cart_with_items.items:
                raise ValueError('Cart is empty')
            order_model = OrderModel(
                address=order.address,
                total_price=cart_with_items.total_price,
                comment=order.comment,
                user_id=user_id,
            )
            order = await self.order_repo.create(order_model)

            for item in cart_with_items.items:
                order_item_model = OrderItemModel(
                    order_id=order.id,
                    dish_id=item.dish_id,
                    quantity=item.quantity,
                    price=item.price,

                )
                await self.order_item_repo.create(order_item_model)

            await self.cart_service.clear(user_id)

    async def get_by_order_id(self, user_id: int, order_id: int):
        ...

    async def get_all_orders_by_user_id(self, user_id: int):
        ...



