import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getContent, resetContent, saveContent } from "@/lib/content";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  return NextResponse.json(getContent());
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const content = saveContent(await request.json());
    return NextResponse.json(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt tamamlanamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  return NextResponse.json(resetContent());
}
