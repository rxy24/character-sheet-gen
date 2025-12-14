from typing import Optional, List, TypeVar
from pydantic import BaseModel, ConfigDict
from fastapi import Query

T = TypeVar("T")

class Spell(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id : str
    spellName :str
    spellLevel: int
    school: str
    castingTime: str
    range: str
    saves: Optional[str]
    fullDescription: str
    supportedClass : list[str]

class Spells(BaseModel):
    model_config = ConfigDict(extra="ignore")
    data : list[Spell]

def spell_filter(
    id : Optional[str] = None,
    spellName :Optional[str] = None,
    spellLevel: Optional[int] = None,
    school: Optional[str] = None,
    castingTime: Optional[str] = None,
    range: Optional[str] = None,
    saves: Optional[str] = None,
    fullDescription: Optional[str] = None,
    supportedClass : Optional[List[str]] = Query(None)
):
    return {k: v for k, v in locals().items() if v is not None}
