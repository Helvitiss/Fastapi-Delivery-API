from datetime import datetime

from app.core.database import Base
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserModel(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)

    cart: Mapped["CartModel"] = relationship("CartModel", back_populates="user")
    orders: Mapped[list["OrderModel"]] = relationship("OrderModel", back_populates="user")
