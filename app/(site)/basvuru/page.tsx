import type { Metadata } from "next";
import { PracticalNotes } from "@/components/content/PracticalNotes";
import { ApplicationChoice } from "@/components/forms/ApplicationChoice";
import { ApplicationClosed } from "@/components/forms/ApplicationClosed";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { applicationsClosed, getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: "Başvuru",
    description: `GENTA ${site.edition} bireysel ve delegasyon başvurusu. ${site.datesShort}, ${site.city}.`,
  };
}

export default async function ApplicationPage() {
  const { site, copy } = await getContent();
  const closed = applicationsClosed(site.applicationDeadlineIso);
  return (
    <>
      <PageHero
        eyebrow={copy.pages.applyEyebrow}
        title={closed ? copy.pages.applyClosedTitle : copy.pages.applyTitle}
        description={closed ? copy.pages.applyClosedText : copy.pages.applyText}
      />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          {closed ? (
            <ApplicationClosed
              title={copy.pages.applyClosedTitle}
              text={copy.pages.applyClosedText}
              deadlineLabel={site.applicationDeadlineLabel}
            />
          ) : (
            <ApplicationChoice />
          )}
        </Container>
        <Container className="mt-16 sm:mt-20">
          <PracticalNotes />
        </Container>
      </section>
    </>
  );
}
