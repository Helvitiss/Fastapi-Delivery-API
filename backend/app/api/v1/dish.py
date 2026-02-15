from typing import List
from fastapi import APIRouter, Depends

from app.schemas.dish import Dish, DishCreate, DishUpdate

from app.dependencies.main import get_menu_service
from app.services.menu import MenuService

router = APIRouter(prefix="/dish", tags=["dish"])




@router.get('/', response_model=List[Dish])
async def get_dishes(menu_service: MenuService = Depends(get_menu_service)):
    dishes = await menu_service.get_list_dishes()
    return dishes


@router.get('/{dish_id}', response_model=Dish)
async def get_dish(dish_id: int, menu_service: MenuService = Depends(get_menu_service)):
    dish = await menu_service.get_dish_by_id(dish_id)
    return dish


@router.post('/', response_model=Dish, status_code=201)
async def post_dish(dish: DishCreate, menu_service: MenuService = Depends(get_menu_service)):
    result = await menu_service.create_dish(dish)
    return result


@router.put('/{dish_id}', response_model=Dish)
async def update_dish(dish_id: int, dish: DishUpdate, menu_service: MenuService = Depends(get_menu_service)):
    result = await menu_service.update_dish(dish_id, dish)
    return result

@router.patch('/{dish_id}', response_model=Dish)
async def patch_dish(dish_id: int, dish: DishUpdate, menu_service: MenuService = Depends(get_menu_service)):
    result = await menu_service.update_dish(dish_id, dish)
    return result

@router.delete('/{dish_id}', status_code=204)
async def delete_dish(dish_id: int, menu_service: MenuService = Depends(get_menu_service)):
    await menu_service.delete_dish(dish_id)



