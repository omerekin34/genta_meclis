import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-svh bg-ivory text-ink">{children}</div>;
}
