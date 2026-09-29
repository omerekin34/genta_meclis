import { cache } from "react";
import { adminClient } from "@/lib/supabase-admin";
import { about } from "@/data/about";
import { commissions, iconNames, type IconName } from "@/data/commissions";
import { sponsorMarks, sponsors, type SponsorMark } from "@/data/sponsors";
import { communityJoinMessage, coordinators, navItems, practicalNotes, site, whatsappQuestions } from "@/data/site";
import { defaultCopy } from "./site-copy";
import { teamAcademicGroup, teamLeadGroup, teamOrgLeadGroup, type Commission, type Content, type Coordinator, type HomeStat, type NavItem, type Sponsor, type StatSource } from "./content-types";
import { collapseTeamNav } from "./team";

const settingsId = "live";

const activityStart = new Date("2026-09-28T00:00:00+03:00");

export function activityYears(now = new Date()) {
  let years = now.getFullYear() - activityStart.getFullYear();
  const anniversary = new Date(activityStart);
  anniversary.setFullYear(now.getFullYear());
  if (now.getTime() < anniversary.getTime()) years -= 1;
  return Math.max(1, years + 1);
}

const defaultStats: HomeStat[] = [
  { id: "basvuru", label: "Başvuru", caption: "Gönderilen kayıt", value: 0, source: "applications" },
  { id: "kurul", label: "Kurul", caption: "Komisyon masası", value: 9, source: "commissions" },
  { id: "etkinlik", label: "Etkinlik", caption: "Aktif oturum", value: 1, source: "manual" },
  { id: "yil", label: "Faaliyet yılı", caption: "28 Eylül 2026’dan beri", value: 1, source: "activity" },
];

const statSources: StatSource[] = ["manual", "applications", "commissions", "activity"];

function asStatSource(value: unknown): StatSource {
  return statSources.includes(value as StatSource) ? (value as StatSource) : "manual";
}

const defaultPreferences = [
  { value: "Sağlık Komisyonu", label: "Sağlık" },
  { value: "Adalet Komisyonu", label: "Adalet" },
  { value: "Milli Eğitim Komisyonu", label: "Milli Eğitim" },
  { value: "Milli Savunma Komisyonu", label: "Milli Savunma" },
  { value: "Anayasa Komisyonu", label: "Anayasa" },
  { value: "Dışişleri Komisyonu", label: "Dışişleri" },
  { value: "İçişleri Komisyonu", label: "İçişleri" },
  { value: "Dinişleri Komisyonu", label: "Dinişleri" },
  { value: "Türk Devletleri Komisyonu", label: "Türk Devletleri" },
];

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function digitsFromPhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  else if (digits.length === 10) digits = `90${digits}`;
  return digits;
}

function asIcon(value: unknown): IconName {
  return iconNames.includes(value as IconName) ? (value as IconName) : "parliament";
}

function asMark(value: unknown): SponsorMark {
  return sponsorMarks.includes(value as SponsorMark) ? (value as SponsorMark) : "laurel";
}

export function defaultContent(): Content {
  return {
    site: {
      name: site.name,
      title: site.title,
      edition: site.edition,
      datesLabel: site.datesLabel,
      datesShort: site.datesShort,
      durationLabel: site.durationLabel,
      highlightedDays: [...site.highlightedDays],
      monthLabel: site.monthLabel,
      city: site.city,
      venue: site.venue,
      venueShort: site.venueShort,
      email: site.email,
      instagram: site.instagram,
      instagramLabel: site.instagramLabel,
      fee: site.fee,
      applicationDeadlineLabel: site.applicationDeadlineLabel,
      applicationDeadlineIso: site.applicationDeadlineIso,
      eventStartIso: site.eventStartIso,
      headerOffset: site.headerOffset,
      communityJoinMessage,
    },
    coordinators: coordinators.map((person, index) => ({
      id: `coord-${index + 1}`,
      name: person.name,
      role: person.role,
      phone: person.phone,
      tel: person.tel,
      whatsapp: person.whatsapp,
    })),
    team: coordinators.map((person, index) => ({
      id: `team-${index + 1}`,
      name: person.name,
      role: person.role,
      group: teamLeadGroup,
      school: "",
      photo: "",
    })),
    navItems: collapseTeamNav(navItems.map((item) => ({ href: item.href, label: item.label }))),
    practicalNotes: practicalNotes.map((note, index) => ({
      id: `note-${index + 1}`,
      title: note.title,
      text: note.text,
    })),
    stats: defaultStats.map((item) => ({ ...item })),
    whatsappQuestions: [...whatsappQuestions],
    about: {
      lead: about.lead,
      mission: about.mission,
      vision: about.vision,
      purpose: about.purpose.map((paragraph, index) => ({ id: `purpose-${index + 1}`, text: paragraph })),
      values: about.values.map((value, index) => ({
        id: `value-${index + 1}`,
        title: value.title,
        text: value.text,
      })),
    },
    commissions: commissions.map((commission) => ({
      ...commission,
      agenda: commission.agenda.map((item) => ({ ...item })),
      media: commission.media.map((item) => ({ ...item })),
    })),
    sponsors: sponsors.map((sponsor) => ({ ...sponsor })),
    preferences: defaultPreferences.map((item) => ({ ...item })),
    copy: {
      home: { ...defaultCopy.home },
      pages: { ...defaultCopy.pages },
      frame: { ...defaultCopy.frame },
    },
  };
}

