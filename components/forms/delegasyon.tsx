"use client";

import { isEmail } from "./fields";
import { SchoolPicker } from "./SchoolPicker";
import {
  Essay,
  GradePills,
  MiniField,
  Question,
  RankedCommissions,
  isLocalPhone,
  isNationalId,
  lineClass,
  requireRanking,
  requireWords,
  required,
} from "./form-ui";

export type DelegateSlot = {
  fullName: string;
  nationalId: string;
  email: string;
  grade: string;
  school: string;
  experience: string;
  commission1: string;
  commission2: string;
  commission3: string;
};

export type Delegation = {
  fullName: string;
  nationalId: string;
  school: string;
  experience: string;
  grade: string;
  phone: string;
  email: string;
  delegates: [DelegateSlot, DelegateSlot, DelegateSlot, DelegateSlot, DelegateSlot];
  otherDelegates: string;
  motivation: string;
  commission1: string;
  commission2: string;
  commission3: string;
  commissionReason: string;
  acceptReassignment: boolean;
  acceptMedia: boolean;
};

function emptyDelegate(): DelegateSlot {
  return {
    fullName: "",
    nationalId: "",
    email: "",
    grade: "",
    school: "",
    experience: "",
    commission1: "",
    commission2: "",
    commission3: "",
  };
}

export function createDelegation(commission1 = ""): Delegation {
  return {
    fullName: "",
    nationalId: "",
    school: "",
    experience: "",
    grade: "",
    phone: "",
    email: "",
    delegates: [emptyDelegate(), emptyDelegate(), emptyDelegate(), emptyDelegate(), emptyDelegate()],
    otherDelegates: "",
    motivation: "",
    commission1,
    commission2: "",
    commission3: "",
    commissionReason: "",
    acceptReassignment: false,
    acceptMedia: false,
  };
}

export function DelegationFields({
  value,
  errors,
  onChange,
  onDelegate,
}: {
  value: Delegation;
  errors: Record<string, string>;
  onChange: <K extends keyof Delegation>(key: K, next: Delegation[K]) => void;
  onDelegate: (index: number, patch: Partial<DelegateSlot>) => void;
}) {
  return (
    <>
      <Question label="Baş Delege Ad-Soyad" required error={errors.fullName}>
        <input className={lineClass} value={value.fullName} placeholder="Yanıtınız" autoComplete="name" onChange={(event) => onChange("fullName", event.target.value)} />
      </Question>
      <Question label="Baş Delege T.C. Kimlik Numarası" required error={errors.nationalId}>
        <input className={lineClass} value={value.nationalId} placeholder="Yanıtınız" inputMode="numeric" autoComplete="off" onChange={(event) => onChange("nationalId", event.target.value)} />
      </Question>
      <Question
        label="Baş Delege Okul Adı"
        required
        hint="İstanbul’daki liselerden seçin. Okulunuz listede yoksa adını yazıp “Bu adı kullan” deyin."
        error={errors.school}
      >
        <SchoolPicker value={value.school} onChange={(next) => onChange("school", next)} />
      </Question>
      <Question label="Baş Delege Deneyimleri" hint="Daha önceden varsa katıldığınız etkinlikler.">
        <textarea className={`${lineClass} min-h-16 resize-y`} value={value.experience} placeholder="Yanıtınız" onChange={(event) => onChange("experience", event.target.value)} />
      </Question>
      <Question label="Baş Delege Sınıf Düzeyi" required error={errors.grade}>
        <GradePills value={value.grade} onChange={(next) => onChange("grade", next)} />
      </Question>
      <Question label="Baş Delege Telefon Numarası" required hint="(Başına sıfır koyarak yazınız) örn. 0542 XXX XX XX" error={errors.phone}>
        <input className={lineClass} type="tel" value={value.phone} placeholder="Yanıtınız" autoComplete="tel" onChange={(event) => onChange("phone", event.target.value)} />
      </Question>
      <Question label="Baş Delege Mail Adresi" required error={errors.email}>
        <input className={lineClass} type="email" value={value.email} placeholder="Yanıtınız" autoComplete="email" onChange={(event) => onChange("email", event.target.value)} />
      </Question>
      {value.delegates.map((delegate, index) => (
        <DelegateCard key={index} index={index} value={delegate} errors={errors} onChange={(patch) => onDelegate(index, patch)} />
      ))}
      <Question
        label="Diğer Delegelerin Bilgileri"
        hint="(Delegasyon 5 kişiden fazla ise kalan delegelerin bilgilerini burada doldurunuz.)"
      >
        <textarea className={`${lineClass} min-h-20 resize-y`} value={value.otherDelegates} placeholder="Yanıtınız" onChange={(event) => onChange("otherDelegates", event.target.value)} />
      </Question>
      <Question label="Meclisimize katılma motivasyonunuz nedir?" required hint="En az 100 kelime ile açıklayınız." error={errors.motivation}>
        <Essay value={value.motivation} minimum={100} onChange={(next) => onChange("motivation", next)} />
      </Question>
      <Question
        label="Baş Delege komisyon tercihleri"
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
      <Question label="Komisyon tercihlerinizin bu yönde olmasının nedeni nedir?" required hint="En az 100 kelime ile açıklayınız." error={errors.commissionReason}>
        <Essay value={value.commissionReason} minimum={100} onChange={(next) => onChange("commissionReason", next)} />
      </Question>
      <Question
        label="İhtiyaç duyulması halinde kendi komite tercihlerim yerine proje koordinatör ekibi tarafından komisyonumda değişiklik yapılabileceğini kabul ediyorum."
        required
        error={errors.acceptReassignment}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" className="size-4 accent-brand" checked={value.acceptReassignment} onChange={(event) => onChange("acceptReassignment", event.target.checked)} />
          Kabul Ediyorum.
        </label>
      </Question>
      <Question
        label="Etkinlik boyunca kayda alınacak fotoğraf, video ve benzeri kayıtlarımın sosyal medya hesaplarında paylaşılmasına izin veriyorum."
        required
        error={errors.acceptMedia}
      >
        <label className="flex cursor-pointer items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" className="size-4 accent-brand" checked={value.acceptMedia} onChange={(event) => onChange("acceptMedia", event.target.checked)} />
          Kabul Ediyorum
        </label>
      </Question>
    </>
  );
}

