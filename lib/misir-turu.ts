import { randomUUID } from "node:crypto";
import { cache } from "react";
import { adminClient } from "@/lib/supabase-admin";

export const misirTuruTable = "misir_turu";
export const misirTuruBucket = "genta-media";
export const misirTuruFolder = "misir-turu";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const misirTuruImageKeys = ["hero_image", "hurghada_image", "luksor_image", "kahire_image"] as const;
export type MisirTuruImageKey = (typeof misirTuruImageKeys)[number];

const textKeys = [
  "hero_eyebrow",
  "hero_title",
  "hero_dates",
  "hero_lead",
  "hero_badge",
  "hero_video",
  "intro_text",
  "hurghada_title",
  "hurghada_subtitle",
  "hurghada_body",
  "hurghada_exp1_title",
  "hurghada_exp1_text",
  "hurghada_exp2_title",
  "hurghada_exp2_text",
  "luksor_title",
  "luksor_subtitle",
  "luksor_body",
  "luksor_items",
  "luksor_closing",
  "kahire_title",
  "kahire_subtitle",
  "kahire_body",
  "kahire_items",
  "kahire_closing",
  "finale_title",
  "finale_hurghada_title",
  "finale_hurghada_text",
  "finale_luksor_title",
  "finale_luksor_text",
  "finale_kahire_title",
  "finale_kahire_text",
  "finale_body",
  "finale_headline",
  "finale_footer",
] as const;

export type MisirTuruTextKey = (typeof textKeys)[number];

export type MisirTuruContent = {
  id: string;
} & Record<MisirTuruTextKey | MisirTuruImageKey, string>;

const defaultId = "live";

