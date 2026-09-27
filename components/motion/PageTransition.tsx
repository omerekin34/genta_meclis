"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { useContext, useState, type ReactNode } from "react";
import { pageFade } from "./tokens";

function PreservedTree({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const [snapshot] = useState({ context, children });

  if (!snapshot.context) {
    return snapshot.children;
  }

  return (
    <LayoutRouterContext.Provider value={snapshot.context}>
      {snapshot.children}
    </LayoutRouterContext.Provider>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <div id="icerik" className="flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduce ? 0 : pageFade.duration,
            ease: pageFade.ease,
          }}
        >
          <PreservedTree>{children}</PreservedTree>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
