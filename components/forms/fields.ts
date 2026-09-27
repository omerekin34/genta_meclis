export const inputClass =
  "w-full border border-brand/20 bg-paper px-4 py-3.5 text-[15px] leading-6 text-ink outline-none transition-[border-color] duration-300 placeholder:text-ink/35 focus:border-brand";

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function buildMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
