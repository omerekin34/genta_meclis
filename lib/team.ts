import type { BureauMember, IconName } from "@/data/commissions";
import { commissionBureau } from "@/data/commissions";
import type { Commission, NavItem, TeamMember } from "@/lib/content-types";
import {
  isTeamNavHref,
  teamAcademicGroup,
  teamCommissionCategory,
  teamGeneralAssemblyGroup,
  teamHubHref,
  teamLeadGroup,
  teamOrgLeadGroup,
  teamUnits,
} from "@/lib/content-types";

export type TeamGroup = {
  key: string;
  title: string;
  eyebrow?: string;
  icon?: IconName;
  lead: boolean;
  cardLead?: boolean;
  columns?: "grid";
  category: string;
  members: TeamMember[];
};

export type TeamCategory = { value: string; label: string };

function of(members: TeamMember[], group: string) {
  return members.filter((member) => member.group === group);
}

export function resolveCommissionBureau(commission: Commission, team: TeamMember[]): BureauMember[] {
  const fromTeam = of(team, commission.slug)
    .filter((member) => member.name.trim())
    .map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role.trim() || "Komisyon Başkanı",
      photo: member.photo.trim() || undefined,
    }));
  if (fromTeam.length > 0) return fromTeam;
  return commissionBureau(commission);
}

function coordinationGroup(members: TeamMember[]): TeamGroup {
  return {
    key: teamLeadGroup,
    title: "Genel Koordinasyon",
    lead: true,
    category: teamLeadGroup,
    members: of(members, teamLeadGroup),
  };
}

export function teamGroupRank(group: string, commissions: Commission[]) {
  if (group === teamLeadGroup) return 0;
  if (group === teamAcademicGroup) return 1;
  if (group === teamGeneralAssemblyGroup) return 2;
  const commissionIndex = commissions.findIndex((item) => item.slug === group);
  if (commissionIndex >= 0) return 3 + commissionIndex;
  if (group === teamOrgLeadGroup) return 100;
  const unitIndex = teamUnits.findIndex((item) => item.value === group);
  if (unitIndex >= 0) return 101 + unitIndex;
  return group ? 199 : 200;
}

export function genelKurulMembers(members: TeamMember[]) {
  return of(members, teamGeneralAssemblyGroup);
}

export function replaceGenelKurul(team: TeamMember[], next: TeamMember[]): TeamMember[] {
  const others = team.filter((member) => member.group !== teamGeneralAssemblyGroup);
  return [
    ...others,
    ...next.map((member) => ({
      ...member,
      group: teamGeneralAssemblyGroup,
    })),
  ];
}

export function academicTeam(members: TeamMember[], commissions: Commission[]) {
  const groups: TeamGroup[] = [
    coordinationGroup(members),
    {
      key: teamAcademicGroup,
      title: "Akademik Başkanı",
      lead: true,
      category: teamAcademicGroup,
      members: of(members, teamAcademicGroup),
    },
    {
      key: teamGeneralAssemblyGroup,
      title: "Genel Kurul",
      lead: true,
      cardLead: false,
      columns: "grid" as const,
      category: teamGeneralAssemblyGroup,
      members: of(members, teamGeneralAssemblyGroup),
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
    { value: teamLeadGroup, label: "Genel Koordinasyon" },
    { value: teamAcademicGroup, label: "Akademik Başkanı" },
    { value: teamGeneralAssemblyGroup, label: "Genel Kurul" },
    { value: teamCommissionCategory, label: "Komisyon Başkanları" },
  ];

  return { groups, categories };
}

export function organizationTeam(members: TeamMember[]) {
  const groups: TeamGroup[] = [
    coordinationGroup(members),
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
    { value: teamLeadGroup, label: "Genel Koordinasyon" },
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
    if (item.href === "/basvuru/durum") continue;
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
