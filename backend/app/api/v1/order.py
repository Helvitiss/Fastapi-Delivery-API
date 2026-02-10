from fastapi import APIRouter




router = APIRouter(prefix="/orders", tags=["orders"])




@router.get("/")
async def get_orders():
    ...


@router.post("/")
async def create_order():
    ...


