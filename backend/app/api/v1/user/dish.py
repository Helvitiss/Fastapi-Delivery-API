from fastapi import APIRouter, Depends

from app.dependencies.main import get_dish_service
from app.schemas.dish import DishRead
from app.services.dish import DishService

router = APIRouter(prefix="/dishes", tags=["Меню"])


@router.get("/", response_model=list[DishRead], summary="Все блюда")
async def list_available_dishes(menu_service: DishService = Depends(get_dish_service)):
    return await menu_service.get_list_dishes()


@router.get("/{dish_id}", response_model=DishRead, summary="Детали блюда")
async def retrieve_available_dish(
    dish_id: int, menu_service: DishService = Depends(get_dish_service)
):
    return await menu_service.get_dish_by_id(dish_id)
