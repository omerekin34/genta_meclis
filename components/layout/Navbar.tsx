"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "@/components/providers/ContentProvider";
import { pageFade } from "@/components/motion/tokens";
import { isTeamNavHref, teamNavItems } from "@/lib/content-types";
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
  const [teamOpen, setTeamOpen] = useState(false);
  const [mobileTeamOpen, setMobileTeamOpen] = useState(false);
  const teamBarRef = useRef<HTMLDivElement>(null);
  const open = menuPath === pathname;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setTeamOpen(false);
    setMobileTeamOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !teamOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        setTeamOpen(false);
        setMobileTeamOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, teamOpen]);

  useEffect(() => {
    if (!teamOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (teamBarRef.current && !teamBarRef.current.contains(event.target as Node)) {
        setTeamOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [teamOpen]);

  const mainNav = navItems.filter(
    (item) => item.href !== "/" && item.href !== "/basvuru" && item.href !== "/basvuru/durum",
  );
  const mobileNav = navItems.filter((item) => item.href !== "/basvuru" && item.href !== "/basvuru/durum");

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white">
      <TopBar />
      <div ref={teamBarRef} className="relative border-b border-white/10 bg-brand/95 backdrop-blur-md">
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

        <nav className="hidden items-center gap-4 xl:gap-6 lg:flex" aria-label="Ana menü">
          {mainNav.map((item) => {
            const teamItem = isTeamNavHref(item.href);
            const active = teamItem ? isTeamNavHref(pathname) : isActive(pathname, item.href);
            if (teamItem) {
              return (
                <button
                  key={item.href}
                  type="button"
                  aria-expanded={teamOpen}
                  aria-controls="ekip-alt-menu"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setTeamOpen((current) => !current)}
                  className={`group relative inline-flex items-center gap-1.5 font-display text-[11px] xl:text-[12px] font-medium tracking-[0.04em] whitespace-nowrap transition-colors duration-700 ${
                    active || teamOpen ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 12"
                    className={`size-2.5 shrink-0 transition-transform duration-300 ${teamOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M2 4.5L6 8.5L10 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span
                    className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-700 ${
                      active || teamOpen ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative font-display text-[11px] xl:text-[12px] font-medium tracking-[0.04em] whitespace-nowrap transition-colors duration-700 ${
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
            className="group hidden items-center gap-2 border border-white bg-white px-5 py-3 font-display text-[12px] font-semibold tracking-[0.04em] text-brand transition-all duration-700 hover:-translate-y-0.5 hover:bg-transparent hover:text-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:inline-flex"
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
            onClick={() => {
              setMenuPath((current) => (current === pathname ? null : pathname));
              setTeamOpen(false);
            }}
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

      <AnimatePresence>
        {teamOpen ? (
          <motion.nav
            id="ekip-alt-menu"
            aria-label="Ekip sayfaları"
            className="hidden overflow-hidden border-t border-white/10 bg-brand lg:block"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: pageFade.ease }}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-center gap-16 px-5 py-4 sm:gap-24">
              {teamNavItems.map((branch) => {
                const active = isActive(pathname, branch.href);
                return (
                  <Link
                    key={branch.href}
                    href={branch.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-display text-[12px] font-medium tracking-[0.04em] transition-colors duration-500 ${
                      active ? "text-white" : "text-white/55 hover:text-white"
                    }`}
                    onClick={() => setTeamOpen(false)}
                  >
                    {branch.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
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
                  {mobileNav.map((item, index) => {
                    const teamItem = isTeamNavHref(item.href);
                    return (
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
                      {teamItem ? (
                        <div className="border-b border-white/10">
                          <button
                            type="button"
                            aria-expanded={mobileTeamOpen}
                            className="flex w-full items-center justify-center gap-2 py-4 font-display text-3xl font-medium"
                            onClick={() => setMobileTeamOpen((current) => !current)}
                          >
                            {item.label}
                            <svg
                              viewBox="0 0 12 12"
                              className={`mt-1 size-4 shrink-0 transition-transform duration-300 ${mobileTeamOpen ? "rotate-180" : ""}`}
                              aria-hidden="true"
                            >
                              <path d="M2 4.5L6 8.5L10 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {mobileTeamOpen ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: reduce ? 0 : 0.3, ease: pageFade.ease }}
                                className="overflow-hidden"
                              >
                                {teamNavItems.map((branch) => (
                                  <Link
                                    key={branch.href}
                                    href={branch.href}
                                    className="block py-3 font-display text-xl font-medium tracking-[0.02em] text-white/70"
                                    onClick={() => setMenuPath(null)}
                                  >
                                    {branch.label}
                                  </Link>
                                ))}
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block border-b border-white/10 py-4 font-display text-3xl font-medium"
                          onClick={() => setMenuPath(null)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                    );
                  })}
                  <Link
                    href="/basvuru"
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-white px-5 py-4 font-display text-sm font-semibold tracking-[0.04em] text-brand"
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
