import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  ApplicationKind,
  ApplicationRecord,
  ApplicationStatus,
  DelegateMember,
  DelegationApplication,
  IndividualApplication,
} from "@/lib/application-types";

export type { ApplicationKind, ApplicationRecord, ApplicationStatus };

function adminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function flag(value: unknown) {
  return value === true;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isNationalId(value: string) {
  return /^[1-9]\d{10}$/.test(value.replace(/\s/g, ""));
}

function isLocalPhone(value: string) {
  return /^0\d{10}$/.test(value.replace(/\D/g, ""));
}

function person(record: Record<string, unknown>) {
  return {
    full_name: text(record.fullName),
    national_id: text(record.nationalId).replace(/\s/g, ""),
    school: text(record.school),
    grade: text(record.grade),
    phone: text(record.phone),
    email: text(record.email),
    experience: text(record.experience),
    motivation: text(record.motivation),
    commission_1: text(record.commission1),
    commission_2: text(record.commission2),
    commission_3: text(record.commission3),
    commission_reason: text(record.commissionReason),
    accept_reassignment: flag(record.acceptReassignment),
    accept_media: flag(record.acceptMedia),
  };
}

function checkPerson(row: ReturnType<typeof person>) {
  if (!row.full_name) return "Ad soyad zorunludur.";
  if (!isNationalId(row.national_id)) return "T.C. kimlik numarası 11 hane olmalıdır.";
  if (!isEmail(row.email)) return "Geçerli bir e-posta yazın.";
  if (!isLocalPhone(row.phone)) return "Telefonu başına 0 koyarak yazın.";
  if (!row.school) return "Okul adı zorunludur.";
  if (!row.grade) return "Sınıf seçin.";
  if (!row.motivation) return "Motivasyon zorunludur.";
  if (!row.commission_1 || !row.commission_2 || !row.commission_3) return "Üç komisyon tercihi gerekir.";
  if (!row.commission_reason) return "Tercih gerekçesi zorunludur.";
  if (!row.accept_reassignment || !row.accept_media) return "Kabul kutularını işaretleyin.";
  return "";
}

function member(value: unknown, slot: number): { row: DelegateMember } | { error: string } {
  if (!value || typeof value !== "object") return { error: `${slot}. delege eksik.` };
  const record = value as Record<string, unknown>;
  const row: DelegateMember = {
    slot,
    full_name: text(record.fullName),
    national_id: text(record.nationalId).replace(/\s/g, ""),
    email: text(record.email),
    school: text(record.school),
    grade: text(record.grade),
    experience: text(record.experience),
    commission_1: text(record.commission1),
    commission_2: text(record.commission2),
    commission_3: text(record.commission3),
  };
  if (!row.full_name) return { error: `${slot}. delegenin adı zorunludur.` };
  if (!isNationalId(row.national_id)) return { error: `${slot}. delegenin T.C. kimliği 11 hane olmalıdır.` };
  if (!isEmail(row.email)) return { error: `${slot}. delegenin e-postası geçersiz.` };
  if (!row.school || !row.grade) return { error: `${slot}. delegenin okul ve sınıfı zorunludur.` };
  if (!row.commission_1 || !row.commission_2 || !row.commission_3) return { error: `${slot}. delege üç komisyon seçmelidir.` };
  return { row };
}

export function readApplication(body: unknown): { record: ApplicationRecord } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Başvuru okunamadı." };
  const kind = (body as { kind?: unknown }).kind;
  const payload = (body as { payload?: unknown }).payload;
  if (kind !== "bireysel" && kind !== "delegasyon") return { error: "Başvuru türü seçin." };
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { error: "Başvuru eksik." };

  const record = payload as Record<string, unknown>;
  const shared = person(record);
  const problem = checkPerson(shared);
  if (problem) return { error: problem };

  if (kind === "bireysel") {
    const participation = text(record.participation);
    if (!participation) return { error: "Katılım sorusu zorunludur." };
    const row: IndividualApplication = {
      ...shared,
      id: "",
      created_at: "",
      status: "yeni",
      kind: "bireysel",
      participation,
    };
    return { record: row };
  }

  const delegates = record.delegates;
  if (!Array.isArray(delegates) || delegates.length < 5) return { error: "Delegasyon için beş delege bilgisi gerekir." };
  const members: DelegateMember[] = [];
  for (let index = 0; index < 5; index += 1) {
    const parsed = member(delegates[index], index + 1);
    if ("error" in parsed) return parsed;
    members.push(parsed.row);
  }
  const row: DelegationApplication = {
    ...shared,
    id: "",
    created_at: "",
    status: "yeni",
    kind: "delegasyon",
    other_delegates: text(record.otherDelegates),
    delegates: members,
  };
  return { record: row };
}

