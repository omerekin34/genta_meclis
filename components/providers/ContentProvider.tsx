"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Content } from "@/lib/content-types";
import { withDerived, type LiveContent } from "@/lib/live";

const ContentContext = createContext<LiveContent | null>(null);

export function ContentProvider({ content, children }: { content: Content; children: ReactNode }) {
  const live = useMemo(() => withDerived(content), [content]);
  return <ContentContext.Provider value={live}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const content = useContext(ContentContext);
  if (!content) throw new Error("İçerik sağlayıcısı yok.");
  return content;
}
