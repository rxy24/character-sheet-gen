
from backend.core.domains.spell_models import spell_filter
from backend.core.domains.pagination import PaginationResults
from backend.core.services.spell_services import SpellService
from backend.core.repositories.spell_repository import SpellRepository
from fastapi import APIRouter, Depends, Header, status, Query
from backend.core.security import oauth2_scheme

router = APIRouter(prefix="/spells", tags=["spells"])

def get_spell_service() -> SpellService:
    repo = SpellRepository()
    return SpellService(repo)

@router.get("/", response_model=PaginationResults, status_code=status.HTTP_200_OK)
async def get_spells(
                     queryParam : dict = Depends(spell_filter), 
                     page: int = 1, 
                     size: int = 100, 
                     service : SpellService = Depends(get_spell_service)
                     ):  
    result = await service.get_list_of_spells(page, size, queryParam)
    return result