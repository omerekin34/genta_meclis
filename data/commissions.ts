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
] as const;

export type IconName = (typeof iconNames)[number];

export type CommissionMedia = {
  id: string;
  kind: "image" | "video";
  caption: string;
  src?: string;
};

export type Commission = {
  slug: string;
  name: string;
  fullName: string;
  summary: string;
  description: string;
  agenda: string[];
  icon: IconName;
  media: CommissionMedia[];
};

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
    slug: "tbmm",
    name: "TBMM Genel Kurulu",
    fullName: "Türkiye Büyük Millet Meclisi Genel Kurul Simülasyonu",
    summary: "Komisyon metinlerinin görüşüldüğü, düzeltildiği ve oylandığı nihai kürsü.",
    description:
      "Genel kurul, komisyonlardan gelen metinlerin bütün meclise açıldığı yerdir. Delegeler söz alır, önerge verir ve oturumun usulüne göre oy kullanır. Bu komisyon, meclis ritminin tamamını görmek isteyen katılımcılar içindir.",
    agenda: [
      "Genel kurul içtüzüğü ve söz alma düzeni",
      "Komisyon raporlarının okunması ve düzeltilmesi",
      "Gençlik politikalarında öncelik sırası üzerine kapanış oylaması",
    ],
    icon: "parliament",
    media: media("tbmm"),
  },
  {
    slug: "saglik",
    name: "Sağlık Komisyonu",
    fullName: "Sağlık, Aile, Çalışma ve Sosyal İşler Komisyonu",
    summary: "Koruyucu sağlık, gençlik ruh sağlığı ve sosyal politika başlıklarını çalışır.",
    description:
      "Sağlık komisyonu, gençlerin doğrudan etkilendiği sağlık ve sosyal politika başlıklarında çözüm metni hazırlar. Tartışma, hizmete erişim, okul sağlığı ve istihdama geçiş etrafında yürür.",
    agenda: [
      "Okullarda koruyucu sağlık hizmetleri",
      "Gençlerin ruh sağlığı desteğine erişimi",
      "Eğitimden istihdama geçişte sosyal politika",
    ],
    icon: "health",
    media: media("saglik"),
  },
  {
    slug: "adalet",
    name: "Adalet Komisyonu",
    fullName: "Adalet Komisyonu",
    summary: "Hukuka erişim, hak arama kültürü ve gençlerin adaletle ilişkisi.",
    description:
      "Adalet komisyonu, hukukun gündelik hayattaki karşılığını konuşur. Amaç, cezalandırma ayrıntısı üretmek değil; hak arama yollarını, adli yardıma erişimi ve uzlaşı usullerini anlamaktır.",
    agenda: [
      "Gençlerin adli yardıma erişimi",
      "Okullarda hak okuryazarlığı",
      "Uyuşmazlıklarda arabuluculuk ve uzlaşı",
    ],
    icon: "justice",
    media: media("adalet"),
  },
  {
    slug: "milli-egitim",
    name: "Millî Eğitim Komisyonu",
    fullName: "Millî Eğitim, Kültür, Gençlik ve Spor Komisyonu",
    summary: "Eğitimde fırsat eşitliği, kültür politikaları ve gençlik programları.",
    description:
      "Millî Eğitim komisyonu, okulun yalnızca ders değil bir kamusal alan olduğu kabulüyle çalışır. Müfredatta tartışma kültürü, kültürel mirasa erişim ve okul sporları gündemin omurgasıdır.",
    agenda: [
      "Müfredatta müzakere ve tartışma kültürü",
      "Kültürel mirasa eşit erişim",
      "Okul sporları ve gençlik programları",
    ],
    icon: "education",
    media: media("egitim"),
  },
  {
    slug: "milli-savunma",
    name: "Millî Savunma Komisyonu",
    fullName: "Millî Savunma Komisyonu",
    summary: "Savunma politikalarının sivil denetimi ve güvenlik okuryazarlığı.",
    description:
      "Bu komisyon bir harekât masası değildir. Gençler, savunma ve güvenlik politikalarının demokratik denetimini, şeffaflığı ve afetlerde sivil savunma bilincini sivil bir dille tartışır.",
    agenda: [
      "Güvenlik politikalarında demokratik denetim ve şeffaflık",
      "Afetlerde sivil savunma bilinci",
      "Gençlerin kamu güvenliği tartışmasındaki yeri",
    ],
    icon: "defense",
    media: media("savunma"),
  },
  {
    slug: "disisleri",
    name: "Dışişleri Komisyonu",
    fullName: "Dışişleri Komisyonu",
    summary: "Diplomasi, kamu diplomasisi ve çok taraflı ilişkiler.",
    description:
      "Dışişleri komisyonu, uluslararası gündemi gençlerin sözüne açar. Müzakere burada bir protokol ezberi değil, karşı tarafı anlayarak konum almaktır.",
    agenda: [
      "Gençlik diplomasisi ve değişim programları",
      "İklim müzakerelerinde ortak sorumluluk",
      "Kültürel diplomasi ve uluslararası temsil",
    ],
    icon: "diplomacy",
    media: media("disisleri"),
  },
  {
    slug: "icisleri",
    name: "İçişleri Komisyonu",
    fullName: "İçişleri Komisyonu",
    summary: "Yerel yönetimler, afet koordinasyonu ve güvenli kentler.",
    description:
      "İçişleri komisyonu, kentin gündelik işleyişini ve vatandaş katılımını ele alır. Tartışma, gençlik alanları, afet yönetimi ve yerel karar süreçlerine katılım üzerinde durur.",
    agenda: [
      "Afet yönetiminde yerel koordinasyon",
      "Güvenli kentler ve gençlik mekânları",
      "Yerel kararlara vatandaş katılımı",
    ],
    icon: "interior",
    media: media("icisleri"),
  },
  {
    slug: "diyanet",
    name: "Diyanet İşleri Komisyonu",
    fullName: "Diyanet İşleri Komisyonu",
    summary: "Din hizmetleri, toplumsal dayanışma ve birlikte yaşama.",
    description:
      "Diyanet komisyonu, inanç hizmetleri ile toplumsal dayanışmayı aynı ciddiyetle konuşur. Çerçeve; gençlere yönelik manevi danışmanlık, yardımlaşma ve farklı inançlara saygıdır.",
    agenda: [
      "Gençlere yönelik manevi danışmanlık",
      "Toplumsal dayanışma ve yardımlaşma",
      "İnanç özgürlüğü ve birlikte yaşama",
    ],
    icon: "faith",
    media: media("diyanet"),
  },
  {
    slug: "plan-butce",
    name: "Plan ve Bütçe Komisyonu",
    fullName: "Plan ve Bütçe Komisyonu",
    summary: "Kamu kaynaklarının önceliği ve gençlik harcamalarının görünürlüğü.",
    description:
      "Plan ve Bütçe, bir temenniyi kaleme değil kaynağa bağlar. Komisyon, eğitim ve gençlik başlıklarının bütçede nasıl göründüğünü, önceliğin nasıl kurulduğunu ve harcamanın nasıl anlatıldığını tartışır.",
    agenda: [
      "Gençlik ve eğitim harcamalarında öncelik",
      "Kaynakların şeffaf anlatımı",
      "Yerel gençlik programlarının finansmanı",
    ],
    icon: "budget",
    media: media("butce"),
  },
];

export function getCommission(slug: string) {
  return commissions.find((item) => item.slug === slug);
}
