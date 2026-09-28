import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { listApplications } from "@/lib/applications";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  const result = await listApplications();
  if (result.error) return NextResponse.json({ error: result.error, rows: [] }, { status: 503 });
  return NextResponse.json({ rows: result.rows });
}
