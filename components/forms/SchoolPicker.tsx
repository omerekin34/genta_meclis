"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import schools from "@/data/schools.json";

type School = { district: string; name: string };

const catalog = schools as School[];

function fold(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function schoolLabel(school: School) {
  if (fold(school.name).includes(fold(school.district))) return school.name;
  return `${school.name} (${school.district})`;
}

const lineClass =
  "box-border w-full min-w-0 border-b border-ink/20 bg-transparent py-2 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink/35 focus:border-brand";

export function SchoolPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  const matches = useMemo(() => {
    const needle = fold(query.trim());
    const pool = needle
      ? catalog.filter((school) => fold(`${school.district} ${school.name}`).includes(needle))
      : catalog.filter((school) => school.district === "Pendik");
    return pool.slice(0, needle ? 12 : 8).map(schoolLabel);
  }, [query]);

  const typed = query.trim();
  const canUseTyped = typed.length >= 3 && !matches.some((item) => fold(item) === fold(typed));
  const options = canUseTyped ? [...matches, typed] : matches;

  function choose(next: string) {
    onChange(next);
    setQuery(next);
    setOpen(false);
  }

  return (
    <div ref={root} className="relative min-w-0">
      <input
        className={lineClass}
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder="Okul adını yazın, listeden seçin"
        autoComplete="off"
        onFocus={() => {
          setOpen(true);
          setActive(0);
        }}
        onBlur={(event) => {
          const next = event.currentTarget.value.trim();
          if (next !== value) onChange(next);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          setActive(0);
          onChange(next.trim());
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (open && options[active]) choose(options[active]);
            else onChange(query.trim());
            setOpen(false);
            return;
          }
          if (!open && event.key === "ArrowDown") {
            setOpen(true);
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((current) => Math.min(current + 1, Math.max(options.length - 1, 0)));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((current) => Math.max(current - 1, 0));
          }
          if (event.key === "Escape") setOpen(false);
        }}
      />
      {open ? (
        <ul id={listId} role="listbox" className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-brand/15">
          {matches.map((item, index) => (
            <li key={item}>
              <button
                type="button"
                role="option"
                aria-selected={active === index}
                className={`block w-full px-3 py-2.5 text-left text-sm leading-6 break-words ${
                  active === index ? "bg-ivory text-brand" : "text-ink hover:bg-ivory"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(item);
                }}
              >
                {item}
              </button>
            </li>
          ))}
          {canUseTyped ? (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={active === matches.length}
                className={`block w-full px-3 py-2.5 text-left text-sm leading-6 ${
                  active === matches.length ? "bg-ivory text-brand" : "text-ink hover:bg-ivory"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  choose(typed);
                }}
              >
                Bu adı kullan: {typed}
              </button>
            </li>
          ) : null}
          {matches.length === 0 && !canUseTyped ? (
            <li className="px-3 py-2.5 text-sm text-ink/60">Eşleşen lise yok. Birkaç harf daha yazın.</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
