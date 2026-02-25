from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart import CartModel, CartItemModel


class CartRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, cart_id: int) -> CartModel | None:
        stmt = select(CartModel).where(CartModel.id == cart_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create_by_user_id(self, user_id: int) -> CartModel:
        stmt = select(CartModel).where(CartModel.user_id == user_id)
        result = await self.session.execute(stmt)
        cart = result.scalar_one_or_none()

        if cart:
            return cart

        cart = CartModel(user_id=user_id)
        self.session.add(cart)

        try:
            await self.session.flush()
            return cart
        except IntegrityError:
            result = await self.session.execute(stmt)
            return result.scalar_one()

    async def clear(self, user_id: int) -> None:
        cart = await self.get_or_create_by_user_id(user_id)

        stmt = delete(CartItemModel).where(CartItemModel.cart_id == cart.id)
        await self.session.execute(stmt)
        await self.session.flush()


class CartItemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **kwargs) -> CartItemModel:
        instance = CartItemModel(**kwargs)
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def find_by_cart_and_dish(
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

    async def get_all_with_info(self, cart_id: int) -> list[CartItemModel]:
        stmt = (select(CartItemModel)
                .where(CartItemModel.cart_id == cart_id)
                .options(selectinload(CartItemModel.dish))
                )
        result = await self.session.scalars(stmt)
        return result.all()

    async def add_item_to_cart(
            self,
            cart_id: int,
            dish_id: int,
            quantity: int = 1,
    ) -> CartItemModel:
        item = await self.find_by_cart_and_dish(cart_id, dish_id)

        if item:
            item.quantity += quantity
            await self.session.flush()
            return item

        return await self.create(
            cart_id=cart_id,
            dish_id=dish_id,
            quantity=quantity,
        )

    async def remove(self, instance: CartItemModel) -> None:
        await self.session.delete(instance)
        await self.session.flush()