function normalizeCoordinator(value: unknown, index: number): Coordinator {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const phone = text(row.phone);
  const whatsapp = digitsFromPhone(text(row.whatsapp) || phone);
  return {
    id: text(row.id) || `coord-${index + 1}`,
    name: text(row.name),
    role: text(row.role),
    phone,
    tel: whatsapp ? `+${whatsapp}` : "",
    whatsapp,
  };
}

function normalizeCommission(value: unknown, index: number): Commission {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const media = Array.isArray(row.media) ? row.media : [];
  const agenda = (Array.isArray(row.agenda) ? row.agenda : [])
    .map((item, agendaIndex) => {
      const agendaRow: Record<string, unknown> = item && typeof item === "object" ? (item as Record<string, unknown>) : { title: item };
      return {
        id: text(agendaRow.id) || `gundem-${index + 1}-${agendaIndex + 1}`,
        title: text(agendaRow.title),
        text: text(agendaRow.text),
      };
    })
    .filter((item) => item.title || item.text);
  return {
    slug: text(row.slug) || `komisyon-${index + 1}`,
    name: text(row.name),
    fullName: text(row.fullName),
    summary: text(row.summary),
    description: text(row.description),
    agenda,
    icon: asIcon(row.icon),
    media: media.map((item, mediaIndex) => {
      const mediaRow = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const kind = mediaRow.kind === "video" ? "video" : "image";
      return {
        id: text(mediaRow.id) || `media-${index + 1}-${mediaIndex + 1}`,
        kind,
        caption: text(mediaRow.caption),
        src: text(mediaRow.src) || undefined,
      };
    }),
  };
}

function normalizeSponsor(value: unknown, index: number): Sponsor {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const logo = text(row.logoSrc);
  return {
    id: text(row.id) || `sponsor-${index + 1}`,
    name: text(row.name),
    note: text(row.note),
    mark: asMark(row.mark),
    logoSrc: logo || undefined,
  };
}

export function normalizeContent(value: unknown): Content {
  const fallback = defaultContent();
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const siteRow = row.site && typeof row.site === "object" ? (row.site as Record<string, unknown>) : {};
  const aboutRow = row.about && typeof row.about === "object" ? (row.about as Record<string, unknown>) : {};
  const copyRow = row.copy && typeof row.copy === "object" ? (row.copy as Record<string, unknown>) : {};
  const days = Array.isArray(siteRow.highlightedDays)
    ? siteRow.highlightedDays.map((day) => Number(day)).filter((day) => Number.isInteger(day) && day >= 1 && day <= 31)
    : fallback.site.highlightedDays;

  return {
    site: {
      ...fallback.site,
      name: text(siteRow.name, fallback.site.name),
      title: text(siteRow.title, fallback.site.title),
      edition: text(siteRow.edition, fallback.site.edition),
      datesLabel: text(siteRow.datesLabel, fallback.site.datesLabel),
      datesShort: text(siteRow.datesShort, fallback.site.datesShort),
      durationLabel: text(siteRow.durationLabel, fallback.site.durationLabel),
      highlightedDays: days.length > 0 ? days : fallback.site.highlightedDays,
      monthLabel: text(siteRow.monthLabel, fallback.site.monthLabel),
      city: text(siteRow.city, fallback.site.city),
      venue: text(siteRow.venue, fallback.site.venue),
      venueShort: text(siteRow.venueShort, fallback.site.venueShort),
      email: text(siteRow.email, fallback.site.email),
      instagram: text(siteRow.instagram, fallback.site.instagram),
      instagramLabel: text(siteRow.instagramLabel, fallback.site.instagramLabel),
      fee: text(siteRow.fee, fallback.site.fee),
      applicationDeadlineLabel: text(siteRow.applicationDeadlineLabel, fallback.site.applicationDeadlineLabel),
      applicationDeadlineIso: text(siteRow.applicationDeadlineIso, fallback.site.applicationDeadlineIso),
      eventStartIso: text(siteRow.eventStartIso, fallback.site.eventStartIso),
      headerOffset: text(siteRow.headerOffset, fallback.site.headerOffset),
      communityJoinMessage: text(siteRow.communityJoinMessage, fallback.site.communityJoinMessage),
    },
    coordinators: Array.isArray(row.coordinators)
      ? row.coordinators.map(normalizeCoordinator)
      : fallback.coordinators,
    team: Array.isArray(row.team)
      ? row.team.map((item, index) => {
          const member = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return {
            id: text(member.id) || `team-${index + 1}`,
            name: text(member.name),
            role: text(member.role),
            group:
              text(member.group) ||
              (/organizasyon başkan/i.test(text(member.role))
                ? teamOrgLeadGroup
                : /akademik başkan/i.test(text(member.role))
                  ? teamAcademicGroup
                  : /genel koordinat/i.test(text(member.role))
                    ? teamLeadGroup
                    : ""),
            school: text(member.school),
            photo: text(member.photo),
          };
        })
      : fallback.team,
    navItems: Array.isArray(row.navItems)
      ? collapseTeamNav(
          row.navItems.map((item) => {
            const nav = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { href: text(nav.href, "/"), label: text(nav.label) } satisfies NavItem;
          }),
        )
      : fallback.navItems,
    practicalNotes: Array.isArray(row.practicalNotes)
      ? row.practicalNotes.map((item, index) => {
          const note = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return { id: text(note.id) || `note-${index + 1}`, title: text(note.title), text: text(note.text) };
        })
      : fallback.practicalNotes,
    stats: Array.isArray(row.stats)
      ? row.stats.map((item, index) => {
          const stat = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          const value = Number(stat.value);
          return {
            id: text(stat.id) || `stat-${index + 1}`,
            label: text(stat.label),
            caption: text(stat.caption),
            value: Number.isFinite(value) && value >= 0 ? Math.round(value) : 0,
            source: asStatSource(stat.source),
          };
        })
      : fallback.stats,
    whatsappQuestions: Array.isArray(row.whatsappQuestions)
      ? row.whatsappQuestions.map((item) => text(item)).filter(Boolean)
      : fallback.whatsappQuestions,
    about: {
      lead: text(aboutRow.lead, fallback.about.lead),
      mission: text(aboutRow.mission, fallback.about.mission),
      vision: text(aboutRow.vision, fallback.about.vision),
      purpose: Array.isArray(aboutRow.purpose)
        ? aboutRow.purpose.map((item, index) => {
            const block = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: text(block.id) || `purpose-${index + 1}`, text: text(block.text) };
          })
        : fallback.about.purpose,
      values: Array.isArray(aboutRow.values)
        ? aboutRow.values.map((item, index) => {
            const block = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(block.id) || `value-${index + 1}`,
              title: text(block.title),
              text: text(block.text),
            };
          })
        : fallback.about.values,
    },
    commissions: Array.isArray(row.commissions) ? row.commissions.map(normalizeCommission) : fallback.commissions,
    sponsors: Array.isArray(row.sponsors) ? row.sponsors.map(normalizeSponsor) : fallback.sponsors,
    preferences: Array.isArray(row.preferences)
      ? row.preferences.map((item) => {
          const option = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return { value: text(option.value), label: text(option.label) };
        })
      : fallback.preferences,
    copy: {
      home: fillCopy(copyRow.home, fallback.copy.home),
      pages: fillCopy(copyRow.pages, fallback.copy.pages),
      frame: fillCopy(copyRow.frame, fallback.copy.frame),
    },
  };
}

