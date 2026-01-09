import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CharacterDataProps, CharacterFeatures, Effect } from "./character-models";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, Stack, TextField, Typography } from "@mui/material";
import { SectionDivider } from "./character-fields";
import React from "react";
import { useAlert } from "../../../components/alert-provider";
import { Add } from "@mui/icons-material";
import { ClassFeature } from "./class-models";

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

    const addEffect = () => {
        setItem((prev) => ({
            ...prev,
            effects: [...prev.effects, { name: "", value: "", description: "" }],
        }));
    };

    const removeEffect = (index: number) => {
        setItem((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    const updateEffect = (index: number, field: keyof Effect, value: string | number) => {
        setItem((prev) => {
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
                            <Stack spacing={2} mb={1} >
                                <TextField label="Feature Name" id="feature-name" required onChange={(e) => setItem({
                                    ...item, featureDescription:
                                        { ...item.featureDescription, name: e.target.value }
                                })} />
                                <TextField label="Feature Description" id="feature-description" onChange={(e) => setItem(
                                    {
                                        ...item, featureDescription:
                                            { ...item.featureDescription, description: e.target.value }
                                    }
                                )} />
                                <TextField type="number" label="Feature Level" id="feature-level" required onChange={(e) => setItem(
                                    {
                                        ...item, featureDescription:
                                            { ...item.featureDescription, level: Number(e.target.value) }
                                    }
                                )} />
                                <TextField label="Action Type" id="Action Type" required onChange={(e) => setItem(
                                    {
                                        ...item, featureDescription:
                                            { ...item.featureDescription, description: e.target.value }
                                    }
                                )} />
                            </Stack>
                            <Divider />
                            <Typography >
                                Effect List
                            </Typography>
                            <Typography >
                                Add effects to allow default calculations of specific fields.
                            </Typography>
                            <Stack spacing={2} style={{ maxHeight: 200, overflowY: "auto", paddingTop: 10 }}>
                                {item.effects.map((effect, index) => (
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

function CharacterFeaturesTable(props: CharacterDataProps) {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "level", headerName: "level", flex: 1 },
        { field: "moreDetails", headerName: "Details", flex: 1 }

    ];

    const [rows, setRows] = useState(props.formData.characterFeatures.map(feature => feature.featureDescription))

    useEffect(() => {
        setRows(props.formData.characterFeatures.map(feature => feature.featureDescription))
    }, [props.formData.characterFeatures])

    return (
        <>
            <DataGrid
                getRowId={(row) => row.name}
                rows={rows}
                columns={columns}
                hideFooter={true}
                density="compact"
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