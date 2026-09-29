import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { TeamBranchNav } from "@/components/team/TeamBranchNav";
import { TeamDirectory } from "@/components/team/TeamDirectory";
import type { TeamCategory, TeamGroup } from "@/lib/team";

export function TeamPageView({
  eyebrow,
  title,
  description,
  groups,
  categories,
  empty,
}: {
  eyebrow: string;
  title: string;
  description: string;
  groups: TeamGroup[];
  categories: TeamCategory[];
  empty: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          <TeamBranchNav />
          <TeamDirectory groups={groups} categories={categories} empty={empty} />
        </Container>
      </section>
    </>
  );
}
