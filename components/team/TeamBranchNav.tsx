"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { teamNavItems } from "@/lib/content-types";

export function TeamBranchNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12" aria-label="Ekip sayfaları">
      {teamNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex rounded-full border px-5 py-2 font-display text-[12px] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 ${
              active
                ? "border-brand bg-brand text-white"
                : "border-brand/20 bg-white text-brand hover:border-brand/50 hover:bg-brand/5"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
