"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginCard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Giriş yapılamadı.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-ivory px-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-brand/10 bg-white p-8 shadow-[0_24px_60px_-36px_rgba(108,17,16,0.45)]">
        <Image src="/brand/logo.png" alt="GENTA" width={512} height={512} priority className="mx-auto h-auto w-36" />
        <h1 className="mt-6 text-center font-display text-3xl font-semibold text-brand">Yönetim</h1>
        <p className="mt-2 text-center text-sm leading-6 text-ink/65">
          Site metinlerini, kişileri ve kartları buradan düzenlersiniz.
        </p>
        <label className="mt-8 block">
          <span className="font-display text-[11px] tracking-[0.16em] text-ink/50 uppercase">Şifre</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-full border border-brand/15 bg-ivory px-5 py-3 text-ink outline-none focus:border-brand"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-brand">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 font-display text-[12px] font-semibold tracking-[0.14em] text-white uppercase transition-colors duration-500 hover:bg-brand-deep disabled:opacity-60"
        >
          {pending ? "Giriliyor" : "Giriş yap"}
        </button>
      </form>
    </main>
  );
}
