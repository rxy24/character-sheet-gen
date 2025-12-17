import { ClassListDataProps, ClassModel } from "./class-models";

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

export interface Character {
    characterName: string;
    buildOwner: string;
    proficiencyBonus: number;
    passiveInsight: number;
    passiveInvestigation: number;
    passivePerception: number;
    hitPoints: HitPoints;
    armourClass: number;
    abilityScores: AbilityScore[];
    savingThrows: SaveScores[];
    classes: CharacterClass[];
    armour: Armour[];
    equipments?: Equipments[] | null;
    characterMisc: CharacterMisc[];
    characterAdditionalScores : CharacterAdditionalScores[];
}

export interface ClassLevelFieldProps {
    pageProps: CharacterDataProps;
}

export interface CharacterDataProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
}

export interface CharacterLevelDataProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    classListData : ClassModel[]
    setClassListData: React.Dispatch<React.SetStateAction<ClassModel[] | null>>;
}