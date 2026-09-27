"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { iconNames, type IconName } from "@/data/commissions";
import { sponsorMarks, type SponsorMark } from "@/data/sponsors";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/layout/SocialIcons";
import type { Content } from "@/lib/content-types";

const sections = [
  ["genel", "Genel"],
  ["kisiler", "Koordinatörler"],
  ["sosyal", "Sosyal"],
  ["menu", "Menü"],
  ["hakkimizda", "Hakkımızda"],
  ["notlar", "Bilgi kartları"],
  ["komisyonlar", "Komisyonlar"],
  ["sponsorlar", "Sponsorlar"],
  ["metinler", "Metinler"],
  ["whatsapp", "WhatsApp soruları"],
  ["basvuru", "Başvuru komisyonları"],
] as const;

type SectionId = (typeof sections)[number][0];

const iconLabels: Record<IconName, string> = {
  parliament: "Meclis",
  health: "Sağlık",
  justice: "Adalet",
  education: "Eğitim",
  defense: "Savunma",
  diplomacy: "Diplomasi",
  interior: "İçişleri",
  faith: "Diyanet",
  budget: "Bütçe",
};

const markLabels: Record<SponsorMark, string> = {
  laurel: "Defne",
  columns: "Sütun",
  ring: "Halka",
  quill: "Divit",
  bridge: "Köprü",
  diamond: "Elmas",
};

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function move<T>(list: T[], index: number, direction: -1 | 1) {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return list;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

export function AdminDesk({ initial }: { initial: Content }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [section, setSection] = useState<SectionId>("genel");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [focusSlug, setFocusSlug] = useState("");
  const dirty = useMemo(() => JSON.stringify(draft) !== saved, [draft, saved]);

  function patchSite(key: keyof Content["site"], value: string) {
    setDraft((current) => ({ ...current, site: { ...current.site, [key]: value } }));
  }

  async function save() {
    setPending(true);
    setError("");
    setMessage("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = (await response.json().catch(() => null)) as Content & { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(body?.error ?? "Kayıt tamamlanamadı.");
      return;
    }
    setDraft(body);
    setSaved(JSON.stringify(body));
    setMessage("Kaydedildi. Site bu içerikle güncellenir.");
    router.refresh();
  }

  async function resetAll() {
    if (!window.confirm("Tüm düzenlemeler silinip ilk metinlere dönülsün mü?")) return;
    const response = await fetch("/api/admin/content", { method: "DELETE" });
    if (!response.ok) {
      setError("Sıfırlama tamamlanamadı.");
      return;
    }
    const body = (await response.json()) as Content;
    setDraft(body);
    setSaved(JSON.stringify(body));
    setMessage("İlk metinlere dönüldü.");
    router.refresh();
  }

  function addCoordinator() {
    setDraft((current) => ({
      ...current,
      coordinators: [
        ...current.coordinators,
        { id: uid("coord"), name: "", role: "Genel Koordinatör", phone: "", tel: "", whatsapp: "" },
      ],
    }));
  }

  function addNav() {
    setDraft((current) => ({ ...current, navItems: [...current.navItems, { href: "/", label: "Yeni sayfa" }] }));
  }

  function addPurpose() {
    setDraft((current) => ({
      ...current,
      about: { ...current.about, purpose: [...current.about.purpose, { id: uid("purpose"), text: "" }] },
    }));
  }

  function addValue() {
    setDraft((current) => ({
      ...current,
      about: { ...current.about, values: [...current.about.values, { id: uid("value"), title: "", text: "" }] },
    }));
  }

  function addNote() {
    setDraft((current) => ({
      ...current,
      practicalNotes: [...current.practicalNotes, { id: uid("note"), title: "", text: "" }],
    }));
  }

  function addCommission() {
    const slug = uid("komisyon");
    setDraft((current) => ({
      ...current,
      commissions: [
        ...current.commissions,
        { slug, name: "Yeni komisyon", fullName: "", summary: "", description: "", agenda: [], icon: "parliament", media: [] },
      ],
    }));
    setFocusSlug(slug);
  }

  function addSponsor() {
    setDraft((current) => ({
      ...current,
      sponsors: [...current.sponsors, { id: uid("sponsor"), name: "", note: "", mark: "laurel" }],
    }));
  }

  function addQuestion() {
    setDraft((current) => ({ ...current, whatsappQuestions: [...current.whatsappQuestions, ""] }));
  }

  function addPreference() {
    setDraft((current) => ({
      ...current,
      preferences: [...current.preferences, { value: "Yeni komisyon", label: "Yeni" }],
    }));
  }

  const adds: { label: string; run: () => void }[] =
    section === "kisiler"
      ? [{ label: "Ekle", run: addCoordinator }]
      : section === "menu"
        ? [{ label: "Ekle", run: addNav }]
        : section === "hakkimizda"
          ? [
              { label: "Paragraf", run: addPurpose },
              { label: "Değer", run: addValue },
            ]
          : section === "notlar"
            ? [{ label: "Ekle", run: addNote }]
            : section === "komisyonlar"
              ? [{ label: "Ekle", run: addCommission }]
              : section === "sponsorlar"
                ? [{ label: "Ekle", run: addSponsor }]
                : section === "whatsapp"
                  ? [{ label: "Ekle", run: addQuestion }]
                  : section === "basvuru"
                    ? [{ label: "Ekle", run: addPreference }]
                    : [];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/giris");
    router.refresh();
  }

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-brand-deep text-white lg:sticky lg:top-0 lg:h-svh lg:w-64">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:py-6">
          <div className="flex items-center gap-3">
            <Image src="/brand/mark.png" alt="" width={478} height={454} className="h-10 w-11 object-contain" />
            <div>
              <p className="font-display text-sm font-semibold tracking-[0.18em]">GENTA</p>
              <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Yönetim</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/" className="text-sm text-white/75">
              Siteyi gör
            </Link>
            <button type="button" onClick={logout} className="text-sm text-white/75">
              Çıkış
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto lg:pb-0" aria-label="Yönetim bölümleri">
          {sections.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`shrink-0 rounded-xl px-3 py-2.5 text-left text-sm whitespace-nowrap transition-colors duration-300 lg:block lg:w-full lg:whitespace-normal ${
                section === id ? "bg-white text-brand" : "text-white/75 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="hidden space-y-2 border-t border-white/10 p-4 lg:block">
          <Link href="/" className="block text-sm text-white/75 hover:text-white">
            Siteyi gör
          </Link>
          <button type="button" onClick={logout} className="text-sm text-white/75 hover:text-white">
            Çıkış
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-brand/10 bg-ivory/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <p className="font-display text-lg font-semibold text-brand">
              {sections.find(([id]) => id === section)?.[1]}
            </p>
            <p className="text-sm text-ink/55">{dirty ? "Kaydedilmemiş değişiklik var." : "Kayıt güncel."}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {adds.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.run}
                className="rounded-full border border-brand bg-white px-4 py-2.5 text-sm font-medium text-brand"
              >
                {action.label}
              </button>
            ))}
            <button type="button" onClick={resetAll} className="text-sm text-ink/55 hover:text-brand">
              İlk metinlere dön
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending || !dirty}
              className="rounded-full bg-brand px-5 py-2.5 font-display text-[12px] font-semibold tracking-[0.12em] text-white uppercase transition-colors duration-500 hover:bg-brand-deep disabled:opacity-40"
            >
              {pending ? "Kaydediliyor" : "Kaydet"}
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-8">
          {error ? <p className="mb-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand">{error}</p> : null}
          {message ? <p className="mb-4 rounded-2xl bg-white px-4 py-3 text-sm text-ink/70">{message}</p> : null}
          {section === "genel" ? <GeneralPanel draft={draft} patchSite={patchSite} setDraft={setDraft} /> : null}
          {section === "kisiler" ? <PeoplePanel draft={draft} setDraft={setDraft} /> : null}
          {section === "sosyal" ? <SocialPanel draft={draft} patchSite={patchSite} /> : null}
          {section === "menu" ? <MenuPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "hakkimizda" ? <AboutPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "notlar" ? <NotesPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "komisyonlar" ? (
            <CommissionsPanel draft={draft} setDraft={setDraft} focusSlug={focusSlug} />
          ) : null}
          {section === "sponsorlar" ? <SponsorsPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "metinler" ? <CopyPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "whatsapp" ? <QuestionsPanel draft={draft} setDraft={setDraft} /> : null}
          {section === "basvuru" ? <PreferencesPanel draft={draft} setDraft={setDraft} /> : null}
        </div>
      </div>
    </div>
  );
}

function GeneralPanel({
  draft,
  patchSite,
  setDraft,
}: {
  draft: Content;
  patchSite: (key: keyof Content["site"], value: string) => void;
  setDraft: Dispatch<SetStateAction<Content>>;
}) {
  return (
    <div className="space-y-4">
      <Group title="Kimlik">
        <TextField label="Kısa ad" value={draft.site.name} onChange={(value) => patchSite("name", value)} />
        <TextField label="Tam ad" value={draft.site.title} onChange={(value) => patchSite("title", value)} />
        <TextField label="Dönem" value={draft.site.edition} onChange={(value) => patchSite("edition", value)} />
      </Group>
      <Group title="Başvuru tarihi" hint="Üst şeritteki geri sayım, son gün ve saate göre işler. Sitede görünen yazıyı ayrı tutabilirsiniz.">
        <TextField
          label="Sitede görünen son tarih"
          value={draft.site.applicationDeadlineLabel}
          onChange={(value) => patchSite("applicationDeadlineLabel", value)}
        />
        <ClockField
          label="Son gün ve saat"
          iso={draft.site.applicationDeadlineIso}
          onChange={(value) => patchSite("applicationDeadlineIso", value)}
        />
      </Group>
      <Group title="Oturum" hint="Ana sayfadaki meclis sayacı, etkinliğin başlangıcına göre işler.">
        <ClockField
          label="Etkinliğin başlangıcı"
          iso={draft.site.eventStartIso}
          onChange={(value) => patchSite("eventStartIso", value)}
        />
        <TextField label="Tarih yazısı" value={draft.site.datesLabel} onChange={(value) => patchSite("datesLabel", value)} />
        <TextField label="Kısa tarih" value={draft.site.datesShort} onChange={(value) => patchSite("datesShort", value)} />
        <TextField label="Süre" value={draft.site.durationLabel} onChange={(value) => patchSite("durationLabel", value)} />
        <TextField label="Ay" value={draft.site.monthLabel} onChange={(value) => patchSite("monthLabel", value)} />
        <TextField
          label="Vurgulanan günler"
          value={draft.site.highlightedDays.join(", ")}
          onChange={(value) =>
            setDraft((current) => ({
              ...current,
              site: {
                ...current.site,
                highlightedDays: value
                  .split(",")
                  .map((item) => Number(item.trim()))
                  .filter((item) => Number.isInteger(item)),
              },
            }))
          }
        />
      </Group>
      <Group title="Yer">
        <TextField label="Şehir" value={draft.site.city} onChange={(value) => patchSite("city", value)} />
        <TextField label="Mekân" value={draft.site.venue} onChange={(value) => patchSite("venue", value)} />
        <TextField label="Kısa mekân" value={draft.site.venueShort} onChange={(value) => patchSite("venueShort", value)} />
      </Group>
      <Group title="Ücret">
        <TextField label="Katılım ücreti" value={draft.site.fee} onChange={(value) => patchSite("fee", value)} />
      </Group>
    </div>
  );
}

function SocialPanel({
  draft,
  patchSite,
}: {
  draft: Content;
  patchSite: (key: keyof Content["site"], value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <article className="rounded-3xl border border-brand/10 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
            <MailIcon />
          </span>
          <p className="font-display text-sm font-semibold text-brand">E-posta</p>
        </div>
        <div className="mt-4">
          <TextField label="Adres" value={draft.site.email} onChange={(value) => patchSite("email", value)} />
        </div>
      </article>
      <article className="rounded-3xl border border-brand/10 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
            <InstagramIcon />
          </span>
          <p className="font-display text-sm font-semibold text-brand">Instagram</p>
        </div>
        <div className="mt-4 space-y-4">
          <TextField
            label="Profil adresi"
            value={draft.site.instagram}
            onChange={(value) => patchSite("instagram", value)}
          />
          <TextField
            label="Görünen ad"
            value={draft.site.instagramLabel}
            onChange={(value) => patchSite("instagramLabel", value)}
          />
        </div>
      </article>
      <article className="rounded-3xl border border-brand/10 bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
            <WhatsAppIcon />
          </span>
          <p className="font-display text-sm font-semibold text-brand">WhatsApp topluluğu</p>
        </div>
        <div className="mt-4">
          <AreaField
            label="Katılım mesajı"
            value={draft.site.communityJoinMessage}
            onChange={(value) => patchSite("communityJoinMessage", value)}
          />
          <p className="mt-2 text-sm leading-6 text-ink/55">
            Bağlantı listedeki ilk koordinatörün numarasına gider.
          </p>
        </div>
      </article>
    </div>
  );
}

function PeoplePanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.coordinators.map((person, index) => (
        <Card
          key={person.id}
          onUp={() => setDraft((current) => ({ ...current, coordinators: move(current.coordinators, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, coordinators: move(current.coordinators, index, 1) }))}
          onDelete={() =>
            setDraft((current) => ({ ...current, coordinators: current.coordinators.filter((item) => item.id !== person.id) }))
          }
        >
          <TextField
            label="Ad soyad"
            value={person.name}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                coordinators: current.coordinators.map((item) => (item.id === person.id ? { ...item, name: value } : item)),
              }))
            }
          />
          <TextField
            label="Görev"
            value={person.role}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                coordinators: current.coordinators.map((item) => (item.id === person.id ? { ...item, role: value } : item)),
              }))
            }
          />
          <TextField
            label="Telefon"
            value={person.phone}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                coordinators: current.coordinators.map((item) => (item.id === person.id ? { ...item, phone: value } : item)),
              }))
            }
          />
        </Card>
      ))}
    </List>
  );
}

function MenuPanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.navItems.map((item, index) => (
        <Card
          key={`${item.href}-${index}`}
          onUp={() => setDraft((current) => ({ ...current, navItems: move(current.navItems, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, navItems: move(current.navItems, index, 1) }))}
          onDelete={() => setDraft((current) => ({ ...current, navItems: current.navItems.filter((_, itemIndex) => itemIndex !== index) }))}
        >
          <TextField
            label="Yazı"
            value={item.label}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                navItems: current.navItems.map((nav, navIndex) => (navIndex === index ? { ...nav, label: value } : nav)),
              }))
            }
          />
          <TextField
            label="Adres"
            value={item.href}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                navItems: current.navItems.map((nav, navIndex) => (navIndex === index ? { ...nav, href: value } : nav)),
              }))
            }
          />
        </Card>
      ))}
    </List>
  );
}

function AboutPanel({ draft, setDraft }: PanelProps) {
  return (
    <div className="space-y-4">
      <AreaField label="Giriş" value={draft.about.lead} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, lead: value } }))} />
      <AreaField label="Misyon" value={draft.about.mission} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, mission: value } }))} />
      <AreaField label="Vizyon" value={draft.about.vision} onChange={(value) => setDraft((current) => ({ ...current, about: { ...current.about, vision: value } }))} />
      <h2 className="pt-4 font-display text-sm font-semibold tracking-[0.14em] text-brand uppercase">Amaç paragrafları</h2>
      <List>
        {draft.about.purpose.map((block, index) => (
          <Card
            key={block.id}
            onDelete={() =>
              setDraft((current) => ({
                ...current,
                about: { ...current.about, purpose: current.about.purpose.filter((item) => item.id !== block.id) },
              }))
            }
            onUp={() =>
              setDraft((current) => ({ ...current, about: { ...current.about, purpose: move(current.about.purpose, index, -1) } }))
            }
            onDown={() =>
              setDraft((current) => ({ ...current, about: { ...current.about, purpose: move(current.about.purpose, index, 1) } }))
            }
          >
            <AreaField
              label="Paragraf"
              value={block.text}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  about: {
                    ...current.about,
                    purpose: current.about.purpose.map((item) => (item.id === block.id ? { ...item, text: value } : item)),
                  },
                }))
              }
            />
          </Card>
        ))}
      </List>
      <h2 className="pt-4 font-display text-sm font-semibold tracking-[0.14em] text-brand uppercase">Değerler</h2>
      <List>
        {draft.about.values.map((value, index) => (
          <Card
            key={value.id}
            onDelete={() =>
              setDraft((current) => ({
                ...current,
                about: { ...current.about, values: current.about.values.filter((item) => item.id !== value.id) },
              }))
            }
            onUp={() =>
              setDraft((current) => ({ ...current, about: { ...current.about, values: move(current.about.values, index, -1) } }))
            }
            onDown={() =>
              setDraft((current) => ({ ...current, about: { ...current.about, values: move(current.about.values, index, 1) } }))
            }
          >
            <TextField
              label="Başlık"
              value={value.title}
              onChange={(next) =>
                setDraft((current) => ({
                  ...current,
                  about: {
                    ...current.about,
                    values: current.about.values.map((item) => (item.id === value.id ? { ...item, title: next } : item)),
                  },
                }))
              }
            />
            <AreaField
              label="Metin"
              value={value.text}
              onChange={(next) =>
                setDraft((current) => ({
                  ...current,
                  about: {
                    ...current.about,
                    values: current.about.values.map((item) => (item.id === value.id ? { ...item, text: next } : item)),
                  },
                }))
              }
            />
          </Card>
        ))}
      </List>
    </div>
  );
}

function NotesPanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.practicalNotes.map((note, index) => (
        <Card
          key={note.id}
          onUp={() => setDraft((current) => ({ ...current, practicalNotes: move(current.practicalNotes, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, practicalNotes: move(current.practicalNotes, index, 1) }))}
          onDelete={() =>
            setDraft((current) => ({ ...current, practicalNotes: current.practicalNotes.filter((item) => item.id !== note.id) }))
          }
        >
          <TextField
            label="Başlık"
            value={note.title}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                practicalNotes: current.practicalNotes.map((item) => (item.id === note.id ? { ...item, title: value } : item)),
              }))
            }
          />
          <AreaField
            label="Metin"
            value={note.text}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                practicalNotes: current.practicalNotes.map((item) => (item.id === note.id ? { ...item, text: value } : item)),
              }))
            }
          />
        </Card>
      ))}
    </List>
  );
}

function CommissionsPanel({ draft, setDraft, focusSlug }: PanelProps & { focusSlug: string }) {
  const [open, setOpen] = useState(focusSlug || draft.commissions[0]?.slug || "");
  useEffect(() => {
    if (focusSlug) setOpen(focusSlug);
  }, [focusSlug]);
  const current = draft.commissions.find((item) => item.slug === open) ?? draft.commissions[0];

  function update(slug: string, patch: Partial<Content["commissions"][number]>) {
    setDraft((content) => ({
      ...content,
      commissions: content.commissions.map((item) => (item.slug === slug ? { ...item, ...patch } : item)),
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {draft.commissions.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => setOpen(item.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              current?.slug === item.slug ? "border-brand bg-brand text-white" : "border-brand/20 text-brand"
            }`}
          >
            {item.name || "Adsız"}
          </button>
        ))}
      </div>
      {current ? (
        <Card
          onDelete={() => {
            setDraft((content) => ({ ...content, commissions: content.commissions.filter((item) => item.slug !== current.slug) }));
            setOpen("");
          }}
        >
          <TextField label="Kısa ad" value={current.name} onChange={(value) => update(current.slug, { name: value })} />
          <TextField label="Tam ad" value={current.fullName} onChange={(value) => update(current.slug, { fullName: value })} />
          <TextField
            label="Adres"
            value={current.slug}
            onChange={(value) => {
              update(current.slug, { slug: value });
              setOpen(value);
            }}
          />
          <label className="block">
            <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Simge</span>
            <select
              value={current.icon}
              onChange={(event) => update(current.slug, { icon: event.target.value as IconName })}
              className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3"
            >
              {iconNames.map((icon) => (
                <option key={icon} value={icon}>
                  {iconLabels[icon]}
                </option>
              ))}
            </select>
          </label>
          <AreaField label="Özet" value={current.summary} onChange={(value) => update(current.slug, { summary: value })} />
          <AreaField label="Açıklama" value={current.description} onChange={(value) => update(current.slug, { description: value })} />
          <AreaField
            label="Gündem, her satır bir madde"
            value={current.agenda.join("\n")}
            onChange={(value) => update(current.slug, { agenda: value.split("\n").map((line) => line.trim()).filter(Boolean) })}
          />
          <AreaField
            label="Medya, her satır: gorsel veya video | başlık"
            value={current.media.map((item) => `${item.kind === "video" ? "video" : "gorsel"} | ${item.caption}`).join("\n")}
            onChange={(value) =>
              update(current.slug, {
                media: value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, index) => {
                    const [kind, caption] = line.split("|");
                    return {
                      id: current.media[index]?.id ?? uid("media"),
                      kind: kind?.trim() === "video" ? "video" : "image",
                      caption: (caption ?? kind ?? "").trim(),
                    } as const;
                  }),
              })
            }
          />
        </Card>
      ) : (
        <p className="text-sm text-ink/60">Komisyon kalmadı. Ekle ile yeni bir masa açabilirsiniz.</p>
      )}
    </div>
  );
}

function SponsorsPanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.sponsors.map((sponsor, index) => (
        <Card
          key={sponsor.id}
          onUp={() => setDraft((current) => ({ ...current, sponsors: move(current.sponsors, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, sponsors: move(current.sponsors, index, 1) }))}
          onDelete={() => setDraft((current) => ({ ...current, sponsors: current.sponsors.filter((item) => item.id !== sponsor.id) }))}
        >
          <TextField
            label="Ad"
            value={sponsor.name}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                sponsors: current.sponsors.map((item) => (item.id === sponsor.id ? { ...item, name: value } : item)),
              }))
            }
          />
          <TextField
            label="Not"
            value={sponsor.note}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                sponsors: current.sponsors.map((item) => (item.id === sponsor.id ? { ...item, note: value } : item)),
              }))
            }
          />
          <label className="block">
            <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">İşaret</span>
            <select
              value={sponsor.mark}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sponsors: current.sponsors.map((item) =>
                    item.id === sponsor.id ? { ...item, mark: event.target.value as SponsorMark } : item,
                  ),
                }))
              }
              className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3"
            >
              {sponsorMarks.map((mark) => (
                <option key={mark} value={mark}>
                  {markLabels[mark]}
                </option>
              ))}
            </select>
          </label>
        </Card>
      ))}
    </List>
  );
}

function QuestionsPanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.whatsappQuestions.map((question, index) => (
        <Card
          key={`${index}-${question.slice(0, 12)}`}
          onUp={() => setDraft((current) => ({ ...current, whatsappQuestions: move(current.whatsappQuestions, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, whatsappQuestions: move(current.whatsappQuestions, index, 1) }))}
          onDelete={() =>
            setDraft((current) => ({
              ...current,
              whatsappQuestions: current.whatsappQuestions.filter((_, itemIndex) => itemIndex !== index),
            }))
          }
        >
          <TextField
            label="Soru"
            value={question}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                whatsappQuestions: current.whatsappQuestions.map((item, itemIndex) => (itemIndex === index ? value : item)),
              }))
            }
          />
        </Card>
      ))}
    </List>
  );
}

function PreferencesPanel({ draft, setDraft }: PanelProps) {
  return (
    <List>
      {draft.preferences.map((option, index) => (
        <Card
          key={`${option.value}-${index}`}
          onUp={() => setDraft((current) => ({ ...current, preferences: move(current.preferences, index, -1) }))}
          onDown={() => setDraft((current) => ({ ...current, preferences: move(current.preferences, index, 1) }))}
          onDelete={() =>
            setDraft((current) => ({ ...current, preferences: current.preferences.filter((_, itemIndex) => itemIndex !== index) }))
          }
        >
          <TextField
            label="Kısa ad"
            value={option.label}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                preferences: current.preferences.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)),
              }))
            }
          />
          <TextField
            label="Kayıt adı"
            value={option.value}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                preferences: current.preferences.map((item, itemIndex) => (itemIndex === index ? { ...item, value } : item)),
              }))
            }
          />
        </Card>
      ))}
    </List>
  );
}

