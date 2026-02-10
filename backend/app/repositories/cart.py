from sqlalchemy import select, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart import CartModel, CartItemModel


class CartRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: int) -> CartModel | None:
        stmt = select(CartModel).where(CartModel.user_id == user_id)
        cart = await self.session.scalar(stmt)
        return cart

    async def create(self, user_id: int) -> CartModel:
        cart = CartModel(user_id=user_id)
        self.session.add(cart)
        await self.session.flush()
        return cart

    async def clear(self, cart_id: int) -> None:
        cart = await self.session.scalar(
            select(CartModel).where(CartModel.id == cart_id)
        )
        if cart:
            await self.session.delete(cart)


class CartItemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_cart_and_dish(
            self,
            cart_id: int,
            dish_id: int,
    ) -> CartItemModel | None:
        stmt = select(CartItemModel).where(
            CartItemModel.cart_id == cart_id,
            CartItemModel.dish_id == dish_id,
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


    async def get_all_by_cart_id(self, cart_id: int) -> Sequence[CartItemModel]:
        stmt = (select(CartItemModel)
                .where(CartItemModel.cart_id == cart_id)
                .options(selectinload(CartItemModel.dish))
                )
        result = await self.session.scalars(stmt)

        return result.all()


    async def add(self, cart_item: CartItemModel) -> None:
        self.session.add(cart_item)

    async def delete(self, cart_item: CartItemModel) -> None:
        await self.session.delete(cart_item)
