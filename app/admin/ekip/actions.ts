"use server";

import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import { teamGeneralAssemblyGroup, type TeamMember } from "@/lib/content-types";
import { genelKurulMembers, replaceGenelKurul } from "@/lib/team";

export type GenelKurulActionResult =
  | { ok: true; members: TeamMember[] }
  | { ok: false; error: string };

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function normalizeGenelKurulMember(value: unknown, index: number): TeamMember {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: text(row.id) || `team-gk-${index + 1}`,
    name: text(row.name),
    role: text(row.role) || "Genel Kurul Üyesi",
    group: teamGeneralAssemblyGroup,
    school: text(row.school),
    photo: text(row.photo),
  };
}

export async function getGenelKurulMembers(): Promise<TeamMember[]> {
  const content = await getContent();
  return genelKurulMembers(content.team);
}

export async function updateGenelKurulMembers(input: unknown): Promise<GenelKurulActionResult> {
  if (!(await isAuthed())) return { ok: false, error: "Oturum gerekli." };
  try {
    const incoming = Array.isArray(input) ? input : [];
    const members = incoming.map(normalizeGenelKurulMember);
    const ids = members.map((member) => member.id.trim());
    if (ids.some((id) => !id)) return { ok: false, error: "Üye kimliği boş olamaz." };
    if (new Set(ids).size !== ids.length) return { ok: false, error: "İki üye aynı kimliği kullanamaz." };

    const content = await getContent();
    const saved = await saveContent({
      ...content,
      team: replaceGenelKurul(content.team, members),
    });
    revalidatePath("/ekibimiz");
    revalidatePath("/ekibimiz/akademik");
    revalidatePath("/admin");
    return { ok: true, members: genelKurulMembers(saved.team) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Kayıt tamamlanamadı." };
  }
}
