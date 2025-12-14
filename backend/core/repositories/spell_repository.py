from pymongo.asynchronous.database import AsyncDatabase
from backend.core.db import get_mongo_db

from backend.core.repositories.mongo_repository_base import MongoBaseRepository


collectionName = 'spells'

class SpellRepository(MongoBaseRepository):
    async def list_spells(self, page:int, size: int, query : dict):
        db : AsyncDatabase= next(get_mongo_db())

        filter_dict = self.formatDynamicQuery(query=query)
        
        return await self.paginate(collections=db.get_collection(collectionName),
                                filter_query=filter_dict,
                                page=page,
                                size=size)