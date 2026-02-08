import asyncio

from app.core.database import create_db_and_tables, Base
from app.models import *

if __name__ == '__main__':
    asyncio.run(create_db_and_tables())