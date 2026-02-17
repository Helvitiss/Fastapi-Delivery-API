from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CategoryModel
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.category_repo = CategoryRepository(session)

    async def create_category(self, category_schema: CategoryCreate) -> CategoryModel:
        category_model = CategoryModel(**category_schema.model_dump())
        category = await self.category_repo.create(category_model)
        return category

    async def get_all_categories(self) -> list[CategoryModel]:
        categories = await self.category_repo.get_all()
        return categories

    async def get_category_by_id(self, category_id: int) -> CategoryModel:
        category_model = await self.category_repo.get_by_id(category_id)
        return category_model

    async def update_category(self, category_id: int, category_schema: CategoryUpdate) -> CategoryModel:
        category = await self.get_category_by_id(category_id)

        for k, v in category_schema.model_dump(exclude_unset=True).items():
            setattr(category, k, v)

        return category

    async def delete_category(self, category_id: int) -> None:
        category = await self.category_repo.get_by_id(category_id)
        await self.session.delete(category)
