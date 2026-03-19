

from app.core.database import Base
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.enums import UserRole

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cart import CartModel
    from app.models.order import OrderModel


class UserModel(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str | None] = mapped_column(String(30), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), index=True)
    role: Mapped[UserRole] = mapped_column(default=UserRole.USER)


    cart: Mapped["CartModel"] = relationship("CartModel", back_populates="user")
    orders: Mapped[list["OrderModel"]] = relationship("OrderModel", back_populates="user")
