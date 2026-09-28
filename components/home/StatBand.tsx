"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type ShownStat = {
  id: string;
  label: string;
  caption: string;
  value: number;
};

const glyphs: Record<string, string> = {
  basvuru: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 19v-1.2C3 15.2 5.2 14 8 14s5 1.2 5 3.8V19M13 14.2c1.7-.4 3.5 0 4.6.9 1.3.9 2.4 2.2 2.4 3.7V19",
  kurul: "M4 10.5 12 5l8 5.5M6 10v8h12v-8M10 18v-4h4v4",
  etkinlik: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  gun: "M5 6h14v13H5V6Zm0 4h14M8 4v4M16 4v4",
  yil: "M7 4v3M17 4v3M5 8h14v11H5V8Zm0 4h14",
};

export function StatBand({ stats }: { stats: ShownStat[] }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (reduce) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  if (stats.length === 0) return null;

  return (
    <section ref={root} className="bg-brand-deep text-white" aria-label="Meclis sayıları">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 px-5 py-14 sm:grid-cols-4 sm:px-8 sm:py-16">
        {stats.map((stat, index) => (
          <li
            key={stat.id}
            className={`text-center ${index === stats.length - 1 && stats.length % 2 === 1 ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""}`}
          >
            <StatIcon id={stat.id} />
            <p className="mt-4 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
              <CountUp value={stat.value} active={active} />
              <span>+</span>
            </p>
            <p className="mt-2 font-display text-sm font-medium">{stat.label}</p>
            <p className="mx-auto mt-1 max-w-[12rem] text-xs leading-5 text-white/55">{stat.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CountUp({ value, active }: { value: number; active: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduce || value === 0) {
      setShown(value);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setShown(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduce, value]);

  return shown.toLocaleString("tr-TR");
}

function StatIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" className="mx-auto size-7 text-white/80" fill="none" aria-hidden="true">
      <path d={glyphs[id] ?? glyphs.etkinlik} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
