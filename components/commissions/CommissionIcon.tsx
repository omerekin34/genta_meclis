import type { SVGProps } from "react";
import type { IconName } from "@/data/commissions";

function IconFrame({
  className,
  children,
}: {
  className?: string;
  children: SVGProps<SVGSVGElement>["children"];
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Parliament({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M8 20 L24 10 L40 20" {...stroke} />
      <path d="M12 20 V36 H36 V20" {...stroke} />
      <path d="M18 36 V24 H22 V36 M26 36 V24 H30 V36" {...stroke} />
      <path d="M10 36 H38" {...stroke} />
    </IconFrame>
  );
}

function Health({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="24" cy="24" r="13" {...stroke} />
      <path d="M24 17 V31 M17 24 H31" {...stroke} />
    </IconFrame>
  );
}

function Justice({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M24 10 V38 M16 38 H32" {...stroke} />
      <path d="M14 16 H34" {...stroke} />
      <path d="M14 16 L10 24 H18 Z M34 16 L30 24 H38 Z" {...stroke} />
    </IconFrame>
  );
}

function Education({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M8 18 C16 14 20 22 24 18 C28 14 32 22 40 18 V30 C32 34 28 26 24 30 C20 34 16 26 8 30 Z" {...stroke} />
      <path d="M24 18 V30" {...stroke} />
    </IconFrame>
  );
}

function Defense({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M24 8 L38 14 V24 C38 32 32 38 24 41 C16 38 10 32 10 24 V14 Z" {...stroke} />
      <path d="M24 16 V30 M18 23 H30" {...stroke} />
    </IconFrame>
  );
}

function Diplomacy({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="24" cy="24" r="13" {...stroke} />
      <path d="M11 24 H37 M24 11 C20 16 20 32 24 37 C28 32 28 16 24 11" {...stroke} />
    </IconFrame>
  );
}

function Interior({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M10 20 H38 V38 H10 Z" {...stroke} />
      <path d="M10 20 L24 10 L38 20" {...stroke} />
      <path d="M21 38 V28 H27 V38" {...stroke} />
    </IconFrame>
  );
}

function Faith({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <path d="M28 14 A12 12 0 1 0 28 34 A8 8 0 1 1 28 14" {...stroke} />
      <path d="M33 12 L34.2 15.2 L37.6 15.4 L35 17.6 L35.8 21 L33 19.2 L30.2 21 L31 17.6 L28.4 15.4 L31.8 15.2 Z" {...stroke} />
    </IconFrame>
  );
}

function Budget({ className }: { className?: string }) {
  return (
    <IconFrame className={className}>
      <circle cx="32" cy="18" r="6" {...stroke} />
      <path d="M10 16 H22 M10 24 H30 M10 32 H26" {...stroke} />
    </IconFrame>
  );
}

const icons = {
  parliament: Parliament,
  health: Health,
  justice: Justice,
  education: Education,
  defense: Defense,
  diplomacy: Diplomacy,
  interior: Interior,
  faith: Faith,
  budget: Budget,
};

export function CommissionIcon({
  name,
  className = "size-12",
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = icons[name];
  return <Icon className={className} />;
}
