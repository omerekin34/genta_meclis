import agendas from "./agendas.json";

export const iconNames = [
  "parliament",
  "health",
  "justice",
  "education",
  "defense",
  "diplomacy",
  "interior",
  "faith",
  "budget",
  "constitution",
  "turkic",
] as const;

export type IconName = (typeof iconNames)[number];

export type CommissionMedia = {
  id: string;
  kind: "image" | "video";
  caption: string;
  src?: string;
};

export type AgendaItem = {
  id: string;
  title: string;
  text: string;
};

export type BureauMember = {
  id: string;
  name: string;
  role: string;
  photo?: string;
};

export type Commission = {
  slug: string;
  name: string;
  fullName: string;
  summary: string;
  description: string;
  agenda: AgendaItem[];
  icon: IconName;
  media: CommissionMedia[];
  logoSrc?: string;
  bureau?: BureauMember[];
};

export function placeholderBureau(slug: string): BureauMember[] {
  return [
    { id: `${slug}-divan-baskan`, name: "Ad Soyad", role: "Komisyon Başkanı" },
    { id: `${slug}-divan-vekil`, name: "Ad Soyad", role: "Başkan Vekili" },
    { id: `${slug}-divan-sozcu`, name: "Ad Soyad", role: "Sözcü" },
  ];
}

export function commissionBureau(commission: Pick<Commission, "slug" | "bureau">): BureauMember[] {
  const stored = (commission.bureau ?? []).filter((member) => member.name.trim() || member.role.trim());
  return stored.length > 0 ? stored : placeholderBureau(commission.slug);
}

export function commissionLogoSrc(commission: Pick<Commission, "slug" | "logoSrc">) {
  return commission.logoSrc?.trim() || `/logos/${commission.slug}.jpg`;
}

function agenda(slug: keyof typeof agendas): AgendaItem[] {
  return agendas[slug].map((item, index) => ({ id: `${slug}-gundem-${index + 1}`, ...item }));
}

function media(prefix: string): CommissionMedia[] {
  return [
    { id: `${prefix}-1`, kind: "image", caption: "Açılış karesi" },
    { id: `${prefix}-2`, kind: "image", caption: "Komisyon masası" },
    { id: `${prefix}-3`, kind: "image", caption: "Söz alma anı" },
    { id: `${prefix}-4`, kind: "image", caption: "Kapanış karesi" },
    { id: `${prefix}-5`, kind: "video", caption: "Oturum kaydı" },
    { id: `${prefix}-6`, kind: "video", caption: "Kısa değerlendirme" },
  ];
}

