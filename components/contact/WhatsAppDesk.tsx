"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "@/components/providers/ContentProvider";
import { whatsAppHref } from "@/data/site";
import type { Coordinator } from "@/lib/content-types";
import { pageFade } from "@/components/motion/tokens";

export function WhatsAppDesk() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { coordinators, whatsappQuestions, copy } = useContent();
  const greeting = copy.frame.whatsappGreeting;
  const [coordinator, setCoordinator] = useState<Coordinator | undefined>(coordinators[0]);

  useEffect(() => {
    setCoordinator((current) => coordinators.find((person) => person.id === current?.id) ?? coordinators[0]);
  }, [coordinators]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function href(question?: string) {
    const text = question ? `${greeting}\n\n${question}` : `${greeting}\n\nBir sorum olacak.`;
    return whatsAppHref(coordinator?.whatsapp ?? "", text);
  }

  return (
    <div className="fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.section
            role="dialog"
            aria-label="WhatsApp ile soru sor"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: pageFade.ease }}
            className="w-[min(92vw,22rem)] border border-brand/15 bg-paper text-ink shadow-[0_24px_60px_rgba(42,8,8,0.28)]"
          >
            <div className="flex items-start justify-between gap-4 bg-brand px-4 py-4 text-white">
              <div>
                <p className="font-display text-[10px] tracking-[0.22em] text-white/65 uppercase">
                  WhatsApp
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold">{copy.frame.whatsappTitle}</h2>
              </div>
              <button
                type="button"
                className="px-1 text-xl leading-none text-white/80"
                onClick={() => setOpen(false)}
                aria-label="Paneli kapat"
              >
                ×
              </button>
            </div>

            <div className="px-4 py-4">
              <p className="font-display text-[10px] tracking-[0.18em] text-brand/60 uppercase">
                {copy.frame.whatsappWho}
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {coordinators.map((person) => {
                  const selected = person.whatsapp === coordinator?.whatsapp;
                  return (
                    <button
                      key={person.whatsapp}
                      type="button"
                      onClick={() => setCoordinator(person)}
                      className={`px-3 py-2 text-left transition-colors duration-500 ${
                        selected ? "bg-brand text-white" : "border border-brand/15 hover:bg-ivory"
                      }`}
                    >
                      <span className="block text-sm font-medium">{person.name}</span>
                      <span className={`block text-xs ${selected ? "text-white/75" : "text-ink/60"}`}>
                        {person.role} · {person.phone}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 font-display text-[10px] tracking-[0.18em] text-brand/60 uppercase">
                {copy.frame.whatsappAsk}
              </p>
              <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                {whatsappQuestions.map((question) => (
                  <li key={question}>
                    <a
                      href={href(question)}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-2 py-2 text-sm leading-5 text-brand transition-colors duration-500 hover:bg-ivory"
                    >
                      {question}
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={href()}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 bg-[#128C7E] px-4 py-3 font-display text-[12px] font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-500 hover:bg-[#0E6E63]"
              >
                <WhatsAppGlyph />
                {copy.frame.whatsappOwn}
              </a>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "WhatsApp panelini kapat" : "WhatsApp ile soru sor"}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(18,80,50,0.35)] transition-transform duration-700 hover:scale-105"
      >
        <WhatsAppGlyph className="size-7" />
      </button>
    </div>
  );
}

function WhatsAppGlyph({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.26-.28.58-.35.77-.35h.55c.18 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.19-.14.32-.28.49-.14.17-.3.38-.42.51-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.26.09 1.62.76 1.9.9.28.14.46.21.53.32.07.12.07.68-.17 1.36z"
      />
    </svg>
  );
}