export async function insertApplication(record: ApplicationRecord) {
  const supabase = adminClient();
  if (!supabase) return { error: "Supabase bağlantısı henüz yok." as const };

  if (record.kind === "bireysel") {
    const { id: _id, created_at: _created, kind: _kind, ...row } = record;
    const inserted = await supabase.from("individual_applications").insert(row).select("id").single();
    if (inserted.error || !inserted.data) return { error: "Başvuru kaydedilemedi." as const };
    return { ok: true as const, id: inserted.data.id as string, kind: "bireysel" as const };
  }

  const { id: _id, created_at: _created, kind: _kind, delegates, ...row } = record;
  const inserted = await supabase.from("delegation_applications").insert(row).select("id").single();
  if (inserted.error || !inserted.data) return { error: "Başvuru kaydedilemedi." as const };
  const members = delegates.map((delegate) => ({ ...delegate, application_id: inserted.data.id }));
  const membersResult = await supabase.from("delegation_members").insert(members);
  if (membersResult.error) {
    await supabase.from("delegation_applications").delete().eq("id", inserted.data.id);
    return { error: "Delegeler kaydedilemedi." as const };
  }
  return { ok: true as const, id: inserted.data.id as string, kind: "delegasyon" as const };
}

const individualColumns =
  "id, created_at, status, full_name, national_id, school, grade, phone, email, experience, motivation, commission_1, commission_2, commission_3, commission_reason, accept_reassignment, accept_media, participation";

const delegationColumns =
  "id, created_at, status, full_name, national_id, school, grade, phone, email, experience, motivation, commission_1, commission_2, commission_3, commission_reason, accept_reassignment, accept_media, other_delegates, delegation_members(slot, full_name, national_id, email, school, grade, experience, commission_1, commission_2, commission_3)";

export async function listApplications() {
  const supabase = adminClient();
  if (!supabase) return { error: "Supabase bağlantısı henüz yok." as const, rows: [] as ApplicationRecord[] };

  const [individuals, delegations] = await Promise.all([
    supabase.from("individual_applications").select(individualColumns).order("created_at", { ascending: false }),
    supabase.from("delegation_applications").select(delegationColumns).order("created_at", { ascending: false }),
  ]);
  if (individuals.error || delegations.error) return { error: "Başvurular alınamadı." as const, rows: [] as ApplicationRecord[] };

  const rows: ApplicationRecord[] = [
    ...(individuals.data ?? []).map((row) => ({ ...(row as Omit<IndividualApplication, "kind">), kind: "bireysel" as const })),
    ...(delegations.data ?? []).map((row) => {
      const source = row as Omit<DelegationApplication, "kind" | "delegates"> & { delegation_members?: DelegateMember[] };
      const { delegation_members, ...rest } = source;
      return {
        ...rest,
        kind: "delegasyon" as const,
        delegates: [...(delegation_members ?? [])].sort((a, b) => a.slot - b.slot),
      };
    }),
  ];
  rows.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return { rows };
}

export async function lookupApplicationStatus(id: string): Promise<
  | { error: string }
  | { kind: ApplicationKind; fullName: string; status: ApplicationStatus }
> {
  const supabase = adminClient();
  if (!supabase) return { error: "Supabase bağlantısı henüz yok." as const };
  const [individual, delegation] = await Promise.all([
    supabase.from("individual_applications").select("full_name, status").eq("id", id).maybeSingle(),
    supabase.from("delegation_applications").select("full_name, status").eq("id", id).maybeSingle(),
  ]);
  if (individual.error || delegation.error) return { error: "Durum alınamadı." as const };
  if (individual.data) {
    return { kind: "bireysel" as const, fullName: individual.data.full_name as string, status: individual.data.status as ApplicationStatus };
  }
  if (delegation.data) {
    return { kind: "delegasyon" as const, fullName: delegation.data.full_name as string, status: delegation.data.status as ApplicationStatus };
  }
  return { error: "Bu takip numarasıyla kayıt bulunamadı." as const };
}

export async function updateApplicationStatus(id: string, kind: ApplicationKind, status: ApplicationStatus) {
  const supabase = adminClient();
  if (!supabase) return { error: "Supabase bağlantısı henüz yok." as const };
  const table = kind === "bireysel" ? "individual_applications" : "delegation_applications";
  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) return { error: "Durum güncellenemedi." as const };
  return { ok: true as const };
}

export async function deleteApplication(id: string, kind: ApplicationKind) {
  const supabase = adminClient();
  if (!supabase) return { error: "Supabase bağlantısı henüz yok." as const };
  const table = kind === "bireysel" ? "individual_applications" : "delegation_applications";
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: "Başvuru silinemedi." as const };
  return { ok: true as const };
}
