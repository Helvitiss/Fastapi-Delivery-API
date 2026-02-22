import pytest
from unittest.mock import AsyncMock
from app.services.address import AddressService
from app.repositories.address import AddressRepository
from app.schemas.address import AddressCreate
from app.models import AddressModel

@pytest.fixture
def address_repo():
    return AsyncMock(spec=AddressRepository)

@pytest.fixture
def address_service(mock_session, address_repo):
    return AddressService(session=mock_session, address_repo=address_repo)

async def test_create_address(address_service, address_repo):
    user_id = 1
    schema = AddressCreate(address="Test St 123")
    
    result = await address_service.create(user_id, schema)
    
    assert result.address == "Test St 123"
    assert result.user_id == user_id
    address_repo.create.assert_called_once()

async def test_get_by_user_id(address_service, address_repo):
    user_id = 1
    address_repo.get_by_user_id.return_value = [AddressModel(id=1, address="St 1")]
    
    result = await address_service.get_by_user_id(user_id)
    
    assert len(result) == 1
    assert result[0].address == "St 1"
    address_repo.get_by_user_id.assert_called_once_with(user_id)

async def test_delete_address(address_service, address_repo):
    await address_service.delete(10, 1)
    address_repo.delete.assert_called_once_with(10, 1)
