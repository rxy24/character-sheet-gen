import 'server-only'
import { cookies } from 'next/headers'
 
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function createSession(userId: string) {
    // TODO; Update
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = 's'
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
