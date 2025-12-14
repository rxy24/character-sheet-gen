from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from backend.core.config import settings
from collections.abc import Generator

mongoEngine = AsyncMongoClient(settings.MONGODB_URI)
db = mongoEngine[settings.MONGODB_DB]

def get_mongo_db() -> Generator[AsyncDatabase, None, None]:
    '''
    Retrieve an instance of mongodb connection
    '''
    try:
        yield db
    finally:
        pass