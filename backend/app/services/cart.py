from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException
from app.models.cart import CartItemModel, CartModel
from app.repositories.cart import CartRepository, CartItemRepository
from app.schemas.cart import CartResponse


class CartService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cart_repo = CartRepository(session)
        self.cart_item_repo = CartItemRepository(session)

    async def get_by_user_id(self, user_id: int) -> CartModel:
        try:
            cart = await self.cart_repo.get_by_user_id(user_id)
        except NotFoundException:
            cart = await self.cart_repo.create(user_id=user_id)
        return cart

    async def get_items_by_user_id(self, user_id: int) -> CartResponse:

        cart = await self.get_by_user_id(user_id)


        items = await self.cart_item_repo.get_card_with_items(cart.id)

        item_list = []
        total_price = 0


        for item in items:

            total_dish_price = item.dish.price * item.quantity
            total_price += total_dish_price
            result_item = {'dish': item.dish,
                           'quantity': item.quantity,
                           'total_dish_price': total_dish_price, }
            item_list.append(result_item)

        result = {
            'cart_id': cart.id,
            'total_price': total_price,
            'items': item_list,
        }

        return result


    async def add_dish(self, user_id: int, dish_id: int, quantity: int = 1) -> None:

        cart = await self.get_by_user_id(user_id)


        cart_item = await self.cart_item_repo.find_by_cart_and_dish(
            cart.id,
            dish_id,
        )

        if cart_item:
            cart_item.quantity += quantity
        else:
            cart_item = CartItemModel(
                cart_id=cart.id,
                dish_id=dish_id,
                quantity=quantity,
            )
            await self.cart_item_repo.add(cart_item)

        await self.session.commit()

    async def update(self, user_id: int, dish_id: int, quantity: int = 1) -> None:
        cart = await self.get_by_user_id(user_id)

        cart_item = await self.cart_item_repo.find_by_cart_and_dish(
            cart.id,
            dish_id,
        )
        if quantity == 0:
            if cart_item:
                await self.cart_item_repo.delete(cart_item)
        else:
            cart_item.quantity = quantity
        await self.session.commit()


    async def remove_dish(self, user_id: int, dish_id: int) -> None:
        await self.update(user_id, dish_id, 0)


    async def clear(self, user_id: int) -> None:
        cart = await self.get_by_user_id(user_id)

        for item in cart.items:
            await self.cart_item_repo.delete(item)

        await self.session.commit()
