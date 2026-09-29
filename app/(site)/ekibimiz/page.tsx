import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { TeamDirectory, type TeamCategory, type TeamGroup } from "@/components/team/TeamDirectory";
import { getContent } from "@/lib/content";
import { teamAcademicGroup, teamLeadGroup, teamUnits } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description: "GENTA 2026 Genç Tartışmacılar Meclisi’ni hazırlayan ekip: görevleri ve okulları.",
};

const otherGroup = "diger";

const categories: TeamCategory[] = [
  { value: teamLeadGroup, label: "Genel Koordinasyon" },
  { value: teamAcademicGroup, label: "Akademik Ekip" },
  ...teamUnits.map((unit) => ({ value: unit.value, label: unit.short })),
  { value: otherGroup, label: "Diğer" },
];

export default async function TeamPage() {
  const { team, copy, commissions } = await getContent();
  const members = team.filter((member) => member.name);
  const known = new Set<string>([
    teamLeadGroup,
    teamAcademicGroup,
    ...teamUnits.map((unit) => unit.value),
    ...commissions.map((commission) => commission.slug),
  ]);
  const of = (group: string) => members.filter((member) => member.group === group);

  const groups: TeamGroup[] = [
    { key: teamLeadGroup, title: "Genel Koordinasyon", lead: true, category: teamLeadGroup, members: of(teamLeadGroup) },
    { key: teamAcademicGroup, title: "Akademik Ekip", lead: false, category: teamAcademicGroup, members: of(teamAcademicGroup) },
    ...commissions.map((commission) => ({
      key: commission.slug,
      title: commission.name,
      eyebrow: "Akademik Ekip",
      icon: commission.icon,
      lead: false,
      category: teamAcademicGroup,
      members: of(commission.slug),
    })),
    ...teamUnits.map((unit) => ({
      key: unit.value,
      title: unit.label,
      lead: false,
      category: unit.value,
      members: of(unit.value),
    })),
    {
      key: otherGroup,
      title: "Ekip",
      lead: false,
      category: otherGroup,
      members: members.filter((member) => !known.has(member.group)),
    },
  ].filter((group) => group.members.length > 0);

  return (
    <>
      <PageHero eyebrow={copy.pages.teamEyebrow} title={copy.pages.teamTitle} description={copy.pages.teamText} />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          <TeamDirectory groups={groups} categories={categories} />
        </Container>
      </section>
    </>
  );
}
