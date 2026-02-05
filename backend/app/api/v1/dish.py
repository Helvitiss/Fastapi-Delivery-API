from typing import List

from app.core.dependencies import get_dish_repo
from app.repositories.main_repos import DishRepo
from app.schemas.dish import Dish, DishCreate, DishUpdate
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/dish", tags=["dish"])




@router.get('/', response_model=List[Dish])
async def get_dishes(dish_repo: DishRepo = Depends(get_dish_repo)):
    dishes = await dish_repo.get_all_dishes()
    return dishes


@router.get('/{dish_id}', response_model=Dish)
async def get_dish(dish_id: int, dish_repo: DishRepo = Depends(get_dish_repo)):
    dish = await dish_repo.get_dish_by_id(dish_id)
    return dish


@router.post('/', response_model=Dish, status_code=201)
async def post_dish(dish: DishCreate, dish_repo: DishRepo = Depends(get_dish_repo)):
    result = await dish_repo.create_dish(dish)
    return result


@router.put('/{dish_id}', response_model=Dish)
async def update_dish(dish_id: int, dish: DishCreate, dish_repo: DishRepo = Depends(get_dish_repo)):
    result = await dish_repo.update_dish(dish_id, dish)
    return result

@router.patch('/{dish_id}', response_model=Dish)
async def patch_dish(dish_id: int, dish: DishUpdate, dish_repo: DishRepo = Depends(get_dish_repo)):
    result = await dish_repo.update_dish(dish_id, dish)
    return result

@router.delete('/{dish_id}', status_code=204)
async def delete_dish(dish_id: int, dish_repo: DishRepo = Depends(get_dish_repo)):
    ...

