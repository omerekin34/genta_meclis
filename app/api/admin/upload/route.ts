import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const bucket = "genta-media";
const maxBytes = 4 * 1024 * 1024;
const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(request: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  const supabase = adminClient();
  if (!supabase) return NextResponse.json({ error: "Supabase bağlantısı henüz yok." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const folder = String(form?.get("folder") ?? "genel").replace(/[^a-z0-9-]/gi, "") || "genel";
  const file = form?.get("file");
  const remote = String(form?.get("url") ?? "").trim();

  let bytes: Buffer;
  let contentType: string;

  if (file instanceof File) {
    if (file.size > maxBytes) return NextResponse.json({ error: "Dosya en fazla 4 MB olsun." }, { status: 400 });
    bytes = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffType(bytes, file.type);
    if (!sniffed) return NextResponse.json({ error: "JPG, PNG, WEBP, GIF veya SVG yükleyin." }, { status: 400 });
    contentType = sniffed;
  } else if (remote) {
    try {
      const downloaded = await downloadPublicImage(remote);
      bytes = downloaded.bytes;
      contentType = downloaded.type;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Bu adresten görsel alınamadı." }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
  }

  const extension = types[contentType];
  if (!extension) return NextResponse.json({ error: "JPG, PNG, WEBP, GIF veya SVG yükleyin." }, { status: 400 });

  const existing = await supabase.storage.getBucket(bucket);
  if (existing.error) {
    const created = await supabase.storage.createBucket(bucket, { public: true });
    if (created.error && !/already exists/i.test(created.error.message)) {
      return NextResponse.json({ error: "Görsel klasörü açılamadı." }, { status: 503 });
    }
  }

  const objectPath = `${folder}/${randomUUID()}.${extension}`;
  const uploaded = await supabase.storage.from(bucket).upload(objectPath, bytes, { contentType, cacheControl: "31536000" });
  if (uploaded.error) return NextResponse.json({ error: "Görsel yüklenemedi." }, { status: 503 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return NextResponse.json({ url: data.publicUrl });
}

function sniffType(bytes: Buffer, declared: string) {
  const mime = declared.split(";")[0].trim().toLowerCase();
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return "image/gif";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  const head = bytes.toString("utf8", 0, Math.min(512, bytes.length)).trim().toLowerCase();
  if (head.includes("<svg") || (head.startsWith("<?xml") && head.includes("<svg"))) return "image/svg+xml";
  return types[mime] ? mime : null;
}

function isPrivateIp(ip: string) {
  const value = ip.toLowerCase();
  if (value.startsWith("::ffff:")) return isPrivateIp(value.slice(7));
  if (value === "::1" || value === "::" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:")) return true;
  const parts = value.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) return false;
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

async function assertPublicHttpUrl(raw: string) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Geçerli bir https adresi yapıştır.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("Sadece http veya https adresi yapıştır.");
  if (parsed.username || parsed.password) throw new Error("Bu adres kullanılamaz.");
  const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host) throw new Error("Geçerli bir https adresi yapıştır.");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Bu adres kullanılamaz.");
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new Error("Bu adres kullanılamaz.");
  } else {
    const addresses = await lookup(host, { all: true }).catch(() => []);
    if (!addresses.length) throw new Error("Bu adresten görsel alınamadı.");
    if (addresses.some((item) => isPrivateIp(item.address))) throw new Error("Bu adres kullanılamaz.");
  }
  return parsed;
}

async function downloadPublicImage(raw: string) {
  let current = raw;
  for (let step = 0; step < 4; step += 1) {
    const parsed = await assertPublicHttpUrl(current);
    const response = await fetch(parsed.href, {
      redirect: "manual",
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(15000),
    }).catch(() => null);
    if (!response) throw new Error("Bu adresten görsel alınamadı.");

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Bu adresten görsel alınamadı.");
      current = new URL(location, parsed.href).href;
      continue;
    }
    if (!response.ok) throw new Error("Bu adresten görsel alınamadı.");

    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > maxBytes) throw new Error("Dosya en fazla 4 MB olsun.");

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new Error("Dosya en fazla 4 MB olsun.");
    const type = sniffType(bytes, response.headers.get("content-type") ?? "");
    if (!type) throw new Error("JPG, PNG, WEBP, GIF veya SVG yükleyin.");
    return { bytes, type };
  }
  throw new Error("Bu adresten görsel alınamadı.");
}
