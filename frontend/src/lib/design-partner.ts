export interface PartyInfo {
  signatoryName: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface DesignPartnerFormData {
  effectiveDate: string;
  term: string;
  fees: string;
  product: string;
  governingLaw: string;
  chosenCourts: string;
  provider: PartyInfo;
  partner: PartyInfo;
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function makeDefaultFormData(): DesignPartnerFormData {
  return {
    effectiveDate: todayISO(),
    term: "",
    fees: "",
    product: "",
    governingLaw: "",
    chosenCourts: "",
    provider: { signatoryName: "", title: "", company: "", noticeAddress: "" },
    partner: { signatoryName: "", title: "", company: "", noticeAddress: "" },
  };
}
