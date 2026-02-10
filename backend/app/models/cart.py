from sqlalchemy import ForeignKey, Integer

from app.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship



class CartModel(Base):
    __tablename__ = 'cart'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))


    user: Mapped["UserModel"] = relationship("UserModel", back_populates="cart")
    items: Mapped[list['CartItem']] = relationship("CartItemModel", back_populates="cart", cascade="all, delete-orphan")


class CartItemModel(Base):
    __tablename__ = 'cart_item'
    id: Mapped[int] = mapped_column(primary_key=True)
    cart_id: Mapped[int] = mapped_column(ForeignKey('cart.id'))
    dish_id: Mapped[int] = mapped_column(ForeignKey('dish.id'))
    quantity: Mapped[int] = mapped_column(default=1)


    dish: Mapped['DishModel'] = relationship("DishModel")
    cart: Mapped["CartModel"] = relationship("CartModel", back_populates="items")




