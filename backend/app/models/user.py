from datetime import datetime

from app.core.database import Base
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.enums import UserRole

class UserModel(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    phone: Mapped[str] = mapped_column(String(20), index=True)
    role: Mapped[UserRole] = mapped_column(default=UserRole.USER)


    cart: Mapped["CartModel"] = relationship("CartModel", back_populates="user")
    orders: Mapped[list["OrderModel"]] = relationship("OrderModel", back_populates="user")
