import Image from "next/image";
import { getContent } from "@/lib/content";
import type { Sponsor } from "@/lib/content-types";
import { SponsorMarkIcon } from "./SponsorMark";

const sequence = [0, 1] as const;

export function SponsorMarquee() {
  const { sponsors } = getContent();
  return (
    <div className="overflow-hidden">
      <div className="sponsor-track flex w-max items-start py-2">
        {sequence.map((copy) => (
          <ul key={copy} className="flex shrink-0 items-start gap-10 pr-10">
            {sponsors.map((sponsor) => (
              <li key={`${copy}-${sponsor.id}`}>
                <SponsorPlaque sponsor={sponsor} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function SponsorPlaque({ sponsor }: { sponsor: Sponsor }) {
  return (
    <article className="flex w-56 shrink-0 flex-col items-center text-center">
      <div className="flex size-36 items-center justify-center rounded-full border border-brand/15 bg-ivory">
        {sponsor.logoSrc ? (
          <Image
            src={sponsor.logoSrc}
            alt=""
            width={88}
            height={88}
            className="size-20 object-contain"
          />
        ) : (
          <SponsorMarkIcon mark={sponsor.mark} />
        )}
      </div>
      <h3 className="mt-4 flex h-10 items-center justify-center font-display text-[13px] leading-5 font-semibold tracking-[0.1em] text-brand uppercase">
        {sponsor.name}
      </h3>
      <p className="mt-2 h-12 text-sm leading-6 text-ink/65">{sponsor.note}</p>
    </article>
  );
}
