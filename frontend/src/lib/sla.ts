export interface PartyInfo {
  signatoryName: string;
  title: string;
  company: string;
  noticeAddress: string;
}

export interface SlaFormData {
  targetUptime: string;
  subscriptionPeriod: string;
  supportChannel: string;
  targetResponseTime: string;
  scheduledDowntime: string;
  uptimeCredit: string;
  responseTimeCredit: string;
  provider: PartyInfo;
  customer: PartyInfo;
}

export function makeDefaultFormData(): SlaFormData {
  return {
    targetUptime: "",
    subscriptionPeriod: "",
    supportChannel: "",
    targetResponseTime: "",
    scheduledDowntime: "",
    uptimeCredit: "",
    responseTimeCredit: "",
    provider: { signatoryName: "", title: "", company: "", noticeAddress: "" },
    customer: { signatoryName: "", title: "", company: "", noticeAddress: "" },
  };
}
