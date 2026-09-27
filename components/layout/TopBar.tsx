"use client";

import { useContent } from "@/components/providers/ContentProvider";
import { useCountdown } from "@/components/home/useCountdown";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./SocialIcons";

export function TopBar() {
  const { site, communityJoinHref, copy } = useContent();
  const clock = useCountdown(site.applicationDeadlineIso);

  return (
    <div className="border-b border-white/10 bg-brand-deep text-white">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-3 px-2 sm:h-9 sm:px-8">
        <div className="flex min-w-0 items-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-9 items-center justify-center gap-2 text-white/85 transition-colors duration-500 hover:text-white sm:w-auto sm:justify-start sm:px-1"
            aria-label={`Instagram ${site.instagramLabel}`}
          >
            <InstagramIcon className="size-4 sm:size-3.5" />
            <span className="hidden font-display text-[11px] tracking-[0.14em] sm:inline">
              {site.instagramLabel}
            </span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex size-9 items-center justify-center gap-2 text-white/85 transition-colors duration-500 hover:text-white sm:w-auto sm:justify-start sm:px-1"
            aria-label={`E-posta ${site.email}`}
          >
            <MailIcon className="size-4 sm:size-3.5" />
            <span className="hidden font-display text-[11px] tracking-[0.08em] md:inline">
              {site.email}
            </span>
          </a>
          <a
            href={communityJoinHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-9 items-center justify-center gap-2 text-white/85 transition-colors duration-500 hover:text-white sm:w-auto sm:justify-start sm:px-1"
            aria-label="WhatsApp grubuna ve topluluğuna katılma isteği gönder"
          >
            <WhatsAppIcon className="size-4 sm:size-3.5" />
            <span className="hidden font-display text-[11px] tracking-[0.12em] lg:inline">
              {copy.frame.groupLabel}
            </span>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <p className="text-right leading-none">
            <span className="block font-display text-[8px] tracking-[0.12em] whitespace-nowrap text-white/60 uppercase sm:text-[10px] sm:tracking-[0.18em]">
              {copy.frame.deadlineCaption}
            </span>
            <span className="mt-1 block font-display text-[10px] whitespace-nowrap text-white/95 sm:text-[11px]">
              {site.applicationDeadlineLabel}
            </span>
          </p>
          {clock.expired ? (
            <span className="font-display text-[11px] tracking-[0.12em] uppercase">{copy.frame.expiredLabel}</span>
          ) : (
            <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Başvuruya kalan süre">
              {clock.parts.map((part) => (
                <li
                  key={part.label}
                  className={`min-w-7 text-center sm:min-w-8 ${part.short === "sn" ? "hidden sm:block" : ""}`}
                >
                  <span className="block font-display text-sm font-semibold tabular-nums sm:text-base">
                    {clock.ready ? part.value : "—"}
                  </span>
                  <span className="block font-display text-[8px] tracking-[0.14em] text-white/55 uppercase">
                    {part.short}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

