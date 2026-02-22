import pytest
from unittest.mock import AsyncMock
from app.dependencies.auth import get_auth_service
from app.main import app

# Переопределяем зависимость для тестов
@pytest.fixture
def mock_auth_service():
    service = AsyncMock()
    service.request_otp.return_value = 1 # expires in 1 min
    return service

@pytest.mark.asyncio
async def test_request_otp_endpoint(client, mock_auth_service):
    # Подменяем зависимость в приложении
    app.dependency_overrides[get_auth_service] = lambda: mock_auth_service
    
    response = await client.post(
        "/auth/request-code", 
        json={"phone_number": "79998887766"}
    )
    
    # Очищаем переопределения после теста
    app.dependency_overrides.clear()
    
    assert response.status_code == 200
    data = response.json()
    assert data["phone_number"] == "79998887766"
    assert data["expires_in_seconds"] == 1
    mock_auth_service.request_otp.assert_called_once_with("79998887766")
