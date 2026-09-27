import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getContent } from "@/lib/content";
import { whatsAppHref } from "@/data/site";


export async function generateMetadata(): Promise<Metadata> {
  const { site } = getContent();
  return {
    title: "İletişim",
    description: `${site.venue}, ${site.city}. ${site.email}`,
  };
}

export default function ContactPage() {
  const { site, coordinators, copy } = getContent();
  const whatsAppNote = copy.frame.whatsappGreeting;
  const mapQuery = `${site.venue}, ${site.city}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <>
      <PageHero
        eyebrow={copy.pages.contactEyebrow}
        title={copy.pages.contactTitle}
        description={copy.pages.contactText}
      />
      <section className="bg-ivory py-14 sm:py-20">
        <Container>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <InfoCard icon={<PhoneIcon />} label={copy.pages.contactPhone}>
              <ul className="space-y-3">
                {coordinators.map((person) => (
                  <li key={person.tel}>
                    <a className="font-medium text-brand hover:underline" href={`tel:${person.tel}`}>
                      {person.phone}
                    </a>
                    <p className="text-sm text-ink/55">{person.name}</p>
                  </li>
                ))}
              </ul>
            </InfoCard>
            <InfoCard icon={<MailIcon />} label={copy.pages.contactMail}>
              <a className="font-medium break-all text-brand hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <p className="mt-1 text-sm text-ink/55">{copy.pages.contactMailNote}</p>
            </InfoCard>
            <InfoCard icon={<PinIcon />} label={copy.pages.contactAddress}>
              <p className="text-sm leading-6 text-ink/80">{site.venue}</p>
              <p className="mt-1 text-sm text-ink/55">{site.city}</p>
              <a
                className="mt-2 inline-flex text-sm font-medium text-brand hover:underline"
                href={mapHref}
                target="_blank"
                rel="noreferrer"
              >
                {copy.pages.contactDirections}
              </a>
            </InfoCard>
            <InfoCard icon={<WhatsAppIcon />} label={copy.pages.contactWhatsapp}>
              <ul className="space-y-2">
                {coordinators.map((person) => (
                  <li key={person.whatsapp}>
                    <a
                      className="font-medium text-brand hover:underline"
                      href={whatsAppHref(person.whatsapp, whatsAppNote)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {person.phone}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-ink/55">{copy.pages.contactFast}</p>
            </InfoCard>
          </ul>

          <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <ContactForm />
            <article className="flex min-h-80 flex-col overflow-hidden rounded-3xl border border-brand/10 bg-paper shadow-[0_1px_2px_rgba(44,20,18,0.04)]">
              <iframe
                title={`${site.venue} konumu`}
                src={mapSrc}
                className="min-h-80 w-full flex-1 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={mapHref}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 text-center font-display text-[11px] font-semibold tracking-[0.2em] text-brand uppercase transition-colors duration-500 hover:bg-brand hover:text-white"
              >
                {copy.pages.contactMap}
              </a>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="rounded-3xl border border-brand/10 bg-paper p-4 text-center shadow-[0_1px_2px_rgba(44,20,18,0.04)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5 sm:text-left">
      <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand sm:mx-0">{icon}</span>
      <p className="mt-4 font-display text-[11px] font-semibold tracking-[0.16em] text-ink/45 uppercase sm:tracking-[0.2em]">{label}</p>
      <div className="mt-2 break-words">{children}</div>
    </li>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.8h2.2l1.2 3-1.5 1.1a12 12 0 0 0 5.2 5.2l1.1-1.5 3 1.2V19a1.8 1.8 0 0 1-2 1.8A15.2 15.2 0 0 1 3.2 7.8 1.8 1.8 0 0 1 5 5.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
      />
      <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 3.5A8.2 8.2 0 0 0 4.7 15.2L3.6 19.4l4.3-1.1A8.2 8.2 0 1 0 12.04 3.5Zm4.76 11.62c-.2.56-1.16 1.07-1.62 1.14-.42.06-.96.09-1.55-.1-.36-.11-.82-.26-1.41-.51-2.48-1.07-4.1-3.57-4.22-3.74-.12-.17-1.02-1.36-1.02-2.59 0-1.23.64-1.84.87-2.09.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.43.2.5.69 1.72.75 1.84.06.13.1.27.02.44-.08.17-.12.27-.24.42-.12.14-.25.32-.36.43-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.91.81 1.68 1.07 1.92 1.19.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.23.32-.19.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14Z"
      />
    </svg>
  );
}
