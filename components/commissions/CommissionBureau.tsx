import { Reveal } from "@/components/motion/Reveal";
import type { BureauMember } from "@/data/commissions";

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0]?.toLocaleUpperCase("tr-TR")).join("");
}

export function CommissionBureau({
  commissionName,
  members,
}: {
  commissionName: string;
  members: BureauMember[];
}) {
  return (
    <div className="mt-20">
      <Reveal>
        <p className="font-display text-xs tracking-[0.28em] text-brand/70 uppercase">Divan Kurulu</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-brand sm:text-4xl">Komisyon Divan Kurulu</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/70">
          {commissionName} oturumunu yürüten başkan, vekil ve kurul üyeleri bu kartlarda yer alır.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {members.map((member, index) => (
          <Reveal key={member.id} delay={Math.min(0.08 + index * 0.06, 0.3)} className="w-full max-w-72">
            <article className="group flex h-full flex-col overflow-hidden border border-brand/12 bg-white text-center transition-all duration-700 hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_22px_40px_-28px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-brand">
                {member.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- fotoğraf adresi her kaynaktan gelebilir
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-1000 group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                ) : (
                  <span className="font-display text-5xl font-semibold tracking-wide text-white/85">
                    {initials(member.name)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="mx-auto rounded-full bg-brand px-3 py-1 font-display text-[10px] font-semibold tracking-[0.14em] text-white uppercase">
                  {member.role || "Ekip üyesi"}
                </p>
                <p className="mt-3 font-display text-base leading-snug font-semibold text-brand">{member.name}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
