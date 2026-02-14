from app.core.database import Base
from sqlalchemy import String, Text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship



class DishModel(Base):
    __tablename__ = 'dish'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    weight: Mapped[int | None] = mapped_column(nullable=True)
    image_path: Mapped[str | None] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)


    category_id: Mapped[int] = mapped_column(ForeignKey('category.id', ondelete='CASCADE'))

    category: Mapped['CategoryModel'] = relationship('CategoryModel', back_populates='dishes')




class CategoryModel(Base):
    __tablename__ = 'category'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text)

    dishes: Mapped[list['DishModel']] = relationship('DishModel', back_populates='category', cascade='all, delete')
