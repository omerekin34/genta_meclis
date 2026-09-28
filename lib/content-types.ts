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
