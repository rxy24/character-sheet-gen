

from backend.core.domains.class_models import ClassModel, ClassModels
from backend.core.domains.pagination import PaginationResults, create_pagination_result
from backend.core.repositories.class_repository import ClassRepository


class ClassServices:
    def __init__(self, repo : ClassRepository) -> None:
        self.repo = repo

    
    async def get_list_of_classes(self, page : int, size : int, query : dict)  -> PaginationResults:
        skip = max((page-1)*size, 1)
        item, total = await self.repo.get_class_list(skip, size, query)
        class_models = ClassModels(data=item)

        return create_pagination_result(
            page=page,
            size=size,
            items=class_models.data, # type: ignore
            total=total # type: ignore
        )
    
    async def get_classes(self, class_name : str) -> ClassModel:
        result = await self.repo.get_class(class_name=class_name)
        return ClassModel(**result) # type: ignore