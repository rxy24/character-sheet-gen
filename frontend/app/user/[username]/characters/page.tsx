import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CharacterListClientPage from "./components/characters-list-client";
import { TOKEN_LABEL } from "@/app/libs/constants";


export default async function CharacterDashboard() {
    const cookieStore = await cookies()
    if (!cookieStore.get(TOKEN_LABEL)) {
        redirect(`/login`)
    }

    return (
    <AppRouterCacheProvider>
        <CharacterListClientPage />
    </AppRouterCacheProvider>
    )
}