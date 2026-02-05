from app.core.dependencies import get_category_repo
from app.schemas.category import Category, CategoryCreate
from fastapi import APIRouter, Depends
from app.repositories.main_repos import CategoryRepo

router = APIRouter(prefix="/category", tags=["category"])



@router.get("/", response_model=list[Category])
async def get_categories(cat_repo: CategoryRepo = Depends(get_category_repo)):
    result = await cat_repo.get_all_categories()
    return result




@router.get('/{category_id}', response_model=Category)
async def get_category(category_id: int, cat_repo: CategoryRepo = Depends(get_category_repo)):
    result = await CategoryRepo.get_category_by_id(category_id)
    return result




@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate, cat_repo: CategoryRepo = Depends(get_category_repo)):

    result = await cat_repo.create_category(category)
    return result