type PanelProps = {
  draft: Content;
  setDraft: Dispatch<SetStateAction<Content>>;
};

function List({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
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

function ClockField({ label, iso, onChange }: { label: string; iso: string; onChange: (value: string) => void }) {
  const date = iso.slice(0, 10);
  const time = iso.slice(11, 16);
  function write(nextDate: string, nextTime: string) {
    if (!nextDate) return;
    onChange(`${nextDate}T${nextTime || "00:00"}:00+03:00`);
  }
  return (
    <div>
      <p className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <input
          type="date"
          value={/^\d{4}-\d{2}-\d{2}$/.test(date) ? date : ""}
          onChange={(event) => write(event.target.value, time)}
          className="w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
        />
        <input
          type="time"
          value={/^\d{2}:\d{2}$/.test(time) ? time : ""}
          onChange={(event) => write(date, event.target.value)}
          className="w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
        />
      </div>
    </div>
  );
}

const copyGroups = [
  {
    key: "home" as const,
    title: "Ana sayfa",
    fields: [
      ["heroCta", "Kahraman düğmesi"],
      ["sessionEyebrow", "Oturum üst yazı"],
      ["sessionTitle", "Oturum başlığı"],
      ["sessionBody", "Oturum metni"],
      ["countdownLabel", "Sayaç yazısı"],
      ["gathered", "Süre dolunca"],
      ["aboutEyebrow", "Hakkımızda üst yazı"],
      ["aboutTitle", "Hakkımızda başlığı"],
      ["aboutCta", "Hakkımızda düğmesi"],
      ["commissionsEyebrow", "Komisyon üst yazı"],
      ["commissionsTitle", "Komisyon başlığı"],
      ["commissionsCta", "Komisyon düğmesi"],
      ["applyTitle", "Başvuru başlığı"],
      ["applyText", "Başvuru metni"],
      ["applyCta", "Başvuru düğmesi"],
      ["sponsorsEyebrow", "Sponsor üst yazı"],
      ["sponsorsTitle", "Sponsor başlığı"],
    ],
  },
  {
    key: "pages" as const,
    title: "Sayfalar",
    fields: [
      ["aboutEyebrow", "Hakkımızda üst yazı"],
      ["aboutTitle", "Hakkımızda başlığı"],
      ["aboutMission", "Misyon başlığı"],
      ["aboutVision", "Vizyon başlığı"],
      ["aboutPurpose", "Amaç başlığı"],
      ["commissionsEyebrow", "Komisyonlar üst yazı"],
      ["commissionsTitle", "Komisyonlar başlığı"],
      ["commissionsText", "Komisyonlar metni"],
      ["sponsorsEyebrow", "Sponsorlar üst yazı"],
      ["sponsorsTitle", "Sponsorlar başlığı"],
      ["sponsorsText", "Sponsorlar metni"],
      ["contactEyebrow", "İletişim üst yazı"],
      ["contactTitle", "İletişim başlığı"],
      ["contactText", "İletişim metni"],
      ["contactPhone", "Telefon kartı"],
      ["contactMail", "E-posta kartı"],
      ["contactMailNote", "E-posta notu"],
      ["contactAddress", "Adres kartı"],
      ["contactDirections", "Yol tarifi"],
      ["contactWhatsapp", "WhatsApp kartı"],
      ["contactFast", "WhatsApp notu"],
      ["contactMap", "Harita yazısı"],
      ["contactFormTitle", "Form başlığı"],
      ["contactFormHint", "Form açıklaması"],
      ["contactSubmit", "Gönder düğmesi"],
      ["applyEyebrow", "Başvuru üst yazı"],
      ["applyTitle", "Başvuru başlığı"],
      ["applyText", "Başvuru metni"],
    ],
  },
  {
    key: "frame" as const,
    title: "Üst şerit, menü ve alt bilgi",
    fields: [
      ["applyCta", "Başvuru düğmesi"],
      ["deadlineCaption", "Son tarih yazısı"],
      ["groupLabel", "Gruba katıl"],
      ["expiredLabel", "Süre dolunca"],
      ["footerMark", "Logo altı"],
      ["footerDisclaimer", "Kurum açıklaması"],
      ["feePrefix", "Ücret yazısı"],
      ["columnInstitution", "Kurum sütunu"],
      ["columnPages", "Sayfalar sütunu"],
      ["columnPeople", "Koordinasyon sütunu"],
      ["factDate", "Tarih etiketi"],
      ["factPlace", "Yer etiketi"],
      ["factDeadline", "Son başvuru etiketi"],
      ["whatsappCommunity", "WhatsApp topluluğu"],
      ["whatsappGreeting", "WhatsApp selamı"],
      ["whatsappTitle", "WhatsApp başlığı"],
      ["whatsappWho", "Kime yazılsın"],
      ["whatsappAsk", "Hazır sorular"],
      ["whatsappOwn", "Kendi sorum düğmesi"],
    ],
  },
];

function CopyPanel({ draft, setDraft }: PanelProps) {
  return (
    <div className="space-y-4">
      {copyGroups.map((group) => (
        <Group key={group.key} title={group.title}>
          {group.fields.map(([key, label]) => {
            const bag = draft.copy[group.key] as Record<string, string>;
            const value = bag[key] ?? "";
            const long = value.length > 80 || key.endsWith("Body") || key.endsWith("Text") || key.endsWith("Disclaimer") || key === "applyTitle";
            const change = (next: string) =>
              setDraft((current) => ({
                ...current,
                copy: {
                  ...current.copy,
                  [group.key]: { ...(current.copy[group.key] as Record<string, string>), [key]: next },
                },
              }));
            return long ? (
              <AreaField key={key} label={label} value={value} onChange={change} />
            ) : (
              <TextField key={key} label={label} value={value} onChange={change} />
            );
          })}
        </Group>
      ))}
    </div>
  );
}

function Card({
  children,
  onDelete,
  onUp,
  onDown,
}: {
  children: ReactNode;
  onDelete?: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  return (
    <article className="space-y-4 rounded-3xl border border-brand/10 bg-white p-5">
      {children}
      <div className="flex gap-3 text-sm">
        {onUp ? (
          <button type="button" onClick={onUp} className="text-ink/55 hover:text-brand">
            Yukarı
          </button>
        ) : null}
        {onDown ? (
          <button type="button" onClick={onDown} className="text-ink/55 hover:text-brand">
            Aşağı
          </button>
        ) : null}
        {onDelete ? (
          <button type="button" onClick={onDelete} className="ml-auto text-brand">
            Sil
          </button>
        ) : null}
      </div>
    </article>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

function AreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-ink outline-none focus:border-brand"
      />
    </label>
  );
}
