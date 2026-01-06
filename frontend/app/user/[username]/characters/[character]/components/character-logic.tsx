import { AbilityScore, Character, CharacterClass, CharacterDataProps, CharacterSpellSlots, InventoryItem, SaveScores } from "./character-models";
import { ClassFeatureSpellNumbers } from "./class-models";

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

export function generate_spell_slot_updates(baseClassSpellSlots: ClassFeatureSpellNumbers[], currSpellSlotsList: CharacterSpellSlots[]): CharacterSpellSlots[] {
    const updatedSpellSlots: CharacterSpellSlots[] = []

    if (baseClassSpellSlots !== undefined) {
        for (const slot of baseClassSpellSlots) {
            const currSpellSlot = currSpellSlotsList.find(slots => slots.spellLevel === slot.spellLevel)
            if (currSpellSlot === undefined) {
                const newSpellSlot: CharacterSpellSlots = {
                    spellLevel: slot.spellLevel,
                    slotsRemaining: slot.amount,
                    additionalSlots: 0,
                    slotsTotal: slot.amount
                }
                updatedSpellSlots.push(newSpellSlot)
            } else {
                updatedSpellSlots.push({ ...currSpellSlot, slotsTotal: slot.amount })
            }
        }
    }

    return updatedSpellSlots
}

export function calculate_skill_roll(ability: string, proficiency : string, abilityScores : AbilityScore[]){
    const score : AbilityScore | undefined = abilityScores.find(item => item.abilityName === ability)
    let rollAmount : number = score? score.modifier : 0
    return calculate_skill_roll_add_prof(proficiency, rollAmount)
}

function calculate_skill_roll_add_prof(proficiency : string, rollAmount : number) : number {
    let profRollAmount : number = 0
    if(proficiency === undefined || proficiency.length === 0){
        profRollAmount = 0
    }
    if(proficiency === "half"){
        profRollAmount = 1
    } else if(proficiency === "prof"){
        profRollAmount = 2
    } else if(proficiency === "double"){
        profRollAmount = 4
    }

    return rollAmount + profRollAmount
}