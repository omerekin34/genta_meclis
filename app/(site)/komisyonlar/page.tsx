import type { Metadata } from "next";
import { CommissionGrid } from "@/components/commissions/CommissionGrid";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Komisyonlar",
  description:
    "GENTA 2026’nın dokuz komisyonu: Anayasa, Sağlık, Adalet, Millî Eğitim, Millî Savunma, Dışişleri, İçişleri, Diyanet ve Türk Devletleri.",
};

export default async function CommissionsPage() {
  const { copy } = await getContent();
  return (
    <>
      <PageHero
        eyebrow={copy.pages.commissionsEyebrow}
        title={copy.pages.commissionsTitle}
        description={copy.pages.commissionsText}
      />
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <CommissionGrid />
        </Container>
      </section>
    </>
  );
}
