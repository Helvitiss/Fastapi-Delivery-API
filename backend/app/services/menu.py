from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CategoryModel, DishModel
from app.repositories.menu import DishRepository, CategoryRepository
from app.schemas.category import  CategoryCreate, CategoryUpdate
from app.schemas.dish import DishCreate, DishUpdate


class MenuService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.dish_repo = DishRepository(session)
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
        category = self.category_repo.get_by_id(category_id)
        await self.session.delete(category)


    async def get_dish_by_id(self, dish_id: int) -> DishModel:
        dish = await self.dish_repo.get_by_id(dish_id)
        return dish


    async def create_dish(self, dish_schema: DishCreate) -> DishModel:
        await self.category_repo.get_by_id(dish_schema.category_id)

        dish_model = DishModel(**dish_schema.model_dump())
        result = await self.dish_repo.create(dish_model)

        return result

    async def update_dish(self, dish_id: int, dish_schema: DishUpdate) -> DishModel:
        dish = await self.dish_repo.get_by_id(dish_id)
        if dish_schema.category_id is not None:
            await self.category_repo.get_by_id(dish_schema.category_id)


        for key, value in dish_schema.model_dump(exclude_unset=True).items():
            setattr(dish, key, value)

        return dish

    async def delete_dish(self, dish_id: int) -> None:
        dish = self.dish_repo.get_by_id(dish_id)

        await self.session.delete(dish)


    async def get_list_dishes(self) -> list[DishModel]:
        dishes = await self.dish_repo.get_all()
        return dishes

