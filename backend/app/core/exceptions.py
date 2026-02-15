



class BaseAppError(Exception):
    pass


class NotFoundError(BaseAppError):
    pass


class BadRequestError(BaseAppError):
    pass