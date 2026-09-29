import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import type { TeamMember } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Ekibimiz",
  description: "GENTA 2026 Genç Tartışmacılar Meclisi’ni hazırlayan ekip: görevleri ve okulları.",
};

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0]?.toLocaleUpperCase("tr-TR")).join("");
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-brand/12 bg-paper transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- fotoğraf adresi her kaynaktan gelebilir
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="font-display text-6xl font-semibold tracking-wide text-white/85">{initials(member.name)}</span>
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 h-1 bg-brand" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col p-6 text-center">
        <p className="mx-auto inline-flex rounded-full bg-brand px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
          {member.role || "Ekip üyesi"}
        </p>
        <h2 className="mt-4 font-display text-xl leading-snug font-semibold text-brand">{member.name}</h2>
        {member.school ? (
          <p className="mt-2 flex items-start justify-center gap-2 text-sm leading-6 text-ink/70">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand/70">
              <path d="M3 9 L12 4 L21 9 L12 14 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M7 11.5 V16 C9.5 18 14.5 18 17 16 V11.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <span>{member.school}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default async function TeamPage() {
  const { team, copy } = await getContent();
  const members = team.filter((member) => member.name);
  return (
    <>
      <PageHero eyebrow={copy.pages.teamEyebrow} title={copy.pages.teamTitle} description={copy.pages.teamText} />
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          {members.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-5">
              {members.map((member, index) => (
                <Reveal
                  key={member.id}
                  delay={Math.min(index * 0.06, 0.36)}
                  className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                >
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-base text-ink/70">Ekip bilgileri yakında burada.</p>
          )}
        </Container>
      </section>
    </>
  );
}
