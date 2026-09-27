import { redirect } from "next/navigation";
import { AdminDesk } from "@/components/admin/AdminDesk";
import { isAuthed } from "@/lib/auth";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthed())) redirect("/admin/giris");
  return <AdminDesk initial={getContent()} />;
}
