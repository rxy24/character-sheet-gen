export interface ClassFeatureEffects {
  name: string;
  description: string;
  value: string;
}

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
  actionType?: string | null;
  effects?: ClassFeatureEffects[] | null;
}

export interface ClassHitPoints {
  baseHp: number;
  modifier: string;
  baseIncreasePerLvl: number;
}

export interface SubClassModel {
  level: number;
  description: string;
  features: ClassFeature[];
}

export interface ClassFeatureSpellNumbers {
  spellLevel: number;
  amount: number;
}

export interface ClassFeatureNumbers {
  level: number;
  proficiencyBonus?: number | null;
  channelDivinity?: number | null;
  numOfSpells: ClassFeatureSpellNumbers[];
}

export interface ClassModel {
  className: string;
  version: string;
  hitPoints: ClassHitPoints;
  subClass: SubClassModel;
  features: ClassFeature[];
  featureTableData: ClassFeatureNumbers[];
}

export interface ClassListDataProps {
    classListData : ClassModel[]
    setClassListData: React.Dispatch<React.SetStateAction<ClassModel[] | null>>;
}