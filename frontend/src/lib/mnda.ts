export type MndaTerm =
  | { type: "expires"; years: number }
  | { type: "until_terminated" };

export type ConfidentialityTerm =
  | { type: "years"; years: number }
  | { type: "perpetuity" };

export interface PartyInfo {
  signatoryName: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
}

export interface MndaFormData {
  purpose: string;
  effectiveDate: string;
  mndaTerm: MndaTerm;
  confidentialityTerm: ConfidentialityTerm;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyInfo;
  party2: PartyInfo;
}

const baseFormData: Omit<MndaFormData, "effectiveDate"> = {
  purpose: "相手方との事業関係を締結するかどうかの評価",
  mndaTerm: { type: "expires", years: 1 },
  confidentialityTerm: { type: "years", years: 1 },
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { signatoryName: "", title: "", company: "", noticeAddress: "", date: "" },
  party2: { signatoryName: "", title: "", company: "", noticeAddress: "", date: "" },
};

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function makeDefaultFormData(): MndaFormData {
  return { ...baseFormData, effectiveDate: todayISO() };
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}
