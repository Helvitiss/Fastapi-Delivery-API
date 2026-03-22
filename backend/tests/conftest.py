from unittest.mock import AsyncMock

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app

# Создаем тестовый движок (может быть как SQLite в памяти, так и мок)
# Для простых юнит-тестов мы чаще будем использовать моки сессий напрямую.


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
