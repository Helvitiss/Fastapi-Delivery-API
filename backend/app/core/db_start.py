import asyncio
from app.models import *
from app.core.database import create_db_and_tables

if __name__ == '__main__':
    asyncio.run(create_db_and_tables())