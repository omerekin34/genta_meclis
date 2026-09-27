import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-svh items-center bg-brand py-28 text-white">
      <Container>
        <p className="font-display text-xs tracking-[0.32em] text-white/65 uppercase">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold">Sayfa bulunamadı.</h1>
        <p className="mt-5 max-w-md text-white/75">
          Aradığınız adres bu mecliste yok. Ana sayfadan devam edebilirsiniz.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex bg-white px-6 py-3.5 font-display text-[12px] font-semibold tracking-[0.18em] text-brand uppercase"
        >
          Ana sayfa
        </Link>
      </Container>
    </section>
  );
}
