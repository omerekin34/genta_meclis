import { NextResponse } from "next/server";
import { insertApplication, readApplication } from "@/lib/applications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Başvuru okunamadı." }, { status: 400 });
  }

  const parsed = readApplication(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const saved = await insertApplication(parsed.record);
  if ("error" in saved) return NextResponse.json({ error: saved.error }, { status: 503 });
  return NextResponse.json({ ok: true, id: saved.id, kind: saved.kind });
}
