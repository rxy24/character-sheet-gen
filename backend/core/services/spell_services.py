from backend.core.repositories.spell_repository import SpellRepository
from backend.core.domains.spell_models import Spells
from backend.core.domains.pagination import PaginationResults, create_pagination_result

class SpellService:
    def __init__(self, repo : SpellRepository) -> None:
        self.repo = repo

    
    async def get_list_of_spells(self, page : int, size : int, query : dict) -> PaginationResults:
        skip = max((page-1)*size, 1)
        item, total = await self.repo.list_spells(skip, size, query)
        spells = Spells(data=item)
        return create_pagination_result(
            page=page,
            size=size,
            items=spells.data, # type: ignore
            total=total # type: ignore
        )