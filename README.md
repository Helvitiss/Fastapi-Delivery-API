# FastAPI Delivery API

Production-oriented backend для сервиса доставки еды.

## TL;DR

Production-ready backend для доставки еды на FastAPI и Async SQLAlchemy.
Реализованы OTP-аутентификация, JWT-авторизация, логика корзины, управление заказами и разделение прав доступа (user/admin).
Проект построен на layered-архитектуре, покрыт unit и integration тестами и готов к запуску в Docker.

## О проекте

Этот репозиторий изначально проектировался как часть монорепозитория (backend + frontend).
Сейчас основной фокус — backend API, который уже закрывает ключевые доменные сценарии сервиса доставки еды:

- аутентификация и авторизация;
- работа с каталогом и меню;
- операции с корзиной;
- управление адресами доставки;
- создание и просмотр заказов;
- административные сценарии управления меню и заказами.

Frontend запланирован как следующий этап развития, а текущая структура репозитория уже готова к этому.

## Ключевые технические преимущества

- Асинхронный стек FastAPI + SQLAlchemy 2.0 с явным разделением ответственности.
- Layered-архитектура: routers → services → repositories → models.
- Транзакционные бизнес-потоки вокруг корзины и оформления заказа.
- Role-based access control с четким разделением user/admin.
- OTP-flow с контролем срока действия кода и JWT lifecycle.
- CLI-утилита для операционных задач (создание/повышение администратора).
- Структурированный набор тестов (unit + integration) для бизнес-логики и API-контрактов.

## Возможности API

### Пользовательская зона
- `auth`: OTP-аутентификация и выдача JWT-токенов.
- `categories` / `dishes`: просмотр категорий и блюд.
- `cart`: добавление/обновление/удаление позиций и расчет итоговой стоимости.
- `addresses`: управление адресами доставки.
- `orders`: создание и просмотр заказов.

### Административная зона
- управление категориями;
- управление блюдами;
- управление заказами;
- выдача роли администратора через CLI.

## Архитектура

Проект следует layered-подходу:

- **API (routers)**: HTTP-контракты и валидация request/response.
- **Services**: бизнес-логика и orchestration use-case сценариев.
- **Repositories**: слой доступа к данным.
- **Models/Schemas**: модели БД и DTO.
- **Core**: конфигурация, обработка исключений и инфраструктурная обвязка.

Такой подход упрощает поддержку, тестирование и развитие функциональности.

## Безопасность

- JWT-базированная аутентификация для stateless API-доступа.
- Короткоживущие OTP-коды с контролем времени жизни.
- Role-based access control для привилегированных операций.
- Конфигурация через переменные окружения для чувствительных параметров.
- Разделение публичных и административных эндпоинтов.

## Масштабируемость

- Async I/O на уровне фреймворка и доступа к БД.
- Stateless JWT-модель, удобная для горизонтального масштабирования.
- Слоистая архитектура, безопасная для эволюции продукта.
- Docker-first подход для воспроизводимого окружения деплоя.
- Четкие доменные границы для дальнейшей декомпозиции.

## Технологический стек

- Python 3.12
- FastAPI
- SQLAlchemy 2.0 (Async)
- PostgreSQL
- Alembic
- JWT + OTP
- Pytest / pytest-asyncio / pytest-cov
- Docker / Docker Compose

## Структура репозитория

```text
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── dependencies/
│   │   ├── core/
│   │   └── cli/
│   ├── alembic/
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pytest.ini
├── docker-compose.yml
└── README.md
```

## Быстрый старт

### Вариант 1: Docker (рекомендуется)

1. Создайте файл `backend/.env`.
2. Заполните обязательные переменные окружения (пример ниже).
3. Запустите контейнеры:

```bash
docker compose up -d --build
```

Документация API после запуска:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Вариант 2: Локальный запуск backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Переменные окружения (`backend/.env`)

```env
SECRET_KEY=your_secret_key
DB_URL=postgresql+asyncpg://fastapidelivery_user:fastapidelivery@db:5432/fastapidelivery_db
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
OTP_EXPIRE_MINUTES=5
```

Для локального запуска без Docker замените `db` в `DB_URL` на `localhost` (или ваш реальный хост БД).

## CLI: создание/повышение администратора

После запуска API-контейнера:

```bash
docker exec -it fastapidelivery_api python -m app.cli.create_admin +79990001122 --name "Super Admin"
```

## Стратегия тестирования

В проекте используются два уровня тестов:

- **Unit-тесты (`backend/tests/unit`)**:
  - проверяют бизнес-логику сервисного слоя в изоляции;
  - используют `AsyncMock`/mock-репозитории и мок сессии БД;
  - валидируют доменные сценарии, например расчеты корзины и решения в order-flow.
- **Integration-тесты (`backend/tests/integration`)**:
  - проверяют API-уровень через FastAPI app с `httpx.AsyncClient` + `ASGITransport`;
  - используют dependency overrides для текущего пользователя и сервисов;
  - валидируют контракты эндпоинтов, статус-коды и структуру ответов.
- **Общие фикстуры (`backend/tests/conftest.py`)**:
  - переиспользуемый async-клиент и event loop setup.

Запуск тестов из директории `backend/`:

```bash
pytest -v
```

Отчет покрытия:

```bash
pytest -v --cov=app --cov-report=term-missing
```

## Roadmap

- Реализовать frontend-приложение в рамках запланированной monorepo-структуры.
- Добавить CI-пайплайн (линтеры, тесты, отчеты покрытия).
- Расширить доменную логику (промокоды, более детальные статусы доставки, уведомления).
- Усилить production-конфигурацию observability-инструментами (структурные логи, метрики, healthchecks).

## Лицензия

MIT
