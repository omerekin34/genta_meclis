import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "GENTA Meclis Mısır Turu",
  description:
    "Ocak’ta yeniden Mısır’dayız. 24–30 Ocak 2027, Hurghada, Luksor ve Kahire. GENTA Meclis Mısır Turu.",
};

export default function MisirTuruLayout({ children }: { children: ReactNode }) {
  return children;
}
