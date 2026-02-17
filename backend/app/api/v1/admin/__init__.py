from fastapi import APIRouter, Depends
from app.dependencies.auth import is_admin


from .dish import router as dish_router
from .orders import router as orders_router
from .category import router as category_router
admin_router = APIRouter(prefix='/admin',dependencies=[Depends(is_admin)])


admin_router.include_router(dish_router)
admin_router.include_router(orders_router)
admin_router.include_router(category_router)