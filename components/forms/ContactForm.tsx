"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent, type ReactNode } from "react";
import { useContent } from "@/components/providers/ContentProvider";
import { pageFade } from "@/components/motion/tokens";
import { buildMailto, isEmail, isPhone } from "./fields";

const fieldClass =
  "w-full rounded-full border border-brand/15 bg-ivory px-5 py-3.5 text-[15px] leading-6 text-ink outline-none transition-[border-color,background-color] duration-300 placeholder:text-ink/35 focus:border-brand focus:bg-white";

type ContactValues = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const empty: ContactValues = { name: "", phone: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const { site, copy } = useContent();
  const reduce = useReducedMotion();
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function update(key: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "Bu alan zorunludur.";
    if (values.phone.trim() && !isPhone(values.phone)) next.phone = "Geçerli bir telefon numarası yazın.";
    if (!isEmail(values.email)) next.email = "Geçerli bir e-posta adresi yazın.";
    if (!values.subject.trim()) next.subject = "Bu alan zorunludur.";
    if (!values.message.trim()) next.message = "Bu alan zorunludur.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const body = [
      `Gönderen: ${values.name.trim()}`,
      `E-posta: ${values.email.trim()}`,
      values.phone.trim() ? `Telefon: ${values.phone.trim()}` : null,
      "",
      values.message.trim(),
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.location.href = buildMailto(site.email, `GENTA İletişim — ${values.subject.trim()}`, body);
    setSent(true);
  }

  return (
    <div className="rounded-3xl border border-brand/10 bg-paper p-6 shadow-[0_1px_2px_rgba(44,20,18,0.04)] sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: pageFade.ease }}
            className="py-12 text-center"
          >
            <h2 className="font-display text-2xl font-semibold text-brand">Mesaj taslağınız hazır.</h2>
            <p className="mt-3 text-sm leading-7 text-ink/75">
              E-posta uygulamanız açıldı. Gönderimi tamamladığınızda notunuz bize ulaşır.
            </p>
            <button
              type="button"
              className="mt-6 font-display text-xs tracking-[0.18em] text-brand uppercase"
              onClick={() => setSent(false)}
            >
              Yeni mesaj
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="space-y-5"
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.6 }}
          >
            <div>
              <h2 className="font-display text-xs font-semibold tracking-[0.22em] text-brand uppercase">
                {copy.pages.contactFormTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">{copy.pages.contactFormHint}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Label label="Ad soyad" error={errors.name}>
                <input
                  className={fieldClass}
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  autoComplete="name"
                  placeholder="Adınız soyadınız"
                />
              </Label>
              <Label label="Telefon" error={errors.phone}>
                <input
                  className={fieldClass}
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="05XX XXX XX XX"
                />
              </Label>
            </div>
            <Label label="E-posta" error={errors.email}>
              <input
                className={fieldClass}
                type="email"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                autoComplete="email"
                placeholder="ornek@email.com"
              />
            </Label>
            <Label label="Konu" error={errors.subject}>
              <input
                className={fieldClass}
                value={values.subject}
                onChange={(event) => update("subject", event.target.value)}
                placeholder="Başvuru, delegasyon, program…"
              />
            </Label>
            <Label label="Mesaj" error={errors.message}>
              <textarea
                className="min-h-36 w-full resize-y rounded-3xl border border-brand/15 bg-ivory px-8 py-5 text-[15px] leading-7 text-ink outline-none transition-[border-color,background-color] duration-300 placeholder:text-ink/35 focus:border-brand focus:bg-white"
                value={values.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="Kısaca anlatın, dönüş yapalım."
              />
            </Label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-brand px-8 py-3 font-display text-[13px] font-semibold tracking-[0.14em] text-white transition-all duration-700 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-[0_12px_28px_-16px_rgba(108,17,16,0.7)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
            >
              {copy.pages.contactSubmit}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-brand" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
