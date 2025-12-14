from fastapi import APIRouter, Depends, status

from backend.core.domains.class_models import ClassModel, class_filter
from backend.core.domains.pagination import PaginationResults
from backend.core.repositories.class_repository import ClassRepository
from backend.core.services.class_services import ClassServices


router = APIRouter(prefix="/classes", tags=["classes"])

def get_class_service():
    repo = ClassRepository()
    return ClassServices(repo)

@router.get("/", response_model=PaginationResults, status_code=status.HTTP_200_OK)
async def get_class_list(
                     queryParam : dict = Depends(class_filter), 
                     page: int = 1, 
                     size: int = 100, 
                     service : ClassServices = Depends(get_class_service)
):
    result = await service.get_list_of_classes(page, size, queryParam)
    return result

@router.get("/{className}", response_model=ClassModel, status_code=status.HTTP_200_OK)
async def get_class(className : str, service : ClassServices = Depends(get_class_service)):
    return await service.get_classes(class_name=className)