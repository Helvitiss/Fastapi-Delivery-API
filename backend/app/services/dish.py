from logging import getLogger

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DishModel
from app.repositories.category import CategoryRepository
from app.repositories.dish import DishRepository
from app.schemas.dish import DishCreate, DishUpdate
from app.services.storage import LocalStorageService


class DishService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.dish_repo = DishRepository(session)
        self.category_repo = CategoryRepository(session)
        self.storage_service = LocalStorageService()


    async def get_dish_by_id(self, dish_id: int, include_inactive=False) -> DishModel:
        dish = await self.dish_repo.get_by_id(dish_id, include_inactive=include_inactive)
        return dish

    async def create_dish(self, dish_schema: DishCreate) -> DishModel:
        await self.category_repo.get_by_id(dish_schema.category_id)

        dish_model = DishModel(**dish_schema.model_dump())
        result = await self.dish_repo.create(dish_model)

        return result

    async def upload_image(self, dish_id: int, file: UploadFile):
        dish = await self.get_dish_by_id(dish_id)
        image_url = await self.storage_service.save_dish_image(file)
        old_image_url = dish.image_url
        dish.image_url = image_url
        await self.session.flush()
        getLogger().info(f'new image url: {image_url}')
        if old_image_url is not None:
            self.storage_service.delete_file(old_image_url)
        return image_url

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

    async def get_list_dishes(self, include_inactive=False) -> list[DishModel]:
        dishes = await self.dish_repo.get_all(include_inactive)
        return dishes
