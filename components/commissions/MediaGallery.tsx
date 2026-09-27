"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { CommissionMedia } from "@/data/commissions";
import { pageFade } from "@/components/motion/tokens";

export function MediaGallery({ items }: { items: CommissionMedia[] }) {
  const images = items.filter((item) => item.kind === "image");
  const videos = items.filter((item) => item.kind === "video");
  const [active, setActive] = useState<CommissionMedia | null>(null);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((item, index) => (
          <figure key={item.id}>
            <button
              type="button"
              className="block w-full text-left"
              onClick={() => setActive(item)}
            >
              <Mount item={item} index={index} />
            </button>
            <figcaption className="mt-3 text-sm text-ink/70">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {videos.map((item) => (
          <figure key={item.id}>
            {item.src ? (
              <video
                className="aspect-video w-full bg-brand"
                controls
                playsInline
                poster={undefined}
                src={item.src}
              />
            ) : (
              <div className="relative flex aspect-video items-center justify-center bg-brand text-white">
                <Corners />
                <div className="text-center">
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-white/50">
                    <svg viewBox="0 0 24 24" className="ml-1 size-5" aria-hidden="true">
                      <path d="M8 6 L18 12 L8 18 Z" fill="currentColor" />
                    </svg>
                  </span>
                  <p className="mt-4 font-display text-[11px] tracking-[0.28em] uppercase">Video</p>
                </div>
              </div>
            )}
            <figcaption className="mt-3 text-sm text-ink/70">{item.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Lightbox item={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Mount({ item, index }: { item: CommissionMedia; index: number }) {
  if (item.src) {
    return (
      <span className="relative block aspect-[4/5] overflow-hidden bg-brand">
        <Image src={item.src} alt={item.caption} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
      </span>
    );
  }

  return (
    <span className="relative flex aspect-[4/5] items-center justify-center bg-brand text-white">
      <Corners />
      <span className="text-center">
        <span className="block font-display text-[11px] tracking-[0.28em] text-white/70 uppercase">
          Fotoğraf
        </span>
        <span className="mt-2 block font-display text-3xl font-medium">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
    </span>
  );
}

function Corners() {
  return (
    <>
      <span className="absolute top-3 left-3 size-4 border-t border-l border-white/45" />
      <span className="absolute top-3 right-3 size-4 border-t border-r border-white/45" />
      <span className="absolute bottom-3 left-3 size-4 border-b border-l border-white/45" />
      <span className="absolute right-3 bottom-3 size-4 border-r border-b border-white/45" />
    </>
  );
}

function Lightbox({ item, onClose }: { item: CommissionMedia | null; onClose: () => void }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!item) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-deep/88 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, ease: pageFade.ease }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
        >
          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, ease: pageFade.ease }}
            onClick={(event) => event.stopPropagation()}
          >
            {item.src && item.kind === "image" ? (
              <Image
                src={item.src}
                alt={item.caption}
                width={1200}
                height={1500}
                className="max-h-[75vh] w-full object-contain"
              />
            ) : (
              <div className="flex aspect-[4/5] max-h-[75vh] items-center justify-center bg-brand text-white">
                <p className="font-display text-sm tracking-[0.24em] uppercase">{item.caption}</p>
              </div>
            )}
            <p className="mt-4 text-center text-sm text-white/80">{item.caption}</p>
            <button
              type="button"
              className="mx-auto mt-4 block font-display text-xs tracking-[0.2em] text-white uppercase"
              onClick={onClose}
            >
              Kapat
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
