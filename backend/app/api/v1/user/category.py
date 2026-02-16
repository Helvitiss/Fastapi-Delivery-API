from app.dependencies.main import get_menu_service
from app.schemas.category import CategoryRead, CategoryCreate, CategoryUpdate
from fastapi import APIRouter, Depends

from app.services.menu import MenuService

router = APIRouter(prefix="/categories", tags=["user: category"])



@router.get("/", response_model=list[CategoryRead])
async def list_categories(menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.get_all_categories()



@router.get('/{category_id}', response_model=CategoryRead)
async def get_category(category_id: int, menu_service: MenuService = Depends(get_menu_service)):
    return await menu_service.get_category_by_id(category_id)



