import {ClassModel } from "./class-models";

export interface CharacterMiscFieldProps {
    label: string;
    value: string;
    disabled: boolean;
    pageProps: CharacterDataProps;
}

export interface CharacterMiscFieldParams {
    label : string,
    disabled : boolean,
    overrideValue? : number 
    props : CharacterDataProps
}

export interface CharacterClass {
    className: string
    level: number
    isMain: boolean
}

export interface AbilityScore {
    abilityName: string
    value: number
    modifier: number
}

export interface AbilityScoreParams {
    props: CharacterDataProps
}

export interface SaveScores {
    abilityName: string
    modifier: number
    hasAdvantage: boolean

}

export interface SaveScoresParam {
    props : CharacterDataProps
}

export interface HitPoints {
    maxHp: number
    currentHp: number
}

export interface ArmourClass {
    armourClassValue: number
    tempArmourClassValue: number
}

export interface Effect {
  name: string;
  description: string;
  value: string;
}

export interface InventoryItem {
  name: string;
  description: string;
  type: string;

  isActive?: boolean;
  weight?: string;
  value?: string;
  notes?: string;

  effects: Effect[];
}

export interface Equipments {
    name: string;
    hit: number;
    attackNum: number;
    damage: string;
    range: string | null;
    type: string;
    notes: string;
}

export interface CharacterMisc {
    description: string;
    value: string;
}

export interface CharacterAdditionalScores {
    description: string;
    value: number;
}

export interface Armour {
    name: string;
    armourClass: number;
}

export interface Spell {
  id: string;
  spellName: string;
  spellLevel: number;
  school: string;
  castingTime: string;
  range: string;
  saves?: string;
  fullDescription: string;
  supportedClass: string[];
}

export interface CharacterSpells {
    spellName: string;
    spellLevel: number;
    school: string;
    castingTime: string;
    range: string;
    saves?: string;
    fullDescription: string;
    isActive?: Boolean 
    effects : Effect[]
}

export interface CharacterSpellSlots {
    spellLevel: number;
    slotsRemaining : number;
    slotsTotal : number;
    additionalSlots : number;
}

export interface CharacterLog {
    description: string;
    type : string;
}

export interface CharacterSkill {
    skillName : string;
    ability : string;
    proficiency : string;
    advantage : boolean;
}

export interface Character {
    characterName: string;
    buildOwner: string;
    proficiencyBonus: number;
    passiveInsight: number;
    passiveInvestigation: number;
    passivePerception: number;
    hitPoints: HitPoints;
    armourClass: ArmourClass;
    abilityScores: AbilityScore[];
    savingThrows: SaveScores[];
    skills: CharacterSkill[]
    classes: CharacterClass[];
    inventory: InventoryItem[]
    characterMisc: CharacterMisc[];
    characterAdditionalScores : CharacterAdditionalScores[];
    characterSpells: CharacterSpells[]
    characterSpellSlotInfo : CharacterSpellSlots[]
    characterLog : CharacterLog[]
}

export interface ClassLevelFieldProps {
    pageProps: CharacterDataProps;
}

export interface CharacterDataProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
}

export interface SpellDataProps {
    formData: Spell;
    setFormData: React.Dispatch<React.SetStateAction<Spell | null>>;
}

export interface CharacterLevelDataProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    classListData : ClassModel[]
    setClassListData: React.Dispatch<React.SetStateAction<ClassModel[] | null>>;
}

export interface CharacterSpelllDataProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    classListData : ClassModel[]
    setClassListData: React.Dispatch<React.SetStateAction<ClassModel[] | null>>;
}