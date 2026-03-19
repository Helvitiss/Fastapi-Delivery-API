from sqlalchemy import ForeignKey, UniqueConstraint

from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import UserModel
    from app.models.dish import DishModel
    from app.models.cart_item import CartItemModel

class CartModel(Base):
    __tablename__ = 'cart'
    __table_args__ = (UniqueConstraint("user_id"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))


    user: Mapped["UserModel"] = relationship("UserModel", back_populates="cart")
    items: Mapped[list['CartItemModel']] = relationship("CartItemModel", back_populates="cart", cascade="all, delete-orphan")


class CartItemModel(Base):
    __tablename__ = 'cart_items'
    __table_args__ = (
        UniqueConstraint("cart_id", "dish_id", name="uq_cart_item_dish"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey('cart.id'))
    dish_id: Mapped[int] = mapped_column(ForeignKey('dish.id'))
    quantity: Mapped[int] = mapped_column(default=1)


    dish: Mapped['DishModel'] = relationship("DishModel")
    cart: Mapped["CartModel"] = relationship("CartModel", back_populates="items")




