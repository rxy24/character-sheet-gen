from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class HitPoints(BaseModel):
    model_config = ConfigDict(extra="ignore")
    maxHp: int
    currentHp: int


class AbilityScore(BaseModel):
    model_config = ConfigDict(extra="ignore")
    abilityName: str
    value: int
    modifier: int


class SavingThrow(BaseModel):
    model_config = ConfigDict(extra="ignore")
    abilityName: str
    modifier: int
    hasAdvantage: bool


class CharacterClass(BaseModel):
    model_config = ConfigDict(extra="ignore")
    className: str
    level: int


class Armour(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    armourClass: int


class Equipment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    hit: int
    attackNum: int
    damage: str
    range: Optional[str]
    type: str
    notes: Optional[str] = None
    ammoRemaining: Optional[int] = None

class CharacterMisc(BaseModel):
    model_config = ConfigDict(extra="ignore")
    description: Optional[str]
    value: Optional[str]

class CharacterAdditionalScores(BaseModel):
    model_config = ConfigDict(extra="ignore")
    description: Optional[str]
    value: Optional[int]

class Character(BaseModel):
    model_config = ConfigDict(extra="ignore")
    characterName: str
    buildOwner: str
    hitPoints: HitPoints
    armourClass: int
    abilityScores: List[AbilityScore]
    savingThrows: List[SavingThrow]
    classes: List[CharacterClass]
    armour: List[Armour]
    equipments: Optional[List[Equipment]] = None
    characterMisc: Optional[List[CharacterMisc]] = None
    characterAdditionalScores : Optional[List[CharacterAdditionalScores]] = None

class CharacterList(BaseModel):
    data : list[Character]



def character_filter(
    characterName: Optional[str] = None,

    # Nested filters (optional)
    abilityName: Optional[str] = None,
    className: Optional[str] = None,
    armourName: Optional[str] = None,
    equipmentName: Optional[str] = None,
):
    """
    Produces a dict of provided (non-None) filters.
    Works similarly to your class_filter function.
    """
    return {k: v for k, v in locals().items() if v is not None}