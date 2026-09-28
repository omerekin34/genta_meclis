export const applicationStatuses = ["yeni", "incelendi", "kabul", "red"] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ApplicationKind = "bireysel" | "delegasyon";

type Shared = {
  id: string;
  created_at: string;
  status: ApplicationStatus;
  full_name: string;
  national_id: string;
  school: string;
  grade: string;
  phone: string;
  email: string;
  experience: string;
  motivation: string;
  commission_1: string;
  commission_2: string;
  commission_3: string;
  commission_reason: string;
  accept_reassignment: boolean;
  accept_media: boolean;
};

export type DelegateMember = {
  slot: number;
  full_name: string;
  national_id: string;
  email: string;
  school: string;
  grade: string;
  experience: string;
  commission_1: string;
  commission_2: string;
  commission_3: string;
};

export type IndividualApplication = Shared & {
  kind: "bireysel";
  participation: string;
};

export type DelegationApplication = Shared & {
  kind: "delegasyon";
  other_delegates: string;
  delegates: DelegateMember[];
};

export type ApplicationRecord = IndividualApplication | DelegationApplication;
