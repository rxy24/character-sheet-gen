
import { TOKEN_LABEL, USERNAME_LABEL } from "@/app/libs/constants";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.text();
  const params = new URLSearchParams(body);
  const username = params.get(USERNAME_LABEL);

  const response = await fetch(process.env.API_URL! + "/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const result = await response.json();
  const nextResponseResult = NextResponse.json(result);
  const cookieStore = await cookies()
  
  const cookieConfig: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: true,
    maxAge: 1200,
    sameSite: 'strict'
  }
  cookieStore.set(TOKEN_LABEL ,result.access_token, cookieConfig)
  
  cookieStore.set(USERNAME_LABEL, username?? "undefined", cookieConfig)
  return nextResponseResult;
}