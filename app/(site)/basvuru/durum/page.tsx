import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusLookup } from "@/components/forms/StatusLookup";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Başvuru sorgulama",
  description: "GENTA başvuru takip numarasını sakla ve onay sonucunu bu sayfadan gör.",
};

export default function ApplicationStatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Sorgulama"
        title="Başvurunu sorgula."
        description="Burası formdan ayrı durur. Gönderince verilen takip numarasını sakla. Onaylanırsa burada kayıt tamamlandı ve Kabul görürsün."
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
