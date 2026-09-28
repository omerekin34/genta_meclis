import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { applicationStatuses, type ApplicationKind, type ApplicationStatus } from "@/lib/application-types";
import { deleteApplication, updateApplicationStatus } from "@/lib/applications";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  const { id } = await context.params;
  let status: ApplicationStatus | null = null;
  let kind: ApplicationKind | null = null;
  try {
    const body = (await request.json()) as { status?: string; kind?: string };
    if (applicationStatuses.includes(body.status as ApplicationStatus)) status = body.status as ApplicationStatus;
    if (body.kind === "bireysel" || body.kind === "delegasyon") kind = body.kind;
  } catch {
    status = null;
  }
  if (!status || !kind) return NextResponse.json({ error: "Durum seçin." }, { status: 400 });
  const saved = await updateApplicationStatus(id, kind, status);
  if ("error" in saved) return NextResponse.json({ error: saved.error }, { status: 503 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  const { id } = await context.params;
  const kindParam = new URL(request.url).searchParams.get("kind");
  const kind: ApplicationKind | null = kindParam === "bireysel" || kindParam === "delegasyon" ? kindParam : null;
  if (!kind) return NextResponse.json({ error: "Başvuru türü gerekli." }, { status: 400 });
  const removed = await deleteApplication(id, kind);
  if ("error" in removed) return NextResponse.json({ error: removed.error }, { status: 503 });
  return NextResponse.json({ ok: true });
}
