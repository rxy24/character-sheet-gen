import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { CharacterDataProps, Effect, InventoryItem } from "./character-models";
import { useEffect, useState } from "react";
import { Add, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { SectionDivider } from "./character-fields";
import { useAlert } from "../../../components/alert-provider";
import React from "react";


function AddInventoryButton(props: CharacterDataProps) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [item, setItem] = useState<InventoryItem>({
        name: "",
        description: "",
        isActive: false,
        effects: [],
        type: "",
        notes: "",
        value: "",
        weight: ""
    });

    const handleCancelClick = () => {
        setError(null)
        setOpen(false)
        setItem({
            name: "",
            description: "",
            isActive: false,
            effects: [],
            type: "",
            notes: "",
            value: "",
            weight: ""
        })
    }

    // Add a new effect row
    const addEffect = () => {
        setItem((prev) => ({
            ...prev,
            effects: [...prev.effects, { name: "", value: "", description: "" }],
        }));
    };

    // Remove an effect row
    const removeEffect = (index: number) => {
        setItem((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    // Update an effect row
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
                inventory: [...prev.inventory, item]
            }
            : prev
        );
        console.log(props.formData)
        setItem({
            name: "",
            description: "",
            isActive: false,
            effects: [],
            type: "",
            notes: "",
            value: "",
            weight: ""
        })
        setOpen(false)

        setTimeout(() => showAlert('success', 'Item Successfully Added to Inventory'), 0);
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
                <DialogTitle>Add new Item</DialogTitle>
                <DialogContent>
                    <form id="add-new-item-form" onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2 }} fullWidth required>
                            <Stack spacing={2} mb={1} >
                                <TextField label="Item name" id="item-name" required  onChange={(e) => setItem({ ...item, name: e.target.value })}/>
                                <TextField label="Item Description" id="item-description" onChange={(e) => setItem({ ...item, description: e.target.value })} />
                                <TextField label="Item Type" id="item-type" required onChange={(e) => setItem({ ...item, type: e.target.value })}/>
                                <TextField label="Item Weight" id="item-weight" onChange={(e) => setItem({ ...item, weight: e.target.value })}/>
                                <TextField label="Item Value" id="item-value" onChange={(e) => setItem({ ...item, value: e.target.value })}/>
                                <TextField label="Item Notes" id="item-notes" onChange={(e) => setItem({ ...item, notes: e.target.value })}/>
                            </Stack>
                            <Divider />
                            <Typography >
                                Effect List
                            </Typography>
                            <Typography >
                                Add effects to allow default calculations of specific fields.
                            </Typography>
                            <Stack spacing={2} style={{ maxHeight: 200, overflowY: "auto" }}>
                                {item.effects.map((effect, index) => (
                                    <Stack key={index} direction="row" spacing={2} alignItems="center">
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
                    <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="add-new-item-form">
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

function ActiveInventoryTable(props: CharacterDataProps) {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 200 },
        { field: "description", headerName: "Description", width: 200 },
        { field: "type", headerName: "Type", width: 200 },
        { field: "notes", headerName: "Notes", width: 200 },
        { field: "moreDetails", headerName: "Details", width: 200 }

    ];

    const filteredInventory: InventoryItem[] = props.formData.inventory.filter(item => item.isActive)
    const [rows, setRows] = useState(filteredInventory)

    useEffect(() => {
        setRows(props.formData.inventory.filter(item => item.isActive))
    }, [props.formData.inventory])

    return (
        <div>
            <DataGrid
                getRowId={(row) => row.name}
                rows={rows}
                columns={columns}
                hideFooter={true}
                disableColumnMenu
                disableColumnSelector
                disableRowSelectionOnClick
                disableColumnResize={false}
            />
        </div>
    )
}

function InventoryTable(props: CharacterDataProps) {
    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", width: 200 },
        { field: "description", headerName: "Description", width: 200 },
        { field: "type", headerName: "Type", width: 200 },
        {
            field: "isActive", headerName: "Active Equipment", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return params.value ? <CheckBox /> : <CheckBoxOutlineBlank />;
            }
        },
        { field: "moreDetails", headerName: "Details", width: 200 }

    ];

    const [rows, setRows] = useState(props.formData.inventory)

    useEffect(() => {
        setRows(props.formData.inventory)
    }, [props.formData.inventory])

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== "isActive") return;

        setRows((prev) =>
            prev.map((row) =>
                row.name === params.id
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
                getRowId={(row) => row.name}
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

export function ActiveInventoryTableInfo(props: CharacterDataProps) {
    return <Box sx={{ margin: 2, width: '100%', overflowX: 'auto' }}>
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <SectionDivider sectionText="Active Inventory" />
                <ActiveInventoryTable formData={props.formData} setFormData={props.setFormData} />
            </Grid>
        </Grid>
    </Box>
}

export function InventoryTableInfo(props: CharacterDataProps) {
    return <Box sx={{ margin: 2, width: '100%', overflowX: 'auto' }}>
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <SectionDivider sectionText="Inventory" />
                <InventoryTable formData={props.formData} setFormData={props.setFormData} />
                <AddInventoryButton formData={props.formData} setFormData={props.setFormData} />
            </Grid>
        </Grid>
    </Box>
}