from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


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
    isMain: bool


class Effect(BaseModel):
    name: str
    description: str
    value: str


class InventoryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    description: str
    type: str

    isActive: Optional[bool] = None
    weight: Optional[str] = ""
    value: Optional[str] = ""
    notes: Optional[str] = ""

    effects: List[Effect] = Field(default_factory=list)

class CharacterMisc(BaseModel):
    model_config = ConfigDict(extra="ignore")
    description: Optional[str]
    value: Optional[str]

class CharacterAdditionalScores(BaseModel):
    model_config = ConfigDict(extra="ignore")
    description: Optional[str]
    value: Optional[int]

class ArmourClass(BaseModel):
    armourClassValue: int
    tempArmourClassValue : int

class CharacterSpells(BaseModel):
    model_config = ConfigDict(extra="ignore")
    spellName: str
    spellLevel: int
    school: str
    castingTime: str
    range: str
    saves: Optional[str] = None
    fullDescription: str
    isActive: Optional[bool] = None
    effects: List[Effect]

class CharacterSpellSlots(BaseModel):
    model_config = ConfigDict(extra="ignore")
    spellLevel: int
    slotsRemaining: int
    slotsTotal: int
    additionalSlots: int

class CharacterLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    description: str
    type : str

class Character(BaseModel):
    model_config = ConfigDict(extra="ignore")
    characterName: str
    buildOwner: str
    hitPoints: HitPoints
    armourClass: ArmourClass
    abilityScores: List[AbilityScore]
    savingThrows: List[SavingThrow]
    classes: List[CharacterClass]
    inventory: Optional[List[InventoryItem]] = None
    characterMisc: Optional[List[CharacterMisc]] = None
    characterAdditionalScores : Optional[List[CharacterAdditionalScores]] = None
    characterSpells : Optional[List[CharacterSpells]] = None
    characterSpellSlotInfo : Optional[List[CharacterSpellSlots]] = None
    characterLog : Optional[List[CharacterLog]] = None

class CharacterList(BaseModel):
    data : list[Character]



def character_filter(
    characterName: Optional[str] = None,

    # Nested filters (optional)
    abilityName: Optional[str] = None,
    className: Optional[str] = None,
):
    """
    Produces a dict of provided (non-None) filters.
    Works similarly to your class_filter function.
    """
    return {k: v for k, v in locals().items() if v is not None}