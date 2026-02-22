class BaseAppError(Exception):
    """Базовый класс для всех исключений приложения."""
    def __init__(self, message: str = "An error occurred"):
        self.message = message
        super().__init__(self.message)


class NotFoundError(BaseAppError):
    """Ресурс не найден."""
    pass


class BadRequestError(BaseAppError):
    """Неверный запрос."""
    pass


class UnauthorizedError(BaseAppError):
    """Ошибка авторизации."""
    pass


class ForbiddenError(BaseAppError):
    """Доступ запрещен."""
    pass


class ConflictError(BaseAppError):
    """Конфликт данных (например, дубликат)."""
    pass


class InternalServerError(BaseAppError):
    """Внутренняя ошибка сервера."""
    pass