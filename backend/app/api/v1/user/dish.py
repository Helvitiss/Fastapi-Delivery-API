from typing import List
from fastapi import APIRouter, Depends

from app.schemas.dish import DishRead, DishCreate, DishUpdate

from app.dependencies.main import get_menu_service
from app.services.menu import MenuService

router = APIRouter(prefix="/dishes", tags=["user: dishes"])




@router.get('/', response_model=List[DishRead])
async def list_dishes(menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.get_list_dishes()


@router.get('/{dish_id}', response_model=DishRead)
async def retrieve_dish(dish_id: int, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.get_dish_by_id(dish_id)


