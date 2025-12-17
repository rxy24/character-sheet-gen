import { cookies } from "next/headers";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { redirect } from 'next/navigation';
import CharacterClientPage from "./components/character-client";
import { TOKEN_LABEL, USERNAME_LABEL } from "@/app/libs/constants";


export default async function CharacterPage({ params }: { params: { character: string, username: string } }) {
  const cookieStore = await cookies()
  const { character } = await params
  if (!cookieStore.get(TOKEN_LABEL)) {
    const username : string | undefined = cookieStore.get(USERNAME_LABEL)?.value;

    redirect(`/user/${username}/characters`)
  }

  return (
    <AppRouterCacheProvider>
      <CharacterClientPage characterSlug={character} />
    </AppRouterCacheProvider>
  );
}