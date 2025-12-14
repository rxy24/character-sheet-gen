from backend.core.repositories.mongo_repository_base import MongoBaseRepository
from pymongo.asynchronous.database import AsyncDatabase
from backend.core.db import get_mongo_db

collectionName = 'characters'

class CharacterRepository(MongoBaseRepository):

    async def get_character(self, build_owner : str, character_name : str):
        db : AsyncDatabase= next(get_mongo_db())
        results = await db.get_collection(collectionName).find({
            "buildOwner" : build_owner,
            "characterName" : character_name
        }).to_list()

        if len(results) == 0:
            return {}
        else:
            return results[0]

    async def get_character_list(self, page:int, size: int, query : dict, build_owner : str):
        db : AsyncDatabase= next(get_mongo_db())

        query["buildOwner"] = build_owner

        filter_dict = self.formatDynamicQuery(query=query)
        
        return await self.paginate(collections=db.get_collection(collectionName),
                                filter_query=filter_dict,
                                page=page,
                                size=size)
    
    async def update_character(self):
        pass

    async def create_character(self):
        pass

    async def delete_character(self):
        pass
    pass