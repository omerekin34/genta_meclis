import type { Metadata } from "next";
import { Suspense } from "react";
import { PracticalNotes } from "@/components/content/PracticalNotes";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: "Başvuru",
    description: `GENTA ${site.edition} bireysel ve delegasyon başvuru formu. ${site.datesShort}, ${site.city}.`,
  };
}

export default async function ApplicationPage() {
  const { copy } = await getContent();
  return (
    <>
      <PageHero eyebrow={copy.pages.applyEyebrow} title={copy.pages.applyTitle} description={copy.pages.applyText} />
      <section className="bg-ivory py-16 sm:py-24">
        <Container>
          <PracticalNotes />
        </Container>
        <Container className="mt-12 max-w-3xl">
          <Suspense fallback={<div className="h-96 bg-paper" />}>
            <ApplicationForm />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
