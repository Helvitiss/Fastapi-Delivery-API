from logging import getLogger

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError
from app.models import DishModel
from app.repositories.category import CategoryRepository
from app.repositories.dish import DishRepository
from app.schemas.dish import DishCreate, DishUpdate
from app.services.storage import LocalStorageService


class DishService:
    def __init__(
        self, 
        session: AsyncSession,
        dish_repo: DishRepository,
        category_repo: CategoryRepository,
        storage_service: LocalStorageService
    ):
        self.session = session
        self.dish_repo = dish_repo
        self.category_repo = category_repo
        self.storage_service = storage_service


    async def get_dish_by_id(self, dish_id: int, include_inactive=False) -> DishModel:
        dish = await self.dish_repo.get_by_id(dish_id, include_inactive=include_inactive)
        return dish

    async def create_dish(self, dish_schema: DishCreate) -> DishModel:
        await self.category_repo.get_by_id(dish_schema.category_id)

        normalized_name = dish_schema.name.strip()
        duplicate = await self.dish_repo.get_by_name(normalized_name)
        if duplicate is not None:
            raise ConflictError('Dish with this name already exists')

        dish_model = DishModel(**dish_schema.model_dump())
        dish_model.name = normalized_name
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

        if dish_schema.name is not None:
            normalized_name = dish_schema.name.strip()
            duplicate = await self.dish_repo.get_by_name(normalized_name)
            if duplicate is not None and duplicate.id != dish.id:
                raise ConflictError('Dish with this name already exists')

        update_data = dish_schema.model_dump(exclude_unset=True)
        if 'name' in update_data and update_data['name'] is not None:
            update_data['name'] = update_data['name'].strip()

        for key, value in update_data.items():
            setattr(dish, key, value)

        return dish

    async def delete_dish(self, dish_id: int) -> None:
        await self.dish_repo.delete(dish_id)

    async def get_list_dishes(self, include_inactive=False) -> list[DishModel]:
        dishes = await self.dish_repo.get_all(include_inactive)
        return dishes