function DelegateCard({
  index,
  value,
  errors,
  onChange,
}: {
  index: number;
  value: DelegateSlot;
  errors: Record<string, string>;
  onChange: (patch: Partial<DelegateSlot>) => void;
}) {
  const key = `delegate${index}`;
  return (
    <Question
      label={`${index + 1}. Delege Bilgileri`}
      required
      hint="Ad-soyad, T.C., mail, sınıf, okulun tam adı, deneyim ve ilk üç komisyon tercihi."
      error={errors[`${key}.commissions`]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <MiniField label="Ad-Soyad" error={errors[`${key}.fullName`]}>
            <input className={lineClass} value={value.fullName} placeholder="Yanıtınız" onChange={(event) => onChange({ fullName: event.target.value })} />
          </MiniField>
          <MiniField label="T.C. Kimlik Numarası" error={errors[`${key}.nationalId`]}>
            <input className={lineClass} value={value.nationalId} placeholder="Yanıtınız" inputMode="numeric" onChange={(event) => onChange({ nationalId: event.target.value })} />
          </MiniField>
        </div>
        <MiniField label="Mail Adresi" error={errors[`${key}.email`]}>
          <input className={lineClass} type="email" value={value.email} placeholder="Yanıtınız" onChange={(event) => onChange({ email: event.target.value })} />
        </MiniField>
        <MiniField label="Okul" error={errors[`${key}.school`]}>
          <SchoolPicker value={value.school} onChange={(school) => onChange({ school })} />
        </MiniField>
        <MiniField label="Sınıf" error={errors[`${key}.grade`]}>
          <GradePills value={value.grade} onChange={(grade) => onChange({ grade })} />
        </MiniField>
        <MiniField label="Deneyimler">
          <input className={lineClass} value={value.experience} placeholder="Varsa yazın, yoksa boş bırakın" onChange={(event) => onChange({ experience: event.target.value })} />
        </MiniField>
        <MiniField label="İlk üç komisyon tercihi">
          <RankedCommissions
            values={[value.commission1, value.commission2, value.commission3]}
            onChange={([first, second, third]) => onChange({ commission1: first, commission2: second, commission3: third })}
          />
        </MiniField>
      </div>
    </Question>
  );
}

export function validateDelegation(value: Delegation) {
  const errors: Record<string, string> = {};
  required(value.fullName, errors, "fullName");
  required(value.school, errors, "school");
  required(value.grade, errors, "grade");
  if (!isNationalId(value.nationalId)) errors.nationalId = "11 haneli T.C. kimlik numaranızı yazın.";
  if (!isLocalPhone(value.phone)) errors.phone = "Numarayı başına 0 koyarak, 11 hane olarak yazın.";
  if (!isEmail(value.email)) errors.email = "Geçerli bir e-posta adresi yazın.";
  value.delegates.forEach((delegate, index) => validateDelegate(delegate, index, errors));
  requireWords(value.motivation, 100, errors, "motivation");
  requireRanking([value.commission1, value.commission2, value.commission3], errors, "commission1");
  requireWords(value.commissionReason, 100, errors, "commissionReason");
  if (!value.acceptReassignment) errors.acceptReassignment = "Devam etmek için kabul etmeniz gerekir.";
  if (!value.acceptMedia) errors.acceptMedia = "Devam etmek için izin vermeniz gerekir.";
  return errors;
}

function validateDelegate(value: DelegateSlot, index: number, errors: Record<string, string>) {
  const key = `delegate${index}`;
  if (!value.fullName.trim()) errors[`${key}.fullName`] = "Ad-soyad zorunludur.";
  if (!isNationalId(value.nationalId)) errors[`${key}.nationalId`] = "11 haneli T.C. kimlik numarası yazın.";
  if (!isEmail(value.email)) errors[`${key}.email`] = "Geçerli bir e-posta yazın.";
  if (!value.grade) errors[`${key}.grade`] = "Sınıf seçin.";
  if (!value.school.trim()) errors[`${key}.school`] = "Okulun tam adını yazın.";
  const chosen = [value.commission1, value.commission2, value.commission3].filter(Boolean);
  if (chosen.length < 3 || new Set(chosen).size < 3) errors[`${key}.commissions`] = "Üç farklı komisyon seçin.";
}
