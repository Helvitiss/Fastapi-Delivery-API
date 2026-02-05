from app.core.dependencies import get_dish_repo, get_category_service
from app.schemas.category import Category, CategoryCreate
from fastapi import APIRouter, Depends

from app.services.main_service import CategoryService

router = APIRouter(prefix="/category", tags=["category"])



@router.get("/", response_model=list[Category])
async def get_categories(cat_service: CategoryService = Depends(get_category_service)):
    result = await cat_service.get_all()
    return result




@router.get('/{category_id}', response_model=Category)
async def get_category(category_id: int, cat_service: CategoryService = Depends(get_category_service)):
    result = await cat_service.get_by_id(category_id)
    return result




@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate,cat_service: CategoryService = Depends(get_category_service)):

    result = await cat_service.create(category)
    return result


@router.delete("/{category_id}", response_model=Category)
async def delete_category(category_id: int, cat_service: CategoryService = Depends(get_category_service)):
    result = await cat_service.delete(category_id)
    return result


