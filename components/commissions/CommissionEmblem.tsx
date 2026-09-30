"use client";

import { useState } from "react";
import { commissionLogoSrc, type Commission } from "@/data/commissions";
import { CommissionIcon } from "./CommissionIcon";

export function CommissionEmblem({ commission }: { commission: Commission }) {
  const src = commissionLogoSrc(commission);
  const [failed, setFailed] = useState(!src);

  return (
    <div className="relative mx-auto size-36 sm:size-44 md:size-52">
      <div
        className="absolute -inset-[9px] rounded-full bg-gradient-to-b from-white/40 via-white/12 to-transparent"
        aria-hidden="true"
      />
      <div className="relative size-full overflow-hidden rounded-full bg-white shadow-[0_28px_56px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/55">
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo adresi yerel veya uzak olabilir
          <img
            src={src}
            alt={`${commission.name} logosu`}
            className="size-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="flex size-full items-center justify-center bg-brand text-white">
            <CommissionIcon name={commission.icon} className="size-16 sm:size-20" />
          </span>
        )}
      </div>
    </div>
  );
}
