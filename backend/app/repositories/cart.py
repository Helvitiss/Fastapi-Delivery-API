from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.cart import CartModel, CartItemModel

class CartRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create_by_user_id(self, user_id: int) -> CartModel:

        stmt = select(CartModel).where(CartModel.user_id == user_id)
        cart = (await self.session.execute(stmt)).scalar_one_or_none()

        if cart:
            return cart

        cart = CartModel(user_id=user_id)
        self.session.add(cart)

        try:
            await self.session.flush()
            return cart

        except IntegrityError:
            pass

            return (await self.session.execute(stmt)).scalar_one()



class CartItemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_cart_and_dish(
            self,
            cart_id: int,
            dish_id: int,
    ) -> CartItemModel | None:
        stmt = select(CartItemModel).where(
            CartItemModel.cart_id == cart_id,
            CartItemModel.dish_id == dish_id,
        )
        obj = await self.session.execute(stmt)
        result = obj.scalar_one_or_none()
        return result


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
        ...
        item = await self.find_by_cart_and_dish(cart_id, dish_id)

        if item:
            item.quantity += quantity
            await self.session.flush()
            return item

        item = CartItemModel(
            cart_id=cart_id,
            dish_id=dish_id,
            quantity=quantity,
        )

        self.session.add(item)
        await self.session.flush()
        return item


    async def delete(self, cart_item: CartItemModel) -> None:
        await self.session.delete(cart_item)
