import type { ReactNode } from "react";
import { WhatsAppDesk } from "@/components/contact/WhatsAppDesk";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/motion/PageTransition";
import { ContentProvider } from "@/components/providers/ContentProvider";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ContentProvider content={getContent()}>
      <a
        href="#icerik"
        className="absolute top-0 left-4 z-[90] -translate-y-full bg-white px-4 py-2 font-display text-sm text-brand focus:translate-y-4"
      >
        İçeriğe geç
      </a>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <WhatsAppDesk />
    </ContentProvider>
  );
}
