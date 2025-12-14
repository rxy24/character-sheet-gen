import { AbilityScore, CharacterClass, CharacterDataProps, SaveScores } from "./character-models";

export function calculate_proficiency_bonus(props: CharacterDataProps): number {
    const characterLevel: number = character_level_calculation(props.formData.classes)
    const proficiencyNumber: number = Math.ceil(characterLevel/4) + 1;
    return proficiencyNumber
}

export function character_level_calculation(characterClasses : CharacterClass[]): number{
    return characterClasses.reduce(
        (accumulator, currentClass) => { return accumulator + currentClass.level; }, 0)
}

export function calculate_ability_score_modifiers(abilityScore : AbilityScore){
    return Math.floor(abilityScore.value/2) - 5
}

export function calculate_save_score_modifiers(saveScore: SaveScores, abilityScoreList : AbilityScore[], proficiencyBonus : number) : number{
    const abilityScore = abilityScoreList.find(x => x.abilityName === saveScore.abilityName)
    
    if(!abilityScore || !saveScore){
        return 0
    }

    const profBonusClean = proficiencyBonus?? 0
    
    return (saveScore.hasAdvantage ? profBonusClean : 0) + abilityScore.modifier
}