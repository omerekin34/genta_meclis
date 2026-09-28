import Link from "next/link";
import { PracticalNotes } from "@/components/content/PracticalNotes";
import { CommissionGrid } from "@/components/commissions/CommissionGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SponsorMarquee } from "@/components/sponsors/SponsorMarquee";
import { countApplications } from "@/lib/applications";
import { activityYears, getContent } from "@/lib/content";
import type { HomeStat } from "@/lib/content-types";
import { Countdown } from "./Countdown";
import { NovemberCalendar } from "./NovemberCalendar";
import { StatBand } from "./StatBand";

function shownValue(stat: HomeStat, applications: number, commissions: number) {
  if (stat.source === "applications") return applications;
  if (stat.source === "commissions") return commissions;
  if (stat.source === "activity") return activityYears();
  return stat.value;
}

export async function HomeSections() {
  const { site, about, copy, stats, commissions } = await getContent();
  const applications = await countApplications();
  return (
    <>
      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <div className="bg-brand p-2 text-white">
                <NovemberCalendar />
              </div>
            </Reveal>
            <div className="text-center lg:text-left">
              <Reveal>
                <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">
                  {copy.home.sessionEyebrow}
                </p>
                <h2 className="mt-3 font-display text-4xl leading-tight font-semibold text-brand">
                  {copy.home.sessionTitle}
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-ink/80 lg:mx-0">{copy.home.sessionBody}</p>
              </Reveal>
              <Reveal delay={0.12} className="mt-8">
                <p className="mb-3 font-display text-[11px] tracking-[0.22em] text-brand/60 uppercase">
                  {copy.home.countdownLabel}
                </p>
                <Countdown />
              </Reveal>
            </div>
          </div>
        </Container>

        <Container className="mt-14">
          <PracticalNotes />
        </Container>

        <div className="mt-16 sm:mt-20">
          <StatBand
            stats={stats.map((stat) => ({
              id: stat.id,
              label: stat.label,
              caption: stat.caption,
              value: shownValue(stat, applications, commissions.length),
            }))}
          />
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <Container>
          <div className="grid items-end gap-10 text-center lg:grid-cols-[1.2fr_0.8fr] lg:text-left">
            <Reveal>
              <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">
                {copy.home.aboutEyebrow}
              </p>
              <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl leading-tight font-semibold text-brand sm:text-5xl lg:mx-0">
                {copy.home.aboutTitle}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink/80 lg:mx-0">{about.lead}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/hakkimizda"
                className="group mx-auto inline-flex w-full max-w-xs items-center justify-center gap-3 border border-brand/30 bg-white px-5 py-3 font-display text-[12px] font-semibold tracking-[0.16em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:mx-0 lg:w-auto"
              >
                {copy.home.aboutCta}
                <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
              <div>
                <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">
                  {copy.home.commissionsEyebrow}
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold text-brand">{copy.home.commissionsTitle}</h2>
              </div>
              <Link
                href="/komisyonlar"
                className="group inline-flex w-full max-w-xs items-center justify-center gap-3 border border-brand/30 bg-paper px-5 py-3 font-display text-[12px] font-semibold tracking-[0.16em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-auto"
              >
                {copy.home.commissionsCta}
                <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <CommissionGrid />
          </div>
        </Container>
      </section>

      <section className="bg-brand py-24 text-white sm:py-32">
        <Container>
          <Reveal className="text-center">
            <p className="font-display text-xs tracking-[0.28em] text-white/65 uppercase sm:tracking-[0.32em]">
              {site.datesShort}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[0.95] font-bold tracking-tight uppercase italic sm:text-7xl">
              {copy.home.applyTitle.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/80">{copy.home.applyText}</p>
            <Link
              href="/basvuru"
              className="group mx-auto mt-10 inline-flex w-full max-w-xs items-center justify-center gap-3 border border-white bg-white px-8 py-4 font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:bg-transparent hover:text-white hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
            >
              {copy.home.applyCta}
              <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        </Container>
      </section>

      <section className="overflow-hidden bg-paper py-16">
        <Container>
          <Reveal>
            <div className="text-center">
              <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">
                {copy.home.sponsorsEyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-brand">{copy.home.sponsorsTitle}</h2>
            </div>
          </Reveal>
        </Container>
        <div className="mt-8">
          <SponsorMarquee />
        </div>
      </section>
    </>
  );
}
