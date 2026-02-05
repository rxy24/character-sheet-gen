import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { Character, CharacterDataProps, Effect, InventoryItem } from "./character-models";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, Stack, TextField, useMediaQuery, useTheme } from "@mui/material";
import { SectionDivider } from "./character-fields";
import { useAlert } from "../../../components/alert-provider";
import React from "react";
import { CharacterEffectModal } from "./character-effects";
import { MobileRowCard, useIsMobile } from "./character-mobile";

export interface InventoryItemProp {
    item: InventoryItem
    setItem: React.Dispatch<React.SetStateAction<InventoryItem>>;
}

export interface EditInventoryItemProp {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    itemName: string
}

export interface InventoryProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    useIsActiveFilter: boolean
}

export interface ActiveEquipmentProps {
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    isActiveEquipment: boolean
    isMobile : boolean
    equipmentName: string
}



function inventory_columns(isMobile: boolean, props: CharacterDataProps): GridColDef[] {
    return [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "type", headerName: "Type", flex: 1 },
        {
            field: "isActive", headerName: "Equipped", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return <EquipCheckBox key={params.row.name + "-active-equipment-box"} equipmentName={params.row.name} isActiveEquipment={params.value} formData={props.formData} setFormData={props.setFormData} isMobile={isMobile}/>;
            }
        },
        {
            field: "moreDetails", headerName: "Details", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return <>
                    <EditInventoryItemButton itemName={params.row.name} formData={props.formData} setFormData={props.setFormData} />
                </>;
            }
        }
    ]
}

function EquipCheckBox(props: ActiveEquipmentProps) {
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const eventBoolean = props.isMobile? event.target.checked : !props.isActiveEquipment
        props.setFormData(prev => prev ? {
            ...prev,
            inventory: props.formData.inventory.map(item => item.name === props.equipmentName ? { ...item, isActive: eventBoolean } : item)
        } : prev)
    }
    return (
        <>
            <Checkbox checked={props.isActiveEquipment || false} size="medium" onChange={handleChange} />
        </>
    )
}

function InventoryItemFormField(props: InventoryItemProp) {
    return (
        <>
            <Stack spacing={2} mb={1} >
                <TextField label="Item name" id="item-name" required value={props.item.name} onChange={(e) => props.setItem({
                    ...props.item, name: e.target.value
                })} />
                <TextField multiline minRows={4}
                    fullWidth label="Item Description" id="item-description" value={props.item.description} onChange={(e) => props.setItem(
                        {
                            ...props.item, description: e.target.value
                        }
                    )} />
                <TextField label="Item Type" id="item-type" value={props.item.type} required onChange={(e) => props.setItem(
                    {
                        ...props.item, type: e.target.value
                    }
                )} />
                <TextField label="Item Weight" id="item-weight" value={props.item.weight} onChange={(e) => props.setItem(
                    {
                        ...props.item, weight: e.target.value
                    }
                )} />
                <TextField label="Item Value" id="item-value" value={props.item.value} onChange={(e) => props.setItem(
                    {
                        ...props.item, value: e.target.value
                    }
                )} />
                <TextField multiline minRows={4}
                    fullWidth label="Item Notes" id="item-notes" value={props.item.notes} onChange={(e) => props.setItem(
                        {
                            ...props.item, notes: e.target.value
                        }
                    )} />
            </Stack>
        </>
    )
}

function InventoryItemEffectField(props: InventoryItemProp) {
    const addEffect = () => {
        props.setItem((prev) => ({
            ...prev,
            effects: [...prev.effects, { name: "", value: "", description: "" }],
        }));
    };

    const removeEffect = (index: number) => {
        props.setItem((prev) => ({
            ...prev,
            effects: prev.effects.filter((_, i) => i !== index),
        }));
    };

    const updateEffect = (index: number, field: keyof Effect, value: string | number) => {
        props.setItem((prev) => {
            const effects = [...prev.effects];
            effects[index] = { ...effects[index], [field]: value };
            return { ...prev, effects };
        });
    };
    return (
        <>
            <CharacterEffectModal addEffect={addEffect} removeEffect={removeEffect} updateEffect={updateEffect} effects={props.item.effects} />
        </>
    )
}

function EditInventoryItemButton(props: EditInventoryItemProp) {
    const [currItem, setCurrItem] = useState(props.formData.inventory.find(item => item.name === props.itemName))

    useEffect(() => {
        setCurrItem(props.formData.inventory.find(item => item.name === props.itemName))
    }, [props.formData.inventory])

    const currInventoryItem: InventoryItem | undefined = currItem
    const defaultInventoryItem: InventoryItem = { name: "", type: "", description: "", notes: "", value: "", isActive: false, weight: "", effects: [] }

    const updatedInvItem: InventoryItem = currInventoryItem ? currInventoryItem : defaultInventoryItem

    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [item, setItem] = useState(updatedInvItem)

    const handleCancelClick = () => {
        setError(null)
        setOpen(false)
        setItem(updatedInvItem)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        props.setFormData(prev => prev
            ? {
                ...prev,
                inventory: prev.inventory.map(previtem => previtem.name === props.itemName ? item : previtem)
            }
            : prev
        );
        setItem(item)
        setOpen(false)

        setTimeout(() => showAlert('success', 'Item Successfully Updated'), 0);
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
                aria-labelledby="edit-character-item-modal"
                slotProps={{
                    paper: {
                        sx: {
                            width: 800,
                            maxWidth: 1000,
                        },
                    },
                }}
            >
                <DialogTitle>Edit Item</DialogTitle>
                <DialogContent>
                    <form id="edit-item-form" onSubmit={handleSubmit}>
                        <FormControl sx={{ marginTop: 2 }} fullWidth required>
                            <InventoryItemFormField item={item} setItem={setItem} />
                            <Divider />
                            <InventoryItemEffectField item={item} setItem={setItem} />
                        </FormControl>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="edit-item-form">
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        props.setFormData(prev => prev
            ? {
                ...prev,
                inventory: [...prev.inventory, item]
            }
            : prev
        );
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
                            <InventoryItemFormField item={item} setItem={setItem} />
                            <Divider />
                            <InventoryItemEffectField item={item} setItem={setItem} />
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

function InventoryTable(props: InventoryProps) {
    const isMobile = useIsMobile(); 
    const columns: GridColDef[] = inventory_columns(isMobile, props)
    const currInventoryList: InventoryItem[] = props.useIsActiveFilter ? props.formData.inventory.filter(item => item.isActive) : props.formData.inventory
    const [rows, setRows] = useState(currInventoryList)

    useEffect(() => {
        setRows(currInventoryList)
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
    };
    if (isMobile) {
        return (
            <>
                <Grid container spacing={2}>
                    {rows.map((row) => (
                        <Grid key={row.name + "-grid"} size={{ xs: 12, sm: 12 }}>
                            <MobileRowCard columns={columns} row={row} formData={props.formData} setFormData={props.setFormData} textColumnNameFilter={["moreDetails", "isActive"]}/>
                        </Grid>
                    ))}
                </Grid>
            </>
        )
    }

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
                <InventoryTable formData={props.formData} setFormData={props.setFormData} useIsActiveFilter={true} />
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
                <InventoryTable formData={props.formData} setFormData={props.setFormData} useIsActiveFilter={false} />
                <AddInventoryButton formData={props.formData} setFormData={props.setFormData} />
            </Grid>
        </Grid>
    </Box>
}