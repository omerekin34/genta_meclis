import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import { CommissionCard } from "./CommissionCard";

export async function CommissionGrid() {
  const { commissions } = await getContent();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {commissions.map((commission, index) => (
        <Reveal key={commission.slug} delay={Math.min(index * 0.06, 0.36)} className="h-full">
          <CommissionCard commission={commission} />
        </Reveal>
      ))}
    </div>
  );
}
