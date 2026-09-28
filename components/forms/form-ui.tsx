"use client";

import { useId, type ReactNode } from "react";
import { useContent } from "@/components/providers/ContentProvider";

export const grades = ["Hazırlık Sınıfı", "9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"] as const;

export const lineClass =
  "box-border w-full min-w-0 border-b border-ink/20 bg-transparent py-2 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink/35 focus:border-brand";

export function Question({
  label,
  required = false,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const labelId = useId();
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-invalid={error ? "true" : undefined}
      className={`w-full min-w-0 rounded-xl border bg-white px-5 py-5 shadow-[0_1px_2px_rgba(44,20,18,0.04)] ${error ? "border-brand/40" : "border-black/5"}`}
    >
      <p id={labelId} className="text-[15px] leading-6 font-semibold break-words text-ink">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </p>
      {hint ? <p className="mt-1 text-sm leading-6 break-words text-ink/60">{hint}</p> : null}
      <div className="mt-4 min-w-0">{children}</div>
      {error ? (
        <p className="mt-2 text-sm break-words text-brand" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Essay({
  value,
  minimum,
  onChange,
}: {
  value: string;
  minimum: number;
  onChange: (value: string) => void;
}) {
  const count = wordCount(value);
  return (
    <>
      <textarea
        className={`${lineClass} min-h-16 resize-y`}
        value={value}
        placeholder="Yanıtınız"
        onChange={(event) => onChange(event.target.value)}
      />
      <p className={`mt-2 text-xs ${count > 0 && count < minimum ? "text-brand" : "text-ink/45"}`}>
        {count} / {minimum} kelime
      </p>
    </>
  );
}

export function GradePills({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      {grades.map((grade) => {
        const selected = value === grade;
        return (
          <button
            key={grade}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(grade)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
              selected ? "border-brand bg-brand text-white" : "border-brand/20 text-ink hover:border-brand"
            }`}
          >
            {grade}
          </button>
        );
      })}
    </div>
  );
}

export function RankedCommissions({
  values,
  onChange,
}: {
  values: [string, string, string];
  onChange: (next: [string, string, string]) => void;
}) {
  const { preferences } = useContent();
  function toggle(option: string) {
    const current = values.filter(Boolean);
    if (current.includes(option)) {
      const next = current.filter((item) => item !== option);
      onChange([next[0] ?? "", next[1] ?? "", next[2] ?? ""]);
      return;
    }
    if (current.length >= 3) return;
    const next = [...current, option];
    onChange([next[0] ?? "", next[1] ?? "", next[2] ?? ""]);
  }

  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      {preferences.map((option) => {
        const rank = values.indexOf(option.value);
        const selected = rank >= 0;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option.value)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
              selected ? "border-brand bg-brand text-white" : "border-brand/20 text-ink hover:border-brand"
            }`}
          >
            {selected ? `${rank + 1}. ` : ""}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function MiniField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block" data-invalid={error ? "true" : undefined}>
      <span className="mb-2 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-brand" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function required(value: string, errors: Record<string, string>, key: string) {
  if (!value.trim()) errors[key] = "Bu alan zorunludur.";
}

export function wordCount(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function requireWords(value: string, minimum: number, errors: Record<string, string>, key: string) {
  const count = wordCount(value);
  if (count === 0) {
    errors[key] = "Bu alan zorunludur.";
    return;
  }
  if (count < minimum) errors[key] = `En az ${minimum} kelime yazın. Şu an ${count} kelime.`;
}

export function requireRanking(values: string[], errors: Record<string, string>, key: string) {
  const chosen = values.filter(Boolean);
  if (chosen.length < 3) errors[key] = "Üç komisyon tercihini sırayla seçin.";
  else if (new Set(chosen).size < 3) errors[key] = "Üç tercih birbirinden farklı olmalıdır.";
}

export function isNationalId(value: string) {
  return /^[1-9]\d{10}$/.test(value.replace(/\s/g, ""));
}

export function isLocalPhone(value: string) {
  return /^0\d{10}$/.test(value.replace(/\D/g, ""));
}
