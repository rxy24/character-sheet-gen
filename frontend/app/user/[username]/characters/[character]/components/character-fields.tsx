
"use client";
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { CharacterMiscFieldParams } from "./character-models";

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
