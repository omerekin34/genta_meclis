"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  applicationStatuses,
  type ApplicationKind,
  type ApplicationRecord,
  type ApplicationStatus,
  type DelegateMember,
} from "@/lib/application-types";

const statusLabel: Record<ApplicationStatus, string> = {
  yeni: "Onay bekliyor",
  incelendi: "İnceleniyor",
  kabul: "Kayıt tamamlandı",
  red: "Reddedildi",
};

const kindLabel: Record<ApplicationKind, string> = {
  bireysel: "Bireysel",
  delegasyon: "Delegasyon",
};

const toastText: Record<ApplicationStatus, string> = {
  yeni: "Başvuru yeni olarak işaretlendi",
  incelendi: "Başvuru incelemeye alındı",
  kabul: "Başvuru onaylandı",
  red: "Başvuru reddedildi",
};

export function ApplicationsPanel() {
  const [rows, setRows] = useState<ApplicationRecord[]>([]);
  const [openId, setOpenId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/applications");
    const body = (await response.json().catch(() => null)) as { rows?: ApplicationRecord[]; error?: string } | null;
    setLoading(false);
    if (!response.ok) {
      setError(body?.error ?? "Başvurular alınamadı.");
      setRows([]);
      return;
    }
    setError("");
    setRows(body?.rows ?? []);
  }, []);

  useEffect(() => {
    const start = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(start);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function setStatus(row: ApplicationRecord, status: ApplicationStatus) {
    if (!window.confirm("Bu işlemi gerçekleştirmek istediğinize emin misiniz?")) return;
    const response = await fetch(`/api/admin/applications/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, kind: row.kind }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Durum güncellenemedi.");
      return;
    }
    setError("");
    setRows((current) => current.map((item) => (item.id === row.id && item.kind === row.kind ? { ...item, status } : item)));
    setToast({ id: Date.now(), text: toastText[status] });
  }

  async function remove(row: ApplicationRecord) {
    const confirmed = window.confirm(`${row.full_name} kaydı silinsin mi? Bu işlem geri alınamaz.`);
    if (!confirmed) return;
    const response = await fetch(`/api/admin/applications/${row.id}?kind=${row.kind}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Başvuru silinemedi.");
      return;
    }
    setError("");
    setOpenId("");
    setRows((current) => current.filter((item) => !(item.id === row.id && item.kind === row.kind)));
  }

  if (loading) return <p className="text-sm text-ink/55">Başvurular yükleniyor.</p>;

  return (
    <div className="space-y-4">
      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-2xl border border-brand/15 bg-white py-3 pr-5 pl-4 text-sm font-medium text-brand shadow-[0_18px_40px_-20px_rgba(108,17,16,0.55)]"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-brand text-white" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
              <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {toast.text}
        </div>
      ) : null}
      {error ? <p className="rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand">{error}</p> : null}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink/60">{rows.length} başvuru</p>
        <button type="button" onClick={() => void load()} className="text-sm text-brand">
          Yenile
        </button>
      </div>
      {rows.length === 0 && !error ? (
        <p className="rounded-3xl border border-brand/10 bg-white px-5 py-8 text-sm text-ink/60">
          Henüz kayıtlı başvuru yok. Form gönderildiğinde burada görünür.
        </p>
      ) : null}
      {(["bireysel", "delegasyon"] as const).map((kind) => {
        const group = rows.filter((row) => row.kind === kind);
        return (
          <section key={kind} className="space-y-3">
            <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-brand uppercase">
              {kindLabel[kind]} · {group.length}
            </h2>
            {group.length === 0 ? (
              <p className="rounded-3xl border border-brand/10 bg-white px-5 py-6 text-sm text-ink/55">Bu türde kayıt yok.</p>
            ) : (
              group.map((row) => renderCard(row))
            )}
          </section>
        );
      })}
    </div>
  );

  function renderCard(row: ApplicationRecord) {
        const open = openId === `${row.kind}-${row.id}`;
        const when = new Date(row.created_at).toLocaleString("tr-TR", {
          dateStyle: "medium",
          timeStyle: "short",
        });
        return (
          <article key={`${row.kind}-${row.id}`} className="rounded-3xl border border-brand/10 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => setOpenId(open ? "" : `${row.kind}-${row.id}`)}>
                <p className="font-display text-lg font-semibold text-brand">{row.full_name}</p>
                <p className="mt-1 text-sm text-ink/65">
                  {kindLabel[row.kind]} · {row.school}
                </p>
                <p className="mt-1 text-xs text-ink/45">{when}</p>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-brand/10 px-3 py-1 font-display text-[11px] tracking-[0.12em] text-brand uppercase">
                  {statusLabel[row.status]}
                </span>
                <button
                  type="button"
                  onClick={() => void remove(row)}
                  className="rounded-full border border-brand/25 px-3 py-1 text-sm text-brand"
                >
                  Sil
                </button>
              </div>
            </div>
            {open ? (
              <div className="mt-5 border-t border-brand/10 pt-5">
                <div className="space-y-5">
                  <FieldGroup title="Kimlik">
                    <Fact label="T.C. kimlik" value={row.national_id} />
                    <Fact label="Okul" value={row.school} />
                    <Fact label="Sınıf" value={row.grade} />
                    <Fact label="Telefon" value={row.phone} />
                    <Fact label="E-posta" value={row.email} />
                  </FieldGroup>
                  <FieldGroup title="Komisyon">
                    <Fact label="1. tercih" value={row.commission_1} />
                    <Fact label="2. tercih" value={row.commission_2} />
                    <Fact label="3. tercih" value={row.commission_3} />
                    <Fact label="Tercih gerekçesi" value={row.commission_reason} />
                    <Fact label="Komisyon değişikliği" value={row.accept_reassignment ? "Kabul" : "Yok"} />
                  </FieldGroup>
                  <FieldGroup title="Yanıtlar">
                    <Fact label="Motivasyon" value={row.motivation} />
                    <Fact label="Deneyim" value={row.experience || "—"} />
                    {row.kind === "bireysel" ? <Fact label="Katılım sorusu" value={row.participation} /> : null}
                    {row.kind === "delegasyon" ? <Fact label="Diğer delegeler" value={row.other_delegates || "—"} /> : null}
                    <Fact label="Kayıt izni" value={row.accept_media ? "Kabul" : "Yok"} />
                  </FieldGroup>
                </div>
                {row.kind === "delegasyon" ? <Delegates delegates={row.delegates} /> : null}
                {row.status === "kabul" ? (
                  <p className="mt-5 rounded-2xl bg-brand px-4 py-3 text-sm text-white">Kayıt tamamlandı. Takip sayfasında Kabul görünür.</p>
                ) : (
                  <p className="mt-5 text-sm text-ink/60">Kabul et dersen kayıt tamamlanır ve başvurana Kabul görünür.</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void setStatus(row, "kabul")}
                    className={`rounded-full px-4 py-2 text-sm ${row.status === "kabul" ? "bg-brand text-white" : "bg-brand text-white"}`}
                  >
                    Kabul et
                  </button>
                  <button
                    type="button"
                    onClick={() => void setStatus(row, "incelendi")}
                    className={`rounded-full border px-4 py-2 text-sm ${row.status === "incelendi" ? "border-brand bg-brand/10 text-brand" : "border-brand/20 text-brand"}`}
                  >
                    İncelendi
                  </button>
                  <button
                    type="button"
                    onClick={() => void setStatus(row, "red")}
                    className={`rounded-full border px-4 py-2 text-sm ${row.status === "red" ? "border-brand bg-brand/10 text-brand" : "border-brand/20 text-ink/70"}`}
                  >
                    Reddet
                  </button>
                  {applicationStatuses
                    .filter((status) => status === "yeni")
                    .map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => void setStatus(row, status)}
                        className={`rounded-full border px-4 py-2 text-sm ${row.status === status ? "border-brand bg-brand/10 text-brand" : "border-brand/20 text-ink/55"}`}
                      >
                        Yeni
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
          </article>
        );
  }
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">{title}</h3>
      <dl className="mt-3 space-y-3 text-sm">{children}</dl>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-[11px] tracking-[0.14em] text-ink/45 uppercase">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-ink/85">{value}</dd>
    </div>
  );
}

function Delegates({ delegates }: { delegates: DelegateMember[] }) {
  return (
    <div className="mt-5 space-y-3">
      {delegates.map((person) => (
        <div key={person.slot} className="rounded-2xl bg-ivory px-4 py-3">
          <p className="font-display text-xs tracking-[0.14em] text-brand uppercase">{person.slot}. delege</p>
          <p className="mt-2 text-sm text-ink/85">{person.full_name}</p>
          <p className="text-sm text-ink/65">
            {person.school} · {person.grade}
          </p>
          <p className="text-sm text-ink/65">
            {person.email} · {person.national_id}
          </p>
          <p className="text-sm text-ink/65">{person.experience || "Deneyim yok"}</p>
          <p className="text-sm text-ink/65">
            {person.commission_1}, {person.commission_2}, {person.commission_3}
          </p>
        </div>
      ))}
    </div>
  );
}
