import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mısır Turu",
  description:
    "Mısır Turu ile ilgili detaylı bilgilendirme çok yakında buradan yapılacaktır.",
};

export default function MisirTuruPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-ivory px-5 pt-28 pb-20 sm:px-8">
      <article className="relative w-full max-w-xl overflow-hidden border border-brand/15 bg-paper px-8 py-14 text-center shadow-2xl sm:px-14 sm:py-16">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-brand" aria-hidden="true" />
        <p className="font-display text-[11px] font-medium tracking-[0.32em] text-brand/70 uppercase">
          Genta Meclis
        </p>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-brand sm:text-5xl">
          Mısır Turu
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-brand/25" aria-hidden="true" />
        <p className="mt-6 font-sans text-base leading-8 text-ink/75 sm:text-lg sm:leading-9">
          Mısır Turu ile ilgili detaylı bilgilendirme çok yakında buradan yapılacaktır.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 border border-brand bg-brand px-7 py-3 font-display text-[12px] font-semibold tracking-[0.16em] text-white uppercase transition-all duration-500 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-[0_16px_32px_-18px_rgba(108,17,16,0.65)]"
        >
          Geri Dön
        </Link>
      </article>
    </section>
  );
}
