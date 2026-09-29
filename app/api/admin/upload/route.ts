import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { adminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const bucket = "genta-media";
// Vercel rejects request bodies above 4.5 MB before this handler runs.
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
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
  const extension = types[file.type];
  if (!extension) return NextResponse.json({ error: "JPG, PNG, WEBP, GIF veya SVG yükleyin." }, { status: 400 });
  if (file.size > maxBytes) return NextResponse.json({ error: "Dosya en fazla 4 MB olsun." }, { status: 400 });

  const folder = String(form?.get("folder") ?? "genel").replace(/[^a-z0-9-]/gi, "") || "genel";
  const existing = await supabase.storage.getBucket(bucket);
  if (existing.error) {
    const created = await supabase.storage.createBucket(bucket, { public: true });
    if (created.error && !/already exists/i.test(created.error.message)) {
      return NextResponse.json({ error: "Görsel klasörü açılamadı." }, { status: 503 });
    }
  }

  const objectPath = `${folder}/${randomUUID()}.${extension}`;
  const uploaded = await supabase.storage
    .from(bucket)
    .upload(objectPath, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000" });
  if (uploaded.error) return NextResponse.json({ error: "Görsel yüklenemedi." }, { status: 503 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return NextResponse.json({ url: data.publicUrl });
}
