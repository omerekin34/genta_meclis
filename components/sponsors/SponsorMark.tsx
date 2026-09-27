import type { SponsorMark } from "@/data/sponsors";

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.3,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SponsorMarkIcon({ mark }: { mark: SponsorMark }) {
  return (
    <svg viewBox="0 0 64 64" className="size-16 text-brand" aria-hidden="true">
      {mark === "laurel" ? (
        <>
          <path d="M32 14 V50" {...stroke} />
          <path d="M32 20 C24 18 20 24 18 30 C24 28 28 30 32 34" {...stroke} />
          <path d="M32 20 C40 18 44 24 46 30 C40 28 36 30 32 34" {...stroke} />
          <path d="M32 30 C24 28 20 34 18 40 C24 38 28 40 32 44" {...stroke} />
          <path d="M32 30 C40 28 44 34 46 40 C40 38 36 40 32 44" {...stroke} />
        </>
      ) : null}
      {mark === "columns" ? (
        <>
          <path d="M14 18 H50" {...stroke} />
          <path d="M18 18 V46 M32 18 V46 M46 18 V46" {...stroke} />
          <path d="M12 46 H52" {...stroke} />
        </>
      ) : null}
      {mark === "ring" ? (
        <>
          <circle cx="32" cy="32" r="16" {...stroke} />
          <circle cx="32" cy="32" r="6" {...stroke} />
        </>
      ) : null}
      {mark === "quill" ? (
        <>
          <path d="M42 14 C28 22 20 34 18 50" {...stroke} />
          <path d="M42 14 C36 28 28 36 18 50" {...stroke} />
          <path d="M22 40 L30 36" {...stroke} />
        </>
      ) : null}
      {mark === "bridge" ? (
        <>
          <path d="M10 40 H54" {...stroke} />
          <path d="M14 40 V28 H24 V40 M40 40 V28 H50 V40" {...stroke} />
          <path d="M24 28 H40" {...stroke} />
          <path d="M24 28 C28 20 36 20 40 28" {...stroke} />
        </>
      ) : null}
      {mark === "diamond" ? (
        <>
          <path d="M32 12 L50 32 L32 52 L14 32 Z" {...stroke} />
          <path d="M14 32 H50" {...stroke} />
        </>
      ) : null}
    </svg>
  );
}
