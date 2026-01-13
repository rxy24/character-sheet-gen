import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Character, CharacterDataProps, CharacterFeatures, Effect } from "./character-models";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, Stack, TextField, Typography } from "@mui/material";
import { SectionDivider } from "./character-fields";
import React from "react";
import { useAlert } from "../../../components/alert-provider";
import { Add } from "@mui/icons-material";
import { ClassFeature } from "./class-models";
import { CharacterEffectModal } from "./character-effects";
import { MobileRowCard, useIsMobile } from "./character-mobile";

export interface CharacterFeatureProp {
    item: CharacterFeatures;
    setItem: React.Dispatch<React.SetStateAction<CharacterFeatures>>;
}

export interface EditFeatureProp {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    featureName: string
}

function AddFeatureButton(props: CharacterDataProps) {
    const defaultClassFeature: ClassFeature = { name: "", level: 0, description: "", actionType: "", effects: [] }
    const defaultCharacterFeatures: CharacterFeatures = {
        featureDescription: defaultClassFeature,
        effects: []
    }

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [item, setItem] = useState(defaultCharacterFeatures)

    const handleCancelClick = () => {
        setError(null)
        setOpen(false)
        setItem(defaultCharacterFeatures)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        props.setFormData(prev => prev
            ? {
                ...prev,
                characterFeatures: [...prev.characterFeatures, item]
            }
            : prev
        );
        setItem(defaultCharacterFeatures)
        setOpen(false)

        setTimeout(() => showAlert('success', 'Character Feature Successfully Added'), 0);
    }

    return (
        <>
            <Box display="flex" justifyContent="center" mt={2}>
                <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
                    Add New Item
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                closeAfterTransition={false}
                aria-labelledby="character-feature-modal"
                slotProps={{
                    paper: {
                        sx: {
                            width: 600,
                            maxWidth: 800,
                        },
                    },
                }}
            >
                <DialogTitle>Add new Item</DialogTitle>
                <DialogContent>
                    <form id="add-new-feature-form" onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2 }} fullWidth required>
                            <CharacterFeatureFormFields item={item} setItem={setItem} />
                            <Divider />
                            <CharacterFeatureEffectField item={item} setItem={setItem} />
                        </FormControl>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="add-new-feature-form">
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

function EditFeatureButton(props: EditFeatureProp) {
    const [currCharFeature, setCurrCharFeature] = useState(props.formData.characterFeatures.find(item => item.featureDescription.name === props.featureName))

    useEffect(()=>{
        setCurrCharFeature(props.formData.characterFeatures.find(item => item.featureDescription.name === props.featureName))
    }, [props.formData.characterFeatures])

    const currClassFeature: ClassFeature | undefined = currCharFeature?.featureDescription
    const defaultClassFeature: ClassFeature = { name: "", level: 0, description: "", actionType: "", effects: [] }

    const defaultCharacterFeatures: CharacterFeatures = {
        featureDescription: currClassFeature ? currClassFeature : defaultClassFeature,
        effects: currCharFeature ? currCharFeature.effects : []
    }

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [item, setItem] = useState(defaultCharacterFeatures)

    const handleCancelClick = () => {
        setError(null)
        setOpen(false)
        setItem(defaultCharacterFeatures)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        props.setFormData(prev => prev
            ? {
                ...prev,
                characterFeatures: prev.characterFeatures.map(previtem => previtem.featureDescription.name === props.featureName ? item : previtem)
            }
            : prev
        );
        setItem(item)
        setOpen(false)

        setTimeout(() => showAlert('success', 'Character Feature Successfully Updated'), 0);
    }

    return (
        <>
            <Button onClick={handleOpen} variant="outlined">
                Edit
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                closeAfterTransition={false}
                aria-labelledby="edit-character-feature-modal"
                slotProps={{
                    paper: {
                        sx: {
                            width: 800,
                            maxWidth: 1000,
                        },
                    },
                }}
            >
                <DialogTitle>Edit Feature</DialogTitle>
                <DialogContent>
                    <form id="edit-feature-form" onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2 }} fullWidth required>
                            <CharacterFeatureFormFields item={item} setItem={setItem} />
                            <Divider />
                            <CharacterFeatureEffectField item={item} setItem={setItem} />
                        </FormControl>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="edit-feature-form">
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

