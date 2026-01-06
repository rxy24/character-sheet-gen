import { useEffect } from "react";
import { calculate_proficiency_bonus } from "./character-logic";
import { CharacterDataProps } from "./character-models";
import { PROFICIENCY_BONUS_FIELD } from "@/app/libs/constants";
import { Box, Grid } from "@mui/material";
import { CharacterMiscNumberField, SectionDivider } from "./character-fields";

export function CharacterPassiveField(props: CharacterDataProps) {
    const proficiencyCalc = calculate_proficiency_bonus(props)


    useEffect(() => {
        const profValue = props.formData.characterAdditionalScores.find(
            prof => prof.description === PROFICIENCY_BONUS_FIELD
        )?.value;

        if (profValue === undefined || profValue === proficiencyCalc) return;

        props.setFormData(prev => ({
            ...prev!,
            characterAdditionalScores: prev!.characterAdditionalScores.map(charClass =>
                charClass.description === PROFICIENCY_BONUS_FIELD
                    ? { ...charClass, value: proficiencyCalc }
                    : charClass
            ),
        }));
    }, [
        props.formData.characterAdditionalScores,
        proficiencyCalc,
    ]);


    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 12 }}>
                <SectionDivider sectionText="Passive Effects" />
            </Grid>

            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Proficiency Bonus"} disabled={true} props={props} overrideValue={proficiencyCalc} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Insight"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Investigation"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Passive Perception"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                <CharacterMiscNumberField label={"Movement"} disabled={true} props={props} />
            </Grid>
        </Grid>
    </Box>
}