import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommissionIcon } from "@/components/commissions/CommissionIcon";
import { MediaGallery } from "@/components/commissions/MediaGallery";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getContent().commissions.map((commission) => ({ slug: commission.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const commission = getContent().commissions.find((item) => item.slug === slug);
  if (!commission) return { title: "Komisyon" };
  return {
    title: commission.name,
    description: commission.summary,
  };
}

export default async function CommissionPage({ params }: PageProps) {
  const { slug } = await params;
  const commission = getContent().commissions.find((item) => item.slug === slug);
  if (!commission) notFound();

  return (
    <>
      <section className="bg-brand pt-40 pb-16 text-white sm:pt-48 sm:pb-20">
        <Container>
          <Link
            href="/komisyonlar"
            className="font-display text-xs tracking-[0.22em] text-white/70 uppercase"
          >
            ← Komisyonlar
          </Link>
          <div className="mt-8 flex items-start gap-5">
            <CommissionIcon name={commission.icon} className="size-14 shrink-0" />
            <div>
              <h1 className="font-display text-4xl leading-tight font-semibold sm:text-6xl">
                {commission.name}
              </h1>
              {commission.fullName !== commission.name ? (
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">{commission.fullName}</p>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Konu</p>
              <p className="mt-5 text-lg leading-8 text-ink/85">{commission.description}</p>
              <Link
                href={`/basvuru?komisyon=${commission.slug}`}
                className="mt-8 inline-flex bg-brand px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.18em] text-white uppercase transition-colors duration-700 hover:bg-brand-deep"
              >
                Bu komisyona başvur
              </Link>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Gündem</p>
              <ol className="mt-4">
                {commission.agenda.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[auto_1fr] gap-4 border-t border-brand/15 py-4"
                  >
                    <span className="font-display text-sm text-brand/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-7 text-ink/85">{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="mt-20">
            <Reveal>
              <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Medya</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-brand">
                Fotoğraf ve video alanı
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
                Oturum çekimleri bu galeride sergilenir. Kayıtlar eklendiğinde kareler ve videolar
                aynı düzende açılır.
              </p>
            </Reveal>
            <div className="mt-8">
              <MediaGallery items={commission.media} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
