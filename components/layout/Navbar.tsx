"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "@/components/providers/ContentProvider";
import { pageFade } from "@/components/motion/tokens";
import { LogoMark } from "./Logo";
import { TopBar } from "./TopBar";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { site, navItems, copy } = useContent();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <TopBar />
      <div className="border-b border-white/10 bg-brand/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} Meclis ana sayfa`}>
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-[0.22em]">{site.name}</span>
            <span className="mt-1 font-display text-[11px] font-medium tracking-[0.32em] text-white/75">
              Meclis
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Ana menü">
          {navItems
            .filter((item) => item.href !== "/" && item.href !== "/basvuru")
            .map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative font-display text-[12px] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-colors duration-700 ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-700 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/basvuru"
            className="group hidden items-center gap-2 border border-white bg-white px-5 py-3 font-display text-[12px] font-semibold tracking-[0.16em] text-brand uppercase transition-all duration-700 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:inline-flex"
          >
            {copy.frame.applyCta}
            <span
              aria-hidden="true"
              className="transition-transform duration-700 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobil-menu"
            onClick={() => setMenuPath((current) => (current === pathname ? null : pathname))}
          >
            <span className="sr-only">{open ? "Menüyü kapat" : "Menüyü aç"}</span>
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.nav
                  id="mobil-menu"
                  aria-label="Mobil menü"
                  className="fixed inset-x-0 bottom-0 top-[7.75rem] z-[80] flex flex-col overflow-y-auto bg-brand px-6 py-8 text-center text-white sm:top-[7.25rem] lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.75, ease: pageFade.ease }}
                >
                  {navItems
                    .filter((item) => item.href !== "/basvuru")
                    .map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduce ? 0 : 0.7,
                        delay: reduce ? 0 : 0.08 * index,
                        ease: pageFade.ease,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="block border-b border-white/10 py-4 font-display text-3xl font-medium"
                        onClick={() => setMenuPath(null)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/basvuru"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-white px-5 py-4 font-display text-sm font-semibold tracking-[0.16em] text-brand uppercase"
                    onClick={() => setMenuPath(null)}
                  >
                    {copy.frame.applyCta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </motion.nav>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </header>
  );
}
