from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.services.address import AddressService
from app.services.cart import CartService
from app.services.category import CategoryService
from app.services.dish import DishService
from app.services.order import OrderService
from app.services.storage import LocalStorageService
from app.repositories.user import UserRepository
from app.repositories.dish import DishRepository
from app.repositories.category import CategoryRepository
from app.repositories.cart import CartRepository, CartItemRepository
from app.repositories.order import OrderRepository
from app.repositories.address import AddressRepository
from app.repositories.auth import AuthRepository


async def get_async_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
            await db.commit()
        except:
            await db.rollback()
            raise






# Repository dependencies
async def get_user_repository(session: AsyncSession = Depends(get_async_db)) -> UserRepository:
    return UserRepository(session)

async def get_dish_repository(session: AsyncSession = Depends(get_async_db)) -> DishRepository:
    return DishRepository(session)

async def get_category_repository(session: AsyncSession = Depends(get_async_db)) -> CategoryRepository:
    return CategoryRepository(session)

async def get_cart_repository(session: AsyncSession = Depends(get_async_db)) -> CartRepository:
    return CartRepository(session)

async def get_cart_item_repository(session: AsyncSession = Depends(get_async_db)) -> CartItemRepository:
    return CartItemRepository(session)

async def get_order_repository(session: AsyncSession = Depends(get_async_db)) -> OrderRepository:
    return OrderRepository(session)

async def get_address_repository(session: AsyncSession = Depends(get_async_db)) -> AddressRepository:
    return AddressRepository(session)

async def get_auth_repository(session: AsyncSession = Depends(get_async_db)) -> AuthRepository:
    return AuthRepository(session)

async def get_local_storage_service() -> LocalStorageService:
    return LocalStorageService()


# Service dependencies
async def get_dish_service(
    session: AsyncSession = Depends(get_async_db),
    dish_repo: DishRepository = Depends(get_dish_repository),
    category_repo: CategoryRepository = Depends(get_category_repository),
    storage_service: LocalStorageService = Depends(get_local_storage_service)
) -> DishService:
    return DishService(session, dish_repo, category_repo, storage_service)

async def get_category_service(
    session: AsyncSession = Depends(get_async_db),
    category_repo: CategoryRepository = Depends(get_category_repository)
) -> CategoryService:
    return CategoryService(session, category_repo)

async def get_cart_service(
    session: AsyncSession = Depends(get_async_db),
    cart_repo: CartRepository = Depends(get_cart_repository),
    cart_item_repo: CartItemRepository = Depends(get_cart_item_repository),
    dish_repo: DishRepository = Depends(get_dish_repository)
) -> CartService:
    return CartService(session, cart_repo, cart_item_repo, dish_repo)

async def get_order_service(
    session: AsyncSession = Depends(get_async_db),
    order_repo: OrderRepository = Depends(get_order_repository),
    cart_repo: CartRepository = Depends(get_cart_repository),
    cart_item_repo: CartItemRepository = Depends(get_cart_item_repository)
) -> OrderService:
    return OrderService(session, order_repo, cart_repo, cart_item_repo)

async def get_address_service(
    session: AsyncSession = Depends(get_async_db),
    address_repo: AddressRepository = Depends(get_address_repository)
) -> AddressService:
    return AddressService(session, address_repo)