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
    <div className="space-y-6">
      <aside className="rounded-3xl border border-brand/20 bg-white px-6 py-6 sm:px-8">
        <p className="font-display text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">Çok önemli</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-brand">Takip numaranı sakla.</h2>
        <p className="mt-3 text-sm leading-7 text-ink/80">
          Başvuruyu gönderince sana bir kod verilir. Bu kod kaydın tek anahtarıdır. Ekran görüntüsü al veya bir yere yaz. Kod olmadan bu sayfada sonucun görünmez. Onaylanırsa burada Kabul yazılır.
        </p>
      </aside>
      <form onSubmit={submit} className="rounded-3xl bg-paper px-6 py-8 sm:px-10">
        <label className="block">
          <span className="font-display text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">Takip numarası</span>
          <input
            value={kod}
            onChange={(event) => setKod(event.target.value)}
            className="mt-3 w-full rounded-2xl border border-brand/15 bg-ivory px-5 py-4 text-[15px] text-ink outline-none focus:border-brand"
            placeholder="Başvurudan sonra verilen numara"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Bakılıyor" : "Sorgula"}
        </button>
        {error ? (
          <p className="mt-5 text-sm text-brand" role="alert">
            {error}
          </p>
        ) : null}
      </form>
      {found && copy ? (
        <div className="rounded-3xl bg-brand px-6 py-10 text-center text-white sm:px-10">
          <p className="font-display text-xs tracking-[0.22em] text-white/70 uppercase">
            {found.kind === "bireysel" ? "Bireysel başvuru" : "Delegasyon başvurusu"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold">{copy.title}</h2>
          <p className="mt-3 text-sm text-white/80">{found.fullName}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/85">{copy.text}</p>
        </div>
      ) : null}
    </div>
  );
}
