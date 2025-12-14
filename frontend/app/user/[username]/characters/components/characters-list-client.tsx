'use client'

import { Box, Card, CardActionArea, CardContent, Grid, Container, Typography } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { fetchAllCharacterFromUser } from "@/app/libs/character-data";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Character } from "../[character]/components/character-models";

const queryClient = new QueryClient()

export interface CharacterDataListProps {
    formData: Character[];
    setFormData: React.Dispatch<React.SetStateAction<Character[] | null>>;
}

export interface CharacterCardParams {
    characterMod: Character
}

export function CharacterCard(characterCardParams: CharacterCardParams) {
    const pathname = usePathname();
    const characterName = characterCardParams.characterMod.characterName
    return (
            <Card sx={{ width: 250, height: 200}}>
                <CardActionArea 
                component={Link}
                href={`${pathname}/${encodeURIComponent(characterName)}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardContent >
                    <Typography variant="h5" gutterBottom>
                        {characterName}
                    </Typography>
                </CardContent>
                </CardActionArea>
            </Card>
    )
}

export function CharacterCardList(prop: CharacterDataListProps) {
    const characterList: Character[] = Array.isArray(prop.formData) ? prop.formData : [];
    if (characterList.length === 0) return null;

    return (
        <Box sx={{ margin: 2 }}>
            <Grid container spacing={2} justifyContent="center">
                {characterList.map((character, index) => (
                    <Grid key={character.characterName.replaceAll(" ", "-") + index}>
                        <CharacterCard characterMod={character} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export function CharacterListClientContent() {
    const { data, isLoading } = useQuery({
        queryKey: ["Character_Dashboard"],
        queryFn: () => fetchAllCharacterFromUser(),
        select: (res) => res.items
    });

    const [formData, setFormData] = useState<Character[] | null>(null);

    useEffect(() => {
        if (data) setFormData(data)
    }, [data]);


    if (isLoading || !formData) return <div>Loading…</div>;

    return (<Container maxWidth="lg">
        <CharacterCardList formData={formData} setFormData={setFormData} />
    </Container>)
}

export default function CharacterListClientPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <CharacterListClientContent />
        </QueryClientProvider>
    )
}