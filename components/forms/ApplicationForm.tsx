"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useId, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useContent } from "@/components/providers/ContentProvider";
import { pageFade } from "@/components/motion/tokens";
import { buildMailto, isEmail } from "./fields";
import { SchoolPicker } from "./SchoolPicker";

type Mode = "bireysel" | "delegasyon";

const grades = ["Hazırlık Sınıfı", "9. Sınıf", "10. Sınıf", "11. Sınıf", "12. Sınıf"] as const;

const preferenceBySlug: Record<string, string> = {
  saglik: "Sağlık Komisyonu",
  adalet: "Adalet Komisyonu",
  "milli-egitim": "Milli Eğitim Komisyonu",
  "milli-savunma": "Milli Savunma Komisyonu",
  disisleri: "Dışişleri Komisyonu",
  icisleri: "İçişleri Komisyonu",
  diyanet: "Dinişleri Komisyonu",
};

type Individual = {
  fullName: string;
  nationalId: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
  motivation: string;
  experience: string;
  commission1: string;
  commission2: string;
  commission3: string;
  commissionReason: string;
  participation: string;
  acceptReassignment: boolean;
  acceptMedia: boolean;
};

type DelegateSlot = {
  fullName: string;
  nationalId: string;
  email: string;
  grade: string;
  school: string;
  experience: string;
  commission1: string;
  commission2: string;
  commission3: string;
};

type Delegation = {
  fullName: string;
  nationalId: string;
  school: string;
  experience: string;
  grade: string;
  phone: string;
  email: string;
  delegates: [DelegateSlot, DelegateSlot, DelegateSlot, DelegateSlot, DelegateSlot];
  otherDelegates: string;
  motivation: string;
  commission1: string;
  commission2: string;
  commission3: string;
  commissionReason: string;
  acceptReassignment: boolean;
  acceptMedia: boolean;
};

function emptyDelegate(): DelegateSlot {
  return {
    fullName: "",
    nationalId: "",
    email: "",
    grade: "",
    school: "",
    experience: "",
    commission1: "",
    commission2: "",
    commission3: "",
  };
}

function createDelegation(commission1 = ""): Delegation {
  return {
    fullName: "",
    nationalId: "",
    school: "",
    experience: "",
    grade: "",
    phone: "",
    email: "",
    delegates: [emptyDelegate(), emptyDelegate(), emptyDelegate(), emptyDelegate(), emptyDelegate()],
    otherDelegates: "",
    motivation: "",
    commission1,
    commission2: "",
    commission3: "",
    commissionReason: "",
    acceptReassignment: false,
    acceptMedia: false,
  };
}

const emptyIndividual: Individual = {
  fullName: "",
  nationalId: "",
  school: "",
  grade: "",
  phone: "",
  email: "",
  motivation: "",
  experience: "",
  commission1: "",
  commission2: "",
  commission3: "",
  commissionReason: "",
  participation: "",
  acceptReassignment: false,
  acceptMedia: false,
};

