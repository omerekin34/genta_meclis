import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { getMisirTuruContent, saveMisirTuruContent } from "@/lib/misir-turu";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  return NextResponse.json(await getMisirTuruContent());
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const content = await saveMisirTuruContent(await request.json());
    revalidatePath("/misir-turu");
    revalidatePath("/admin/misir-turu");
    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Kayıt tamamlanamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
