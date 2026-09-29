import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import { teamAcademicHref, teamOrgHref } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Ekipler",
  description: "GENTA 2026 akademik ekibi ve organizasyon ekibi.",
};

export default async function TeamHubPage() {
  const { copy } = await getContent();
  const branches = [
    {
      href: teamAcademicHref,
      eyebrow: copy.pages.academicEyebrow,
      title: copy.pages.academicTitle,
      text: copy.pages.academicText,
      invert: true,
    },
    {
      href: teamOrgHref,
      eyebrow: copy.pages.orgEyebrow,
      title: copy.pages.orgTitle,
      text: copy.pages.orgText,
      invert: false,
    },
  ];

  return (
    <>
      <PageHero eyebrow={copy.pages.teamEyebrow} title={copy.pages.teamTitle} description={copy.pages.teamText} />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {branches.map((branch, index) => (
              <Reveal key={branch.href} delay={index * 0.08} className="h-full">
                <Link
                  href={branch.href}
                  className={`group flex h-full flex-col p-8 transition-all duration-700 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-10 ${
                    branch.invert
                      ? "bg-brand text-white hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)]"
                      : "border border-brand/15 bg-paper text-brand hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)]"
                  }`}
                >
                  <p
                    className={`font-display text-[11px] tracking-[0.28em] uppercase ${
                      branch.invert ? "text-white/70" : "text-brand/60"
                    }`}
                  >
                    {branch.eyebrow}
                  </p>
                  <h2 className="mt-4 font-display text-2xl leading-snug font-semibold sm:text-3xl">{branch.title}</h2>
                  <p className={`mt-5 flex-1 text-base leading-8 ${branch.invert ? "text-white/80" : "text-ink/80"}`}>
                    {branch.text}
                  </p>
                  <span
                    className={`mt-8 inline-flex items-center gap-2 font-display text-[12px] font-semibold tracking-[0.16em] uppercase ${
                      branch.invert ? "text-white" : "text-brand"
                    }`}
                  >
                    Ekipten devam et
                    <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
