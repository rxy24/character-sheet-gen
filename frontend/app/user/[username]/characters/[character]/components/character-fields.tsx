
"use client";
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridCellParams, GridRowModel } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/FiberManualRecord';
import { useEffect, useState } from "react";
import { AbilityScore, AbilityScoreParams, CharacterDataProps, CharacterMiscFieldParams, HitPoints, SaveScores, SaveScoresParam } from "./character-models";

export function CharacterLevelField({ levelValue, disabled }: { levelValue: number, disabled: boolean }) {
    const options = [];
    for (let i: number = 0; i < 21; i++) {
        options.push({ value: i, label: i })
    }

    const selectedValue = levelValue ? levelValue : 0
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                    labelId="character-level-dropdown"
                    id="outlined-basic"
                    name="character-level-dropdown"
                    variant="outlined"
                    value={selectedValue}
                    disabled={disabled}
                    type='text'
                    label="Level"
                >
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>

    )
}

export function CharacterNameField({ name, disabled }: { name: string, disabled: boolean }) {
    return (
        <div>
            <TextField
                disabled={disabled}
                id="outlined-basic"
                label="Name"
                variant="outlined"
                defaultValue={name}
            />
        </div>

    )
}


export function CharacterMiscField(charMiscProp: CharacterMiscFieldParams) {
    const misc = charMiscProp.props.formData.characterMisc.find(
        (misc) => misc.description === charMiscProp.label
    );

    const miscValue = misc?.value ?? " ";

    return (
        <div>
            <TextField
                disabled={charMiscProp.disabled}
                id={charMiscProp.label + "-misc-field"}
                label={charMiscProp.label}
                variant="outlined"
                value={miscValue}
            />
        </div>

    )
}


export function CharacterMiscNumberField(fieldParams: CharacterMiscFieldParams) {
    const misc = fieldParams.props.formData.characterAdditionalScores.find(
        (misc) => misc.description === fieldParams.label
    );

    const miscValueInit = misc?.value ?? 0;
    const miscValue = fieldParams?.overrideValue ?? miscValueInit

    return (
        <div>
            <TextField
                disabled={fieldParams.disabled}
                id={fieldParams.label + "misc-number-field"}
                label={fieldParams.label}
                variant="outlined"
                value={miscValue}
            />
        </div>

    )
}

export function CharacterMovementField({ movement, disabled }: { movement: number, disabled: boolean }) {
    return (
        <div>
            <TextField
                disabled={disabled}
                id="outlined-basic"
                label="Movement"
                variant="outlined"
                defaultValue={movement}
            />
        </div>

    )
}

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

export function SectionDivider({ sectionText, color = "#23486D" }: { sectionText: string, color?: string }) {
    return (
        <Box display="flex" alignItems="center" my={3}>
            <Divider sx={{ flex: 1, height: 8, backgroundColor: color, borderRadius: 2 }} />
            <Typography sx={{
                mx: 2,
                color: color,
                fontWeight: "bold",
                backgroundColor: "white",
                px: 1,
                borderRadius: 1,
            }}>
                {sectionText}
            </Typography>
            <Divider sx={{ flex: 1, height: 8, backgroundColor: color, borderRadius: 2 }} />
        </Box>
    );
}

export function HealthPointInfo({ hpModel }: { hpModel: HitPoints }) {

    return (
        <div>
            <Box sx={{ marginBottom: 2 }}>
                <Typography
                    variant="subtitle2"
                >
                    Hit Points
                </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
                <Box width={100}>
                    <TextField
                        fullWidth
                        disabled={false}
                        id="current-hit-points"
                        label="Current Hit Point"
                        variant="standard"
                        defaultValue={hpModel.currentHp}
                        sx={{ paddingRight: 1, paddingBottom: 1 }}
                    />
                </Box>
                <Box width={100}>
                    <TextField
                        disabled={false}
                        id="max-hit-points"
                        label="Max Hit Point"
                        variant="standard"
                        defaultValue={hpModel.maxHp}
                        sx={{ paddingRight: 1, paddingBottom: 1 }}
                    />
                </Box>
                <Box width={100}>
                    <TextField
                        disabled={false}
                        id="max-hit-points"
                        label="Temp Hit Point"
                        variant="standard"
                        defaultValue={0}
                    />
                </Box>

            </Box>

        </div>
    )
}

export function ArmourClassInfo(props : CharacterDataProps) {

    return (
        <div>
            <Box sx={{ marginBottom: 2 }}>
                <Typography
                    variant="subtitle2"
                >
                    Armour Class
                </Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
                <Box width={100}>
                    <TextField
                        fullWidth
                        disabled={true}
                        id="current-armour-class"
                        label="AC"
                        variant="standard"
                        value={props.formData.armourClass.armourClassValue}
                        sx={{ paddingRight: 1, paddingBottom: 1 }}
                    />
                </Box>
                <Box width={100}>
                    <TextField
                        disabled={true}
                        id="temp-armour-class"
                        label="Temp AC"
                        variant="standard"
                        value={props.formData.armourClass.tempArmourClassValue}
                    />
                </Box>

            </Box>

        </div>
    )
}
