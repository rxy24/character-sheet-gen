import { useEffect } from "react"
import { CharacterDataProps, HitPoints } from "./character-models"
import { calculate_armour_class } from "./character-logic"
import { Box, Grid, TextField, Typography } from "@mui/material"

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

export function CombatInfo(props: CharacterDataProps) {
    const hpModel: HitPoints = props.formData.hitPoints

    useEffect(() => {
        const newAC: number = calculate_armour_class(props.formData)
        const currAc: number = props.formData.armourClass.armourClassValue

        if (newAC === currAc) return

        props.setFormData(prev => {
            if (!prev) return prev

            return {
                ...prev,
                armourClass: {
                    ...prev.armourClass,
                    armourClassValue: newAC
                }
            }
        });
    }, [props.formData.armourClass, props.formData.inventory])

    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 5 }}>
                <HealthPointInfo hpModel={hpModel} />

            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
                <ArmourClassInfo formData={props.formData} setFormData={props.setFormData} />
            </Grid>
        </Grid>
    </Box>
}
