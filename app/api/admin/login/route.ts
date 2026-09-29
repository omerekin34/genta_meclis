import { NextResponse } from "next/server";
import { adminCookie, signSession, verifyCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  const user = await verifyCredentials(body?.username ?? "", body?.password ?? "");
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie, signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
