from fastapi import APIRouter, Depends, status

from backend.core.domains.character_models import Character, character_filter
from backend.core.domains.pagination import PaginationResults
from backend.core.repositories.character_repository import CharacterRepository
from backend.core.services.character_services import CharacterServices
from backend.core.security import User, get_current_user

from typing import Annotated


router = APIRouter(prefix="/characters", tags=["characters"])

def get_character_service():
    repo = CharacterRepository()
    return CharacterServices(repo)

@router.get("/", response_model=PaginationResults, status_code=status.HTTP_200_OK)
async def get_character_list(
                    currentUser : Annotated[User, Depends(get_current_user)],
                    queryParam : dict = Depends(character_filter), 
                    page: int = 1, 
                    size: int = 100, 
                    service : CharacterServices = Depends(get_character_service),
                     
):
    
    result = await service.get_list_of_characters(page, size, queryParam, currentUser.username)
    return result

@router.get("/{characterName}", response_model=Character, status_code=status.HTTP_200_OK)
async def get_character(currentUser : Annotated[User, Depends(get_current_user)],
                    characterName : str, 
                    service : CharacterServices = Depends(get_character_service)):
    return await service.get_character(character_name=characterName, build_owner=currentUser.username)