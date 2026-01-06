import { Box, Grid } from "@mui/material";
import { SectionDivider } from "./character-fields";
import { AbilityScore, AbilityScoreParams, CharacterDataProps, SaveScores, SaveScoresParam } from "./character-models";
import { useEffect, useState } from "react";
import { calculate_ability_score_modifiers, calculate_save_score_modifiers } from "./character-logic";
import { DataGrid, GridCellParams, GridColDef, GridRowModel } from "@mui/x-data-grid";
import CheckIcon from '@mui/icons-material/FiberManualRecord';

export function CharacterAbilityTable(charProps: AbilityScoreParams) {
    const abilityScoreData: AbilityScore[] = charProps.props.formData.abilityScores
    const columns: GridColDef[] = [
        { field: "abilityName", headerName: "Ability", flex: 1 },
        { field: "value", headerName: "Value", flex: 1, editable: true },
        {
            field: "modifier", headerName: "Modifier", flex: 1,
            renderCell: (params: GridCellParams) => {
                const value = params.value as number | null;
                if (value == null) return "";
                return value > 0 ? `+${value}` : `${value}`;
            }
        }
    ];

    const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const newAbilityValue = Number(newRow.value);
        charProps.props.setFormData(prev => prev
            ? {
                ...prev,
                abilityScores: prev.abilityScores.map(charAbilityScore =>
                    charAbilityScore.abilityName === newRow.abilityName ? { ...charAbilityScore, value: newAbilityValue } : charAbilityScore
                )
            }
            : prev
        );
        return newRow
    }

    const rows = abilityScoreData
    return (
        <div>
            <DataGrid
                getRowId={(row) => row.abilityName}
                rows={rows}
                columns={columns}
                hideFooter={true}
                processRowUpdate={handleProcessRowUpdate}
                density="compact"
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                autoHeight
            />
        </div>
    )
}

export function CharacterSaveTable(charProps: SaveScoresParam) {
    const columns: GridColDef[] = [
        { field: "abilityName", headerName: "Ability", flex: 1 },
        {
            field: "modifier", headerName: "Modifier", flex: 1,
            renderCell: (params: GridCellParams) => {
                const value = params.value as number | null;
                if (value == null) return "";
                return value > 0 ? `+${value}` : `${value}`;
            }
        },
        {
            field: "hasAdvantage", headerName: "Proficency", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return params.value ? <CheckIcon color="success" /> : null;
            }
        }
    ];

    const saveScoreModel: SaveScores[] = charProps.props.formData.savingThrows
    const [rows, setRows] = useState(saveScoreModel);

    useEffect(() => {
        setRows(charProps.props.formData.savingThrows);
    }, [charProps.props.formData.savingThrows]);

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== "hasAdvantage") return;

        setRows((prev) =>
            prev.map((row) =>
                row.abilityName === params.id
                    ? { ...row, hasAdvantage: !row.hasAdvantage }
                    : row
            )
        )
        charProps.props.setFormData(prev =>
            prev
                ? {
                    ...prev,
                    savingThrows: prev.savingThrows.map((saveModel) =>
                        saveModel.abilityName === params.id
                            ? { ...saveModel, hasAdvantage: !saveModel.hasAdvantage }
                            : saveModel
                    ),
                }
                : prev
        );
    };

    const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const newSaveValue = Number(newRow.modifier);
        charProps.props.setFormData(prev => prev
            ? {
                ...prev,
                savingThrows: prev.savingThrows.map(charSaveScore =>
                    charSaveScore.abilityName === newRow.abilityName ? { ...charSaveScore, modifier: newSaveValue } : charSaveScore
                )
            }
            : prev
        );
        return newRow
    }
    return (
        <div>
            <DataGrid
                getRowId={(row) => row.abilityName}
                rows={rows}
                columns={columns}
                hideFooter={true}
                density="compact"
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                autoHeight
                onCellClick={handleCellClick}
                processRowUpdate={handleProcessRowUpdate}
            />
        </div>
    )
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