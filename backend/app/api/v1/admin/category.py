from app.dependencies.main import get_category_service
from app.schemas.category import CategoryRead, CategoryCreate, CategoryUpdate
from fastapi import APIRouter, Depends

from app.services.category import CategoryService
from app.services.dish import DishService

router = APIRouter(prefix="/categories", tags=["admin: category"])







@router.post("/", response_model=CategoryRead)
async def create_category(category: CategoryCreate, cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.create_category(category)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: int, data: CategoryUpdate, cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.update_category(category_id, data)

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, cat_service: CategoryService = Depends(get_category_service)):
    await cat_service.delete_category(category_id)

