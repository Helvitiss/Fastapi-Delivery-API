from celery import Celery
from app.core.config import settings




celery_app = Celery(
    brocker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    task_ignore_result=True,
    broker_connection_retry_on_startup=True,
)


celery_app.autodiscover_tasks(["app.tasks"])