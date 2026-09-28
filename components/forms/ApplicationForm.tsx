"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { pageFade } from "@/components/motion/tokens";
import { emptyIndividual, IndividualFields, validateIndividual, type Individual } from "./bireysel";
import { createDelegation, DelegationFields, validateDelegation, type DelegateSlot, type Delegation } from "./delegasyon";

type Mode = "bireysel" | "delegasyon";

const preferenceBySlug: Record<string, string> = {
  saglik: "Sağlık Komisyonu",
  adalet: "Adalet Komisyonu",
  "milli-egitim": "Milli Eğitim Komisyonu",
  "milli-savunma": "Milli Savunma Komisyonu",
  disisleri: "Dışişleri Komisyonu",
  icisleri: "İçişleri Komisyonu",
  diyanet: "Dinişleri Komisyonu",
};

export function ApplicationForm() {
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
  const [pending, setPending] = useState(false);
  const [receipt, setReceipt] = useState("");

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

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next = mode === "bireysel" ? validateIndividual(individual) : validateDelegation(delegation);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    const response = await fetch("/api/basvuru", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: mode,
        payload: mode === "bireysel" ? individual : delegation,
      }),
    });
    const body = (await response.json().catch(() => null)) as { error?: string; id?: string } | null;
    setPending(false);
    if (!response.ok || !body?.id) {
      setErrors({ form: body?.error ?? "Başvuru kaydedilemedi." });
      return;
    }
    setReceipt(body.id);
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
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand">Başvurunuz alındı.</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink/75">
              {summary ? `${summary} için ` : ""}kayıt onaya alındı. Sonuç bu takip numarasıyla görünür. Onaylanırsa sayfada Kabul yazar.
            </p>
            <p className="mx-auto mt-6 max-w-md break-all font-display text-sm tracking-wide text-brand">{receipt}</p>
            <Link
              href={`/basvuru/durum?kod=${receipt}`}
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-medium text-white"
            >
              Durumu gör
            </Link>
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
                disabled={pending}
                className="w-full max-w-xs rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-white transition-colors duration-500 hover:bg-brand-deep disabled:opacity-60 sm:w-auto sm:max-w-none sm:rounded-md sm:py-2.5"
              >
                {pending ? "Gönderiliyor" : "Gönder"}
              </button>
              <button type="button" className="text-sm text-brand" onClick={clearForm}>
                Formu temizle
              </button>
            </div>
            {errors.form ? <p className="text-sm text-brand">{errors.form}</p> : null}
            <p className="text-sm leading-6 text-ink/55">
              Gönder, başvuruyu onaya alır.{" "}
              <Link href="/basvuru/durum" className="text-brand">
                Durumunu sorgula
              </Link>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
