import { MisirTuruView } from "@/components/misir-turu/MisirTuruView";
import { getMisirTuru } from "@/app/admin/misir-turu/actions";

export const dynamic = "force-dynamic";

export default async function MisirTuruPage() {
  const content = await getMisirTuru();
  return <MisirTuruView content={content} />;
}
