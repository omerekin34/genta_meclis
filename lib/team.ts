import type { IconName } from "@/data/commissions";
import type { Commission, NavItem, TeamMember } from "@/lib/content-types";
import {
  isTeamNavHref,
  teamAcademicGroup,
  teamCommissionCategory,
  teamHubHref,
  teamOrgLeadGroup,
  teamUnits,
} from "@/lib/content-types";

export type TeamGroup = {
  key: string;
  title: string;
  eyebrow?: string;
  icon?: IconName;
  lead: boolean;
  category: string;
  members: TeamMember[];
};

export type TeamCategory = { value: string; label: string };

function of(members: TeamMember[], group: string) {
  return members.filter((member) => member.group === group);
}

export function academicTeam(members: TeamMember[], commissions: Commission[]) {
  const groups: TeamGroup[] = [
    {
      key: teamAcademicGroup,
      title: "Akademik Başkanı",
      lead: true,
      category: teamAcademicGroup,
      members: of(members, teamAcademicGroup),
    },
    ...commissions.map((commission) => ({
      key: commission.slug,
      title: commission.name,
      eyebrow: "Komisyon Başkanı",
      icon: commission.icon,
      lead: false,
      category: teamCommissionCategory,
      members: of(members, commission.slug),
    })),
  ].filter((group) => group.members.length > 0);

  const categories: TeamCategory[] = [
    { value: teamAcademicGroup, label: "Akademik Başkanı" },
    { value: teamCommissionCategory, label: "Komisyon Başkanları" },
  ];

  return { groups, categories };
}

export function organizationTeam(members: TeamMember[]) {
  const groups: TeamGroup[] = [
    {
      key: teamOrgLeadGroup,
      title: "Organizasyon Başkanı",
      lead: true,
      category: teamOrgLeadGroup,
      members: of(members, teamOrgLeadGroup),
    },
    ...teamUnits.map((unit) => ({
      key: unit.value,
      title: unit.label,
      lead: false,
      category: unit.value,
      members: of(members, unit.value),
    })),
  ].filter((group) => group.members.length > 0);

  const categories: TeamCategory[] = [
    { value: teamOrgLeadGroup, label: "Organizasyon Başkanı" },
    ...teamUnits.map((unit) => ({ value: unit.value, label: unit.short })),
  ];

  return { groups, categories };
}

export function collapseTeamNav(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];
  let inserted = false;
  const hub = items.find((item) => item.href === teamHubHref);

  for (const item of items) {
    if (!isTeamNavHref(item.href)) {
      result.push(item);
      continue;
    }
    if (inserted) continue;
    result.push({ href: teamHubHref, label: hub?.label || "Ekibimiz" });
    inserted = true;
  }

  return result;
}
