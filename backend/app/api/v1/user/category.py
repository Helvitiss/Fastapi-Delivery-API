from app.dependencies.main import get_category_service
from app.schemas.category import CategoryRead
from fastapi import APIRouter, Depends

from app.services.category import CategoryService

router = APIRouter(prefix="/categories", tags=["Категории"])


@router.get(
    "/", 
    response_model=list[CategoryRead],
    summary="Все категории"
)
async def list_categories(cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.get_all_categories()


@router.get(
    '/{category_id}', 
    response_model=CategoryRead,
    summary="Детали категории"
)
async def get_category(category_id: int, cat_service: CategoryService = Depends(get_category_service)):
    return await cat_service.get_category_by_id(category_id)



