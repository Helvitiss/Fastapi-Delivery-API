from app.dependencies.main import get_dish_service, get_category_service
from app.schemas.category import CategoryRead, CategoryCreate, CategoryUpdate
from fastapi import APIRouter, Depends

from app.services.category import CategoryService
from app.services.dish import DishService

router = APIRouter(prefix="/categories", tags=["user: category"])



@router.get("/", response_model=list[CategoryRead])
async def list_categories(cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.get_all_categories()



@router.get('/{category_id}', response_model=CategoryRead)
async def get_category(category_id: int, cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.get_category_by_id(category_id)



