"use client";

import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MisirTuruContent } from "@/lib/misir-turu";

export function MisirHero({ content }: { content: MisirTuruContent }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = content.hero_video.trim();
  const heroImage = content.hero_image.trim();
  const framedVideo = Boolean(heroImage && videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  return (
    <section className="relative isolate flex min-h-[90vh] items-center justify-center overflow-hidden bg-zinc-900 pt-28 md:min-h-screen md:pt-32">
      {heroImage ? (
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center"
        />
      ) : null}

      {videoSrc && !framedVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={heroImage || undefined}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
      ) : null}

      <div
        className="absolute inset-0 -z-10 bg-black/65 bg-gradient-to-t from-black/80 via-black/45 to-black/30"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-5 pb-24 text-center">
        <p className="font-display text-[11px] font-medium tracking-[0.34em] text-amber-400/85 uppercase">
          {content.hero_eyebrow}
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-4xl leading-[1.08] font-semibold tracking-tight text-amber-400 drop-shadow-[0_10px_28px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-7xl">
          {content.hero_title}
        </h1>
        <p className="mt-6 font-display text-lg font-medium tracking-[0.22em] text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)] sm:text-2xl">
          {content.hero_dates}
        </p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] sm:text-lg sm:leading-8">
          {content.hero_lead}
        </p>
        {content.hero_badge ? (
          <p className="mt-8 inline-flex max-w-full items-center justify-center border border-amber-400/80 bg-white/10 px-4 py-3 text-center font-display text-[13px] leading-snug font-semibold tracking-wide text-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.18)] backdrop-blur-md sm:mt-10 sm:px-7 sm:py-3.5 sm:text-base">
            {content.hero_badge}
          </p>
        ) : null}

        {framedVideo ? (
          <div className="relative mt-10 w-full max-w-3xl overflow-hidden rounded-lg border border-white/15 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={heroImage}
              className="aspect-video w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      {videoSrc ? (
        <button
          type="button"
          onClick={() => setIsMuted((value) => !value)}
          aria-label={isMuted ? "Sesi aç" : "Sesi kapat"}
          aria-pressed={!isMuted}
          className="absolute right-24 bottom-8 z-20 rounded-full border border-white/30 bg-white/10 p-4 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:right-28"
        >
          {isMuted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}
        </button>
      ) : null}
    </section>
  );
}
