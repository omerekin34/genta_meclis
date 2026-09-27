import { Container } from "./Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-brand px-0 pt-40 pb-16 text-center text-white sm:pt-48 sm:pb-20 sm:text-left">
      <Container>
        <p className="font-display text-xs font-medium tracking-[0.28em] text-white/70 uppercase sm:tracking-[0.34em]">
          {eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-[1.08] font-semibold sm:mx-0 sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 sm:mx-0 sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
