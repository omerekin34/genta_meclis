"use client";

import { useMemo, useState } from "react";
import { CommissionIcon } from "@/components/commissions/CommissionIcon";
import { Reveal } from "@/components/motion/Reveal";
import type { TeamMember } from "@/lib/content-types";
import type { TeamCategory, TeamGroup } from "@/lib/team";

export type { TeamCategory, TeamGroup };

function fold(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0]?.toLocaleUpperCase("tr-TR")).join("");
}

function MemberCard({ member, lead }: { member: TeamMember; lead: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-brand/12 bg-paper transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className={`relative overflow-hidden bg-brand ${lead ? "aspect-[4/5]" : "aspect-square"}`}>
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
            <span className={`font-display font-semibold tracking-wide text-white/85 ${lead ? "text-6xl" : "text-5xl"}`}>
              {initials(member.name)}
            </span>
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 h-1 bg-brand" aria-hidden="true" />
      </div>
      <div className={`flex flex-1 flex-col text-center ${lead ? "p-6" : "p-5"}`}>
        <p className="mx-auto inline-flex rounded-full bg-brand px-4 py-1.5 font-display text-[11px] font-semibold tracking-[0.16em] text-white uppercase">
          {member.role || "Ekip üyesi"}
        </p>
        <h3 className={`mt-4 font-display leading-snug font-semibold text-brand ${lead ? "text-xl" : "text-lg"}`}>{member.name}</h3>
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

function GroupHeading({ group }: { group: TeamGroup }) {
  return (
    <div className="text-center">
      {group.eyebrow ? (
        <p className="mb-3 font-display text-[11px] tracking-[0.28em] text-brand/60 uppercase">{group.eyebrow}</p>
      ) : null}
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="h-px flex-1 bg-brand/20" aria-hidden="true" />
        <h2
          className={`flex items-center gap-3 font-display font-semibold text-brand ${
            group.lead ? "text-2xl sm:text-3xl" : "text-lg tracking-[0.04em] sm:text-xl"
          }`}
        >
          {group.icon ? <CommissionIcon name={group.icon} className="size-7 shrink-0 text-brand" /> : null}
          {group.title}
        </h2>
        <span className="h-px flex-1 bg-brand/20" aria-hidden="true" />
      </div>
    </div>
  );
}

export function TeamDirectory({
  groups,
  categories,
  empty = "Ekip bilgileri yakında burada.",
}: {
  groups: TeamGroup[];
  categories: TeamCategory[];
  empty?: string;
}) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const group of groups) map.set(group.category, (map.get(group.category) ?? 0) + group.members.length);
    return map;
  }, [groups]);
  const total = groups.reduce((sum, group) => sum + group.members.length, 0);
  const chips = categories.filter((item) => (counts.get(item.value) ?? 0) > 0);

  const visible = useMemo(() => {
    const needle = fold(query.trim());
    return groups
      .filter((group) => !category || group.category === category)
      .map((group) => ({
        ...group,
        members: needle
          ? group.members.filter((member) => fold(`${member.name} ${member.role} ${member.school}`).includes(needle))
          : group.members,
      }))
      .filter((group) => group.members.length > 0);
  }, [groups, category, query]);

  if (total === 0) return <p className="text-center text-base text-ink/70">{empty}</p>;

  const chipClass = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 ${
      active ? "border-brand bg-brand text-white" : "border-brand/20 bg-white text-brand hover:border-brand/50 hover:bg-brand/5"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-brand/12 pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible" role="group" aria-label="Ekip filtresi">
          <button type="button" aria-pressed={!category} onClick={() => setCategory("")} className={chipClass(!category)}>
            Tümü <span className={!category ? "text-white/70" : "text-ink/45"}>{total}</span>
          </button>
          {chips.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={chipClass(category === item.value)}
            >
              {item.label}{" "}
              <span className={category === item.value ? "text-white/70" : "text-ink/45"}>{counts.get(item.value)}</span>
            </button>
          ))}
        </div>
        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Ekipte ara</span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-brand/60">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5 L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="İsim, görev veya okul ara"
            className="w-full rounded-full border border-brand/20 bg-white py-2.5 pr-4 pl-11 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-brand"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="mt-14 space-y-20 sm:space-y-24">
          {visible.map((group) => (
            <section key={group.key} aria-label={group.title}>
              <Reveal>
                <GroupHeading group={group} />
              </Reveal>
              <div
                className={
                  group.columns === "grid"
                    ? "mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
                    : "mt-10 flex flex-wrap justify-center gap-5 sm:gap-6"
                }
              >
                {group.members.map((member, index) => (
                  <Reveal
                    key={member.id}
                    delay={Math.min(index * 0.06, 0.3)}
                    className={
                      group.columns === "grid"
                        ? "min-w-0"
                        : group.lead
                          ? "w-full max-w-80 sm:w-[calc((100%-1.5rem)/2)]"
                          : "w-[calc((100%-1.25rem)/2)] max-w-64 sm:w-[calc((100%-3rem)/3)] lg:w-60"
                    }
                  >
                    <MemberCard member={member} lead={group.cardLead ?? group.lead} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-14 text-center">
          <p className="text-base text-ink/70">Bu aramaya uyan ekip üyesi yok.</p>
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setQuery("");
            }}
            className="mt-4 text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            Filtreyi temizle
          </button>
        </div>
      )}
    </div>
  );
}
