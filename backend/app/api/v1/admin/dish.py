from typing import List
from fastapi import APIRouter, Depends

from app.schemas.dish import DishRead, DishCreate, DishUpdate

from app.dependencies.main import get_menu_service
from app.services.menu import MenuService

router = APIRouter(prefix="/dishes", tags=["admin: dishes"])



@router.post('/', response_model=DishRead, status_code=201)
async def create_dish(dish: DishCreate, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.create_dish(dish)


@router.put('/{dish_id}', response_model=DishRead)
async def update_dish(dish_id: int, dish: DishUpdate, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.update_dish(dish_id, dish)

@router.patch('/{dish_id}', response_model=DishRead)
async def partial_update_dish(dish_id: int, dish: DishUpdate, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.update_dish(dish_id, dish)

@router.delete('/{dish_id}', status_code=204)
async def delete_dish(dish_id: int, menu_service: MenuService = Depends(get_menu_service)):
    await menu_service.delete_dish(dish_id)



