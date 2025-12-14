// /app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '../../libs/fetch-with-auth';

export async function POST(req: NextRequest) {
  const { url, method = 'GET', body, token } = await req.json();

  if (!url) return NextResponse.json({ message: 'Missing URL' }, { status: 400 });

  try {
// for debugging
    const cookie_token = token;

    if (!cookie_token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 401 });
    }
    console.log('reached this point')
    const data = await fetchWithAuth(url, cookie_token, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    return NextResponse.json(data);
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
