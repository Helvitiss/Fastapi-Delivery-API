import uuid
from logging import getLogger

import aiofiles
from pathlib import Path
from fastapi import UploadFile


from app.core.config import MEDIA_ROOT, MEDIA_URL


class LocalStorageService:

    def __init__(self):
        self.media_root = MEDIA_ROOT
        self.media_url = MEDIA_URL

    async def save_dish_image(self, file: UploadFile) -> str:
        if not file.content_type.startswith("image/"):
            raise ValueError("File must be an image")

        extension = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{extension}"

        relative_path = f"dishes/{filename}"
        full_path = self.media_root / relative_path



        async with aiofiles.open(full_path, "wb") as buffer:
            content = await file.read()
            await buffer.write(content)

        return f"{self.media_url}/{relative_path}"

    def delete_file(self, image_url: str):
        relative_path = image_url.replace(self.media_url + "/", "")
        full_path = self.media_root / relative_path
        getLogger().info(f"Delete {full_path}")
        if full_path.exists():
            full_path.unlink()

