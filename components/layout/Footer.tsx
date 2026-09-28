import type { ReactNode } from "react";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { withDerived } from "@/lib/live";
import { LogoMark } from "./Logo";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./SocialIcons";

export async function Footer() {
  const { site, navItems, coordinators, communityJoinHref, copy } = withDerived(await getContent());
  const facts = [
    { label: copy.frame.factDate, value: site.datesShort },
    { label: copy.frame.factPlace, value: site.city },
    { label: copy.frame.factDeadline, value: site.applicationDeadlineLabel },
  ];

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 border-b border-white/10 py-14 lg:flex-row lg:items-end lg:justify-between">
          <Link href="/" className="mx-auto flex w-fit items-center gap-4 text-left sm:mx-0" aria-label={`${site.name} Meclis ana sayfa`}>
            <LogoMark className="h-16 w-[4.25rem]" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-[0.22em]">{site.name}</span>
              <span className="mt-1.5 font-display text-[11px] font-medium tracking-[0.34em] text-white/70">
                {copy.frame.footerMark}
              </span>
              <span className="mt-3 text-[15px] text-white/90">{site.title}</span>
            </span>
          </Link>

          <dl className="grid grid-cols-3 gap-3 text-center sm:gap-x-10 sm:text-left lg:gap-x-12">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="font-display text-[10px] font-medium tracking-[0.2em] text-white/45 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-sm leading-5 text-white/90">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-12 py-14 text-center md:grid-cols-12 md:gap-10 md:text-left">
          <div className="md:col-span-5">
            <SectionLabel>{copy.frame.columnInstitution}</SectionLabel>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-white/72 md:mx-0">{copy.frame.footerDisclaimer}</p>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-white/90 md:mx-0">{site.venue}</p>
            <p className="mt-2 text-sm text-white/55">
              {copy.frame.feePrefix} {site.fee}
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Alt menü">
            <SectionLabel>{copy.frame.columnPages}</SectionLabel>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 md:block md:space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors duration-500 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <SectionLabel>{copy.frame.columnPeople}</SectionLabel>
            <ul className="mt-5 grid grid-cols-2 gap-4 md:block md:space-y-5">
              {coordinators.map((person) => (
                <li key={person.tel}>
                  <p className="text-sm font-medium text-white">{person.name}</p>
                  <p className="mt-1 text-xs tracking-wide text-white/50">{person.role}</p>
                  <a
                    className="mt-1 inline-block text-sm text-white/75 tabular-nums transition-colors duration-500 hover:text-white"
                    href={`tel:${person.tel}`}
                  >
                    {person.phone}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex justify-center gap-4 border-t border-white/10 pt-5 md:block md:space-y-3">
              <li>
                <a className={socialLink} href={`mailto:${site.email}`} aria-label={site.email}>
                  <SocialMark>
                    <MailIcon />
                  </SocialMark>
                  <span className="hidden md:inline">{site.email}</span>
                </a>
              </li>
              <li>
                <a className={socialLink} href={site.instagram} target="_blank" rel="noreferrer" aria-label={site.instagramLabel}>
                  <SocialMark>
                    <InstagramIcon />
                  </SocialMark>
                  <span className="hidden md:inline">{site.instagramLabel}</span>
                </a>
              </li>
              <li>
                <a
                  className={socialLink}
                  href={communityJoinHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={copy.frame.whatsappCommunity}
                >
                  <SocialMark>
                    <WhatsAppIcon />
                  </SocialMark>
                  <span className="hidden md:inline">{copy.frame.whatsappCommunity}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 pr-16 pb-24 text-center text-[11px] tracking-[0.12em] text-white/60 uppercase sm:pr-20 sm:pb-6 sm:text-left sm:tracking-[0.16em]">
          <p>
            © {site.edition} {site.name} — {site.title}
          </p>
        </div>
      </div>
    </footer>
  );
}

const socialLink =
  "group inline-flex items-center gap-3 text-sm text-white/80 transition-colors duration-500 hover:text-white";

function SocialMark({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/85 transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-brand">
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <p className="font-display text-[11px] font-medium tracking-[0.24em] text-white/50 uppercase">{children}</p>
      <span className="mt-3 block h-px w-8 bg-white/40" aria-hidden="true" />
    </div>
  );
}
