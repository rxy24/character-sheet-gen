from pymongo.asynchronous.collection import AsyncCollection


class MongoBaseRepository:
    
    async def paginate(self, collections:AsyncCollection, filter_query : dict, page:int, size:int ):
        skip = (page - 1) * size
        cursor = collections.find(filter_query)
        cursor = cursor.skip(skip).limit(size)

        items = await cursor.to_list(length=size)
        total = await collections.count_documents(filter_query)
        return items, total
    
    def formatDynamicQuery(self, query : dict) -> dict:
        filter_dict = {}
        if any(value is not None for value in query.values()):
            for key, value in query.items():
                if value is not None:
                    if isinstance(value, list):
                        filter_dict[key] = {"$in" : value}
                    else:
                        filter_dict[key] = value
        return filter_dict