'use client'

import { useEffect, useState } from "react";
import { fetchCharacter } from "../../../../../libs/character-data";
import { CharacterLevelField, CharacterNameField, CharacterMiscField, SectionDivider } from './character-fields';
import { Container, Grid, Box, Tabs, Tab, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider, IconButton } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Character, CharacterDataProps } from "./character-models";
import { character_level_calculation } from './character-logic';
import { ClassModel } from "./class-models";
import { fetchAllClass } from "@/app/libs/class-data";
import { ActiveInventoryTableInfo, InventoryTableInfo } from "./character-inventory";
import { SpellTableInfo } from "./character-spell";
import { CharacterLevelTableModule } from "./character-levels";
import React from "react";
import { CharacterSkillsTable } from "./character-skills";
import { CharacterPassiveField } from "./character-passive";
import { AbilitySaveScoresInfo } from "./character-abilities";
import { CombatInfo } from "./character-combat";
import { CharacterFeatureInfo } from "./character-features";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { usePathname } from "next/navigation";

const queryClient = new QueryClient()

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`character-tabpanel-${index}`}
            aria-labelledby={`character-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `character-tab-${index}`,
        'aria-controls': `character-tabpanel-${index}`,
    };
}

function CharacterClientContent({ character }: { character: string }) {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const charProfile = useQuery({
        queryKey: [character.replaceAll("%20", "_") + "_Char_Profile"],
        queryFn: () => fetchCharacter({ name: character }),
        select: (res) => res.items[0]
    });

    const classList = useQuery({
        queryKey: ["class_data"],
        queryFn: () => fetchAllClass(),
        select: (res) => res.items
    });

    const [formData, setFormData] = useState<Character | null>(null);
    const [classListData, setClassListData] = useState<ClassModel[] | null>(null);

    useEffect(() => {
        if (charProfile.data) setFormData(charProfile.data)
        if (classList.data) setClassListData(classList.data)
    }, [charProfile.data, classList.data]);

    if (charProfile.isLoading || !formData || classList.isLoading || !classListData) return <div>Loading…</div>;

    return (

        <Container maxWidth="lg">
            <CharacterGeneralInfoModule formData={formData} setFormData={setFormData} />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="character-tabs"
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile>
                        <Tab label="Core" {...a11yProps(0)} />
                        <Tab label="Skills" {...a11yProps(1)} />
                        <Tab label="Combat" {...a11yProps(2)} />
                        <Tab label="Inventory" {...a11yProps(3)} />
                        <Tab label="Spells" {...a11yProps(4)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <SectionDivider sectionText="Character Core" />
                    <CharacterLevelTableModule formData={formData} setFormData={setFormData} classListData={classListData} setClassListData={setClassListData} />
                    <AbilitySaveScoresInfo formData={formData} setFormData={setFormData} />
                    <CharacterFeatureInfo formData={formData} setFormData={setFormData} />

                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <SectionDivider sectionText="Skills" />
                    <CharacterPassiveField formData={formData} setFormData={setFormData} />
                    <CharacterSkillsTable formData={formData} setFormData={setFormData} />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <SectionDivider sectionText="Combat" />
                    <CombatInfo formData={formData} setFormData={setFormData} />
                    <ActiveInventoryTableInfo formData={formData} setFormData={setFormData} />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={3}>

                    <InventoryTableInfo formData={formData} setFormData={setFormData} />
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={4}>
                    <SpellTableInfo formData={formData} setFormData={setFormData} classListData={classListData} setClassListData={setClassListData} />
                </CustomTabPanel>
            </Box>
        </Container>
    );
}

export function CharacterGeneralInfoModule(props: CharacterDataProps) {
    const charName: string = props.formData.characterName;

    const characterLevel: number = character_level_calculation(props.formData.classes)

    return <Box sx={{ margin: 2 }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterNameField name={charName} disabled={true} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterLevelField levelValue={characterLevel} disabled={true} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Deity"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Race"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Background"} disabled={true} props={props} />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
                < CharacterMiscField label={"Alignment"} disabled={true} props={props} />
            </Grid>
        </Grid>
    </Box>
}


interface CharacterUrlProp {
    characterSlug: string
}

export default function CharacterClientPage({ characterSlug }: CharacterUrlProp) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const currentPath = usePathname()
    const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem key={"Home"} disablePadding>
                    <ListItemButton component="a" href={newPath}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItemButton>
                </ListItem>
            </List>

        </Box>
    )
    return (
        <QueryClientProvider client={queryClient}>
            <AppBar position="sticky" sx={{
                backgroundColor: "#23486D",
                marginBottom: 1,
                height: "64px"
            }}>
                <Toolbar>
                    <IconButton sx={{ ml: 1, mr: 2 }} onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></IconButton>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Character Sheet Gen
                    </Typography>
                </Toolbar>
            </AppBar>
            <CharacterClientContent character={characterSlug} />
        </QueryClientProvider>

    );
}