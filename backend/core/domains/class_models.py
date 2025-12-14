from typing import Optional
from pydantic import BaseModel, ConfigDict


class ClassFeatureEffects(BaseModel):
    model_config = ConfigDict(extra="ignore", coerce_numbers_to_str=True)
    description : str
    value : Optional[str] = None

class ClassFeature(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name : str
    level : int
    description : str
    actionType : Optional[str] = None
    effects : Optional[list[ClassFeatureEffects]] = None

class ClassHitPoints(BaseModel):
    model_config = ConfigDict(extra="ignore")
    baseHp : int
    modifier : str
    baseIncreasePerLvl : int

class SubClassModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    level : int
    description : str
    features : list[ClassFeature]

class ClassFeatureSpellNumbers(BaseModel):
    model_config = ConfigDict(extra="ignore")
    spellLevel : int
    amount : int

class ClassFeatureNumbers(BaseModel):
    model_config = ConfigDict(extra="ignore")
    level : int
    proficiencyBonus : Optional[int]
    channelDivinity : Optional[int]
    numOfSpells : list[ClassFeatureSpellNumbers]

class ClassModel(BaseModel):
    model_config = ConfigDict(extra="ignore")
    className : str
    version : str
    hitPoints : ClassHitPoints
    subClass : SubClassModel
    features : list[ClassFeature]
    featureTableData : list[ClassFeatureNumbers]

class ClassModels(BaseModel):
    model_config = ConfigDict(extra="ignore")
    data : list[ClassModel]


def class_filter(
    className : Optional[str] = None,
    version : Optional[str] = None
):
    return {k: v for k, v in locals().items() if v is not None}