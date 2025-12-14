
from backend.core.repositories.mongo_repository_base import MongoBaseRepository
from pymongo.asynchronous.database import AsyncDatabase
from backend.core.db import get_mongo_db

user_collection = 'users'

class UserRepository(MongoBaseRepository):

    async def get_user_info(self, username: str):
        db : AsyncDatabase= next(get_mongo_db())
        return await db.get_collection(user_collection).find_one({"username" : username})

    async def create_user_info(self, accountInsert : dict):
        db : AsyncDatabase= next(get_mongo_db())
        return await db.get_collection(user_collection).insert_one(accountInsert)

    async def update_user_info(self, username : str, query_dict : dict):
        filter_operation = {"username":username}
        update_dict = {}
        if any(value is not None for value in query_dict.values()):
            for key, value in query_dict.items():
                if value is not None:
                    update_dict[key] = value
        
        update_operation = {"$set" : update_dict}
        db : AsyncDatabase= next(get_mongo_db())

        return await db.get_collection(user_collection).update_one(filter=filter_operation, update=update_operation)

    async def delete_user_info(self, username : str):
        db : AsyncDatabase= next(get_mongo_db())

        return await db.get_collection(user_collection).delete_one({'username' : username})