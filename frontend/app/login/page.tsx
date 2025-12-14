
import { cookies } from 'next/headers';
import SignInClient from './components/login-client';
import { redirect } from 'next/navigation';
import { USERNAME_LABEL } from '../libs/constants';

export default async function SignIn() {
  const cookieStore = await cookies()
  if (cookieStore.get('token')) {
    const username : string | undefined = cookieStore.get(USERNAME_LABEL)?.value
    redirect(`/user/${username}/characters`)
  }

  return (
    <SignInClient />
  );
}