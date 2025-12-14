

from backend.core.domains.character_models import Character, CharacterList
from backend.core.domains.pagination import PaginationResults, create_pagination_result
from backend.core.repositories.character_repository import CharacterRepository


class CharacterServices:
    def __init__(self, repo : CharacterRepository) -> None:
        self.repo = repo

    
    async def get_list_of_characters(self, page : int, size : int, query : dict, build_owner : str)  -> PaginationResults:
        skip = max((page-1)*size, 1)
        item, total = await self.repo.get_character_list(skip, size, query, build_owner)
        class_models = CharacterList(data=item)

        return create_pagination_result(
            page=page,
            size=size,
            items=class_models.data, # type: ignore
            total=total # type: ignore
        )
    
    async def get_character(self, character_name : str, build_owner : str) -> Character:
        result = await self.repo.get_character(character_name=character_name, build_owner=build_owner)
        return Character(**result) # type: ignore