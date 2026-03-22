# Food Delivery API

> Монорепо для сервиса доставки еды. На данный момент реализован backend: с чистой архитектурой, асинхронным стеком, фоновыми задачами через Celery и Redis, а также полным покрытием тестами. Frontend в разработке.

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Celery](https://img.shields.io/badge/Celery-5.6-37814A?logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Tests](https://img.shields.io/badge/Tests-27%20passed-brightgreen)](https://pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## О проекте

Полноценный REST API для сервиса доставки еды. Проект написан с упором на **правильную структуру кода**: каждый слой отвечает ровно за одну задачу, зависимости инжектируются явно, бизнес-логика полностью изолирована от инфраструктуры и покрыта тестами.

Это не учебный CRUD: здесь реализованы OTP-авторизация без пароля, умная корзина с агрегацией, заказы со снимком цены на момент оформления и ролевая модель с разделением на пользовательский и административный контуры.

Дополнительно проект теперь использует **Celery + Redis** для фоновых задач:

- отправка OTP-кода пользователю
- логирование SMS после создания заказа

---

## Архитектура

Проект построен по принципу **Layered Architecture**: каждый слой зависит только от нижележащего, а не от соседнего или верхнего.

```text
┌─────────────────────────────────────┐
│         API Layer (Routers)         │  HTTP-эндпоинты, валидация входных данных
├─────────────────────────────────────┤
│       Service Layer (Services)      │  Бизнес-логика, оркестрация
├─────────────────────────────────────┤
│   Repository Layer (Repositories)   │  Доступ к данным, SQL-запросы
├─────────────────────────────────────┤
│        Data Layer (Models)          │  SQLAlchemy ORM модели
└─────────────────────────────────────┘
```

Такой подход даёт три конкретных преимущества:

- **Тестируемость** — сервисы тестируются без базы данных, через моки репозиториев
- **Заменяемость** — инфраструктурные детали не протекают в бизнес-логику
- **Читаемость** — каждый файл делает ровно одно дело, его объём предсказуем

### Структура проекта

```text
backend/
├── app/
│   ├── api/v1/
│   │   ├── admin/         # Эндпоинты для администраторов
│   │   └── user/          # Публичные эндпоинты
│   ├── core/              # Настройки, БД, исключения, безопасность
│   ├── dependencies/      # DI-контейнер (FastAPI Depends)
│   ├── models/            # SQLAlchemy-модели
│   ├── repositories/      # Слой доступа к данным
│   ├── schemas/           # Pydantic-схемы (DTO)
│   ├── services/          # Бизнес-логика
│   ├── tasks/             # Celery-задачи
│   ├── cli/               # CLI-команды
│   ├── celery_app.py      # Конфигурация Celery
│   └── main.py            # Точка входа FastAPI
└── tests/
    ├── unit/              # Тесты сервисов
    └── integration/       # Тесты API
```

---

## Технологический стек

| Категория | Технология |
|---|---|
| **Framework** | FastAPI (async) |
| **База данных** | PostgreSQL 16 + SQLAlchemy 2.0 |
| **Валидация** | Pydantic v2 |
| **Миграции** | Alembic |
| **Авторизация** | JWT + OTP |
| **Фоновые задачи** | Celery + Redis |
| **Инфраструктура** | Docker, Docker Compose, uv |
| **Тесты** | Pytest, pytest-asyncio, pytest-cov |
| **Линтинг** | Ruff |

---

## Ключевые возможности

### OTP-авторизация

Вход без пароля: пользователь получает одноразовый код на телефон. Код сохраняется в базе, а отправка SMS вынесена в Celery-task.

### Корзина

Корзина создаётся автоматически при первом обращении. При добавлении одного блюда дважды количество суммируется, а не создаётся дубликат. Итоговая стоимость считается на сервере.

### Заказы

При оформлении заказа цена и название блюда **фиксируются** в `order_items`, поэтому история заказа не ломается даже при изменениях меню. После создания заказа в фон уходит задача логирования SMS-подтверждения.

### Ролевая модель

Все `/admin` маршруты защищены зависимостью `is_admin`. Обычный пользователь получит `403` ещё до вызова сервисного слоя.

### Загрузка изображений

Поддерживается загрузка фотографий блюд с хранением на диске и раздачей через `StaticFiles` по пути `/media`.

---

## Фоновые задачи

В проекте подключены Celery и Redis.

Сейчас зарегистрированы задачи:

- `app.tasks.auth.send_otp_code_task`
- `app.tasks.order.send_sms_for_customer`

Запуск worker локально из `backend/`:

```bash
uv run celery -A app.celery_app.celery_app worker --loglevel=info
```

В Docker Compose worker поднимается автоматически.

---

## Тестирование

Проект покрыт unit- и integration-тестами.

```text
tests/
├── unit/              # Тесты сервисов через AsyncMock
└── integration/       # Тесты API через httpx.AsyncClient
```

Запуск тестов:

```bash
cd backend
uv run pytest
```

С отчётом покрытия:

```bash
cd backend
uv run pytest --cov=app --cov-report=term-missing
```

Unit-тесты не зависят от Redis: вызовы `.delay()` замоканы там, где сервисы публикуют Celery-задачи.

---

## Быстрый старт

### Через Docker (рекомендуется)

```bash
# 1. Скопировать конфигурацию
cp backend/.env.example backend/.env

# 2. Запустить всё окружение
docker compose up -d --build
```

Для Windows PowerShell:

```powershell
Copy-Item backend\.env.example backend\.env
docker compose up -d --build
```

После запуска будут подняты:

- `db` — PostgreSQL
- `redis` — Redis broker
- `migrate` — Alembic миграции
- `api` — FastAPI
- `worker` — Celery worker

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

Логи:

```bash
docker compose logs -f api
docker compose logs -f worker
```

### Локально

```bash
cd backend
uv sync --extra dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Если нужны PostgreSQL и Redis, проще поднять их через Docker Compose.

### Создание администратора

```bash
docker compose exec api uv run python -m app.cli.create_admin +79990001122 --name "Admin"
```

Команда создаёт пользователя с ролью `admin` или повышает существующего.

---

## Конфигурация

Все настройки задаются через `backend/.env`.

Основные переменные:

| Переменная | Описание |
|---|---|
| `SECRET_KEY` | Ключ подписи JWT |
| `DB_URL` | URL подключения к PostgreSQL |
| `ALGORITHM` | Алгоритм JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни access token |
| `OTP_EXPIRE_MINUTES` | Время жизни OTP-кода |
| `CELERY_BROKER_URL` | Redis broker для Celery |
| `CELERY_RESULT_BACKEND` | Redis backend для результатов Celery |

Для Docker Compose:

```env
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/1
```

---

## API: основные маршруты

| Метод | Маршрут | Описание |
|---|---|---|
| `POST` | `/auth/request-code` | Запросить OTP-код |
| `POST` | `/auth/login` | Войти по OTP, получить JWT |
| `GET` | `/dishes/` | Список доступных блюд |
| `GET` | `/categories/` | Список категорий |
| `GET` | `/cart/` | Содержимое корзины |
| `POST` | `/cart/items` | Добавить блюдо в корзину |
| `POST` | `/orders/` | Оформить заказ |
| `GET` | `/orders/` | Мои заказы |
| `GET` | `/admin/orders/` | Все заказы (admin) |
| `PATCH` | `/admin/orders/{id}/status` | Изменить статус заказа (admin) |

Полная документация доступна в Swagger: `/docs`

---

## Линтинг и форматирование

```bash
cd backend
uv run ruff check .
uv run ruff check . --fix
uv run ruff format .
```

Конфигурация Ruff и Pytest хранится в `backend/pyproject.toml`.

---

## Лицензия

[MIT](LICENSE)
