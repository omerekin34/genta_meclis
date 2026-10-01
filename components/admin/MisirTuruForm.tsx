"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { optimizeImageForUpload, uploadReadyMaxBytes } from "@/lib/optimize-image";
import { type MisirTuruContent, type MisirTuruImageKey } from "@/lib/misir-turu";
import { updateMisirTuru, uploadMisirTuruImage } from "@/app/admin/misir-turu/actions";

const imageFields: { key: MisirTuruImageKey; label: string; hint: string }[] = [
  { key: "hero_image", label: "Hero Arka Planı", hint: "Hero bölümünün arkasında, video ve metnin altında durur." },
  { key: "hurghada_image", label: "Hurghada Görseli", hint: "Rota kartının üstünde görünür." },
  { key: "luksor_image", label: "Luksor Görseli", hint: "Rota kartının üstünde görünür." },
  { key: "kahire_image", label: "Kahire Görseli", hint: "Rota kartının üstünde görünür." },
];

export function MisirTuruForm({ initial }: { initial: MisirTuruContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState<Partial<Record<MisirTuruImageKey, "optimize" | "upload">>>({});
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const busy = pending || Object.keys(uploading).length > 0;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function patch(key: keyof MisirTuruContent, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function uploadSlot(key: MisirTuruImageKey, file: File) {
    setUploading((current) => ({ ...current, [key]: "optimize" }));
    setError("");
    try {
      const optimized = await optimizeImageForUpload(file);
      if (optimized.size > uploadReadyMaxBytes) {
        setError("Görsel optimize edildikten sonra hâlâ çok büyük. Daha küçük bir dosya deneyin.");
        setUploading((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
        return;
      }
      setUploading((current) => ({ ...current, [key]: "upload" }));
      const body = new FormData();
      body.append("file", optimized);
      body.append("slot", key);
      const result = await uploadMisirTuruImage(body);
      if (!result.url) {
        setError(result.error ?? "Görsel yüklenemedi.");
        return;
      }
      patch(key, result.url);
      setToast({ id: Date.now(), text: "Görsel yüklendi." });
    } catch {
      setError("Görsel optimize edilemedi. Başka bir dosya deneyin.");
    } finally {
      setUploading((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }

  async function save() {
    setPending(true);
    setError("");
    const result = await updateMisirTuru(draft);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDraft(result.content);
    setToast({ id: Date.now(), text: "Mısır Turu kaydedildi." });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/giris");
    router.refresh();
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-brand/10 bg-ivory/95 px-5 py-4 backdrop-blur sm:px-6">
        <div>
          <Link href="/admin" className="text-sm text-ink/55 hover:text-brand">
            ← Yönetim
          </Link>
          <p className="mt-1 font-display text-lg font-semibold text-brand">Mısır Turu</p>
          <p className="text-sm text-ink/55">Metin, video ve görselleri buradan güncelleyin.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link href="/misir-turu" className="text-sm text-ink/55 hover:text-brand">
            Sayfayı gör
          </Link>
          <button type="button" onClick={logout} className="text-sm text-ink/55 hover:text-brand">
            Çıkış
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="rounded-full bg-brand px-5 py-2.5 font-display text-[12px] font-semibold tracking-[0.12em] text-white uppercase transition-colors duration-500 hover:bg-brand-deep disabled:opacity-40"
          >
            {pending ? "Kaydediliyor" : "Kaydet"}
          </button>
        </div>
      </header>

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

      <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
        {error ? <p className="rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand">{error}</p> : null}

        <Group title="Hero" hint="Başlık, tarih ve video adresi. Görsel, videonun arkasında karartılmış arka plan olur.">
          <TextField label="Üst yazı" value={draft.hero_eyebrow} onChange={(value) => patch("hero_eyebrow", value)} />
          <TextField label="Başlık" value={draft.hero_title} onChange={(value) => patch("hero_title", value)} />
          <TextField label="Tarih" value={draft.hero_dates} onChange={(value) => patch("hero_dates", value)} />
          <TextField label="Alt metin" value={draft.hero_lead} onChange={(value) => patch("hero_lead", value)} />
          <TextField label="Rozet" value={draft.hero_badge} onChange={(value) => patch("hero_badge", value)} />
          <TextField
            label="Video"
            value={draft.hero_video}
            placeholder="/media/misir-hero.mp4 veya https://..."
            onChange={(value) => patch("hero_video", value)}
          />
        </Group>

        <Group title="Görseller" hint="Yüklemeden önce görseller tarayıcıda 1.5 MB / 1920 px olacak şekilde sıkıştırılır.">
          {imageFields.map((field) => (
            <ImageUpload
              key={field.key}
              label={field.label}
              hint={field.hint}
              value={draft[field.key]}
              phase={uploading[field.key] ?? "idle"}
              onChange={(value) => patch(field.key, value)}
              onFile={(file) => void uploadSlot(field.key, file)}
            />
          ))}
        </Group>

        <Group title="Hikaye">
          <AreaField label="Giriş metni" value={draft.intro_text} onChange={(value) => patch("intro_text", value)} rows={6} />
        </Group>

        <Group title="Hurghada">
          <TextField label="Başlık" value={draft.hurghada_title} onChange={(value) => patch("hurghada_title", value)} />
          <TextField label="Alt başlık" value={draft.hurghada_subtitle} onChange={(value) => patch("hurghada_subtitle", value)} />
          <AreaField label="Metin" value={draft.hurghada_body} onChange={(value) => patch("hurghada_body", value)} />
          <TextField label="Deneyim 1 başlık" value={draft.hurghada_exp1_title} onChange={(value) => patch("hurghada_exp1_title", value)} />
          <AreaField label="Deneyim 1 metin" value={draft.hurghada_exp1_text} onChange={(value) => patch("hurghada_exp1_text", value)} />
          <TextField label="Deneyim 2 başlık" value={draft.hurghada_exp2_title} onChange={(value) => patch("hurghada_exp2_title", value)} />
          <AreaField label="Deneyim 2 metin" value={draft.hurghada_exp2_text} onChange={(value) => patch("hurghada_exp2_text", value)} />
        </Group>

        <Group title="Luksor">
          <TextField label="Başlık" value={draft.luksor_title} onChange={(value) => patch("luksor_title", value)} />
          <TextField label="Alt başlık" value={draft.luksor_subtitle} onChange={(value) => patch("luksor_subtitle", value)} />
          <AreaField label="Metin" value={draft.luksor_body} onChange={(value) => patch("luksor_body", value)} />
          <AreaField label="Maddeler (her satır bir madde)" value={draft.luksor_items} onChange={(value) => patch("luksor_items", value)} />
          <AreaField label="Kapanış" value={draft.luksor_closing} onChange={(value) => patch("luksor_closing", value)} />
        </Group>

        <Group title="Kahire">
          <TextField label="Başlık" value={draft.kahire_title} onChange={(value) => patch("kahire_title", value)} />
          <TextField label="Alt başlık" value={draft.kahire_subtitle} onChange={(value) => patch("kahire_subtitle", value)} />
          <AreaField label="Metin" value={draft.kahire_body} onChange={(value) => patch("kahire_body", value)} />
          <AreaField label="Maddeler (her satır bir madde)" value={draft.kahire_items} onChange={(value) => patch("kahire_items", value)} />
          <AreaField label="Kapanış" value={draft.kahire_closing} onChange={(value) => patch("kahire_closing", value)} />
        </Group>

        <Group title="Final">
          <TextField label="Başlık" value={draft.finale_title} onChange={(value) => patch("finale_title", value)} />
          <TextField label="Hurghada başlık" value={draft.finale_hurghada_title} onChange={(value) => patch("finale_hurghada_title", value)} />
          <TextField label="Hurghada metin" value={draft.finale_hurghada_text} onChange={(value) => patch("finale_hurghada_text", value)} />
          <TextField label="Luksor başlık" value={draft.finale_luksor_title} onChange={(value) => patch("finale_luksor_title", value)} />
          <TextField label="Luksor metin" value={draft.finale_luksor_text} onChange={(value) => patch("finale_luksor_text", value)} />
          <TextField label="Kahire başlık" value={draft.finale_kahire_title} onChange={(value) => patch("finale_kahire_title", value)} />
          <TextField label="Kahire metin" value={draft.finale_kahire_text} onChange={(value) => patch("finale_kahire_text", value)} />
          <AreaField label="Metin" value={draft.finale_body} onChange={(value) => patch("finale_body", value)} rows={5} />
          <TextField label="Slogan" value={draft.finale_headline} onChange={(value) => patch("finale_headline", value)} />
          <AreaField label="Kapanış" value={draft.finale_footer} onChange={(value) => patch("finale_footer", value)} />
        </Group>
      </div>
    </div>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-brand/10 bg-white p-5">
      <h2 className="font-display text-sm font-semibold text-brand">{title}</h2>
      {hint ? <p className="mt-1 text-sm leading-6 text-ink/55">{hint}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

function AreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

function ImageUpload({
  label,
  hint,
  value,
  phase,
  onChange,
  onFile,
}: {
  label: string;
  hint: string;
  value: string;
  phase: "idle" | "optimize" | "upload";
  onChange: (value: string) => void;
  onFile: (file: File) => void;
}) {
  const busy = phase !== "idle";
  return (
    <div>
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand/15 bg-ivory">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin önizlemesi her kaynaktan gelebilir
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-ink/40">Görsel yok</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex cursor-pointer items-center rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white ${busy ? "pointer-events-none opacity-50" : ""}`}
            >
              {phase === "optimize" ? "Optimize ediliyor" : phase === "upload" ? "Yükleniyor" : "Bilgisayardan seç"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onFile(file);
                }}
              />
            </label>
            {value ? (
              <button type="button" onClick={() => onChange("")} className="text-sm text-ink/55 hover:text-brand" disabled={busy}>
                Görseli kaldır
              </button>
            ) : null}
          </div>
          <p className="text-xs leading-5 text-ink/50">
            {hint} JPG, PNG veya WEBP. Yüksek boyutlu görseller yüklemeden önce 1.5 MB / 1920 px olacak şekilde sıkıştırılır.
          </p>
        </div>
      </div>
    </div>
  );
}
