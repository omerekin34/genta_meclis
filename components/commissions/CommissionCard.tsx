import Link from "next/link";
import type { Commission } from "@/data/commissions";
import { CommissionIcon } from "./CommissionIcon";

export function CommissionCard({ commission }: { commission: Commission }) {
  return (
    <Link
      href={`/komisyonlar/${commission.slug}`}
      className="group flex h-full flex-col bg-brand p-7 text-white transition-colors duration-700 hover:bg-brand-deep sm:p-8"
    >
      <CommissionIcon name={commission.icon} className="size-12" />
      <h3 className="mt-8 font-display text-xl leading-snug font-semibold">{commission.name}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-white/75">{commission.summary}</p>
      <span className="mt-8 font-display text-[11px] tracking-[0.22em] uppercase transition-transform duration-700 group-hover:translate-x-1">
        İncele
      </span>
    </Link>
  );
}
