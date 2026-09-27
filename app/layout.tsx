import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = getContent();
  return {
    title: {
      default: `${site.name} | ${site.title} ${site.edition}`,
      template: `%s | ${site.name}`,
    },
    description: `${site.title} ${site.edition}. ${site.datesShort}, ${site.city}. ${site.venue}.`,
    icons: { icon: "/brand/logo.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#6c1110",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