function CharacterFeatureFormFields(characterFeature: CharacterFeatureProp) {
    return (
        <>
            <Stack spacing={2} mb={1} >
                <TextField label="Feature Name" id="feature-name" value={characterFeature.item.featureDescription.name} required onChange={(e) => characterFeature.setItem({
                    ...characterFeature.item, featureDescription:
                        { ...characterFeature.item.featureDescription, name: e.target.value }
                })} />
                <TextField  multiline minRows={4}
                    fullWidth label="Feature Description" id="feature-description" value={characterFeature.item.featureDescription.description} onChange={(e) => characterFeature.setItem(
                        {
                            ...characterFeature.item, featureDescription:
                                { ...characterFeature.item.featureDescription, description: e.target.value }
                        }
                    )} />
                <TextField type="number" label="Feature Level" id="feature-level" value={Number(characterFeature.item.featureDescription.level)} required onChange={(e) => characterFeature.setItem(
                    {
                        ...characterFeature.item, featureDescription:
                            { ...characterFeature.item.featureDescription, level: Number(e.target.value) }
                    }
                )} />
                <TextField label="Action Type" id="feature-action-type" value={characterFeature.item.featureDescription.actionType} required onChange={(e) => characterFeature.setItem(
                    {
                        ...characterFeature.item, featureDescription:
                            { ...characterFeature.item.featureDescription, actionType: e.target.value }
                    }
                )} />
            </Stack>
        </>
    )
}

function CharacterFeatureEffectField(characterFeature: CharacterFeatureProp) {
    const addEffect = () => {
        characterFeature.setItem((prev) => ({
            ...prev,
            effects: [...prev.effects, { name: "", value: "", description: "" }],
        }));
    };

    const removeEffect = (index: number) => {
        characterFeature.setItem((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    const updateEffect = (index: number, field: keyof Effect, value: string | number) => {
        characterFeature.setItem((prev) => {
            const effects = [...prev.effects];
            effects[index] = { ...effects[index], [field]: value };
            return { ...prev, effects };
        });
    };
    return (
        <>
        <CharacterEffectModal addEffect={addEffect} removeEffect={removeEffect} updateEffect={updateEffect} effects={characterFeature.item.effects}/>
        </>
    )
}

function CharacterFeaturesTable(props: CharacterDataProps) {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "level", headerName: "level", flex: 1 },
        {
            field: "moreDetails", headerName: "Details", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return <>
                    <EditFeatureButton featureName={params.row.name} formData={props.formData} setFormData={props.setFormData} />
                </>;
            }
        }

    ];

    const [rows, setRows] = useState(props.formData.characterFeatures.map(feature => feature.featureDescription))

    useEffect(() => {
        setRows(props.formData.characterFeatures.map(feature => feature.featureDescription))
    }, [props.formData.characterFeatures])

    const isMobile = useIsMobile()
    if (isMobile) {
        return (
            <>
                <Grid container spacing={2}>
                    {rows.map((row) => (
                        <Grid key={row.name + "-grid"} size={{ xs: 12, sm: 12 }}>
                            <MobileRowCard columns={columns} row={row} formData={props.formData} setFormData={props.setFormData} textColumnNameFilter={["moreDetails"]}/>
                        </Grid>
                    ))}
                </Grid>
            </>
        )
    }
    return (
        <>
            <DataGrid
                getRowId={(row) => row.name}
                rows={rows}
                columns={columns}
                hideFooter={true}
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                autoHeight
            />

        </>
    )
}

export function CharacterFeatureInfo(props: CharacterDataProps) {
    return (
        <>
            <Box sx={{ margin: 2 }}>
                <SectionDivider sectionText="Character Features" />
                <Grid container spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="center">
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <CharacterFeaturesTable formData={props.formData} setFormData={props.setFormData} />
                        <AddFeatureButton formData={props.formData} setFormData={props.setFormData} />
                    </Grid>
                </Grid>
            </Box>
        </>
    )

}