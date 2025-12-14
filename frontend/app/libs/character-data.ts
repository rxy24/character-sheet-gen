'use server'
import { cookies } from 'next/headers';
import { TOKEN_LABEL } from './constants';

export async function fetchCharacter({ name }: { name: String }) {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_LABEL)?.value
    const method = 'GET'
    const url: string =  `${process.env.API_URL!}/characters?name=${encodeURIComponent(name.toString())}`
    
    const res = await fetch(process.env.NEXT_PUBLIC_FRONT_END_BASE_URL+'/api/proxy',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({url, method, token}),
            credentials: 'include'
        }
    )
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json()
    return data
}

export async function fetchAllCharacterFromUser(){
        const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_LABEL)?.value
    const method = 'GET'
    const url: string = process.env.API_URL! + '/characters'
    
    const res = await fetch(process.env.NEXT_PUBLIC_FRONT_END_BASE_URL+'/api/proxy',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({url, method, token}),
            credentials: 'include'
        }
    )
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json()
    return data
}