export function defaultMisirTuru(): MisirTuruContent {
  return {
    id: defaultId,
    hero_eyebrow: "GENTA Meclis Mısır Turu",
    hero_title: "OCAK'TA YENİDEN MISIR'DAYIZ!",
    hero_dates: "24–30 Ocak 2027",
    hero_lead: "Daha önce birlikte keşfettik, şimdi yeniden yola çıkıyoruz!",
    hero_badge: "🎁 3 Kişiye Ücretsiz Mısır Turu Kazanma Şansı!",
    hero_video: "/media/misir-hero.mp4",
    intro_text:
      "GENTA Meclis olarak 24–30 Ağustos tarihlerinde gerçekleştirdiğimiz GENTA Çalıştayı Mısır Turumuzda 52 kişilik grubumuzla Kahire, Luksor ve Hurghada'yı kapsayan 6 günlük bir yolculuğu başarıyla tamamladık. Çöl safarisinden dalışa, Nil Nehri tekne turundan Piramitler'e kadar birçok farklı deneyimi birlikte yaşadık ve Mısır'dan unutulmaz anılarla döndük. Şimdi ise aynı heyecanı 24–30 Ocak 2027 tarihlerinde yeniden yaşıyoruz! Bu kez 6 günlük programımızda, Mısır'ın hem tatil hem macera hem de tarih dolu yüzünü keşfediyoruz!",
    hurghada_title: "🌊 İLK DURAK: HURGHADA",
    hurghada_subtitle: "Kızıldeniz'de Tatil, Deniz ve Macera!",
    hurghada_body:
      "Mısır maceramıza Hurghada'da başlıyoruz. İlk 3 günümüzü 4–5 yıldızlı, kendi plajı olan havuzlu ve aquaparklı resort otelimizde geçiriyoruz. Kızıldeniz'in güneşi, resort otelimizin imkanları ve birbirinden farklı aktivitelerle turun ilk bölümünü tamamen tatil ve eğlenceye ayırıyoruz.",
    hurghada_exp1_title: "🏜️ Safari Turu",
    hurghada_exp1_text:
      "Hurghada'nın çöllerine doğru macera dolu bir yolculuğa çıkıyoruz. 🏍️ ATV & Buggy, 🌅 Çöl Manzaraları, 🔥 Bedevi Gecesi. Çölün ortasında sadece safari yapmıyor, Mısır'ın geleneksel yaşamına da yakından tanıklık ediyoruz.",
    hurghada_exp2_title: "🤿 KIZILDENİZ'DE DALIŞ & ORANGE BAY",
    hurghada_exp2_text:
      "Hurghada'daki deniz günümüzü ise Kızıldeniz'in eşsiz su altı dünyasına ayırıyoruz. 🚤 Tekneyle denize açılıyor, 🏝️ Orange Bay Adası'nı keşfediyor, 🌊 serbest yüzmenin tadını çıkarıyor, 🤿 Tüplü dalış deneyimi yaşıyoruz. Güneş, deniz, tekne, ada ve dalış... Hurghada'da ilk 3 günümüz tam anlamıyla tatil ve macera!",
    luksor_title: "🏺 Kültür Rotamızın İlk Durağı: LUKSOR",
    luksor_subtitle: "Antik Mısır'ın Kalbine Yolculuk",
    luksor_body:
      "Hurghada'daki 3 günlük tatilin ardından rotamızı Luksor'a çeviriyoruz. Binlerce yıllık tarihin izlerini takip ederek Antik Mısır'ın en önemli merkezlerinden birini keşfediyoruz.",
    luksor_items: "🏺 Krallar Vadisi\n🏛️ Antik tapınaklar\n🌊 Nil Nehri\n📜 Antik Mısır'ın eşsiz mirası.",
    luksor_closing: "Bir gün boyunca kendimizi binlerce yıl öncesine götüren büyük bir kültür yolculuğunun içinde buluyoruz.",
    kahire_title: "🏛️ Turumuzun Finali: KAHİRE",
    kahire_subtitle: "Piramitlerin Gölgesinde Büyük Final",
    kahire_body: "Ve yolculuğumuzun son bölümünde Kahire'deyiz. Mısır denince akla ilk gelen o manzarayla karşılaşıyoruz:",
    kahire_items: "🔺 Gize Piramitleri\n🗿 Sfenks\n🌊 Nil Nehri\n🏺 Antik Mısır'ın eşsiz mirası.",
    kahire_closing:
      "Kahire'de geçireceğimiz iki gün boyunca şehrin tarihi ve kültürel noktalarını keşfediyor, Piramitler Bölgesinde deve deneyimi yaşıyor ve Nil Nehri tekne turuyla Kahire'yi farklı bir açıdan görüyoruz.",
    finale_title: "6 GÜN. 3 ŞEHİR. SAYISIZ DENEYİM.",
    finale_hurghada_title: "🌊 HURGHADA",
    finale_hurghada_text: "Tatil • Deniz • Dalış • Orange Bay • Safari",
    finale_luksor_title: "🏺 LUKSOR",
    finale_luksor_text: "Krallar Vadisi • Tapınaklar • Nil • Antik Mısır",
    finale_kahire_title: "🏛️ KAHİRE",
    finale_kahire_text: "Piramitler • Sfenks • Deve Deneyimi • Nil Nehri",
    finale_body:
      "Önce 3 gün Kızıldeniz'de tatil, sonra çölde macera, ardından Luksor'da Antik Mısır'ın izleri, ve son olarak Kahire'de Piramitlerin büyüleyici atmosferi... Daha Önce Birlikteydik. Şimdi Yeniden Mısır'dayız. 24–30 Ağustos GENTA Çalıştayı Mısır Turumuzda 52 kişilik grubumuzla bu yolculuğu birlikte gerçekleştirdik. Şimdi aynı heyecanı yeni katılacak arkadaşlarımızla birlikte yeniden yaşamaya hazırlanıyoruz.",
    finale_headline: "🇪🇬 GENTA MECLİS MISIR TURU | 24–30 Ocak 2027",
    finale_footer: "6 gün boyunca denizi, çölü, macerayı ve binlerce yıllık tarihi birlikte keşfediyoruz. Mısır'da yeniden görüşmek üzere! 🇪🇬",
    hero_image: "",
    hurghada_image: "",
    luksor_image: "",
    kahire_image: "",
  };
}

function asText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim() ? value : fallback;
}

function asId(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return defaultId;
}

