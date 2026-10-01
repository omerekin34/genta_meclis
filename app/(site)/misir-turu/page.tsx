"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

const INTRO =
  "GENTA Meclis olarak 24–30 Ağustos tarihlerinde gerçekleştirdiğimiz GENTA Çalıştayı Mısır Turumuzda 52 kişilik grubumuzla Kahire, Luksor ve Hurghada'yı kapsayan 6 günlük bir yolculuğu başarıyla tamamladık. Çöl safarisinden dalışa, Nil Nehri tekne turundan Piramitler'e kadar birçok farklı deneyimi birlikte yaşadık ve Mısır'dan unutulmaz anılarla döndük. Şimdi ise aynı heyecanı 24–30 Ocak 2027 tarihlerinde yeniden yaşıyoruz! Bu kez 6 günlük programımızda, Mısır'ın hem tatil hem macera hem de tarih dolu yüzünü keşfediyoruz!";

const HURGHADA = {
  title: "🌊 İLK DURAK: HURGHADA",
  subtitle: "Kızıldeniz'de Tatil, Deniz ve Macera!",
  body: "Mısır maceramıza Hurghada'da başlıyoruz. İlk 3 günümüzü 4–5 yıldızlı, kendi plajı olan havuzlu ve aquaparklı resort otelimizde geçiriyoruz. Kızıldeniz'in güneşi, resort otelimizin imkanları ve birbirinden farklı aktivitelerle turun ilk bölümünü tamamen tatil ve eğlenceye ayırıyoruz.",
  experiences: [
    {
      title: "🏜️ Safari Turu",
      text: "Hurghada'nın çöllerine doğru macera dolu bir yolculuğa çıkıyoruz. 🏍️ ATV & Buggy, 🌅 Çöl Manzaraları, 🔥 Bedevi Gecesi. Çölün ortasında sadece safari yapmıyor, Mısır'ın geleneksel yaşamına da yakından tanıklık ediyoruz.",
    },
    {
      title: "🤿 KIZILDENİZ'DE DALIŞ & ORANGE BAY",
      text: "Hurghada'daki deniz günümüzü ise Kızıldeniz'in eşsiz su altı dünyasına ayırıyoruz. 🚤 Tekneyle denize açılıyor, 🏝️ Orange Bay Adası'nı keşfediyor, 🌊 serbest yüzmenin tadını çıkarıyor, 🤿 Tüplü dalış deneyimi yaşıyoruz. Güneş, deniz, tekne, ada ve dalış... Hurghada'da ilk 3 günümüz tam anlamıyla tatil ve macera!",
    },
  ],
} as const;

const LUKSOR = {
  title: "🏺 Kültür Rotamızın İlk Durağı: LUKSOR",
  subtitle: "Antik Mısır'ın Kalbine Yolculuk",
  body: "Hurghada'daki 3 günlük tatilin ardından rotamızı Luksor'a çeviriyoruz. Binlerce yıllık tarihin izlerini takip ederek Antik Mısır'ın en önemli merkezlerinden birini keşfediyoruz.",
  items: ["🏺 Krallar Vadisi", "🏛️ Antik tapınaklar", "🌊 Nil Nehri", "📜 Antik Mısır'ın eşsiz mirası."],
  closing:
    "Bir gün boyunca kendimizi binlerce yıl öncesine götüren büyük bir kültür yolculuğunun içinde buluyoruz.",
} as const;

const KAHIRE = {
  title: "🏛️ Turumuzun Finali: KAHİRE",
  subtitle: "Piramitlerin Gölgesinde Büyük Final",
  body: "Ve yolculuğumuzun son bölümünde Kahire'deyiz. Mısır denince akla ilk gelen o manzarayla karşılaşıyoruz:",
  items: ["🔺 Gize Piramitleri", "🗿 Sfenks", "🌊 Nil Nehri", "🏺 Antik Mısır'ın eşsiz mirası."],
  closing:
    "Kahire'de geçireceğimiz iki gün boyunca şehrin tarihi ve kültürel noktalarını keşfediyor, Piramitler Bölgesinde deve deneyimi yaşıyor ve Nil Nehri tekne turuyla Kahire'yi farklı bir açıdan görüyoruz.",
} as const;

const FINALE_CITIES = [
  {
    title: "🌊 HURGHADA",
    text: "Tatil • Deniz • Dalış • Orange Bay • Safari",
  },
  {
    title: "🏺 LUKSOR",
    text: "Krallar Vadisi • Tapınaklar • Nil • Antik Mısır",
  },
  {
    title: "🏛️ KAHİRE",
    text: "Piramitler • Sfenks • Deve Deneyimi • Nil Nehri",
  },
] as const;

const FINALE_BODY =
  "Önce 3 gün Kızıldeniz'de tatil, sonra çölde macera, ardından Luksor'da Antik Mısır'ın izleri, ve son olarak Kahire'de Piramitlerin büyüleyici atmosferi... Daha Önce Birlikteydik. Şimdi Yeniden Mısır'dayız. 24–30 Ağustos GENTA Çalıştayı Mısır Turumuzda 52 kişilik grubumuzla bu yolculuğu birlikte gerçekleştirdik. Şimdi aynı heyecanı yeni katılacak arkadaşlarımızla birlikte yeniden yaşamaya hazırlanıyoruz.";

