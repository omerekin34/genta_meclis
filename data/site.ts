export const site = {
  name: "GENTA",
  title: "Genç Tartışmacılar Meclisi",
  edition: "2026",
  datesLabel: "14 · 15 · 16 Kasım 2026",
  datesShort: "14–16 Kasım 2026",
  durationLabel: "Toplam 3 gün",
  highlightedDays: [14, 15, 16] as const,
  monthLabel: "Kasım",
  city: "İstanbul / Pendik",
  venue: "Pendik İTO Şehit Ahmet Aslanhan Anadolu İmam Hatip Lisesi",
  venueShort: "Pendik İTO Şehit Ahmet Aslanhan AİHL",
  email: "gentameclis@gmail.com",
  instagram: "https://www.instagram.com/gentameclis/",
  instagramLabel: "@gentameclis",
  fee: "800₺",
  applicationDeadlineLabel: "1 Kasım 2026",
  applicationDeadlineIso: "2026-11-01T23:59:59+03:00",
  eventStartIso: "2026-11-14T09:00:00+03:00",
  headerOffset: "7.25rem",
} as const;

export const coordinators = [
  {
    name: "Metin Oktay Tüylü",
    role: "Genel Koordinatör",
    phone: "+90 536 329 67 26",
    tel: "+905363296726",
    whatsapp: "905363296726",
  },
  {
    name: "Ömer Asaf Ertaş",
    role: "Genel Koordinatör",
    phone: "+90 551 656 96 93",
    tel: "+905516569693",
    whatsapp: "905516569693",
  },
] as const;

export const practicalNotes = [
  {
    title: "Süre",
    text: "Etkinlik 14, 15 ve 16 Kasım 2026 tarihlerinde toplam 3 gün sürecektir.",
  },
  {
    title: "Yer",
    text: "Pendik İTO Şehit Ahmet Aslanhan Anadolu İmam Hatip Lisesinde gerçekleştirilecektir.",
  },
  {
    title: "Kıyafet",
    text: "Kıyafet kuralları vardır. Ayrıntılar süreç içinde paylaşılacaktır.",
  },
  {
    title: "Sertifika",
    text: "Etkinliğin sonunda katılım sertifikası verilecektir.",
  },
  {
    title: "Ücret",
    text: "Delege katılım ücreti 800₺.",
  },
  {
    title: "Konaklama",
    text: "Konaklama imkânı mevcuttur.",
  },
] as const;

export const whatsappQuestions = [
  "Etkinlik ne zaman ve nerede yapılacak?",
  "Katılım ücreti ne kadar?",
  "Konaklama imkânı var mı?",
  "Kıyafet kuralı var mı?",
  "Katılım sertifikası veriliyor mu?",
  "Bireysel başvuru nasıl yapılır?",
  "Delegasyon olarak nasıl başvururuz?",
  "Başvuru için son tarih nedir?",
] as const;

export function whatsAppHref(phone: string, text: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const communityJoinMessage =
  "Merhaba, GENTA Meclisi WhatsApp grubuna ve topluluğuna katılmak istiyorum.";

export const communityJoinHref = whatsAppHref(coordinators[0].whatsapp, communityJoinMessage);

export const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/komisyonlar", label: "Komisyonlar" },
  { href: "/basvuru", label: "Başvuru" },
  { href: "/sponsorlar", label: "Sponsorlar" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/basvuru/durum", label: "Sorgulama" },
] as const;
