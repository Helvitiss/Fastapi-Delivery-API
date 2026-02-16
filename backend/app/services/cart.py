from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.cart import CartItemModel, CartModel
from app.repositories.cart import CartRepository, CartItemRepository
from app.schemas.cart import CartRead


class CartService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cart_repo = CartRepository(session)
        self.cart_item_repo = CartItemRepository(session)





    async def get_or_create_by_user_id(self, user_id: int) -> CartModel:
        result = await self.cart_repo.get_or_create_by_user_id(user_id)
        return result


    async def get_items_by_user_id(self, user_id: int) -> CartRead:

        cart = await self.get_or_create_by_user_id(user_id)


        items = await self.cart_item_repo.get_all_with_info(cart.id)

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





    async def add_dish(self, user_id: int, dish_id: int, quantity: int = 1) -> CartItemModel:

        cart = await self.get_or_create_by_user_id(user_id)

        item = await self.cart_item_repo.add_item_to_cart(
            cart_id=cart.id,
            dish_id=dish_id,
            quantity=quantity,
        )
        return item

    async def update(self, user_id: int, dish_id: int, quantity: int = 1) -> None:
        cart = await self.get_or_create_by_user_id(user_id)

        cart_item = await self.cart_item_repo.find_by_cart_and_dish(
            cart.id,
            dish_id,
        )
        if cart_item is None:
            raise NotFoundError("Item not found")

        if quantity == 0:
            if cart_item:
                await self.cart_item_repo.delete(cart_item)
        else:
            cart_item.quantity = quantity


    async def remove_dish(self, user_id: int, dish_id: int) -> None:
        await self.update(user_id, dish_id, 0)


    async def clear(self, user_id: int) -> None:
        cart = await self.get_or_create_by_user_id(user_id)

        for item in cart.items:
            await self.cart_item_repo.delete(item)

