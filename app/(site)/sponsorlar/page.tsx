import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { SponsorMarquee, SponsorPlaque } from "@/components/sponsors/SponsorMarquee";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsorlar",
  description: "GENTA 2026’yı destekleyen kurumlara teşekkür.",
};

export default async function SponsorsPage() {
  const { sponsors, copy } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={copy.pages.sponsorsEyebrow}
        title={copy.pages.sponsorsTitle}
        description={copy.pages.sponsorsText}
      />
      <section className="overflow-hidden bg-paper py-16">
        <SponsorMarquee />
      </section>
      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor, index) => (
              <Reveal key={sponsor.id} delay={Math.min(index * 0.06, 0.3)}>
                <SponsorPlaque sponsor={sponsor} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
