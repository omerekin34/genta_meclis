"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import {
  getMisirTuruContent,
  misirTuruImageKeys,
  saveMisirTuruContent,
  uploadMisirTuruFile,
  type MisirTuruContent,
  type MisirTuruImageKey,
} from "@/lib/misir-turu";

export type MisirTuruActionResult =
  | { ok: true; content: MisirTuruContent }
  | { ok: false; error: string };

export async function getMisirTuru(): Promise<MisirTuruContent> {
  return getMisirTuruContent();
}

export async function updateMisirTuru(input: unknown): Promise<MisirTuruActionResult> {
  if (!(await isAuthed())) return { ok: false, error: "Oturum gerekli." };
  try {
    const content = await saveMisirTuruContent(input);
    revalidatePath("/misir-turu");
    revalidatePath("/admin/misir-turu");
    return { ok: true, content };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Kayıt tamamlanamadı." };
  }
}

export async function uploadMisirTuruImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  if (!(await isAuthed())) return { error: "Oturum gerekli." };
  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) return { error: "Dosya seçilmedi." };
  const slot = String(formData.get("slot") ?? "");
  if (slot && !misirTuruImageKeys.includes(slot as MisirTuruImageKey)) {
    return { error: "Geçersiz görsel alanı." };
  }
  try {
    const url = await uploadMisirTuruFile(file);
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Görsel yüklenemedi." };
  }
}
