from unittest.mock import AsyncMock, patch

import pytest

from app.models import UserModel
from app.models import auth as auth_models
from app.repositories.auth import AuthRepository
from app.repositories.user import UserRepository
from app.services.auth import AuthService


@pytest.fixture
def user_repo():
    return AsyncMock(spec=UserRepository)


@pytest.fixture
def auth_repo():
    return AsyncMock(spec=AuthRepository)


@pytest.fixture
def auth_service(mock_session, user_repo, auth_repo):
    return AuthService(session=mock_session, user_repo=user_repo, auth_repo=auth_repo)


async def test_request_otp(auth_service, auth_repo):
    phone = "79998887766"

    with patch("app.services.auth.send_otp_code_task.delay") as delay_mock:
        expires = await auth_service.request_otp(phone)

    assert isinstance(expires, int)
    auth_repo.delete_old_otps.assert_called_once_with(phone)
    auth_repo.create_otp.assert_called_once()
    delay_mock.assert_called_once()


async def test_verify_otp_new_user(auth_service, user_repo, auth_repo):
    phone = "79998887766"
    code = "123456"

    # Мокаем существующий OTP
    auth_repo.get_valid_otp.return_value = auth_models.OTPCodeModel(
        id=1, phone_number=phone, code=code
    )
    # Мокаем что пользователя НЕТ
    user_repo.get_by_phone.return_value = None
    # Мокаем создание пользователя
    user_repo.create_with_phone.return_value = UserModel(id=10, phone=phone)

    # Патчим создание токена чтобы не зависеть от секретов в тестах
    with patch("app.services.auth.create_access_token", return_value="fake_token"):
        token = await auth_service.verify_otp_and_issue_token(phone, code)

    assert token == "fake_token"
    user_repo.create_with_phone.assert_called_once_with(phone)
    auth_repo.delete_old_otps.assert_called_once_with(phone)
