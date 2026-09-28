"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { ApplicationKind, ApplicationStatus } from "@/lib/application-types";

const resultCopy: Record<ApplicationStatus, { title: string; text: string }> = {
  yeni: {
    title: "Onay bekliyor",
    text: "Başvurunuz alındı. Koordinasyon ekibi henüz sonuçlandırmadı.",
  },
  incelendi: {
    title: "İnceleniyor",
    text: "Başvurunuz incelemede. Sonuç belli olunca bu sayfa güncellenir.",
  },
  kabul: {
    title: "Kayıt tamamlandı",
    text: "Kabul. Başvurunuz onaylandı.",
  },
  red: {
    title: "Kabul edilmedi",
    text: "Bu başvuru kabul edilmedi. Sorunuz varsa koordinasyon ekibine yazın.",
  },
};

type Found = {
  kind: ApplicationKind;
  fullName: string;
  status: ApplicationStatus;
};

export function StatusLookup() {
  const params = useSearchParams();
  const [kod, setKod] = useState(params.get("kod") ?? "");
  const [found, setFound] = useState<Found | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const initial = params.get("kod");
    if (initial) void search(initial);
    // İlk açılışta adresteki takip numarasına bakılır.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function search(value: string) {
    const trimmed = value.trim();
    setPending(true);
    setError("");
    setFound(null);
    const response = await fetch(`/api/basvuru/durum?kod=${encodeURIComponent(trimmed)}`);
    const body = (await response.json().catch(() => null)) as (Found & { error?: string }) | null;
    setPending(false);
    if (!response.ok || !body || body.error || !body.status) {
      setError(body?.error ?? "Durum alınamadı.");
      return;
    }
    setFound(body);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void search(kod);
  }

  const copy = found ? resultCopy[found.status] : null;

  return (
    <div className="bg-paper px-6 py-10 sm:px-10">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">Takip numarası</span>
          <input
            value={kod}
            onChange={(event) => setKod(event.target.value)}
            className="mt-2 w-full rounded-full border border-brand/15 bg-ivory px-5 py-3.5 text-[15px] text-ink outline-none focus:border-brand"
            placeholder="Başvurudan sonra verilen numara"
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Bakılıyor" : "Sorgula"}
        </button>
      </form>
      {error ? <p className="mt-6 text-sm text-brand">{error}</p> : null}
      {found && copy ? (
        <div className="mt-8 border-t border-brand/10 pt-8 text-center">
          <p className="font-display text-xs tracking-[0.22em] text-brand/60 uppercase">
            {found.kind === "bireysel" ? "Bireysel başvuru" : "Delegasyon başvurusu"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-brand">{copy.title}</h2>
          <p className="mt-3 text-sm text-ink/70">{found.fullName}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/75">{copy.text}</p>
        </div>
      ) : null}
    </div>
  );
}