export function ApplicationForm() {
  const { site } = useContent();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const preset = preferenceBySlug[params.get("komisyon") ?? ""] ?? "";
  const [mode, setMode] = useState<Mode>("bireysel");
  const [individual, setIndividual] = useState<Individual>({
    ...emptyIndividual,
    commission1: preset,
  });
  const [delegation, setDelegation] = useState<Delegation>(() => createDelegation(preset));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const [seenPreset, setSeenPreset] = useState(preset);
  if (preset !== seenPreset) {
    setSeenPreset(preset);
    if (preset) {
      setIndividual((current) => ({ ...current, commission1: preset }));
      setDelegation((current) => (current.commission1 ? current : { ...current, commission1: preset }));
    }
  }

  const summary = useMemo(() => {
    if (mode === "bireysel") return individual.fullName.trim();
    return delegation.fullName.trim();
  }, [mode, individual.fullName, delegation.fullName]);

  function updateIndividual<K extends keyof Individual>(key: K, value: Individual[K]) {
    setIndividual((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function updateDelegation<K extends keyof Delegation>(key: K, value: Delegation[K]) {
    setDelegation((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function updateDelegate(index: number, patch: Partial<DelegateSlot>) {
    setDelegation((current) => {
      const delegates = current.delegates.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ) as Delegation["delegates"];
      return { ...current, delegates };
    });
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[`delegate${index}.${key}`];
      delete next[`delegate${index}.commissions`];
      return next;
    });
  }

  function clearForm() {
    if (mode === "bireysel") setIndividual(emptyIndividual);
    else setDelegation(createDelegation());
    setErrors({});
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next = mode === "bireysel" ? validateIndividual(individual) : validateDelegation(delegation);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject =
      mode === "bireysel"
        ? `GENTA 2026 Bireysel Başvuru — ${individual.fullName.trim()}`
        : `GENTA 2026 Delegasyon Başvuru — ${delegation.fullName.trim()}`;
    const body = mode === "bireysel" ? individualBody(individual) : delegationBody(delegation);
    window.location.href = buildMailto(site.email, subject, body);
    setSent(true);
  }

  return (
    <div>
      <div className="grid grid-cols-2 border border-brand/15 bg-paper" role="tablist" aria-label="Başvuru türü">
        {(
          [
            ["bireysel", "Bireysel"],
            ["delegasyon", "Delegasyon"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            className={`px-4 py-3 font-display text-xs tracking-[0.18em] uppercase transition-colors duration-500 ${
              mode === value ? "bg-brand text-white" : "bg-paper text-brand hover:bg-ivory"
            }`}
            onClick={() => {
              setMode(value);
              setSent(false);
              setErrors({});
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: pageFade.ease }}
            className="bg-paper px-6 py-16 text-center sm:px-10"
          >
            <p className="font-display text-xs tracking-[0.28em] text-brand/60 uppercase">Teşekkürler</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand">Başvuru taslağınız hazır.</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/75">
              {summary ? `${summary} için ` : ""}e-posta uygulamanız açıldı. Mesajı gönderdiğinizde başvurunuz{" "}
              {site.email} adresine ulaşır.
            </p>
            <button
              type="button"
              className="mt-8 font-display text-xs tracking-[0.18em] text-brand uppercase"
              onClick={() => setSent(false)}
            >
              Forma dön
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={mode}
            className="mt-6 w-full min-w-0 space-y-4"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: pageFade.ease }}
          >
            {mode === "bireysel" ? (
              <IndividualFields value={individual} errors={errors} onChange={updateIndividual} />
            ) : (
              <DelegationFields
                value={delegation}
                errors={errors}
                onChange={updateDelegation}
                onDelegate={updateDelegate}
              />
            )}
            <div className="flex flex-col items-center gap-4 pt-2 sm:flex-row sm:justify-between">
              <button
                type="submit"
                className="w-full max-w-xs rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white transition-colors duration-500 hover:bg-brand-deep sm:w-auto sm:max-w-none sm:rounded-md sm:py-2.5"
              >
                Gönder
              </button>
              <button type="button" className="text-sm text-brand" onClick={clearForm}>
                Formu temizle
              </button>
            </div>
            <p className="text-sm leading-6 text-ink/55">
              Gönder, başvuru taslağını e-posta uygulamanızda açar. Taslağı ilettiğinizde başvurunuz{" "}
              {site.email} adresine ulaşır.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Question({
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
      className="w-full min-w-0 rounded-xl border border-black/5 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(44,20,18,0.04)]"
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

const lineClass =
  "box-border w-full min-w-0 border-b border-ink/20 bg-transparent py-2 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink/35 focus:border-brand";

function IndividualFields({
  value,
  errors,
  onChange,
}: {
  value: Individual;
  errors: Record<string, string>;
  onChange: <K extends keyof Individual>(key: K, next: Individual[K]) => void;
}) {
  return (
    <>
      <Question label="Ad-Soyad" required error={errors.fullName}>
        <input
          className={lineClass}
          value={value.fullName}
          placeholder="Yanıtınız"
          autoComplete="name"
          onChange={(event) => onChange("fullName", event.target.value)}
        />
      </Question>
      <Question label="T.C. Kimlik Numarası" required error={errors.nationalId}>
        <input
          className={lineClass}
          value={value.nationalId}
          placeholder="Yanıtınız"
          inputMode="numeric"
          autoComplete="off"
          onChange={(event) => onChange("nationalId", event.target.value)}
        />
      </Question>
      <Question
        label="Okul Adı"
        required
        hint="İstanbul’daki liselerden seçin. Okulunuz listede yoksa adını yazıp “Bu adı kullan” deyin."
        error={errors.school}
      >
        <SchoolPicker value={value.school} onChange={(next) => onChange("school", next)} />
      </Question>
      <Question label="Sınıf Düzeyi" required error={errors.grade}>
        <GradePills value={value.grade} onChange={(next) => onChange("grade", next)} />
      </Question>
      <Question
        label="Telefon Numarası"
        required
        hint="(Başına sıfır koyarak yazınız) örn. 0542 XXX XX XX"
        error={errors.phone}
      >
        <input
          className={lineClass}
          type="tel"
          value={value.phone}
          placeholder="Yanıtınız"
          autoComplete="tel"
          onChange={(event) => onChange("phone", event.target.value)}
        />
      </Question>
      <Question label="Mail Adresi" required error={errors.email}>
        <input
          className={lineClass}
          type="email"
          value={value.email}
          placeholder="Yanıtınız"
          autoComplete="email"
          onChange={(event) => onChange("email", event.target.value)}
        />
      </Question>
      <Question
        label="Meclisimize katılma motivasyonunuz nedir?"
        required
        hint="En az 100 kelime ile açıklayınız."
        error={errors.motivation}
      >
        <Essay
          value={value.motivation}
          minimum={100}
          onChange={(next) => onChange("motivation", next)}
        />
      </Question>
      <Question
        label="Daha önceki deneyimleriniz nelerdir? Yoksa boş bırakınız."
        hint="En az 100 kelime ile açıklayınız."
        error={errors.experience}
      >
        <Essay
          value={value.experience}
          minimum={100}
          onChange={(next) => onChange("experience", next)}
        />
      </Question>
      <Question
        label="Komisyon tercihleri"
        required
        hint="Sırayla üç komisyon seçin. İlk dokunduğunuz 1. tercih olur. Seçili olana tekrar dokunursanız kalkar."
        error={errors.commission1}
      >
        <RankedCommissions
          values={[value.commission1, value.commission2, value.commission3]}
          onChange={([first, second, third]) => {
            onChange("commission1", first);
            onChange("commission2", second);
            onChange("commission3", third);
          }}
        />
      </Question>
      <Question
        label="Komisyon tercihlerinizin bu yönde olmasının nedeni nedir?"
        required
        hint="En az 100 kelime ile açıklayınız."
        error={errors.commissionReason}
      >
        <Essay
          value={value.commissionReason}
          minimum={100}
          onChange={(next) => onChange("commissionReason", next)}
        />
      </Question>
      <Question
        label="Günümüzde gençlerin ülke yönetimine ve karar alma süreçlerine daha fazla katılması için nasıl bir sistem oluşturulabilir?"
        required
        hint="En az 50 kelime ile açıklayınız."
        error={errors.participation}
      >
        <Essay
          value={value.participation}
          minimum={50}
          onChange={(next) => onChange("participation", next)}
        />
      </Question>
      <Question
        label="İhtiyaç duyulması halinde kendi komite tercihlerim yerine proje koordinatör ekibi tarafından komisyonumda değişiklik yapılabileceğini kabul ediyorum."
        required
        error={errors.acceptReassignment}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input
            type="checkbox"
            className="size-4 accent-brand"
            checked={value.acceptReassignment}
            onChange={(event) => onChange("acceptReassignment", event.target.checked)}
          />
          Kabul Ediyorum.
        </label>
      </Question>
      <Question
        label="Etkinlik boyunca kayda alınacak fotoğraf, video ve benzeri kayıtlarımın sosyal medya hesaplarında paylaşılmasına izin veriyorum."
        required
        error={errors.acceptMedia}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input
            type="checkbox"
            className="size-4 accent-brand"
            checked={value.acceptMedia}
            onChange={(event) => onChange("acceptMedia", event.target.checked)}
          />
          Kabul Ediyorum
        </label>
      </Question>
    </>
  );
}

function Essay({
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

function GradePills({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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

function RankedCommissions({
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

function DelegationFields({
  value,
  errors,
  onChange,
  onDelegate,
}: {
  value: Delegation;
  errors: Record<string, string>;
  onChange: <K extends keyof Delegation>(key: K, next: Delegation[K]) => void;
  onDelegate: (index: number, patch: Partial<DelegateSlot>) => void;
}) {
  return (
    <>
      <Question label="Baş Delege Ad-Soyad" required error={errors.fullName}>
        <input className={lineClass} value={value.fullName} placeholder="Yanıtınız" autoComplete="name" onChange={(event) => onChange("fullName", event.target.value)} />
      </Question>
      <Question label="Baş Delege T.C. Kimlik Numarası" required error={errors.nationalId}>
        <input className={lineClass} value={value.nationalId} placeholder="Yanıtınız" inputMode="numeric" autoComplete="off" onChange={(event) => onChange("nationalId", event.target.value)} />
      </Question>
      <Question
        label="Baş Delege Okul Adı"
        required
        hint="İstanbul’daki liselerden seçin. Okulunuz listede yoksa adını yazıp “Bu adı kullan” deyin."
        error={errors.school}
      >
        <SchoolPicker value={value.school} onChange={(next) => onChange("school", next)} />
      </Question>
      <Question label="Baş Delege Deneyimleri" hint="Daha önceden varsa katıldığınız etkinlikler.">
        <textarea className={`${lineClass} min-h-16 resize-y`} value={value.experience} placeholder="Yanıtınız" onChange={(event) => onChange("experience", event.target.value)} />
      </Question>
      <Question label="Baş Delege Sınıf Düzeyi" required error={errors.grade}>
        <GradePills value={value.grade} onChange={(next) => onChange("grade", next)} />
      </Question>
      <Question label="Baş Delege Telefon Numarası" required hint="(Başına sıfır koyarak yazınız) örn. 0542 XXX XX XX" error={errors.phone}>
        <input className={lineClass} type="tel" value={value.phone} placeholder="Yanıtınız" autoComplete="tel" onChange={(event) => onChange("phone", event.target.value)} />
      </Question>
      <Question label="Baş Delege Mail Adresi" required error={errors.email}>
        <input className={lineClass} type="email" value={value.email} placeholder="Yanıtınız" autoComplete="email" onChange={(event) => onChange("email", event.target.value)} />
      </Question>
      {value.delegates.map((delegate, index) => (
        <DelegateCard
          key={index}
          index={index}
          value={delegate}
          errors={errors}
          onChange={(patch) => onDelegate(index, patch)}
        />
      ))}
      <Question
        label="Diğer Delegelerin Bilgileri"
        hint="(Delegasyon 5 kişiden fazla ise kalan delegelerin bilgilerini burada doldurunuz.)"
      >
        <textarea className={`${lineClass} min-h-20 resize-y`} value={value.otherDelegates} placeholder="Yanıtınız" onChange={(event) => onChange("otherDelegates", event.target.value)} />
      </Question>
      <Question label="Meclisimize katılma motivasyonunuz nedir?" required hint="En az 100 kelime ile açıklayınız." error={errors.motivation}>
        <Essay value={value.motivation} minimum={100} onChange={(next) => onChange("motivation", next)} />
      </Question>
      <Question
        label="Baş Delege komisyon tercihleri"
        required
        hint="Sırayla üç komisyon seçin. İlk dokunduğunuz 1. tercih olur. Seçili olana tekrar dokunursanız kalkar."
        error={errors.commission1}
      >
        <RankedCommissions
          values={[value.commission1, value.commission2, value.commission3]}
          onChange={([first, second, third]) => {
            onChange("commission1", first);
            onChange("commission2", second);
            onChange("commission3", third);
          }}
        />
      </Question>
      <Question label="Komisyon tercihlerinizin bu yönde olmasının nedeni nedir?" required hint="En az 100 kelime ile açıklayınız." error={errors.commissionReason}>
        <Essay value={value.commissionReason} minimum={100} onChange={(next) => onChange("commissionReason", next)} />
      </Question>
      <Question
        label="İhtiyaç duyulması halinde kendi komite tercihlerim yerine proje koordinatör ekibi tarafından komisyonumda değişiklik yapılabileceğini kabul ediyorum."
        required
        error={errors.acceptReassignment}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" className="size-4 accent-brand" checked={value.acceptReassignment} onChange={(event) => onChange("acceptReassignment", event.target.checked)} />
          Kabul Ediyorum.
        </label>
      </Question>
      <Question
        label="Etkinlik boyunca kayda alınacak fotoğraf, video ve benzeri kayıtlarımın sosyal medya hesaplarında paylaşılmasına izin veriyorum."
        required
        error={errors.acceptMedia}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" className="size-4 accent-brand" checked={value.acceptMedia} onChange={(event) => onChange("acceptMedia", event.target.checked)} />
          Kabul Ediyorum
        </label>
      </Question>
    </>
  );
}

function DelegateCard({
  index,
  value,
  errors,
  onChange,
}: {
  index: number;
  value: DelegateSlot;
  errors: Record<string, string>;
  onChange: (patch: Partial<DelegateSlot>) => void;
}) {
  const key = `delegate${index}`;
  return (
    <Question
      label={`${index + 1}. Delege Bilgileri`}
      required
      hint="Ad-soyad, T.C., mail, sınıf, okulun tam adı, deneyim ve ilk üç komisyon tercihi."
      error={errors[`${key}.commissions`]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <MiniField label="Ad-Soyad" error={errors[`${key}.fullName`]}>
            <input className={lineClass} value={value.fullName} placeholder="Yanıtınız" onChange={(event) => onChange({ fullName: event.target.value })} />
          </MiniField>
          <MiniField label="T.C. Kimlik Numarası" error={errors[`${key}.nationalId`]}>
            <input className={lineClass} value={value.nationalId} placeholder="Yanıtınız" inputMode="numeric" onChange={(event) => onChange({ nationalId: event.target.value })} />
          </MiniField>
        </div>
        <MiniField label="Mail Adresi" error={errors[`${key}.email`]}>
          <input className={lineClass} type="email" value={value.email} placeholder="Yanıtınız" onChange={(event) => onChange({ email: event.target.value })} />
        </MiniField>
        <MiniField label="Okul" error={errors[`${key}.school`]}>
          <SchoolPicker value={value.school} onChange={(school) => onChange({ school })} />
        </MiniField>
        <MiniField label="Sınıf" error={errors[`${key}.grade`]}>
          <GradePills value={value.grade} onChange={(grade) => onChange({ grade })} />
        </MiniField>
        <MiniField label="Deneyimler">
          <input className={lineClass} value={value.experience} placeholder="Varsa yazın, yoksa boş bırakın" onChange={(event) => onChange({ experience: event.target.value })} />
        </MiniField>
        <MiniField label="İlk üç komisyon tercihi">
          <RankedCommissions
            values={[value.commission1, value.commission2, value.commission3]}
            onChange={([first, second, third]) => onChange({ commission1: first, commission2: second, commission3: third })}
          />
        </MiniField>
      </div>
    </Question>
  );
}

function MiniField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
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

function required(value: string, errors: Record<string, string>, key: string) {
  if (!value.trim()) errors[key] = "Bu alan zorunludur.";
}

function wordCount(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function requireWords(value: string, minimum: number, errors: Record<string, string>, key: string) {
  const count = wordCount(value);
  if (count === 0) {
    errors[key] = "Bu alan zorunludur.";
    return;
  }
  if (count < minimum) errors[key] = `En az ${minimum} kelime yazın. Şu an ${count} kelime.`;
}

function isNationalId(value: string) {
  return /^[1-9]\d{10}$/.test(value.replace(/\s/g, ""));
}

function isLocalPhone(value: string) {
  return /^0\d{10}$/.test(value.replace(/\D/g, ""));
}

function validateIndividual(value: Individual) {
  const errors: Record<string, string> = {};
  required(value.fullName, errors, "fullName");
  required(value.school, errors, "school");
  required(value.grade, errors, "grade");
  if (!isNationalId(value.nationalId)) errors.nationalId = "11 haneli T.C. kimlik numaranızı yazın.";
  if (!isLocalPhone(value.phone)) errors.phone = "Numarayı başına 0 koyarak, 11 hane olarak yazın.";
  if (!isEmail(value.email)) errors.email = "Geçerli bir e-posta adresi yazın.";
  requireWords(value.motivation, 100, errors, "motivation");
  if (wordCount(value.experience) > 0 && wordCount(value.experience) < 100) {
    errors.experience = `Deneyim yazacaksanız en az 100 kelime yazın. Şu an ${wordCount(value.experience)} kelime. Boş da bırakabilirsiniz.`;
  }
  requireRanking([value.commission1, value.commission2, value.commission3], errors, "commission1");
  requireWords(value.commissionReason, 100, errors, "commissionReason");
  requireWords(value.participation, 50, errors, "participation");
  if (!value.acceptReassignment) errors.acceptReassignment = "Devam etmek için kabul etmeniz gerekir.";
  if (!value.acceptMedia) errors.acceptMedia = "Devam etmek için izin vermeniz gerekir.";
  return errors;
}

function requireRanking(values: string[], errors: Record<string, string>, key: string) {
  const chosen = values.filter(Boolean);
  if (chosen.length < 3) errors[key] = "Üç komisyon tercihini sırayla seçin.";
  else if (new Set(chosen).size < 3) errors[key] = "Üç tercih birbirinden farklı olmalıdır.";
}

function validateDelegation(value: Delegation) {
  const errors: Record<string, string> = {};
  required(value.fullName, errors, "fullName");
  required(value.school, errors, "school");
  required(value.grade, errors, "grade");
  if (!isNationalId(value.nationalId)) errors.nationalId = "11 haneli T.C. kimlik numaranızı yazın.";
  if (!isLocalPhone(value.phone)) errors.phone = "Numarayı başına 0 koyarak, 11 hane olarak yazın.";
  if (!isEmail(value.email)) errors.email = "Geçerli bir e-posta adresi yazın.";
  value.delegates.forEach((delegate, index) => validateDelegate(delegate, index, errors));
  requireWords(value.motivation, 100, errors, "motivation");
  requireRanking([value.commission1, value.commission2, value.commission3], errors, "commission1");
  requireWords(value.commissionReason, 100, errors, "commissionReason");
  if (!value.acceptReassignment) errors.acceptReassignment = "Devam etmek için kabul etmeniz gerekir.";
  if (!value.acceptMedia) errors.acceptMedia = "Devam etmek için izin vermeniz gerekir.";
  return errors;
}

function validateDelegate(value: DelegateSlot, index: number, errors: Record<string, string>) {
  const key = `delegate${index}`;
  if (!value.fullName.trim()) errors[`${key}.fullName`] = "Ad-soyad zorunludur.";
  if (!isNationalId(value.nationalId)) errors[`${key}.nationalId`] = "11 haneli T.C. kimlik numarası yazın.";
  if (!isEmail(value.email)) errors[`${key}.email`] = "Geçerli bir e-posta yazın.";
  if (!value.grade) errors[`${key}.grade`] = "Sınıf seçin.";
  if (!value.school.trim()) errors[`${key}.school`] = "Okulun tam adını yazın.";
  const chosen = [value.commission1, value.commission2, value.commission3].filter(Boolean);
  if (chosen.length < 3 || new Set(chosen).size < 3) errors[`${key}.commissions`] = "Üç farklı komisyon seçin.";
}

function individualBody(value: Individual) {
  return [
    "GENTA 2026 bireysel başvuru",
    `Ad-Soyad: ${value.fullName.trim()}`,
    `T.C. Kimlik Numarası: ${value.nationalId.replace(/\s/g, "")}`,
    `Okul Adı: ${value.school.trim()}`,
    `Sınıf Düzeyi: ${value.grade}`,
    `Telefon Numarası: ${value.phone.trim()}`,
    `Mail Adresi: ${value.email.trim()}`,
    "",
    "Meclisimize katılma motivasyonunuz nedir?",
    value.motivation.trim(),
    "",
    "Daha önceki deneyimleriniz nelerdir?",
    value.experience.trim() || "—",
    "",
    `1. Komisyon Tercihi: ${value.commission1}`,
    `2. Komisyon Tercihi: ${value.commission2}`,
    `3. Komisyon Tercihi: ${value.commission3}`,
    "",
    "Komisyon tercihlerinizin bu yönde olmasının nedeni nedir?",
    value.commissionReason.trim(),
    "",
    "Günümüzde gençlerin ülke yönetimine ve karar alma süreçlerine daha fazla katılması için nasıl bir sistem oluşturulabilir?",
    value.participation.trim(),
    "",
    "Komisyon değişikliği kabulü: Kabul Ediyorum.",
    "Sosyal medya kaydı izni: Kabul Ediyorum.",
  ].join("\n");
}

function delegationBody(value: Delegation) {
  const delegates = value.delegates.map((delegate, index) =>
    [
      `${index + 1}. Delege`,
      `Ad-Soyad: ${delegate.fullName.trim()}`,
      `T.C.: ${delegate.nationalId.replace(/\s/g, "")}`,
      `Mail: ${delegate.email.trim()}`,
      `Sınıf: ${delegate.grade}`,
      `Okul: ${delegate.school.trim()}`,
      `Deneyimler: ${delegate.experience.trim() || "—"}`,
      `Komisyonlar: ${delegate.commission1}, ${delegate.commission2}, ${delegate.commission3}`,
    ].join("\n"),
  );
  return [
    "GENTA 2026 delegasyon başvurusu",
    `Baş Delege Ad-Soyad: ${value.fullName.trim()}`,
    `Baş Delege T.C.: ${value.nationalId.replace(/\s/g, "")}`,
    `Baş Delege Okul: ${value.school.trim()}`,
    `Baş Delege Deneyimleri: ${value.experience.trim() || "—"}`,
    `Baş Delege Sınıf: ${value.grade}`,
    `Baş Delege Telefon: ${value.phone.trim()}`,
    `Baş Delege Mail: ${value.email.trim()}`,
    "",
    ...delegates.flatMap((block) => [block, ""]),
    "Diğer Delegeler:",
    value.otherDelegates.trim() || "—",
    "",
    "Meclisimize katılma motivasyonunuz nedir?",
    value.motivation.trim(),
    "",
    `Baş Delege 1. Komisyon: ${value.commission1}`,
    `Baş Delege 2. Komisyon: ${value.commission2}`,
    `Baş Delege 3. Komisyon: ${value.commission3}`,
    "",
    "Komisyon tercihlerinin nedeni:",
    value.commissionReason.trim(),
    "",
    "Komisyon değişikliği kabulü: Kabul Ediyorum.",
    "Sosyal medya kaydı izni: Kabul Ediyorum.",
  ].join("\n");
}
