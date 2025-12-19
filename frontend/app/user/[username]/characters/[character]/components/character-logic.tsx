import { AbilityScore, Character, CharacterClass, CharacterDataProps, InventoryItem, SaveScores } from "./character-models";

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

export function calculate_armour_class(characterModel : Character){
    const activeInventory : InventoryItem[] = characterModel.inventory.filter(item => item.isActive && item.type==='armour')

    let bodyAcValue: number = 0;
    let shieldAcValue : number = 0;
    let modifierAc: number = 0;
    for(const item of activeInventory){
        for(const effect of item.effects){
            if(effect.description.includes("modifier")){
                const modifierType = effect.value
                const modifierObj = characterModel.abilityScores.find(item=>item.abilityName === modifierType)
                const modValue = modifierObj? modifierObj.modifier : 0
                modifierAc = modifierAc + modValue
            } else if(effect.description.toLowerCase().includes("body armour")){
                bodyAcValue = Number(effect.value)
            } else if(effect.description.toLowerCase().includes("shield")){
                shieldAcValue = Number(effect.value)
            } else if(effect.description.includes("add")){
                bodyAcValue = bodyAcValue+Number(effect.value)
            }
        }
    }

    return bodyAcValue + shieldAcValue + modifierAc
}