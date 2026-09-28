import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

const passwordFile = path.join(process.cwd(), "data", "admin-password.json");

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

function readCustomPassword() {
  if (!existsSync(passwordFile)) return null;
  try {
    const data = JSON.parse(readFileSync(passwordFile, "utf8")) as { salt?: string; hash?: string };
    if (!data.salt || !data.hash) return null;
    return data;
  } catch {
    return null;
  }
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 32).toString("base64url");
}

export function passwordMatches(password: string) {
  const custom = readCustomPassword();
  if (custom?.salt && custom.hash) return safeEqual(hashPassword(password, custom.salt), custom.hash);
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return safeEqual(password, expected);
}

export function savePassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  writeFileSync(passwordFile, `${JSON.stringify({ salt, hash: hashPassword(password, salt) })}\n`, "utf8");
}

export function signSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString("base64url");
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
