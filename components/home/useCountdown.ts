"use client";

import { useEffect, useState } from "react";

export type ClockPart = {
  label: string;
  short: string;
  value: string;
};

function split(diff: number): ClockPart[] {
  const total = Math.max(0, diff);
  const day = Math.floor(total / 86400000);
  const hour = Math.floor((total % 86400000) / 3600000);
  const minute = Math.floor((total % 3600000) / 60000);
  const second = Math.floor((total % 60000) / 1000);
  return [
    { label: "Gün", short: "g", value: String(day) },
    { label: "Saat", short: "sa", value: String(hour).padStart(2, "0") },
    { label: "Dakika", short: "dk", value: String(minute).padStart(2, "0") },
    { label: "Saniye", short: "sn", value: String(second).padStart(2, "0") },
  ];
}

export function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const start = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, []);

  const remaining = now === null ? null : target - now;
  return {
    ready: now !== null,
    expired: remaining !== null && remaining <= 0,
    parts: split(remaining ?? 0),
  };
}
