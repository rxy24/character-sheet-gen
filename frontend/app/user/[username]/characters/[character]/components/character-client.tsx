'use client'

import { useEffect, useState } from "react";
import { fetchCharacter } from "../../../../../libs/character-data";
import { CharacterLevelField, CharacterNameField, CharacterMiscField, SectionDivider, CharacterAbilityTable, CharacterSaveTable, HealthPointInfo, ArmourClassInfo, CharacterMiscNumberField, EquipmentTable, ArmourTable, ClassLevelTable } from './character-fields';
import { Container, Grid, Box } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { AbilityScore, Armour, Character, CharacterDataProps, Equipments, HitPoints, SaveScores } from "./character-models";
import { calculate_ability_score_modifiers, calculate_proficiency_bonus, calculate_save_score_modifiers, character_level_calculation } from './character-logic'

const queryClient = new QueryClient()

function CharacterClientContent({character} : {character : string}) {
    const { data, isLoading } = useQuery({
        queryKey: [character.replaceAll("%20", "_") + "_Char_Profile"],
        queryFn: () => fetchCharacter({ name: character}),
        select: (res) => res.items[0]
    });
    const [formData, setFormData] = useState<Character | null>(null);

    useEffect(() => {
        if (data) setFormData(data)
    }, [data]);

    if (isLoading || !formData) return <div>Loading…</div>;

    return (
        <Container maxWidth="lg">
            <CharacterGeneralInfoModule formData={formData} setFormData={setFormData} />
            <SectionDivider sectionText="Character Core" />
            <CharacterLevelTableModule formData={formData} setFormData={setFormData} />
            <AbilitySaveScoresInfo formData={formData} setFormData={setFormData} />
            <CharacterGeneralInfoAdditionalAbilities formData={formData} setFormData={setFormData} />
            <SectionDivider sectionText="Combat" />
            <CombatInfo charModel={formData} />
            <CombatEquipmentTableInfo charModel={formData} />
        </Container>
    );
}

export function CharacterGeneralInfoModule(props: CharacterDataProps) {
    const charName: string = props.formData.characterName;

    const characterLevel: number = character_level_calculation(props.formData.classes)

    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterNameField name={charName} disabled={true} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterLevelField levelValue={characterLevel} disabled={true} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Deity"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Race"} disabled={true}  props={props}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Background"} disabled={true}  props={props}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Alignment"} disabled={true}  props={props}/>
            </Grid>
        </Grid>
    </Box>
}

export function CharacterGeneralInfoAdditionalAbilities(props: CharacterDataProps) {
    const proficiencyCalc = calculate_proficiency_bonus(props)


    useEffect(() => {
        const profValue = props.formData.characterAdditionalScores.find(
            prof => prof.description === "Proficiency Bonus"
        )?.value;
        
        if (profValue === undefined || profValue === proficiencyCalc) return; // safety check

        props.setFormData(prev => ({
            ...prev!,
            characterAdditionalScores: prev!.characterAdditionalScores.map(charClass =>
                charClass.description === "Proficiency Bonus"
                    ? { ...charClass, value: proficiencyCalc }
                    : charClass
            ),
        }));
    }, [
        props.formData.characterAdditionalScores, // array reference as dependency
        proficiencyCalc,                          // include the new computed value
    ]);


    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Proficiency Bonus"} disabled={true} props={props} overrideValue={proficiencyCalc}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Insight"} disabled={true} props={props}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Investigation"} disabled={true} props={props}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Perception"} disabled={true} props={props}/>
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Movement"} disabled={true} props={props}/>
            </Grid>
        </Grid>
    </Box>
}

export function CharacterLevelTableModule(charProps: CharacterDataProps) {
    return <Box sx={{ margin: 2 }}>
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Class Info" />
                <ClassLevelTable pageProps={charProps}/>
            </Grid>
        </Grid>
    </Box>
}

export function AbilitySaveScoresInfo(props: CharacterDataProps) {
    useEffect(() => {

        const oldScores = props.formData.abilityScores;
        const newScores = oldScores.map(score => ({
            ...score,
            modifier: calculate_ability_score_modifiers(score),
        }));
        const noChanges = newScores.every(
            (newScore, i) => newScore.modifier === oldScores[i].modifier
        );

        if (noChanges) {
            return;
        }
        props.setFormData(prev => ({
            ...prev!,
            abilityScores: newScores,
        }));
    }, [
        props.formData.abilityScores,
        
    ]);

    useEffect(() => {

        const oldSaves = props.formData.savingThrows;
        const abilityScores: AbilityScore[] = props.formData.abilityScores;
        const proficiencyBonus: number = props.formData.characterAdditionalScores.find(x => x.description === "Proficiency Bonus")?.value ?? 0
        const newSaves = oldSaves.map(score => ({
            ...score,
            modifier: calculate_save_score_modifiers(score, abilityScores, proficiencyBonus),
        }));
        const noChanges = newSaves.every(
            (newSaves, i) => newSaves.modifier === oldSaves[i].modifier
        );

        if (noChanges) {
            return;
        }
        props.setFormData(prev => ({
            ...prev!,
            savingThrows: newSaves,
        }));
    }, [
        props.formData.abilityScores,
        props.formData.savingThrows,
        props.formData.characterAdditionalScores
    ]);

    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Ability Info" />
                <CharacterAbilityTable props={props} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Save Info" />
                <CharacterSaveTable props={props} />
            </Grid>
        </Grid>
    </Box>
}

export function CombatInfo({ charModel }: { charModel: any }) {
    const hpModel: HitPoints = charModel.hitPoints
    const armourClassValue: number = charModel.armourClass

    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
                <HealthPointInfo hpModel={hpModel} />

            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
                <ArmourClassInfo armourClass={armourClassValue} />
            </Grid>
        </Grid>
    </Box>
}

export function CombatEquipmentTableInfo({ charModel }: { charModel: any }) {
    const equipmentList: Equipments[] = charModel.equipments
    const armours: Armour[] = charModel.armour

    return <Box sx={{ margin: 2, width: '100%', overflowX: 'auto' }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Equipments" />
                <EquipmentTable equipments={equipmentList} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Armour" />
                <ArmourTable armours={armours} />
            </Grid>
        </Grid>
    </Box>
}

interface CharacterUrlProp {
    characterSlug : string
}

export default function CharacterClientPage({ characterSlug }: CharacterUrlProp) {
    return (
        <QueryClientProvider client={queryClient}>
            <CharacterClientContent character={characterSlug}/>
        </QueryClientProvider>
    );
}