export function lines(value: string) {
  const byLine = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  if (byLine.length !== 1 || !byLine[0].includes(",")) return byLine;
  return byLine[0]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeMisirTuru(value: unknown): MisirTuruContent {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const defaults = defaultMisirTuru();
  const next = { ...defaults, id: asId(row.id) };
  for (const key of textKeys) next[key] = asText(row[key], defaults[key]);
  for (const key of misirTuruImageKeys) next[key] = asText(row[key]);
  return next;
}

function payload(content: MisirTuruContent) {
  const row: Record<string, string> = {};
  for (const key of textKeys) row[key] = content[key];
  for (const key of misirTuruImageKeys) row[key] = content[key];
  return row;
}

function storageMessage(error: { message?: string; code?: string }) {
  const message = error.message ?? "";
  if (error.code === "PGRST205" || /schema cache|does not exist|Could not find the table/i.test(message)) {
    return `misir_turu tablosu yok. Supabase'te tabloyu ve görsel kolonlarını oluşturun. ${message}`.trim();
  }
  if (/column/i.test(message)) {
    return `misir_turu tablosunda beklenen bir kolon yok. Metin ve görsel kolonlarını kontrol edin. ${message}`.trim();
  }
  return message || "Kayıt tamamlanamadı.";
}

export const getMisirTuruContent = cache(async (): Promise<MisirTuruContent> => {
  const supabase = adminClient();
  if (!supabase) return defaultMisirTuru();
  const { data, error } = await supabase.from(misirTuruTable).select("*").limit(1).maybeSingle();
  if (error || data == null) return defaultMisirTuru();
  return normalizeMisirTuru(data);
});

export async function saveMisirTuruContent(value: unknown) {
  const content = normalizeMisirTuru(value);
  const supabase = adminClient();
  if (!supabase) throw new Error("Supabase bağlantısı henüz yok.");

  const existing = await supabase.from(misirTuruTable).select("*").limit(1).maybeSingle();
  if (existing.error) {
    console.error(existing.error);
    throw new Error(storageMessage(existing.error));
  }

  const current = existing.data && typeof existing.data === "object" ? existing.data : null;
  const row = payload(content);
  if (current?.id != null) {
    const { error } = await supabase.from(misirTuruTable).update(row).eq("id", current.id);
    if (error) {
      console.error(error);
      throw new Error(storageMessage(error));
    }
    return { ...content, id: asId(current.id) };
  }

  const inserted = await supabase.from(misirTuruTable).insert({ id: content.id, ...row }).select("id").maybeSingle();
  if (inserted.error) {
    console.error(inserted.error);
    const retry = await supabase.from(misirTuruTable).insert(row).select("id").maybeSingle();
    if (retry.error) {
      console.error(retry.error);
      throw new Error(storageMessage(retry.error));
    }
    return { ...content, id: asId(retry.data?.id) };
  }
  return { ...content, id: asId(inserted.data?.id) };
}

function sniffType(bytes: Buffer, declared: string) {
  const mime = declared.split(";")[0].trim().toLowerCase();
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return imageTypes[mime] ? mime : null;
}

export async function uploadMisirTuruFile(file: Blob) {
  const supabase = adminClient();
  if (!supabase) throw new Error("Supabase bağlantısı henüz yok.");

  const maxBytes = 4 * 1024 * 1024;
  if (file.size > maxBytes) throw new Error("Dosya en fazla 4 MB olsun.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const contentType = sniffType(bytes, file.type);
  if (!contentType) throw new Error("JPG, PNG veya WEBP yükleyin.");
  const extension = imageTypes[contentType];

  const existing = await supabase.storage.getBucket(misirTuruBucket);
  if (existing.error) {
    const created = await supabase.storage.createBucket(misirTuruBucket, { public: true });
    if (created.error && !/already exists/i.test(created.error.message)) {
      throw new Error("Görsel klasörü açılamadı.");
    }
  }

  const objectPath = `${misirTuruFolder}/${randomUUID()}.${extension}`;
  const uploaded = await supabase.storage.from(misirTuruBucket).upload(objectPath, bytes, {
    contentType,
    cacheControl: "31536000",
  });
  if (uploaded.error) {
    console.error(uploaded.error);
    throw new Error(uploaded.error.message || "Görsel yüklenemedi.");
  }

  const { data } = supabase.storage.from(misirTuruBucket).getPublicUrl(objectPath);
  return data.publicUrl;
}
