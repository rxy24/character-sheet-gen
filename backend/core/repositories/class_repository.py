from backend.core.repositories.mongo_repository_base import MongoBaseRepository
from pymongo.asynchronous.database import AsyncDatabase
from backend.core.db import get_mongo_db

collectionName = 'classes'

class ClassRepository(MongoBaseRepository):

    async def get_class(self, class_name : str):
        db : AsyncDatabase= next(get_mongo_db())
        results = await db.get_collection(collectionName).find({
            "className" : class_name
        }).to_list()

        if len(results) == 0:
            return {}
        else:
            return results[0]

    async def get_class_list(self, page:int, size: int, query : dict):
        db : AsyncDatabase= next(get_mongo_db())

        filter_dict = self.formatDynamicQuery(query=query)
        
        return await self.paginate(collections=db.get_collection(collectionName),
                                filter_query=filter_dict,
                                page=page,
                                size=size)
    
    async def update_class(self):
        pass

    async def create_class(self):
        pass

    async def delete_class(self):
        pass
    pass