import { redirect } from "next/navigation";
import { MisirTuruForm } from "@/components/admin/MisirTuruForm";
import { isAuthed } from "@/lib/auth";
import { getMisirTuru } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMisirTuruPage() {
  if (!(await isAuthed())) redirect("/admin/giris");
  return <MisirTuruForm initial={await getMisirTuru()} />;
}
