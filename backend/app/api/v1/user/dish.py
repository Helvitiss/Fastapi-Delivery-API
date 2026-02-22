from typing import List
from fastapi import APIRouter, Depends

from app.schemas.dish import DishRead
from app.dependencies.main import get_dish_service
from app.services.dish import DishService

router = APIRouter(prefix="/dishes", tags=["user: dishes"])


@router.get('/', response_model=List[DishRead])
async def list_available_dishes(menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.get_list_dishes()


@router.get('/{dish_id}', response_model=DishRead)
async def retrieve_available_dish(dish_id: int, menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.get_dish_by_id(dish_id)
