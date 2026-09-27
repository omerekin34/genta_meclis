"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/components/providers/ContentProvider";

export function Hero() {
  const { site, copy } = useContent();
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-brand pt-[7.75rem] pb-36 text-white sm:pt-[7.25rem] sm:pb-0">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {reduce ? null : (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-brand-deep/62" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(108,17,16,0.18),rgba(42,8,8,0.72)_74%)]" />
      </div>
      <p className="pointer-events-none absolute top-1/2 left-6 z-10 hidden -translate-y-1/2 -rotate-90 font-display text-[11px] tracking-[0.42em] text-white/45 lg:block">
        {site.name} · {site.edition}
      </p>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-6 text-center sm:py-12">
        <h1 className="sr-only">
          {site.name} — {site.title} | {site.edition}
        </h1>
        <Image
          src="/brand/lockup.png"
          alt=""
          width={494}
          height={666}
          priority
          className="h-auto w-[min(52vw,210px)] sm:w-[min(72vw,280px)]"
        />
        <ul className="mt-6 flex items-center gap-3 sm:gap-4">
          {site.highlightedDays.map((day) => (
            <li
              key={day}
              className="flex size-12 items-center justify-center rounded-full border border-white font-display text-lg sm:size-16 sm:text-xl"
            >
              {day}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-display text-xs tracking-[0.28em] uppercase sm:tracking-[0.42em]">
          {site.monthLabel} {site.edition}
        </p>
        <p className="mt-8 text-base text-white/85 sm:text-lg">{site.city}</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{site.venue}</p>
        <Link
          href="/basvuru"
          className="group mt-6 inline-flex w-full max-w-xs items-center justify-center gap-3 border border-white bg-white px-8 py-4 font-display text-[13px] font-semibold tracking-[0.18em] text-brand uppercase transition-all duration-700 hover:-translate-y-1 hover:bg-transparent hover:text-white hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:mt-10 sm:w-auto"
        >
          {copy.home.heroCta}
          <span aria-hidden="true" className="transition-transform duration-700 group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>

      <div className="relative z-10 flex justify-center pb-8">
        <motion.span
          className="block h-12 w-px origin-top bg-white/55"
          aria-hidden="true"
          animate={reduce ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [0.35, 1, 0.35] }}
          transition={
            reduce
              ? undefined
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </div>
    </section>
  );
}
