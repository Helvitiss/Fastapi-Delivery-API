import argparse
import asyncio

from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.models.enums import UserRole
from app.models.user import UserModel


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Создаёт администратора или повышает существующего пользователя "
            "по номеру телефона."
        ),
    )
    parser.add_argument(
        "phone",
        help="Номер телефона администратора (пример: +79990001122).",
    )
    parser.add_argument(
        "--name",
        default=None,
        help="Необязательное имя администратора.",
    )
    return parser.parse_args()


async def create_or_promote_admin(phone: str, name: str | None = None) -> tuple[UserModel, bool]:
    async with AsyncSessionLocal() as session:
        stmt = select(UserModel).where(UserModel.phone == phone)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()

        created = False
        if user is None:
            user = UserModel(phone=phone, name=name, role=UserRole.ADMIN)
            session.add(user)
            created = True
        else:
            user.role = UserRole.ADMIN
            if name:
                user.name = name

        await session.commit()
        await session.refresh(user)
        return user, created


async def main() -> None:
    args = parse_args()
    user, created = await create_or_promote_admin(phone=args.phone, name=args.name)

    action = "создан" if created else "обновлён"
    print(
        f"Администратор {action}: "
        f"id={user.id}, phone={user.phone}, role={user.role}, name={user.name}"
    )


if __name__ == "__main__":
    asyncio.run(main())
