from enum import StrEnum


class UserRole(StrEnum):
    USER = "user"
    ADMIN = "admin"


class OrderStatus(StrEnum):
    new = "new"
    confirmed = "confirmed"
    cooking = "cooking"
    delivering = "delivering"
    completed = "completed"
    cancelled = "cancelled"
