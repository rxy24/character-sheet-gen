import { Button, Stack, TextField, Typography } from "@mui/material";
import { Effect } from "./character-models";

interface EffectModalProps {
    effects : Effect[]
    updateEffect: (index: number, field: keyof Effect, value: any) => void;
    removeEffect: (index: number) => void;
    addEffect: () => void;
}

export function CharacterEffectModal(props : EffectModalProps) {
    return (
        <>
            <Typography >
                Effect List
            </Typography>
            <Typography >
                Add effects to allow default calculations of specific fields.
            </Typography>
            <Stack spacing={2} style={{ maxHeight: 200, overflowY: "auto", paddingTop: 10 }}>
                {props.effects.map((effect, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center" >
                        <TextField
                            label="Effect Name"
                            value={effect.name}
                            onChange={(e) => props.updateEffect(index, "name", e.target.value)}
                            required
                        />
                        <TextField
                            label="Effect Description"
                            value={effect.description}
                            onChange={(e) => props.updateEffect(index, "description", e.target.value)}
                            required
                        />
                        <TextField
                            label="Effect Value"
                            value={effect.value}
                            onChange={(e) => props.updateEffect(index, "value", e.target.value)}
                            required
                        />
                        <Button variant="outlined" color="error" onClick={() => props.removeEffect(index)}>
                            Remove
                        </Button>
                    </Stack>
                ))}
                <Button variant="contained" onClick={props.addEffect}>
                    Add Effect
                </Button>
            </Stack>
        </>
    )
}