function fillCopy<T extends Record<string, string>>(value: unknown, fallback: T): T {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const next = { ...fallback };
  for (const key of Object.keys(fallback)) {
    next[key as keyof T] = text(row[key], fallback[key]) as T[keyof T];
  }
  return next;
}

function storageMessage(error: { message?: string; code?: string }) {
  const message = error.message ?? "";
  if (error.code === "PGRST205" || /schema cache|does not exist|Could not find the table/i.test(message)) {
    return "site_settings tablosu yok. Supabase SQL editöründe şemayı bir kez çalıştır.";
  }
  return "Kayıt tamamlanamadı.";
}

export const getContent = cache(async (): Promise<Content> => {
  const supabase = adminClient();
  if (!supabase) return defaultContent();
  const { data, error } = await supabase.from("site_settings").select("document").eq("id", settingsId).maybeSingle();
  if (error || data?.document == null) return defaultContent();
  return normalizeContent(data.document);
});

export async function saveContent(value: unknown) {
  const content = normalizeContent(value);
  const slugs = content.commissions.map((item) => item.slug.trim());
  if (slugs.some((slug) => !slug)) throw new Error("Komisyon adresi boş olamaz.");
  if (new Set(slugs).size !== slugs.length) throw new Error("İki komisyon aynı adresi kullanamaz.");
  const sponsorIds = content.sponsors.map((item) => item.id.trim());
  if (sponsorIds.some((id) => !id)) throw new Error("Sponsor kaydının kimliği boş olamaz.");
  if (new Set(sponsorIds).size !== sponsorIds.length) throw new Error("İki sponsor aynı kimliği kullanamaz.");
  if (content.navItems.some((item) => !item.href.trim() || !item.label.trim())) {
    throw new Error("Menüde boş bağlantı bırakılamaz.");
  }
  const supabase = adminClient();
  if (!supabase) throw new Error("Supabase bağlantısı henüz yok.");
  const { error } = await supabase.from("site_settings").upsert({
    id: settingsId,
    document: content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(storageMessage(error));
  return content;
}

export async function resetContent() {
  const supabase = adminClient();
  if (!supabase) throw new Error("Supabase bağlantısı henüz yok.");
  const { error } = await supabase.from("site_settings").delete().eq("id", settingsId);
  if (error) throw new Error(storageMessage(error));
  return defaultContent();
}
