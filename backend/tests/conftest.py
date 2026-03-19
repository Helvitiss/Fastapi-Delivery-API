import asyncio
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from unittest.mock import AsyncMock

from app.main import app

# Создаем тестовый движок (может быть как SQLite в памяти, так и мок)
# Для простых юнит-тестов мы чаще будем использовать моки сессий напрямую.

@pytest.fixture(scope="session")
def event_loop():
    """Создает экземпляр цикла событий для каждой тестовой сессии."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
async def mock_session():
    """Фикстура для мока асинхронной сессии SQLAlchemy."""
    session = AsyncMock(spec=AsyncSession)
    return session


@pytest.fixture
async def client():
    """Фикстура для асинхронного клиента FastAPI."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
