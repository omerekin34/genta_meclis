import { redirect } from "next/navigation";
import { LoginCard } from "@/components/admin/LoginCard";
import { isAuthed } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");
  return <LoginCard />;
}
