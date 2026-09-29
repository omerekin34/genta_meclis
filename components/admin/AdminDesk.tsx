"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { iconNames, type IconName } from "@/data/commissions";
import { sponsorMarks, type SponsorMark } from "@/data/sponsors";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/layout/SocialIcons";
import { CommissionIcon } from "@/components/commissions/CommissionIcon";
import { SchoolPicker } from "@/components/forms/SchoolPicker";
import { teamAcademicGroup, teamLeadGroup, teamUnits, type Content } from "@/lib/content-types";
import { ApplicationsPanel } from "./ApplicationsPanel";

const sections = [
  ["gelen", "Gelen başvurular"],
  ["genel", "Genel"],
  ["kisiler", "Koordinatörler"],
  ["ekip", "Ekibimiz"],
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
  constitution: "Anayasa",
  turkic: "Türk Devletleri",
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

const toastEvent = "genta-admin-toast";
const addEvent = "genta-admin-add";

function announceAdd(text = "Eklendi. Doldurup Kaydet’e bas.") {
  window.dispatchEvent(new CustomEvent<string>(addEvent, { detail: text }));
}
const flashClasses = ["ring-2", "ring-brand", "ring-offset-4", "ring-offset-ivory", "shadow-[0_18px_40px_-24px_rgba(108,17,16,0.6)]"];

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
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const addSnapshot = useRef<Set<Element> | null>(null);

  useEffect(() => {
    function onToast(event: Event) {
      setToast({ id: Date.now(), text: (event as CustomEvent<string>).detail });
    }
    function onAdd(event: Event) {
      addSnapshot.current = new Set(panelRef.current?.querySelectorAll("article") ?? []);
      onToast(event);
    }
    window.addEventListener(toastEvent, onToast);
    window.addEventListener(addEvent, onAdd);
    return () => {
      window.removeEventListener(toastEvent, onToast);
      window.removeEventListener(addEvent, onAdd);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const before = addSnapshot.current;
    if (!before) return;
    addSnapshot.current = null;
    const articles = [...(panelRef.current?.querySelectorAll("article") ?? [])];
    const target = articles.find((item) => !before.has(item)) ?? articles[0];
    if (!(target instanceof HTMLElement)) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.querySelector<HTMLElement>("input, textarea")?.focus({ preventScroll: true });
    target.classList.add(...flashClasses);
    window.setTimeout(() => target.classList.remove(...flashClasses), 1800);
  }, [draft]);

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

  function addCoordinator() {
    setDraft((current) => ({
      ...current,
      coordinators: [
        ...current.coordinators,
        { id: uid("coord"), name: "", role: "Genel Koordinatör", phone: "", tel: "", whatsapp: "" },
      ],
    }));
  }

  function addMember() {
    setDraft((current) => ({
      ...current,
      team: [...current.team, { id: uid("team"), name: "", role: "", group: teamFilter ?? "", school: "", photo: "" }],
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
                    : section === "ekip"
                      ? [{ label: "Kişi ekle", run: addMember }]
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
            <p className="text-sm text-ink/55">
              {section === "gelen" ? "Formdan gelen kayıtlar." : dirty ? "Kaydedilmemiş değişiklik var." : "Kayıt güncel."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {section === "gelen"
              ? null
              : adds.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  announceAdd(action.label === "Ekle" ? undefined : `${action.label} eklendi. Doldurup Kaydet’e bas.`);
                  action.run();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand bg-white px-4 py-2.5 text-sm font-medium text-brand transition-colors duration-200 hover:bg-brand hover:text-white active:scale-[0.97]"
              >
                <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
                  <path d="M8 3 V13 M3 8 H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {action.label}
              </button>
            ))}
            {section === "gelen" ? null : (
              <button
                type="button"
                onClick={save}
                disabled={pending || !dirty}
                className="rounded-full bg-brand px-5 py-2.5 font-display text-[12px] font-semibold tracking-[0.12em] text-white uppercase transition-colors duration-500 hover:bg-brand-deep disabled:opacity-40"
              >
                {pending ? "Kaydediliyor" : "Kaydet"}
              </button>
            )}
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
        <div ref={panelRef} className="mx-auto max-w-3xl px-6 py-8">
          {error ? <p className="mb-4 rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand">{error}</p> : null}
          {message ? <p className="mb-4 rounded-2xl bg-white px-4 py-3 text-sm text-ink/70">{message}</p> : null}
          {section === "gelen" ? <ApplicationsPanel /> : null}
          {section === "genel" ? <GeneralPanel draft={draft} patchSite={patchSite} setDraft={setDraft} /> : null}
          {section === "kisiler" ? <PeoplePanel draft={draft} setDraft={setDraft} /> : null}
          {section === "ekip" ? (
            <TeamPanel draft={draft} setDraft={setDraft} filter={teamFilter} setFilter={setTeamFilter} />
          ) : null}
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
          key={index}
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
      <CommissionPicker commissions={draft.commissions} value={current?.slug ?? ""} onChange={setOpen} />
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
          <AgendaEditor agenda={current.agenda} onChange={(agenda) => update(current.slug, { agenda })} />
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

function CommissionPicker({
  commissions,
  value,
  onChange,
}: {
  commissions: Content["commissions"];
  value: string;
  onChange: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const current = commissions.find((item) => item.slug === value);
  const needle = query.trim().toLocaleLowerCase("tr");
  const matches = needle
    ? commissions.filter((item) => item.name.toLocaleLowerCase("tr").includes(needle))
    : commissions;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(slug: string) {
    onChange(slug);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={root} className="relative">
      <p className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Düzenlenen komisyon</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
        className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-brand/20 bg-white px-4 py-3 text-left transition-colors duration-200 hover:border-brand/50"
      >
        {current ? <CommissionIcon name={current.icon} className="size-6 shrink-0 text-brand" /> : null}
        <span className="flex-1 font-medium text-brand">{current?.name || "Komisyon seç"}</span>
        <span className="text-xs text-ink/45">{commissions.length} komisyon</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`size-4 text-brand transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6 L8 10 L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-brand/15 bg-white shadow-[0_22px_44px_-24px_rgba(108,17,16,0.55)]">
          <div className="border-b border-brand/10 p-3">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && matches[0]) {
                  event.preventDefault();
                  choose(matches[0].slug);
                }
              }}
              placeholder="Komisyon ara…"
              className="w-full rounded-xl border border-brand/15 bg-ivory px-3 py-2 text-sm text-ink outline-none focus:border-brand"
            />
          </div>
          <ul role="listbox" className="max-h-72 overflow-y-auto py-1">
            {matches.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.slug === value}
                  onClick={() => choose(item.slug)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                    item.slug === value ? "bg-brand/8 font-medium text-brand" : "text-ink hover:bg-ivory hover:text-brand"
                  }`}
                >
                  <CommissionIcon name={item.icon} className="size-5 shrink-0 text-brand/80" />
                  <span className="flex-1">{item.name || "Adsız"}</span>
                  {item.slug === value ? (
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4 text-brand">
                      <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              </li>
            ))}
            {matches.length === 0 ? <li className="px-4 py-3 text-sm text-ink/55">Eşleşen komisyon yok.</li> : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function AgendaEditor({
  agenda,
  onChange,
}: {
  agenda: Content["commissions"][number]["agenda"];
  onChange: (agenda: Content["commissions"][number]["agenda"]) => void;
}) {
  function patch(id: string, next: Partial<(typeof agenda)[number]>) {
    onChange(agenda.map((item) => (item.id === id ? { ...item, ...next } : item)));
  }

  return (
    <div className="space-y-3 rounded-3xl border border-brand/10 bg-ivory/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Gündem maddeleri</p>
        <button
          type="button"
          onClick={() => {
            announceAdd("Gündem maddesi eklendi. Doldurup Kaydet’e bas.");
            onChange([...agenda, { id: uid("gundem"), title: "", text: "" }]);
          }}
          className="rounded-full border border-brand/25 px-3 py-1.5 text-sm text-brand transition-colors duration-200 hover:bg-brand hover:text-white"
        >
          Madde ekle
        </button>
      </div>
      {agenda.length === 0 ? <p className="text-sm text-ink/55">Bu komisyonda henüz gündem maddesi yok.</p> : null}
      {agenda.map((item, index) => (
        <Card
          key={item.id}
          onUp={() => onChange(move(agenda, index, -1))}
          onDown={() => onChange(move(agenda, index, 1))}
          onDelete={() => {
            if (!window.confirm(`${index + 1}. gündem maddesi silinsin mi?`)) return false;
            onChange(agenda.filter((entry) => entry.id !== item.id));
          }}
        >
          <p className="font-display text-xs font-semibold tracking-[0.14em] text-brand uppercase">
            {index + 1}. Gündem maddesi
          </p>
          <AreaField label="Başlık" value={item.title} onChange={(value) => patch(item.id, { title: value })} />
          <AreaField label="Açıklama" value={item.text} onChange={(value) => patch(item.id, { text: value })} />
        </Card>
      ))}
    </div>
  );
}

function teamGroupLabel(group: string, commissions: Content["commissions"]) {
  if (group === teamLeadGroup) return "Genel Koordinasyon";
  if (group === teamAcademicGroup) return "Akademik Ekip";
  const unit = teamUnits.find((item) => item.value === group);
  if (unit) return unit.label;
  const commission = commissions.find((item) => item.slug === group);
  if (commission) return commission.name || "Adsız komisyon";
  return "Diğer ekip";
}

function moveWithinGroup(list: Content["team"], id: string, direction: -1 | 1) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  const group = list[index].group;
  let target = index + direction;
  while (target >= 0 && target < list.length && list[target].group !== group) target += direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function TeamGroupOptions({ commissions }: { commissions: Content["commissions"] }) {
  return (
    <>
      <option value={teamLeadGroup}>Genel Koordinasyon (en üstte)</option>
      <optgroup label="Akademik">
        <option value={teamAcademicGroup}>Akademik Ekip</option>
        {commissions.map((commission) => (
          <option key={commission.slug} value={commission.slug}>
            {commission.name || "Adsız komisyon"}
          </option>
        ))}
      </optgroup>
      <optgroup label="Organizasyon">
        {teamUnits.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </optgroup>
      <option value="">Diğer ekip</option>
    </>
  );
}

function TeamPanel({
  draft,
  setDraft,
  filter,
  setFilter,
}: PanelProps & { filter: string | null; setFilter: (value: string | null) => void }) {
  function patch(id: string, next: Partial<Content["team"][number]>) {
    setDraft((current) => ({
      ...current,
      team: current.team.map((item) => (item.id === id ? { ...item, ...next } : item)),
    }));
  }

  const counts = new Map<string, number>();
  for (const member of draft.team) counts.set(member.group, (counts.get(member.group) ?? 0) + 1);
  const shown = filter === null ? draft.team : draft.team.filter((member) => member.group === filter);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-ink/60">
        Ekibimiz sayfasında Genel Koordinasyon en üstte durur. Altında Akademik Ekip ve komisyonlar, ardından Lojistik, Halkla İlişkiler, Sosyal Medya, Tasarım ve Basın ekipleri kendi satırlarında yan yana dizilir. Okul için birkaç harf yaz, listeden seç. Değişiklikten sonra Kaydet’e bas.
      </p>
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-brand/10 bg-white p-4">
        <label className="flex min-w-0 flex-1 items-center gap-3">
          <span className="shrink-0 font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Göster</span>
          <select
            value={filter ?? "__all"}
            onChange={(event) => setFilter(event.target.value === "__all" ? null : event.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-brand/15 bg-ivory px-4 py-2.5 text-sm"
          >
            <option value="__all">Tüm ekip ({draft.team.length})</option>
            <option value={teamLeadGroup}>Genel Koordinasyon ({counts.get(teamLeadGroup) ?? 0})</option>
            <optgroup label="Akademik">
              <option value={teamAcademicGroup}>Akademik Ekip ({counts.get(teamAcademicGroup) ?? 0})</option>
              {draft.commissions.map((commission) => (
                <option key={commission.slug} value={commission.slug}>
                  {commission.name || "Adsız komisyon"} ({counts.get(commission.slug) ?? 0})
                </option>
              ))}
            </optgroup>
            <optgroup label="Organizasyon">
              {teamUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} ({counts.get(unit.value) ?? 0})
                </option>
              ))}
            </optgroup>
            <option value="">Diğer ekip ({counts.get("") ?? 0})</option>
          </select>
        </label>
        {filter !== null ? (
          <button type="button" onClick={() => setFilter(null)} className="text-sm text-brand hover:underline">
            Filtreyi kaldır
          </button>
        ) : null}
      </div>
      {filter !== null ? (
        <p className="text-sm text-ink/60">
          Kişi ekle, yeni kişiyi doğrudan <strong className="font-medium text-brand">{teamGroupLabel(filter, draft.commissions)}</strong> bölümüne ekler.
        </p>
      ) : null}
      {shown.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-brand/20 bg-white p-5 text-sm text-ink/60">
          {filter === null ? "Henüz kimse yok. Sağ üstteki Kişi ekle düğmesiyle başla." : "Bu bölümde henüz kimse yok. Kişi ekle ile başla."}
        </p>
      ) : null}
      <List>
        {shown.map((member) => (
          <Card
            key={member.id}
            onUp={() => setDraft((current) => ({ ...current, team: moveWithinGroup(current.team, member.id, -1) }))}
            onDown={() => setDraft((current) => ({ ...current, team: moveWithinGroup(current.team, member.id, 1) }))}
            onDelete={() => {
              if (!window.confirm(`${member.name || "Bu kişi"} ekipten çıkarılsın mı?`)) return false;
              setDraft((current) => ({ ...current, team: current.team.filter((item) => item.id !== member.id) }));
            }}
          >
            <p className="inline-flex rounded-full bg-brand/8 px-3 py-1 font-display text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
              {teamGroupLabel(member.group, draft.commissions)}
            </p>
            <TextField label="Ad soyad" value={member.name} onChange={(value) => patch(member.id, { name: value })} />
            <TextField label="Görevi" value={member.role} onChange={(value) => patch(member.id, { role: value })} />
            <label className="block">
              <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Bölümü</span>
              <select
                value={member.group}
                onChange={(event) => patch(member.id, { group: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3"
              >
                <TeamGroupOptions commissions={draft.commissions} />
              </select>
            </label>
            <div className="block">
              <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Okulu</span>
              <SchoolPicker variant="box" value={member.school} onChange={(value) => patch(member.id, { school: value })} />
            </div>
            <ImageField
              label="Fotoğraf"
              folder="ekip"
              value={member.photo}
              round
              onChange={(value) => patch(member.id, { photo: value })}
            />
          </Card>
        ))}
      </List>
    </div>
  );
}

const imageMaxBytes = 4 * 1024 * 1024;
const hostedMedia = "/storage/v1/object/public/genta-media/";

function clipboardFile(data: DataTransfer) {
  const fromFiles = Array.from(data.files).find((item) => item.type.startsWith("image/"));
  if (fromFiles) return fromFiles;
  for (const item of Array.from(data.items)) {
    if (item.kind === "file" && item.type.startsWith("image/")) return item.getAsFile() ?? undefined;
  }
  return undefined;
}

function clipboardSource(data: DataTransfer) {
  const plain = data.getData("text/plain").trim();
  const fromPlain = /https?:\/\/[^\s<>"']+/i.exec(plain)?.[0];
  if (fromPlain) return fromPlain;
  if (plain.startsWith("data:image/")) return plain.split(/\s+/)[0];
  const html = data.getData("text/html").replace(/&amp;/g, "&");
  const htmlSource = /<img[^>]+src=["']([^"']+)["']/i.exec(html)?.[1]?.trim() ?? "";
  if (/^https?:\/\//i.test(htmlSource) || htmlSource.startsWith("data:image/")) return htmlSource;
  const uri = /https?:\/\/[^\s<>"']+/i.exec(data.getData("text/uri-list"))?.[0];
  return uri ?? "";
}

function fileFromDataUrl(source: string) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+)(;base64)?,([\s\S]+)$/.exec(source);
  if (!match) return null;
  const type = match[1];
  const encoded = match[2] ? match[3] : btoa(match[3]);
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new File([bytes], "pasted", { type });
  } catch {
    return null;
  }
}

function ImageField({
  label,
  folder,
  value,
  round = false,
  onChange,
}: {
  label: string;
  folder: string;
  value: string;
  round?: boolean;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function postUpload(body: FormData) {
    setUploading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!response.ok || !result?.url) {
        setError(result?.error ?? (response.status === 413 ? "Dosya en fazla 4 MB olsun." : "Görsel yüklenemedi."));
        return false;
      }
      onChange(result.url);
      return true;
    } catch {
      setError("Görsel yüklenemedi. Bağlantıyı kontrol et.");
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function upload(file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    await postUpload(body);
  }

  async function importUrl(url: string) {
    if (url.includes(hostedMedia)) {
      onChange(url);
      return;
    }
    const body = new FormData();
    body.append("url", url);
    body.append("folder", folder);
    const ok = await postUpload(body);
    if (!ok) {
      onChange(url);
      setError((current) => (current ? `${current} Adres yine de kaydedildi.` : "Adres kaydedildi."));
    }
  }

  function takeTransfer(data: DataTransfer, event?: { preventDefault(): void }) {
    const file = clipboardFile(data);
    const source = clipboardSource(data);
    if (file && (file.size <= imageMaxBytes || !source)) {
      event?.preventDefault();
      if (file.size > imageMaxBytes) {
        setError("Dosya en fazla 4 MB olsun.");
        return;
      }
      void upload(file);
      return;
    }
    if (source.startsWith("data:image/")) {
      const pasted = fileFromDataUrl(source);
      event?.preventDefault();
      if (!pasted) {
        setError("Yapıştırılan görsel okunamadı.");
        return;
      }
      void upload(pasted);
      return;
    }
    if (/^https?:\/\//i.test(source)) {
      event?.preventDefault();
      void importUrl(source);
    }
  }

  return (
    <div
      tabIndex={0}
      className="rounded-3xl outline-none"
      onPaste={(event) => takeTransfer(event.clipboardData, event)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        takeTransfer(event.dataTransfer);
      }}
    >
      <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">{label}</span>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`flex size-24 shrink-0 items-center justify-center overflow-hidden border border-brand/15 bg-ivory ${round ? "rounded-full" : "rounded-2xl"}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- adres her kaynaktan gelebilir
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xs text-ink/40">Görsel yok</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex cursor-pointer items-center rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white ${uploading ? "pointer-events-none opacity-50" : ""}`}
            >
              {uploading ? "Yükleniyor" : "Bilgisayardan seç"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void upload(file);
                }}
              />
            </label>
            {value ? (
              <button type="button" onClick={() => onChange("")} className="text-sm text-ink/55 hover:text-brand">
                Görseli kaldır
              </button>
            ) : null}
          </div>
          <input
            value={value}
            onChange={(event) => onChange(event.target.value.trim())}
            disabled={uploading}
            placeholder="görseli veya https:// adresini yapıştır (Ctrl+V)"
            className="w-full rounded-2xl border border-brand/15 bg-ivory px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
          <p className="text-xs leading-5 text-ink/50">
            JPG, PNG, WEBP, GIF veya SVG. En fazla 4 MB. Görseli kopyalayıp buraya yapıştırabilirsin; link de olur, indirmene gerek yok.
          </p>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
        </div>
      </div>
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
          <ImageField
            label="Logo"
            folder="sponsor"
            value={sponsor.logoSrc ?? ""}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                sponsors: current.sponsors.map((item) =>
                  item.id === sponsor.id ? { ...item, logoSrc: value || undefined } : item,
                ),
              }))
            }
          />
          <label className="block">
            <span className="font-display text-[11px] tracking-[0.14em] text-ink/50 uppercase">Logo yoksa işaret</span>
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
          key={index}
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
          key={index}
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
      ["teamEyebrow", "Ekip üst yazısı"],
      ["teamTitle", "Ekip başlığı"],
      ["teamText", "Ekip metni"],
      ["teamCta", "Ekip düğmesi"],
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
      ["teamEyebrow", "Ekibimiz üst yazı"],
      ["teamTitle", "Ekibimiz başlığı"],
      ["teamText", "Ekibimiz metni"],
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

function notify(text: string) {
  window.dispatchEvent(new CustomEvent<string>(toastEvent, { detail: text }));
}

const moveButton =
  "inline-flex items-center gap-1.5 rounded-full border border-brand/15 px-3 py-1.5 text-ink/65 transition-colors duration-200 hover:border-brand/40 hover:bg-brand/5 hover:text-brand";

function Card({
  children,
  onDelete,
  onUp,
  onDown,
}: {
  children: ReactNode;
  onDelete?: () => void | boolean;
  onUp?: () => void;
  onDown?: () => void;
}) {
  return (
    <article className="space-y-4 rounded-3xl border border-brand/10 bg-white p-5 transition-shadow duration-500">
      {children}
      <div className="flex flex-wrap items-center gap-2 border-t border-brand/10 pt-4 text-sm">
        {onUp ? (
          <button type="button" onClick={onUp} className={moveButton}>
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
              <path d="M8 12.5 V3.5 M4 7.5 L8 3.5 L12 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Yukarı
          </button>
        ) : null}
        {onDown ? (
          <button type="button" onClick={onDown} className={moveButton}>
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
              <path d="M8 3.5 V12.5 M4 8.5 L8 12.5 L12 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Aşağı
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={() => {
              if (onDelete() !== false) notify("Silindi. Kalıcı olması için Kaydet’e bas.");
            }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-brand/25 px-4 py-1.5 font-medium text-brand transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white"
          >
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden="true">
              <path
                d="M3 4.5 H13 M6.5 4.5 V3 H9.5 V4.5 M4.5 4.5 L5.2 13 H10.8 L11.5 4.5 M7 7 V10.5 M9 7 V10.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
