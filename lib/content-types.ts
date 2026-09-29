import type { Commission, IconName } from "@/data/commissions";
import type { Sponsor, SponsorMark } from "@/data/sponsors";
import type { SiteCopy } from "@/lib/site-copy";

export type Coordinator = {
  id: string;
  name: string;
  role: string;
  phone: string;
  tel: string;
  whatsapp: string;
};

export const teamLeadGroup = "genel";
export const teamAcademicGroup = "akademik";
export const teamOrgLeadGroup = "organizasyon";
export const teamCommissionCategory = "komisyon-baskanlari";

export const teamUnits = [
  { value: "tasarim", label: "Tasarım Ekibi", short: "Tasarım" },
  { value: "halkla-iliskiler", label: "Halkla İlişkiler Ekibi", short: "Halkla İlişkiler" },
  { value: "lojistik", label: "Lojistik Ekibi", short: "Lojistik" },
  { value: "sosyal-medya", label: "Sosyal Medya Ekibi", short: "Sosyal Medya" },
  { value: "basin", label: "Basın Ekibi", short: "Basın" },
] as const;

export const teamHubHref = "/ekibimiz";
export const teamAcademicHref = "/ekibimiz/akademik";
export const teamOrgHref = "/ekibimiz/organizasyon";

export const teamNavItems = [
  { href: teamAcademicHref, label: "Akademik" },
  { href: teamOrgHref, label: "Organizasyon" },
] as const;

export function isTeamNavHref(href: string) {
  return href === teamHubHref || href.startsWith(`${teamHubHref}/`);
}

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  group: string;
  school: string;
  photo: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type PracticalNote = {
  id: string;
  title: string;
  text: string;
};

export type StatSource = "manual" | "applications" | "commissions" | "activity";

export type HomeStat = {
  id: string;
  label: string;
  caption: string;
  value: number;
  source: StatSource;
};

export type AboutValue = {
  id: string;
  title: string;
  text: string;
};

export type AboutBlock = {
  id: string;
  text: string;
};

export type PreferenceOption = {
  value: string;
  label: string;
};

export type SiteFacts = {
  name: string;
  title: string;
  edition: string;
  datesLabel: string;
  datesShort: string;
  durationLabel: string;
  highlightedDays: number[];
  monthLabel: string;
  city: string;
  venue: string;
  venueShort: string;
  email: string;
  instagram: string;
  instagramLabel: string;
  fee: string;
  applicationDeadlineLabel: string;
  applicationDeadlineIso: string;
  eventStartIso: string;
  headerOffset: string;
  communityJoinMessage: string;
};

export type Content = {
  site: SiteFacts;
  coordinators: Coordinator[];
  team: TeamMember[];
  navItems: NavItem[];
  practicalNotes: PracticalNote[];
  stats: HomeStat[];
  whatsappQuestions: string[];
  about: {
    lead: string;
    mission: string;
    vision: string;
    purpose: AboutBlock[];
    values: AboutValue[];
  };
  commissions: Commission[];
  sponsors: Sponsor[];
  preferences: PreferenceOption[];
  copy: SiteCopy;
};

export type { Commission, IconName, Sponsor, SponsorMark };
