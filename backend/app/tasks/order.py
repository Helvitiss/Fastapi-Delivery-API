import logging

from app.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(
    name="app.tasks.order.send_sms_for_customer",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=5,
)
def send_sms_for_customer(self, phone_number: str, order_id: int) -> None:
    logger.info(
        "Sending order confirmation SMS to %s for order %s",
        phone_number,
        order_id,
    )
