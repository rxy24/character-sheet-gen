import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { CharacterClass, CharacterDataProps, CharacterSpelllDataProps as CharacterSpellDataProps, CharacterSpells, CharacterSpellSlots, Effect } from "./character-models";
import { Add, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import React from "react";
import { useAlert } from "../../../components/alert-provider";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { SectionDivider } from "./character-fields";
import { ClassFeatureSpellNumbers } from "./class-models";
import { generate_spell_slot_updates } from "./character-logic";

function AddSpellsButton(props: CharacterDataProps) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [spell, setSpell] = useState<CharacterSpells>({
        spellName: "",
        spellLevel: 0,
        isActive: false,
        effects: [],
        school: "",
        castingTime: "",
        range: "",
        fullDescription: ""
    });

    const handleCancelClick = () => {
        setError(null)
        setOpen(false)
        setSpell({
            spellName: "",
            spellLevel: 0,
            isActive: false,
            effects: [],
            school: "",
            castingTime: "",
            range: "",
            fullDescription: ""
        })
    }

    // Add a new effect row
    const addEffect = () => {
        setSpell((prev) => ({
            ...prev,
            effects: [...prev.effects, { name: "", value: "", description: "" }],
        }));
    };

    // Remove an effect row
    const removeEffect = (index: number) => {
        setSpell((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    // Update an effect row
    const updateEffect = (index: number, field: keyof Effect, value: string | number) => {
        setSpell((prev) => {
            const effects = [...prev.effects];
            effects[index] = { ...effects[index], [field]: value };
            return { ...prev, effects };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        props.setFormData(prev => prev
            ? {
                ...prev,
                characterSpells: [...prev.characterSpells, spell]
            }
            : prev
        );
        console.log(props.formData)
        setSpell({
            spellName: "",
            spellLevel: 0,
            isActive: false,
            effects: [],
            school: "",
            castingTime: "",
            range: "",
            fullDescription: ""
        })
        setOpen(false)

        setTimeout(() => showAlert('success', 'Spell is Successfully Added to Spell List'), 0);
    }

    return (
        <>
            <Box display="flex" justifyContent="center" mt={2}>
                <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
                    Add New Spell
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                closeAfterTransition={false}
                aria-labelledby="character-class-modal"
                slotProps={{
                    paper: {
                        sx: {
                            width: 600,
                            maxWidth: 800,
                        },
                    },
                }}
            >
                <DialogTitle>Add new Spell</DialogTitle>
                <DialogContent>
                    <form id="add-new-spell-form" onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2 }} fullWidth required>
                            <Stack spacing={2} mb={1} >
                                <TextField label="Spell Name" id="spell-name" required onChange={(e) => setSpell({ ...spell, spellName: e.target.value })} />
                                <TextField label="Spell Description" id="spell-description" onChange={(e) => setSpell({ ...spell, fullDescription: e.target.value })} />
                                <TextField label="Spell School" id="spell-school" required onChange={(e) => setSpell({ ...spell, school: e.target.value })} />
                                <TextField label="Spell Casting Time" id="spell-casting-time" onChange={(e) => setSpell({ ...spell, castingTime: e.target.value })} />
                                <TextField label="Spell Range" id="spell-range" onChange={(e) => setSpell({ ...spell, range: e.target.value })} />
                                <TextField type="number" label="Spell Level" id="spell-level" onChange={(e) => setSpell({ ...spell, spellLevel: Number(e.target.value) })} inputProps={{
                                    min: 0,
                                    max: 10,
                                    step: 1,
                                }} />
                            </Stack>
                            <Divider />
                            <Typography >
                                Effect List
                            </Typography>
                            <Typography >
                                Add effects to allow default calculations of specific fields.
                            </Typography>
                            <Stack spacing={2} style={{ maxHeight: 200, overflowY: "auto", paddingTop: 10 }}>
                                {spell.effects.map((effect, index) => (
                                    <Stack key={index} direction="row" spacing={2} alignItems="center" >
                                        <TextField
                                            label="Effect Name"
                                            value={effect.name}
                                            onChange={(e) => updateEffect(index, "name", e.target.value)}
                                            required
                                        />
                                        <TextField
                                            label="Effect Description"
                                            value={effect.description}
                                            onChange={(e) => updateEffect(index, "description", e.target.value)}
                                            required
                                        />
                                        <TextField
                                            label="Effect Value"
                                            value={effect.value}
                                            onChange={(e) => updateEffect(index, "value", e.target.value)}
                                            required
                                        />
                                        <Button variant="outlined" color="error" onClick={() => removeEffect(index)}>
                                            Remove
                                        </Button>
                                    </Stack>
                                ))}
                                <Button variant="contained" onClick={addEffect}>
                                    Add Effect
                                </Button>
                            </Stack>
                        </FormControl>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="add-new-spell-form">
                        Submit
                    </Button>
                    <Button sx={{ margin: 1 }} variant="outlined" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function SpellTable(props: CharacterDataProps) {
    const { showAlert } = useAlert();
    const handleCast = (params: GridRenderCellParams) => {
        const spellName: string = params.row.spellName;
        const spellLevel: number = Number(params.row.spellLevel);
        const spellSlotObj: CharacterSpellSlots | undefined = props.formData.characterSpellSlotInfo.find(item => item.spellLevel === spellLevel)

        if (spellSlotObj === undefined || spellSlotObj.slotsRemaining === 0) {
            setTimeout(() => showAlert('error', `Cannot cast level ${spellLevel} spell, no more spell slots remaining`), 0);
        } else {
            props.setFormData(prev => prev ? {
                ...prev,
                characterSpellSlotInfo: prev.characterSpellSlotInfo.map(item => item.spellLevel === spellLevel ? { ...item, slotsRemaining: item.slotsRemaining - 1 } : item),
                characterLog: [...prev.characterLog, { description: `Cast ${spellName}`, type: "Cast Spells" }]
            } : prev)
        }

    }
    const columns: GridColDef[] = [
        { field: "spellName", headerName: "Spell name", width: 100 },
        { field: "spellLevel", headerName: "Spell level", width: 100 },
        { field: "castingTime", headerName: "Casting time", width: 100 },
        { field: "range", headerName: "Range", width: 100 },
        { field: "fullDescription", headerName: "Description", width: 300 },
        {
            field: "actions", headerName: "Activate Spell", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return <>
                    <Button onClick={() => handleCast(params)} variant="outlined">
                        Cast Spell
                    </Button>
                </>;
            }
        },
        { field: "moreDetails", headerName: "Details", width: 200 }

    ];

    const [rows, setRows] = useState(props.formData.characterSpells)

    useEffect(() => {
        setRows(props.formData.characterSpells)
    }, [props.formData.characterSpells])

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== "isActive") return;

        setRows((prev) =>
            prev.map((row) =>
                row.spellName === params.id
                    ? { ...row, isActive: !row.isActive }
                    : row
            )
        )
        props.setFormData(prev => prev
            ? {
                ...prev,
                inventory: prev.inventory.map(item => item.name === params.id ? { ...item, isActive: !item.isActive } : item)
            }
            : prev
        );
    };
    return (
        <div>
            <DataGrid
                getRowId={(row) => row.spellName}
                rows={rows}
                columns={columns}
                hideFooter={true}
                onCellClick={handleCellClick}
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                disableColumnResize={false}
            />
        </div>
    )
}

function ResetSpellSlotButton(props: CharacterDataProps) {
    const handleReset = () => {
        props.setFormData(prev => prev ? {
            ...prev,
            characterSpellSlotInfo: prev.characterSpellSlotInfo.map(item => ({
                ...item,
                slotsRemaining: item.slotsTotal
            }))
        }
            : prev)
    }
    return <>
        <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={handleReset} variant="outlined">
                Restore Spell Slot
            </Button>
        </Box>
    </>
}

function SpellSlotTable(props: CharacterSpellDataProps) {
    const columns: GridColDef[] = [
        { field: "spellLevel", headerName: "Spell Level", headerAlign: 'center', align: 'center', flex: 1, },
        {
            field: "slotsRemaining",
            headerName: "Slot Remaining",
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                    <IconButton
                        size="small"
                        onClick={() => updateRemainingSlots(params.row.spellLevel, -1)}
                    >
                        <Remove />
                    </IconButton>

                    {params.value}

                    <IconButton
                        size="small"
                        onClick={() => updateRemainingSlots(params.row.spellLevel, 1)}
                    >
                        <Add />
                    </IconButton>
                </Stack>
            ),
        },
        { field: "slotsTotal", headerName: "Total Slots", headerAlign: 'center', align: 'center', flex: 1, }

    ];
    const [rows, setRows] = useState(props.formData.characterSpellSlotInfo)

    useEffect(() => {
        setRows(props.formData.characterSpellSlotInfo)
    }, [props.formData.characterSpellSlotInfo])

    useEffect(() => {
        const mainClassList: CharacterClass[] = props.formData.classes.filter(element => element.isMain)
        if (mainClassList.length === 0) {
            return
        } else {
            const mainClass: CharacterClass = mainClassList[0];
            const baseClassSpellSlots: ClassFeatureSpellNumbers[] | undefined = props.classListData.find(item => item.className === mainClass.className)?.featureTableData
                .find(feature => feature.level === mainClass.level)?.numOfSpells
            const currSpellSlotsList: CharacterSpellSlots[] = props.formData.characterSpellSlotInfo;
            if (baseClassSpellSlots !== undefined) {
                const updatedSpellSlots: CharacterSpellSlots[] = generate_spell_slot_updates(baseClassSpellSlots, currSpellSlotsList)
                if (updatedSpellSlots.length !== 0) {
                    props.setFormData(
                        prev => prev ? {
                            ...prev,
                            characterSpellSlotInfo: updatedSpellSlots
                        } : prev
                    )
                }
            }
        }

    }, [props.formData.classes])

    const updateRemainingSlots = (id: number, delta: number) => {
        const data: CharacterSpellSlots | undefined = rows.find(row => row.spellLevel === id)
        const newValue: number = data ? data.slotsRemaining + delta : 0;

        setRows((prev) =>
            prev.map((row) =>
                row.spellLevel === id
                    ? { ...row, slotsRemaining: Math.max(0, newValue) }
                    : row
            )
        );

        props.setFormData(prev => prev ? {
            ...prev,
            characterSpellSlotInfo: prev.characterSpellSlotInfo.map(item => item.spellLevel === id ? { ...item, slotsRemaining: Math.max(0, newValue) } : item)
        }
            : prev)
    };

    return (
        <div>
            <DataGrid
                getRowId={(row) => row.spellLevel}
                rows={rows}
                columns={columns}
                hideFooter={true}
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                disableColumnSorting
                disableColumnFilter
                disableColumnResize
            />
        </div>
    )
}

export function SpellTableInfo(props: CharacterSpellDataProps) {
    return <Box sx={{ margin: 2, width: '100%', overflowX: 'auto' }}>
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <SectionDivider sectionText="Spells" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <SpellSlotTable formData={props.formData} setFormData={props.setFormData} classListData={props.classListData} setClassListData={props.setClassListData} />
                <ResetSpellSlotButton formData={props.formData} setFormData={props.setFormData} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
                <SpellTable formData={props.formData} setFormData={props.setFormData} />
                <AddSpellsButton formData={props.formData} setFormData={props.setFormData} />
            </Grid>
        </Grid>
    </Box>
}