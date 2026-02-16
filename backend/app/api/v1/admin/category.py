from app.dependencies.main import get_menu_service
from app.schemas.category import CategoryRead, CategoryCreate, CategoryUpdate
from fastapi import APIRouter, Depends

from app.services.menu import MenuService

router = APIRouter(prefix="/categories", tags=["admin: category"])







@router.post("/", response_model=CategoryRead)
async def create_category(category: CategoryCreate,menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.create_category(category)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: int, data: CategoryUpdate, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.update_category(category_id, data)

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, menu_service: MenuService = Depends(get_menu_service)):
    await menu_service.delete_category(category_id)

