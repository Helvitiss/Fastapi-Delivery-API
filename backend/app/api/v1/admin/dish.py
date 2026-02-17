from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from app.core.exceptions import NotFoundError
from app.schemas.dish import DishRead, DishCreate, DishUpdate

from app.dependencies.main import get_dish_service
from app.services.dish import DishService

router = APIRouter(prefix="/dishes", tags=["admin: dishes"])

@router.get('/', response_model=list[DishRead])
async def list_all_dishes(menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.get_list_dishes(include_inactive=True)


@router.get('/{dish_id}', response_model=DishRead)
async def retrieve_dish(dish_id: int, menu_service: DishService = Depends(get_dish_service)):

    return await menu_service.get_dish_by_id(dish_id, include_inactive=True)




@router.post('/', response_model=DishRead, status_code=201)
async def create_dish(dish: DishCreate, menu_service: DishService = Depends(get_dish_service)):
    try:
        return await menu_service.create_dish(dish)
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Category not found")

@router.post('/photo')
async def upload_dish_photo(dish_id: int, file: UploadFile = File(...),
                            menu_service: DishService = Depends(get_dish_service)):
    image_url = await menu_service.upload_image(dish_id, file)
    return {"image_url": image_url}

@router.put('/{dish_id}', response_model=DishRead)
async def update_dish(dish_id: int, dish: DishUpdate, menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.update_dish(dish_id, dish)


@router.patch('/{dish_id}', response_model=DishRead)
async def partial_update_dish(dish_id: int, dish: DishUpdate, menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.update_dish(dish_id, dish)


@router.delete('/{dish_id}', status_code=204)
async def delete_dish(dish_id: int, menu_service: DishService = Depends(get_dish_service)):
    await menu_service.delete_dish(dish_id)
