import type { Metadata } from "next";
import { TeamPageView } from "@/components/team/TeamPageView";
import { getContent } from "@/lib/content";
import { academicTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Akademik Ekip",
  description: "GENTA 2026 genel koordinasyon, akademik başkanı, genel kurul ve komisyon başkanları.",
};

export default async function AcademicTeamPage() {
  const { team, copy, commissions } = await getContent();
  const members = team.filter((member) => member.name);
  const { groups, categories } = academicTeam(members, commissions);

  return (
    <TeamPageView
      eyebrow={copy.pages.academicEyebrow}
      title={copy.pages.academicTitle}
      description={copy.pages.academicText}
      groups={groups}
      categories={categories}
      empty="Genel koordinasyon, akademik başkanı, genel kurul ve komisyon başkanları eklendikçe burada görünecek."
    />
  );
}
