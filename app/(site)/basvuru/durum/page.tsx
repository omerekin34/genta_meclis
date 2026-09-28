import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusLookup } from "@/components/forms/StatusLookup";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Başvuru durumu",
  description: "GENTA başvuru takip numarasıyla onay sonucunu görün.",
};

export default function ApplicationStatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Başvuru"
        title="Kaydın nerede?"
        description="Takip numaranı yaz. Onaylanırsa burada kayıt tamamlandı ve Kabul görürsün."
      />
      <section className="bg-ivory py-16 sm:py-24">
        <Container className="max-w-xl">
          <Suspense fallback={<div className="h-40 bg-paper" />}>
            <StatusLookup />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
