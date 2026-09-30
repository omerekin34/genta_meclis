import type { Metadata } from "next";
import { PracticalNotes } from "@/components/content/PracticalNotes";
import { ApplicationChoice } from "@/components/forms/ApplicationChoice";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: "Başvuru",
    description: `GENTA ${site.edition} bireysel ve delegasyon başvurusu. ${site.datesShort}, ${site.city}.`,
  };
}

export default async function ApplicationPage() {
  const { copy } = await getContent();
  return (
    <>
      <PageHero eyebrow={copy.pages.applyEyebrow} title={copy.pages.applyTitle} description={copy.pages.applyText} />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          <ApplicationChoice />
        </Container>
        <Container className="mt-16 sm:mt-20">
          <PracticalNotes />
        </Container>
      </section>
    </>
  );
}
