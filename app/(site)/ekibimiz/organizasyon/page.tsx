import type { Metadata } from "next";
import { TeamPageView } from "@/components/team/TeamPageView";
import { getContent } from "@/lib/content";
import { organizationTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Organizasyon Ekibi",
  description:
    "GENTA 2026 organizasyon başkanı ile tasarım, halkla ilişkiler, lojistik, sosyal medya ve basın ekipleri.",
};

export default async function OrganizationTeamPage() {
  const { team, copy } = await getContent();
  const members = team.filter((member) => member.name);
  const { groups, categories } = organizationTeam(members);

  return (
    <TeamPageView
      eyebrow={copy.pages.orgEyebrow}
      title={copy.pages.orgTitle}
      description={copy.pages.orgText}
      groups={groups}
      categories={categories}
      empty="Organizasyon başkanı ile tasarım, halkla ilişkiler, lojistik, sosyal medya ve basın ekipleri eklendikçe burada görünecek."
    />
  );
}
