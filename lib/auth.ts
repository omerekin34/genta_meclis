import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const adminCookie = "genta_admin";

function secret() {
  return process.env.ADMIN_SECRET || "genta-gelistirme-oturumu";
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function usernameToEmail(username: string) {
  const value = username.trim().toLowerCase();
  if (value.includes("@")) return value;
  const domain = process.env.ADMIN_EMAIL_DOMAIN || "genta.local";
  return `${value}@${domain}`;
}

export async function verifyCredentials(username: string, password: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !username.trim() || !password) return null;
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? "" };
}

export function signSession(user: { id: string; email: string }) {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, email: user.email, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }),
  ).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAuthed() {
  const jar = await cookies();
  return verifyToken(jar.get(adminCookie)?.value);
}
