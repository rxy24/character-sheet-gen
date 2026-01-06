import { DataGrid, GridCellParams, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { CharacterDataProps, CharacterSkill } from "./character-models";
import { calculate_skill_roll } from "./character-logic";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { useState } from "react";

export function CharacterSkillsTable(props: CharacterDataProps) {
    const characterSkillData: CharacterSkill[] = props.formData.skills
    const [rows, setRows] = useState(characterSkillData)
    const columns: GridColDef[] = [
        {
            field: "rolls", headerName: "Rolls", width: 70,
            renderCell: (params: GridCellParams) => {
                const { ability, proficiency } = params.row
                const value: number = calculate_skill_roll(ability, proficiency, props.formData.abilityScores)
                if (value == null) return "";
                return value >= 0 ? `+${value}` : `${value}`;
            }
        },
        { field: "skillName", headerName: "Name", flex: 1 },
        { field: "ability", headerName: "Ability", flex: 1 },
        {
            field: "proficiency", headerName: "Prof", flex: 1,
            editable: true,
            type: 'singleSelect', valueOptions: [
                { value: "", label: "None" },
                { value: "half", label: "1/2" },
                { value: "prof", label: "proficient" },
                { value: "double", label: "x2" },
            ]
        },
        {
            field: "advantage", headerName: "Adv", flex: 1,
            sortable: false,
            editable: false,
            renderCell: (params) => {
                return params.value ? <CheckBox /> : <CheckBoxOutlineBlank />;
            }
        }
    ];

    const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        props.setFormData(prev => prev
            ? {
                ...prev,
                skills: prev.skills.map(charSkills =>
                    charSkills.skillName === newRow.skillName ? { ...charSkills, proficiency: newRow.proficiency, advantage: newRow.advantage } : charSkills
                )
            }
            : prev
        );
        return newRow
    }

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== "advantage") return;

        setRows((prev) =>
            prev.map((row) =>
                row.skillName === params.id
                    ? { ...row, advantage: !row.advantage }
                    : row
            )
        )
        props.setFormData(prev =>
            prev
                ? {
                    ...prev,
                    skills: prev.skills.map((charSkills) =>
                        charSkills.skillName === params.id
                            ? { ...charSkills, advantage: !charSkills.advantage }
                            : charSkills
                    ),
                }
                : prev
        );
    };
    return (
        <div>
            <DataGrid
                getRowId={(row) => row.skillName}
                rows={rows}
                columns={columns}
                hideFooter={true}
                onCellClick={handleCellClick}
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