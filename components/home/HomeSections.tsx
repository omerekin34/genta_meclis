import Link from "next/link";
import { PracticalNotes } from "@/components/content/PracticalNotes";
import { CommissionGrid } from "@/components/commissions/CommissionGrid";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SponsorMarquee } from "@/components/sponsors/SponsorMarquee";
import { getContent } from "@/lib/content";
import { teamAcademicGroup, teamAcademicHref, teamLeadGroup, teamOrgHref, teamOrgLeadGroup } from "@/lib/content-types";
import { Countdown } from "./Countdown";
import { NovemberCalendar } from "./NovemberCalendar";

function teamPreviewHref(group: string) {
  if (group === teamOrgLeadGroup) return teamOrgHref;
  if (group === teamAcademicGroup) return teamAcademicHref;
  return "/ekibimiz";
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0]?.toLocaleUpperCase("tr-TR")).join("");
}

export async function HomeSections() {
  const { site, about, copy, team } = await getContent();
  const named = team.filter((member) => member.name);
  const coordination = named.filter(
    (member) => member.group === teamLeadGroup || /genel koordinat/i.test(member.role),
  );
  const leads = (coordination.length > 0 ? coordination : named).slice(0, 4).map((member, index) => ({
    ...member,
    role: member.role.trim() || "Genel Koordinatör",
    photo: member.photo || `/koordinator${index + 1}.jpg`,
  }));
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
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="text-center lg:text-left">
              <p className="font-display text-xs tracking-[0.3em] text-brand/70 uppercase">{copy.home.teamEyebrow}</p>
              <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl leading-tight font-semibold text-brand sm:text-5xl lg:mx-0">
                {copy.home.teamTitle}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-ink/80 lg:mx-0">{copy.home.teamText}</p>
              <div className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-3 lg:mx-0 lg:max-w-none lg:flex-row">
                <Link
                  href={teamAcademicHref}
                  className="group inline-flex w-full items-center justify-center gap-3 border border-brand bg-brand px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.16em] text-white uppercase transition-all duration-700 hover:-translate-y-1 hover:bg-brand-deep hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-auto"
                >
                  {copy.home.teamAcademicCta}
                  <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                    →
                  </span>
                </Link>
                <Link
                  href={teamOrgHref}
                  className="group inline-flex w-full items-center justify-center gap-3 border border-brand/30 bg-white px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.16em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-auto"
                >
                  {copy.home.teamOrgCta}
                  <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
            {leads.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                {leads.map((member, index) => (
                  <Reveal key={member.id} delay={0.08 + index * 0.06} className="w-[calc((100%-1rem)/2)] max-w-60 sm:w-56">
                    <Link
                      href={teamPreviewHref(member.group)}
                      className="group flex h-full flex-col overflow-hidden border border-brand/12 bg-white text-center transition-all duration-700 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                      <div className="flex aspect-square items-center justify-center overflow-hidden bg-brand">
                        {member.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element -- fotoğraf adresi her kaynaktan gelebilir
                          <img
                            src={member.photo}
                            alt={member.name}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-1000 group-hover:scale-[1.04] motion-reduce:transition-none"
                          />
                        ) : (
                          <span className="font-display text-5xl font-semibold tracking-wide text-white/85">
                            {initials(member.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <p className="mx-auto rounded-full bg-brand px-3 py-1 font-display text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                          {member.role || "Ekip üyesi"}
                        </p>
                        <p className="mt-3 font-display text-base leading-snug font-semibold text-brand">{member.name}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 sm:py-28">
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
                className="group inline-flex w-full max-w-xs items-center justify-center gap-3 border border-brand/30 bg-white px-5 py-3 font-display text-[12px] font-semibold tracking-[0.16em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-auto"
              >
                {copy.home.commissionsCta}
                <span className="transition-transform duration-700 group-hover:translate-x-1.5" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <CommissionGrid limit={6} />
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