export default function MisirTuruPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  return (
    <>
      <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-zinc-900 pt-28 md:min-h-screen md:pt-32">
        <video
          ref={videoRef}
          src="/media/misir-hero.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-10 bg-black/60 bg-gradient-to-t from-black/80 to-transparent md:bg-black/40"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center px-5 pb-24 text-center">
          <p className="font-display text-[11px] font-medium tracking-[0.34em] text-amber-400/85 uppercase">
            GENTA Meclis Mısır Turu
          </p>
          <h1 className="mt-5 max-w-5xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-amber-400 drop-shadow-[0_10px_28px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-7xl">
            OCAK&apos;TA YENİDEN MISIR&apos;DAYIZ!
          </h1>
          <p className="mt-6 font-display text-lg font-medium tracking-[0.22em] text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)] sm:text-2xl">
            24–30 Ocak 2027
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:text-lg sm:leading-8">
            Daha önce birlikte keşfettik, şimdi yeniden yola çıkıyoruz!
          </p>
          <p className="mt-8 inline-flex max-w-full items-center justify-center border border-amber-400/80 bg-white/10 px-4 py-3 text-center font-display text-[13px] leading-snug font-semibold tracking-wide text-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur-md sm:mt-10 sm:px-7 sm:py-3.5 sm:text-base">
            🎁 3 Kişiye Ücretsiz Mısır Turu Kazanma Şansı!
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMuted((value) => !value)}
          aria-label={isMuted ? "Sesi aç" : "Sesi kapat"}
          aria-pressed={!isMuted}
          className="absolute right-24 bottom-8 z-20 rounded-full border border-white/30 bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:right-28"
        >
          {isMuted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </button>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <p className="font-display text-[11px] font-medium tracking-[0.32em] text-brand/70 uppercase">
              Hikaye
            </p>
            <div className="mx-auto mt-5 h-px w-16 bg-brand/25" aria-hidden="true" />
            <p className="mt-8 text-base leading-relaxed text-slate-800 sm:text-lg sm:leading-relaxed">
              {INTRO}
            </p>
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
              <article className="w-full bg-white p-8 shadow-lg sm:p-10 lg:p-12">
                <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
                  <div>
                    <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                    <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                      {HURGHADA.title}
                    </h3>
                    <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                      {HURGHADA.subtitle}
                    </p>
                    <p className="mt-5 text-base leading-relaxed text-slate-800">
                      {HURGHADA.body}
                    </p>
                  </div>
                  <ul className="space-y-6 border-t border-brand/10 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                    {HURGHADA.experiences.map((item) => (
                      <li key={item.title}>
                        <p className="font-display text-[15px] font-semibold tracking-wide text-brand">
                          {item.title}
                        </p>
                        <p className="mt-2 text-[15px] leading-relaxed text-slate-800">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>

            <Reveal delay={0.06}>
              <article className="w-full bg-white p-8 shadow-lg sm:p-10 lg:p-12">
                <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                  {LUKSOR.title}
                </h3>
                <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                  {LUKSOR.subtitle}
                </p>
                <p className="mt-5 text-base leading-relaxed text-slate-800">{LUKSOR.body}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {LUKSOR.items.map((item) => (
                    <li
                      key={item}
                      className="border border-brand/10 bg-zinc-50 px-4 py-3 text-[15px] leading-relaxed text-slate-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-slate-800">{LUKSOR.closing}</p>
              </article>
            </Reveal>

            <Reveal delay={0.1}>
              <article className="w-full bg-white p-8 shadow-lg sm:p-10 lg:p-12">
                <div className="h-1.5 w-12 bg-brand" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl leading-snug font-semibold text-brand sm:text-[1.7rem]">
                  {KAHIRE.title}
                </h3>
                <p className="mt-3 font-display text-base font-medium tracking-wide text-ink/80 sm:text-lg">
                  {KAHIRE.subtitle}
                </p>
                <p className="mt-5 text-base leading-relaxed text-slate-800">{KAHIRE.body}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {KAHIRE.items.map((item) => (
                    <li
                      key={item}
                      className="border border-brand/10 bg-zinc-50 px-4 py-3 text-[15px] leading-relaxed text-slate-800"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-slate-800">{KAHIRE.closing}</p>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-red-950 px-5 py-20 text-center sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-amber-400 sm:text-4xl lg:text-5xl">
              6 GÜN. 3 ŞEHİR. SAYISIZ DENEYİM.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {FINALE_CITIES.map((city, index) => (
              <Reveal key={city.title} delay={index * 0.06}>
                <p className="font-display text-sm font-semibold tracking-[0.12em] text-amber-400 uppercase sm:text-base">
                  {city.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white">{city.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-12 max-w-4xl text-base leading-relaxed text-white/90 sm:text-lg">
              {FINALE_BODY}
            </p>
            <div className="mx-auto mt-14 h-px w-24 bg-amber-400/40" aria-hidden="true" />
            <p className="mt-10 font-display text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-amber-400 sm:text-4xl lg:text-6xl">
              🇪🇬 GENTA MECLİS MISIR TURU | 24–30 Ocak 2027
            </p>
            <p className="mx-auto mt-6 max-w-3xl font-display text-base leading-relaxed text-white sm:text-lg">
              6 gün boyunca denizi, çölü, macerayı ve binlerce yıllık tarihi birlikte keşfediyoruz.
              Mısır&apos;da yeniden görüşmek üzere! 🇪🇬
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
