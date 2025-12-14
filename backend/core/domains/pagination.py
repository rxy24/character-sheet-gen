from typing import TypeVar, List
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")

class PaginationResults(BaseModel):
    model_config = ConfigDict(extra="ignore")
    page : int
    size : int
    total : int
    pages : int
    items : List[T] # type: ignore

def create_pagination_result(page: int,size: int, total: int, items: list)-> PaginationResults:
    pages = (total + size - 1) // size
    return PaginationResults(page=page, size=size, total=total, pages=pages, items=items)