export const commissions: Commission[] = [
  {
    slug: "anayasa",
    name: "Anayasa Komisyonu",
    fullName: "Anayasa Komisyonu",
    summary: "Temel hak ve özgürlükler ile devlet düzeninin anayasal çerçevesi.",
    description:
      "Anayasa Komisyonu, bütün yasaların dayandığı metni masaya yatırır. Delegeler temel hakları, kuvvetler ayrılığını ve anayasa değişikliğinin usulünü tartışır, önerilerini gerekçesiyle birlikte yazıya döker.",
    agenda: agenda("anayasa"),
    icon: "constitution",
    media: media("anayasa"),
    bureau: placeholderBureau("anayasa"),
  },
  {
    slug: "saglik",
    name: "Sağlık Komisyonu",
    fullName: "Sağlık, Aile, Çalışma ve Sosyal İşler Komisyonu",
    summary: "Koruyucu sağlık, gençlik ruh sağlığı ve sosyal politika başlıklarını çalışır.",
    description:
      "Sağlık komisyonu, gençlerin doğrudan etkilendiği sağlık ve sosyal politika başlıklarında çözüm metni hazırlar. Tartışma, hizmete erişim, okul sağlığı ve istihdama geçiş etrafında yürür.",
    agenda: agenda("saglik"),
    icon: "health",
    media: media("saglik"),
    bureau: placeholderBureau("saglik"),
  },
  {
    slug: "adalet",
    name: "Adalet Komisyonu",
    fullName: "Adalet Komisyonu",
    summary: "Hukuka erişim, hak arama kültürü ve gençlerin adaletle ilişkisi.",
    description:
      "Adalet komisyonu, hukukun gündelik hayattaki karşılığını konuşur. Amaç, cezalandırma ayrıntısı üretmek değil; hak arama yollarını, adli yardıma erişimi ve uzlaşı usullerini anlamaktır.",
    agenda: agenda("adalet"),
    icon: "justice",
    media: media("adalet"),
    bureau: placeholderBureau("adalet"),
  },
  {
    slug: "milli-egitim",
    name: "Millî Eğitim Komisyonu",
    fullName: "Millî Eğitim, Kültür, Gençlik ve Spor Komisyonu",
    summary: "Eğitimde fırsat eşitliği, kültür politikaları ve gençlik programları.",
    description:
      "Millî Eğitim komisyonu, okulun yalnızca ders değil bir kamusal alan olduğu kabulüyle çalışır. Müfredatta tartışma kültürü, kültürel mirasa erişim ve okul sporları gündemin omurgasıdır.",
    agenda: agenda("milli-egitim"),
    icon: "education",
    media: media("egitim"),
    bureau: placeholderBureau("milli-egitim"),
  },
  {
    slug: "milli-savunma",
    name: "Millî Savunma Komisyonu",
    fullName: "Millî Savunma Komisyonu",
    summary: "Savunma politikalarının sivil denetimi ve güvenlik okuryazarlığı.",
    description:
      "Bu komisyon bir harekât masası değildir. Gençler, savunma ve güvenlik politikalarının demokratik denetimini, şeffaflığı ve afetlerde sivil savunma bilincini sivil bir dille tartışır.",
    agenda: agenda("milli-savunma"),
    icon: "defense",
    media: media("savunma"),
    bureau: placeholderBureau("milli-savunma"),
  },
  {
    slug: "disisleri",
    name: "Dışişleri Komisyonu",
    fullName: "Dışişleri Komisyonu",
    summary: "Diplomasi, kamu diplomasisi ve çok taraflı ilişkiler.",
    description:
      "Dışişleri komisyonu, uluslararası gündemi gençlerin sözüne açar. Müzakere burada bir protokol ezberi değil, karşı tarafı anlayarak konum almaktır.",
    agenda: agenda("disisleri"),
    icon: "diplomacy",
    media: media("disisleri"),
    bureau: placeholderBureau("disisleri"),
  },
  {
    slug: "icisleri",
    name: "İçişleri Komisyonu",
    fullName: "İçişleri Komisyonu",
    summary: "Yerel yönetimler, afet koordinasyonu ve güvenli kentler.",
    description:
      "İçişleri komisyonu, kentin gündelik işleyişini ve vatandaş katılımını ele alır. Tartışma, gençlik alanları, afet yönetimi ve yerel karar süreçlerine katılım üzerinde durur.",
    agenda: agenda("icisleri"),
    icon: "interior",
    media: media("icisleri"),
    bureau: placeholderBureau("icisleri"),
  },
  {
    slug: "diyanet",
    name: "Diyanet İşleri Komisyonu",
    fullName: "Diyanet İşleri Komisyonu",
    summary: "Din hizmetleri, toplumsal dayanışma ve birlikte yaşama.",
    description:
      "Diyanet komisyonu, inanç hizmetleri ile toplumsal dayanışmayı aynı ciddiyetle konuşur. Çerçeve; gençlere yönelik manevi danışmanlık, yardımlaşma ve farklı inançlara saygıdır.",
    agenda: agenda("diyanet"),
    icon: "faith",
    media: media("diyanet"),
    bureau: placeholderBureau("diyanet"),
  },
  {
    slug: "turk-devletleri",
    name: "Türk Devletleri Komisyonu",
    fullName: "Türk Devletleri Komisyonu",
    summary: "Türk devletleri arasında eğitim, kültür ve ekonomi alanında iş birliği.",
    description:
      "Türk Devletleri Komisyonu, ortak tarih ve dil bağından doğan iş birliğini ele alır. Delegeler gençlik hareketliliğini, eğitim ve kültür alanındaki ortak çalışmaları ve ekonomik bağları tartışır.",
    agenda: agenda("turk-devletleri"),
    icon: "turkic",
    media: media("turk-devletleri"),
    bureau: placeholderBureau("turk-devletleri"),
  },
];

export function getCommission(slug: string) {
  return commissions.find((item) => item.slug === slug);
}
