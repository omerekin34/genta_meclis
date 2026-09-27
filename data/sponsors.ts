export const sponsorMarks = [
  "laurel",
  "columns",
  "ring",
  "quill",
  "bridge",
  "diamond",
] as const;

export type SponsorMark = (typeof sponsorMarks)[number];

export type Sponsor = {
  id: string;
  name: string;
  note: string;
  mark: SponsorMark;
  logoSrc?: string;
};

export const sponsors: Sponsor[] = [
  {
    id: "ana",
    name: "Ana Sponsor",
    note: "Meclisin çatısını taşıyan kurum.",
    mark: "laurel",
  },
  {
    id: "destekci",
    name: "Resmi Destekçi",
    note: "Programın kurumsal paydaşı.",
    mark: "columns",
  },
  {
    id: "egitim",
    name: "Eğitim Paydaşı",
    note: "Okul ve öğrenim desteği.",
    mark: "quill",
  },
  {
    id: "medya",
    name: "Medya Sponsoru",
    note: "Duyuru ve yayın desteği.",
    mark: "ring",
  },
  {
    id: "konaklama",
    name: "Konaklama Sponsoru",
    note: "Misafir delegasyonların ev sahibi.",
    mark: "bridge",
  },
  {
    id: "ikram",
    name: "İkram Sponsoru",
    note: "Oturum sofrasının destekçisi.",
    mark: "diamond",
  },
];
