import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/commissions/MediaGallery";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const content = await getContent();
  return content.commissions.map((commission) => ({ slug: commission.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const commission = content.commissions.find((item) => item.slug === slug);
  if (!commission) return { title: "Komisyon" };
  return {
    title: commission.name,
    description: commission.summary,
  };
}

export default async function CommissionPage({ params }: PageProps) {
  const { slug } = await params;
  const content = await getContent();
  const commission = content.commissions.find((item) => item.slug === slug);
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
          <div className="mt-10 flex justify-center sm:mt-12">
            <div className="flex h-32 w-32 items-center justify-center md:h-48 md:w-48">
              <Image
                src={`/logos/${commission.slug}.jpg`}
                alt={`${commission.name} logosu`}
                width={384}
                height={384}
                priority
                sizes="(min-width: 640px) 192px, 128px"
                className="h-full w-full scale-[1.03] object-cover [clip-path:circle(49%_at_50%_50%)]"
              />
            </div>
          </div>
          <h1 className="mt-10 font-display text-4xl leading-tight font-semibold sm:mt-12 sm:text-6xl">
            {commission.name}
          </h1>
          {commission.fullName !== commission.name ? (
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">{commission.fullName}</p>
          ) : null}
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Konu</p>
            <p className="mt-5 text-lg leading-8 text-ink/85">{commission.description}</p>
            <Link
              href={`/basvuru?komisyon=${commission.slug}`}
              className="mt-8 inline-flex bg-brand px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.18em] text-white uppercase transition-colors duration-700 hover:bg-brand-deep"
            >
              Bu komisyona başvur
            </Link>
          </Reveal>

          {commission.agenda.length > 0 ? (
            <div className="mt-20">
              <Reveal>
                <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Genta Meclis’26</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">Gündem maddeleri</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
                  {commission.name}, oturumlarını bu {commission.agenda.length} madde üzerinden yürütür.
                  Delegeler hazırlıklarını her maddenin çerçevesine göre yapar.
                </p>
              </Reveal>
              <ol className="mt-10 space-y-5">
                {commission.agenda.map((item, index) => (
                  <li key={item.id}>
                    <Reveal delay={Math.min(index * 0.06, 0.24)}>
                      <article className="relative grid gap-5 overflow-hidden border border-brand/12 bg-paper p-6 sm:grid-cols-[5.5rem_1fr] sm:gap-8 sm:p-10">
                        <span className="absolute inset-y-0 left-0 w-1 bg-brand" aria-hidden="true" />
                        <p className="font-display text-5xl leading-none font-semibold text-brand/25 sm:text-6xl">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <div>
                          <p className="font-display text-[11px] font-semibold tracking-[0.22em] text-brand/70 uppercase">
                            {index + 1}. Gündem maddesi
                          </p>
                          {item.title ? (
                            <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-brand sm:text-2xl">
                              {item.title}
                            </h3>
                          ) : null}
                          {item.text ? (
                            <p className="mt-5 max-w-4xl text-[15px] leading-8 text-ink/80">{item.text}</p>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

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
