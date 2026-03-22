import logging

from app.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=5,
)
def send_otp_code_task(self, phone_number: str, code: str) -> None:
    logger.info("Sending OTP code %s to %s", code, phone_number)