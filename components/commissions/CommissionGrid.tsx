import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";
import { CommissionCard } from "./CommissionCard";

export async function CommissionGrid({ limit }: { limit?: number }) {
  const { commissions } = await getContent();
  const shown = limit ? commissions.slice(0, limit) : commissions;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((commission, index) => (
        <Reveal key={commission.slug} delay={Math.min(index * 0.06, 0.36)} className="h-full">
          <CommissionCard commission={commission} />
        </Reveal>
      ))}
    </div>
  );
}
