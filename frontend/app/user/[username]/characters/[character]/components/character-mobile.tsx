import { GridColDef } from "@mui/x-data-grid";
import { Character } from "./character-models";
import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";

export interface MobileRowCard {
    columns: GridColDef[]
    row: any
    formData: Character;
    setFormData: React.Dispatch<React.SetStateAction<Character | null>>;
    textColumnNameFilter: string[]
}

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}

export function MobileRowCard(props: MobileRowCard) {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {props.columns
                    .filter((col) => !props.textColumnNameFilter.includes(col.field))
                    .map((col) => (
                        <Box key={col.field} sx={{ mb: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {col.headerName ?? col.field}
                            </Typography>

                            <Typography variant="body2">
                                {String(props.row[col.field])}
                            </Typography>
                        </Box>
                    ))}
                {props.columns.map((col) => {
                    if (col.renderCell) {
                        return (
                            <Box key={col.field}>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {col.headerName ?? col.field}
                                </Typography>
                                <Typography>
                                {col.renderCell({
                                    id: props.row.id,
                                    field: col.field,
                                    row: props.row,
                                    value: props.row[col.field],
                                } as any)}
                                </Typography>

                            </Box>
                        );
                    }
                    return null;
                })}


            </CardContent>
        </Card>
    );
}