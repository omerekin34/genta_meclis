import Image from "next/image";

export function LogoMark({ className = "h-11 w-12" }: { className?: string }) {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      width={478}
      height={454}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
