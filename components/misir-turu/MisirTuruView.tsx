import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { MisirHero } from "@/components/misir-turu/MisirHero";
import { lines, type MisirTuruContent } from "@/lib/misir-turu";

function CityPhoto({ src, alt }: { src: string; alt: string }) {
  const image = src.trim();
  if (!image) return null;
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-gradient-to-br from-zinc-800 via-brand-deep to-zinc-950">
      <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
    </div>
  );
}

function CityList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <li
          key={`${index}-${item}`}
          className="border border-brand/10 bg-zinc-50 px-4 py-3 text-[15px] leading-relaxed text-slate-800"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function withFlags(text: string) {
  const parts = text.split(/(\p{Regional_Indicator}{2})/u);
  return parts.map((part, index) =>
    /^\p{Regional_Indicator}{2}$/u.test(part) ? (
      <span
        key={index}
        className="inline-block align-[-0.12em]"
        style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
      >
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function MisirTuruView({ content }: { content: MisirTuruContent }) {
  const hurghadaExperiences = [
    { id: "exp1", title: content.hurghada_exp1_title, text: content.hurghada_exp1_text },
    { id: "exp2", title: content.hurghada_exp2_title, text: content.hurghada_exp2_text },
  ].filter((item) => item.title || item.text);
  const luksorItems = lines(content.luksor_items);
  const kahireItems = lines(content.kahire_items);
  const finaleCities = [
    { id: "hurghada", title: content.finale_hurghada_title, text: content.finale_hurghada_text },
    { id: "luksor", title: content.finale_luksor_title, text: content.finale_luksor_text },
    { id: "kahire", title: content.finale_kahire_title, text: content.finale_kahire_text },
  ].filter((item) => item.title || item.text);

  return (
    <>
      <MisirHero content={content} />

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="font-display text-[11px] font-medium tracking-[0.32em] text-brand/70 uppercase">Hikaye</p>
            <div className="mx-auto mt-5 h-px w-16 bg-brand/25" aria-hidden="true" />
            <p className="mt-8 text-base leading-relaxed text-slate-800 sm:text-lg sm:leading-relaxed">{content.intro_text}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="text-center font-display text-[11px] font-medium tracking-[0.32em] text-brand/70 uppercase">
              Rota ve deneyimler
            </p>
            <h2 className="mt-4 text-center font-display text-3xl font-semibold text-brand sm:text-4xl">
              Üç şehir, bir yolculuk
            </h2>
          </Reveal>

          <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-8">
            <Reveal>
              <article className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
                <CityPhoto src={content.hurghada_image} alt="Hurghada" />
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                      <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                      <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                        {content.hurghada_title}
                      </h3>
                      <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                        {content.hurghada_subtitle}
                      </p>
                      <p className="mt-5 text-base leading-relaxed text-slate-800">{content.hurghada_body}</p>
                    </div>
                    <ul className="space-y-8 border-t border-brand/10 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                      {hurghadaExperiences.map((item) => (
                        <li key={item.id}>
                          {item.title ? (
                            <p className="font-display text-[15px] font-semibold tracking-wide text-brand sm:text-base">
                              {item.title}
                            </p>
                          ) : null}
                          {item.text ? <p className="mt-2 text-[15px] leading-relaxed text-slate-800 sm:text-base">{item.text}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.06}>
              <article className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
                <CityPhoto src={content.luksor_image} alt="Luksor" />
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                    {content.luksor_title}
                  </h3>
                  <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                    {content.luksor_subtitle}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-slate-800">{content.luksor_body}</p>
                  <CityList items={luksorItems} />
                  {content.luksor_closing ? (
                    <p className="mt-6 text-base leading-relaxed text-slate-800">{content.luksor_closing}</p>
                  ) : null}
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
                <CityPhoto src={content.kahire_image} alt="Kahire" />
                <div className="p-8 sm:p-10 lg:p-12">
                  <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                    {content.kahire_title}
                  </h3>
                  <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                    {content.kahire_subtitle}
                  </p>
                  <p className="mt-5 text-base leading-relaxed text-slate-800">{content.kahire_body}</p>
                  <CityList items={kahireItems} />
                  {content.kahire_closing ? (
                    <p className="mt-6 text-base leading-relaxed text-slate-800">{content.kahire_closing}</p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-red-950 px-5 py-20 text-center sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-amber-400 sm:text-4xl lg:text-5xl">
              {content.finale_title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {finaleCities.map((city, index) => (
              <Reveal key={city.id} delay={index * 0.06}>
                <p className="font-display text-sm font-semibold tracking-[0.12em] text-amber-400 uppercase sm:text-base">
                  {city.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white sm:text-[15px]">{city.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-12 max-w-4xl text-base leading-relaxed text-white/90 sm:text-lg">{content.finale_body}</p>
            <div className="mx-auto mt-14 h-px w-24 bg-amber-400/40" aria-hidden="true" />
            <p className="mt-10 font-display text-3xl leading-[1.15] font-semibold tracking-tight text-amber-400 sm:text-5xl lg:text-7xl">
              {withFlags(content.finale_headline)}
            </p>
            <p className="mx-auto mt-6 max-w-3xl font-display text-base leading-relaxed text-white sm:text-lg">
              {withFlags(content.finale_footer)}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
