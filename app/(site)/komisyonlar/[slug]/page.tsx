import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommissionBureau } from "@/components/commissions/CommissionBureau";
import { CommissionEmblem } from "@/components/commissions/CommissionEmblem";
import { MediaGallery } from "@/components/commissions/MediaGallery";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import { resolveCommissionBureau } from "@/lib/team";

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
  const bureau = resolveCommissionBureau(commission, content.team);

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
            <CommissionEmblem commission={commission} />
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
              href="/basvuru"
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
                          {item.pdf ? (
                            <a
                              href={item.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/pdf mt-8 flex w-full items-center gap-4 border border-brand/20 bg-ivory p-4 text-brand transition-all duration-500 hover:border-brand hover:bg-brand hover:text-white hover:shadow-[0_18px_40px_-18px_rgba(90,20,30,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand active:scale-[0.99] sm:inline-flex sm:w-auto sm:min-w-[22rem] sm:p-5"
                            >
                              <span className="flex size-12 shrink-0 items-center justify-center bg-brand text-white transition-colors duration-500 group-hover/pdf:bg-white group-hover/pdf:text-brand">
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
                                  <path
                                    d="M7 3.5h7L18.5 8v12a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z M13.5 3.5V8H18.5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-display text-[10px] font-semibold tracking-[0.22em] uppercase opacity-70">
                                  Gündem belgesi · PDF
                                </span>
                                <span className="mt-1 block font-display text-sm font-semibold sm:text-base">
                                  {index + 1}. maddenin PDF’ini aç
                                </span>
                              </span>
                              <span
                                className="shrink-0 font-display text-lg transition-transform duration-500 group-hover/pdf:translate-x-1"
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <div className="mt-20">
                <Reveal>
                  <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Belgeler</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">Gündem belgeleri</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
                    Her gündem maddesi için hazırlanan belgeler aşağıda yer alır. Delegeler oturum öncesi ilgili
                    maddenin PDF’ini inceleyerek hazırlanır.
                  </p>
                </Reveal>
                <ul className="mt-10 grid gap-5 md:grid-cols-3">
                  {commission.agenda.map((item, index) => (
                    <li key={item.id} className="h-full">
                      <Reveal delay={Math.min(index * 0.06, 0.24)} className="h-full">
                        <article className="group relative flex h-full flex-col overflow-hidden border border-brand/12 bg-brand p-7 text-white sm:p-8">
                          <div className="flex items-start justify-between gap-4">
                            <span className="font-display text-5xl leading-none font-semibold text-white/20">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-7 text-white/70">
                              <path
                                d="M7 3.5h7L18.5 8v12a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z M13.5 3.5V8H18.5"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <p className="mt-8 font-display text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
                            {index + 1}. Gündem maddesi
                          </p>
                          <h3 className="mt-3 line-clamp-4 font-display text-lg leading-snug font-semibold">
                            {item.title || "Gündem maddesi"}
                          </h3>
                          <div className="mt-auto pt-8">
                            {item.pdf ? (
                              <>
                                <a
                                  href={item.pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-white px-5 py-3 font-display text-[11px] font-semibold tracking-[0.18em] text-brand uppercase transition-colors duration-500 hover:bg-ivory"
                                >
                                  PDF’i Aç →
                                </a>
                                <a
                                  href={item.pdf}
                                  download
                                  className="ml-4 inline-flex font-display text-[11px] font-semibold tracking-[0.18em] text-white/75 uppercase underline-offset-4 hover:underline"
                                >
                                  İndir
                                </a>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 font-display text-[11px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                                Belge hazırlanıyor
                              </span>
                            )}
                          </div>
                          <span className="absolute inset-x-0 bottom-0 h-1 bg-amber-400" aria-hidden />
                        </article>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
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

          <CommissionBureau commissionName={commission.name} members={bureau} />
        </Container>
      </section>
    </>
  );
}
