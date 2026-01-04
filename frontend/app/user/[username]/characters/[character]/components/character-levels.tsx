import { DataGrid, GridColDef, GridDeleteIcon, GridRowModel } from "@mui/x-data-grid";
import { CharacterClass, CharacterLevelDataProps, ClassLevelFieldProps } from "./character-models";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useState } from "react";
import { useAlert } from "../../../components/alert-provider";
import { SectionDivider } from "./character-fields";


export function AddNewCharacterClassModal(charLevelProp: CharacterLevelDataProps) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [classValue, setClassValue] = useState("");
    const [levelValue, setLevelValue] = useState("");
    const [isMainValue, setIsMain] = useState(false)

    const classNameList = charLevelProp.classListData.map(item => item.className);
    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setClassValue(event.target.value);
    };
    const handleLevelChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLevelValue(event.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newClass: CharacterClass = {
            className: classValue,
            level: Number(levelValue),
            isMain: isMainValue
        }

        if (charLevelProp.formData.classes.filter(classItem => classItem.className === classValue).length > 0) {
            console.log(charLevelProp.formData.classes)
            setError(`${newClass.className} already exists on table. Please edit the table or select a different value`);
            return;
        } else {
            setError(null)
        }

        charLevelProp.setFormData((prev) => {
            if (!prev) return prev;

            return { ...prev, classes: [...(prev.classes || []), newClass] }
        })

        setClassValue("")
        setLevelValue("")
        setIsMain(false)
        setOpen(false)

        setTimeout(() => showAlert('success', 'Character Class Successfully Added'), 0);
    };

    const handleCancelClick = () => {
        setClassValue("")
        setLevelValue("")
        setIsMain(false)
        setError(null)
        setOpen(false)
    }


    return (<>
        <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={handleOpen} variant="outlined" startIcon={<Add />}>
                Add New Class
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
                        maxWidth: 600,
                    },
                },
            }}
        >
            <DialogTitle>Add new Class</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit} id="add-new-character-class-form">
                    <FormControl sx={{ marginTop: 2 }} fullWidth required>
                        <InputLabel id="class-options-label">
                            Character Class
                        </InputLabel>
                        <Select
                            value={classValue}
                            labelId="class-options-label"
                            id="outlined-basic"
                            name="class-options-dropdown"
                            variant="outlined"
                            type='text'
                            label="Character Class"
                            onChange={handleChange}
                        >
                            <MenuItem value="" disabled>
                                <em>Select type</em>
                            </MenuItem>
                            {classNameList.map((className) => (
                                <MenuItem key={className} value={className}>
                                    {className}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField sx={{ marginTop: 2 }}
                            id={"class-level-field"}
                            label={"Class Level"}
                            variant="outlined"
                            value={levelValue}
                            onChange={handleLevelChange}
                            required
                        />
                        <FormControlLabel
                            label={"Is Primary Class"}
                            control={
                                <Switch
                                    checked={isMainValue}
                                    onChange={(event) => {
                                        setIsMain(event.target.checked);
                                    }}
                                />
                            }
                        />

                    </FormControl>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </DialogContent>
            <DialogActions>
                <Button sx={{ margin: 1 }} variant="outlined" type="submit" form="add-new-character-class-form">
                    Submit
                </Button>
                <Button sx={{ margin: 1 }} variant="outlined" onClick={handleCancelClick}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export function ClassLevelTable(classProps: ClassLevelFieldProps) {
    const rows = classProps.pageProps.formData?.classes || [];

    const handleDelete = (id: string) => {

        classProps.pageProps.setFormData((prev) => {
            if (!prev) return prev
            return { ...prev, classes: prev.classes.filter(classItems => classItems.className !== id) }
        })
    }

    const columns: GridColDef[] = [
        { field: "className", headerName: "Class Name", flex: 1 },
        { field: "level", headerName: "Level", flex: 1, editable: true },
        { field: "isMain", headerName: "Primary Class", flex: 1, editable: true },
        {
            field: "delete",
            headerName: "Delete",
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => handleDelete(params.row.className)}
                >
                    <GridDeleteIcon />
                </IconButton>
            ),
        },
    ];

    const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        const levelvalue = Number(newRow.level);
        classProps.pageProps.setFormData(prev => prev
            ? {
                ...prev,
                classes: prev.classes.map(charClass =>
                    charClass.className === newRow.className ? { ...charClass, level: levelvalue } : charClass
                )
            }
            : prev
        );
        return newRow
    }

    return <DataGrid
        getRowId={(row) => row.className}
        rows={rows}
        columns={columns}
        hideFooter={true}
        density="compact"
        processRowUpdate={handleProcessRowUpdate}
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        autoHeight
    />
}

export function CharacterLevelTableModule(charLevelProps: CharacterLevelDataProps) {
    return <Box sx={{ margin: 2 }}>
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid size={{ xs: 12, sm: 6 }}>
                <SectionDivider sectionText="Class Info" />
                <ClassLevelTable pageProps={charLevelProps} />
                <AddNewCharacterClassModal classListData={charLevelProps.classListData} setClassListData={charLevelProps.setClassListData}
                    formData={charLevelProps.formData} setFormData={charLevelProps.setFormData} />
            </Grid>
        </Grid>
    </Box>
}