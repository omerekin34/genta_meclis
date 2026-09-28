import { NextResponse } from "next/server";
import { isAuthed, passwordMatches, savePassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { current?: string; next?: string; again?: string } | null;
  const current = body?.current ?? "";
  const next = body?.next ?? "";
  const again = body?.again ?? "";

  if (!passwordMatches(current)) return NextResponse.json({ error: "Şu anki şifre doğru değil." }, { status: 400 });
  if (next.length < 8) return NextResponse.json({ error: "Yeni şifre en az 8 karakter olsun." }, { status: 400 });
  if (next !== again) return NextResponse.json({ error: "Yeni şifreler aynı değil." }, { status: 400 });
  if (next === current) return NextResponse.json({ error: "Yeni şifre eskisinden farklı olsun." }, { status: 400 });

  savePassword(next);
  return NextResponse.json({ ok: true });
}
