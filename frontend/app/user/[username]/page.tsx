
import { USERNAME_LABEL } from "@/app/libs/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage(){
      const cookieStore = await cookies()
      if (!cookieStore.get('token')) {
        const username : string | undefined = cookieStore.get(USERNAME_LABEL)?.value;
    
        redirect(`/user/${username}/characters`)
      } else {
        redirect('/login')
      }
}