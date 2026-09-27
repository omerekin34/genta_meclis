"use client";

import { useContent } from "@/components/providers/ContentProvider";
import { useCountdown } from "./useCountdown";

export function Countdown() {
  const { site, copy } = useContent();
  const clock = useCountdown(site.eventStartIso);

  if (clock.expired) {
    return <p className="font-display text-lg text-brand">{copy.home.gathered}</p>;
  }

  return (
    <dl className="grid grid-cols-4 gap-3">
      {clock.parts.map((item) => (
        <div key={item.label} className="border border-brand/15 bg-paper px-2 py-4 text-center">
          <dt className="font-display text-[10px] tracking-[0.18em] text-brand/60 uppercase">
            {item.label}
          </dt>
          <dd className="mt-2 font-display text-2xl font-semibold text-brand tabular-nums sm:text-3xl">
            {clock.ready ? item.value : "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
