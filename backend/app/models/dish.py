from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models import CategoryModel


class DishModel(Base):
    __tablename__ = 'dish'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(Text)
    weight: Mapped[int | None] = mapped_column(nullable=True)
    is_available: Mapped[bool | None] = mapped_column(Boolean, default=True)
    image_url: Mapped[str | None] = mapped_column(nullable=True)


    category_id: Mapped[int] = mapped_column(ForeignKey('category.id', ondelete='CASCADE'))

    category: Mapped['CategoryModel'] = relationship('CategoryModel', back_populates='dishes')
