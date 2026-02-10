from typing import List
from fastapi import APIRouter, Depends

from app.schemas.dish import Dish, DishCreate, DishUpdate
from app.core.dependencies.main import get_dish_service
from app.services.dish import DishService



router = APIRouter(prefix="/dish", tags=["dish"])




@router.get('/', response_model=List[Dish])
async def get_dishes(dish_service: DishService = Depends(get_dish_service)):
    dishes = await dish_service.get_all()
    return dishes


@router.get('/{dish_id}', response_model=Dish)
async def get_dish(dish_id: int, dish_service: DishService = Depends(get_dish_service)):
    dish = await dish_service.get_by_id(dish_id)
    return dish


@router.post('/', response_model=Dish, status_code=201)
async def post_dish(dish: DishCreate, dish_service: DishService = Depends(get_dish_service)):
    result = await dish_service.create(dish)
    return result


@router.put('/{dish_id}', response_model=Dish)
async def update_dish(dish_id: int, dish: DishUpdate, dish_service: DishService = Depends(get_dish_service)):
    result = await dish_service.update(dish_id, dish)
    return result

@router.patch('/{dish_id}', response_model=Dish)
async def patch_dish(dish_id: int, dish: DishUpdate, dish_service: DishService = Depends(get_dish_service)):
    result = await dish_service.update(dish_id, dish)
    return result

@router.delete('/{dish_id}', status_code=204)
async def delete_dish(dish_id: int, dish_service: DishService = Depends(get_dish_service)):
    result = await dish_service.delete(dish_id)
    return result


