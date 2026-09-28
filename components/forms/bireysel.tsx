"use client";

import { isEmail } from "./fields";
import { SchoolPicker } from "./SchoolPicker";
import {
  Essay,
  GradePills,
  Question,
  RankedCommissions,
  isLocalPhone,
  isNationalId,
  lineClass,
  requireRanking,
  requireWords,
  required,
  wordCount,
} from "./form-ui";

export type Individual = {
  fullName: string;
  nationalId: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
  motivation: string;
  experience: string;
  commission1: string;
  commission2: string;
  commission3: string;
  commissionReason: string;
  participation: string;
  acceptReassignment: boolean;
  acceptMedia: boolean;
};

export const emptyIndividual: Individual = {
  fullName: "",
  nationalId: "",
  school: "",
  grade: "",
  phone: "",
  email: "",
  motivation: "",
  experience: "",
  commission1: "",
  commission2: "",
  commission3: "",
  commissionReason: "",
  participation: "",
  acceptReassignment: false,
  acceptMedia: false,
};

export function IndividualFields({
  value,
  errors,
  onChange,
}: {
  value: Individual;
  errors: Record<string, string>;
  onChange: <K extends keyof Individual>(key: K, next: Individual[K]) => void;
}) {
  return (
    <>
      <Question label="Ad-Soyad" required error={errors.fullName}>
        <input
          className={lineClass}
          value={value.fullName}
          placeholder="Yanıtınız"
          autoComplete="name"
          onChange={(event) => onChange("fullName", event.target.value)}
        />
      </Question>
      <Question label="T.C. Kimlik Numarası" required error={errors.nationalId}>
        <input
          className={lineClass}
          value={value.nationalId}
          placeholder="Yanıtınız"
          inputMode="numeric"
          autoComplete="off"
          onChange={(event) => onChange("nationalId", event.target.value)}
        />
      </Question>
      <Question
        label="Okul Adı"
        required
        hint="İstanbul’daki liselerden seçin. Okulunuz listede yoksa adını yazıp “Bu adı kullan” deyin."
        error={errors.school}
      >
        <SchoolPicker value={value.school} onChange={(next) => onChange("school", next)} />
      </Question>
      <Question label="Sınıf Düzeyi" required error={errors.grade}>
        <GradePills value={value.grade} onChange={(next) => onChange("grade", next)} />
      </Question>
      <Question
        label="Telefon Numarası"
        required
        hint="(Başına sıfır koyarak yazınız) örn. 0542 XXX XX XX"
        error={errors.phone}
      >
        <input
          className={lineClass}
          type="tel"
          value={value.phone}
          placeholder="Yanıtınız"
          autoComplete="tel"
          onChange={(event) => onChange("phone", event.target.value)}
        />
      </Question>
      <Question label="Mail Adresi" required error={errors.email}>
        <input
          className={lineClass}
          type="email"
          value={value.email}
          placeholder="Yanıtınız"
          autoComplete="email"
          onChange={(event) => onChange("email", event.target.value)}
        />
      </Question>
      <Question
        label="Meclisimize katılma motivasyonunuz nedir?"
        required
        hint="En az 100 kelime ile açıklayınız."
        error={errors.motivation}
      >
        <Essay value={value.motivation} minimum={100} onChange={(next) => onChange("motivation", next)} />
      </Question>
      <Question
        label="Daha önceki deneyimleriniz nelerdir? Yoksa boş bırakınız."
        hint="En az 100 kelime ile açıklayınız."
        error={errors.experience}
      >
        <Essay value={value.experience} minimum={100} onChange={(next) => onChange("experience", next)} />
      </Question>
      <Question
        label="Komisyon tercihleri"
        required
        hint="Sırayla üç komisyon seçin. İlk dokunduğunuz 1. tercih olur. Seçili olana tekrar dokunursanız kalkar."
        error={errors.commission1}
      >
        <RankedCommissions
          values={[value.commission1, value.commission2, value.commission3]}
          onChange={([first, second, third]) => {
            onChange("commission1", first);
            onChange("commission2", second);
            onChange("commission3", third);
          }}
        />
      </Question>
      <Question
        label="Komisyon tercihlerinizin bu yönde olmasının nedeni nedir?"
        required
        hint="En az 100 kelime ile açıklayınız."
        error={errors.commissionReason}
      >
        <Essay value={value.commissionReason} minimum={100} onChange={(next) => onChange("commissionReason", next)} />
      </Question>
      <Question
        label="Günümüzde gençlerin ülke yönetimine ve karar alma süreçlerine daha fazla katılması için nasıl bir sistem oluşturulabilir?"
        required
        hint="En az 50 kelime ile açıklayınız."
        error={errors.participation}
      >
        <Essay value={value.participation} minimum={50} onChange={(next) => onChange("participation", next)} />
      </Question>
      <Question
        label="İhtiyaç duyulması halinde kendi komite tercihlerim yerine proje koordinatör ekibi tarafından komisyonumda değişiklik yapılabileceğini kabul ediyorum."
        required
        error={errors.acceptReassignment}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input
            type="checkbox"
            className="size-4 accent-brand"
            checked={value.acceptReassignment}
            onChange={(event) => onChange("acceptReassignment", event.target.checked)}
          />
          Kabul Ediyorum.
        </label>
      </Question>
      <Question
        label="Etkinlik boyunca kayda alınacak fotoğraf, video ve benzeri kayıtlarımın sosyal medya hesaplarında paylaşılmasına izin veriyorum."
        required
        error={errors.acceptMedia}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input
            type="checkbox"
            className="size-4 accent-brand"
            checked={value.acceptMedia}
            onChange={(event) => onChange("acceptMedia", event.target.checked)}
          />
          Kabul Ediyorum
        </label>
      </Question>
    </>
  );
}

export function validateIndividual(value: Individual) {
  const errors: Record<string, string> = {};
  required(value.fullName, errors, "fullName");
  required(value.school, errors, "school");
  required(value.grade, errors, "grade");
  if (!isNationalId(value.nationalId)) errors.nationalId = "11 haneli T.C. kimlik numaranızı yazın.";
  if (!isLocalPhone(value.phone)) errors.phone = "Numarayı başına 0 koyarak, 11 hane olarak yazın.";
  if (!isEmail(value.email)) errors.email = "Geçerli bir e-posta adresi yazın.";
  requireWords(value.motivation, 100, errors, "motivation");
  if (wordCount(value.experience) > 0 && wordCount(value.experience) < 100) {
    errors.experience = `Deneyim yazacaksanız en az 100 kelime yazın. Şu an ${wordCount(value.experience)} kelime. Boş da bırakabilirsiniz.`;
  }
  requireRanking([value.commission1, value.commission2, value.commission3], errors, "commission1");
  requireWords(value.commissionReason, 100, errors, "commissionReason");
  requireWords(value.participation, 50, errors, "participation");
  if (!value.acceptReassignment) errors.acceptReassignment = "Devam etmek için kabul etmeniz gerekir.";
  if (!value.acceptMedia) errors.acceptMedia = "Devam etmek için izin vermeniz gerekir.";
  return errors;
}
