import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "GENTA Genç Tartışmacılar Meclisi’nin amacı, misyonu ve vizyonu. 14–16 Kasım 2026, İstanbul Pendik.",
};

export default function AboutPage() {
  const { about, copy } = getContent();
  return (
    <>
      <PageHero eyebrow={copy.pages.aboutEyebrow} title={copy.pages.aboutTitle} description={about.lead} />
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <article className="h-full bg-brand p-8 text-white sm:p-10">
                <h2 className="font-display text-2xl font-semibold">{copy.pages.aboutMission}</h2>
                <p className="mt-5 text-base leading-8 text-white/80">{about.mission}</p>
              </article>
            </Reveal>
            <Reveal delay={0.1}>
              <article className="h-full border border-brand/15 bg-paper p-8 sm:p-10">
                <h2 className="font-display text-2xl font-semibold text-brand">{copy.pages.aboutVision}</h2>
                <p className="mt-5 text-base leading-8 text-ink/80">{about.vision}</p>
              </article>
            </Reveal>
          </div>

          <div className="mt-20 max-w-3xl">
            <Reveal>
              <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">
                {copy.pages.aboutPurpose}
              </p>
              <div className="mt-6 space-y-5 text-base leading-8 text-ink/85">
                {about.purpose.map((paragraph) => (
                  <p key={paragraph.id}>{paragraph.text}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {about.values.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.08} className="h-full">
                <article className="h-full border-t-2 border-brand bg-paper p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <h3 className="font-display text-xl font-semibold text-brand">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink/75">{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
