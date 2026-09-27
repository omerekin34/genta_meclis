import { getContent } from "@/lib/content";

const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cu", "Cts", "Pzr"];
const startOffset = 6;
const cells = [...Array.from({ length: startOffset }, () => null), ...Array.from({ length: 30 }, (_, i) => i + 1)];

export function NovemberCalendar() {
  const { site } = getContent();
  const highlighted = new Set<number>(site.highlightedDays);

  return (
    <div className="border border-white/25 p-5 sm:p-6">
      <div className="flex items-end justify-between">
        <p className="font-display text-3xl italic">{site.monthLabel}</p>
        <p className="font-display text-sm tracking-[0.28em]">{site.edition}</p>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-y-2 text-center text-[11px] tracking-wide text-white/55">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-sm">
        {cells.map((day, index) => {
          const marked = day !== null && highlighted.has(day);
          return (
            <span key={`${day ?? "e"}-${index}`} className="flex h-9 items-center justify-center">
              {day ? (
                <span
                  className={
                    marked
                      ? "flex size-8 items-center justify-center rounded-full border border-white"
                      : undefined
                  }
                >
                  {day}
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}
