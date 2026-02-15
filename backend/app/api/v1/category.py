from app.dependencies.main import get_menu_service
from app.schemas.category import Category, CategoryCreate
from fastapi import APIRouter, Depends

from app.services.menu import MenuService

router = APIRouter(prefix="/category", tags=["category"])



@router.get("/", response_model=list[Category])
async def get_categories(menu_service: MenuService = Depends(get_menu_service)):
    categories  = await menu_service.get_all_categories()
    return categories



@router.get('/{category_id}', response_model=Category)
async def get_category(category_id: int, menu_service: MenuService = Depends(get_menu_service)):
    category = await menu_service.get_category_by_id(category_id)
    return category



@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate,menu_service: MenuService = Depends(get_menu_service)):
    category = await menu_service.create_category(category)
    return category




@router.delete("/{category_id}", response_model=Category)
async def delete_category(category_id: int, menu_service: MenuService = Depends(get_menu_service)):
    await menu_service.delete_category(category_id)

