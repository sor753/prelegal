"use client";

import { DesignPartnerFormData } from "@/lib/design-partner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: DesignPartnerFormData;
  onChange: (data: DesignPartnerFormData) => void;
}

function PartySection({
  label,
  idPrefix,
  party,
  onUpdate,
}: {
  label: string;
  idPrefix: string;
  party: DesignPartnerFormData["provider"];
  onUpdate: (party: DesignPartnerFormData["provider"]) => void;
}) {
  const set = (field: keyof typeof party) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onUpdate({ ...party, [field]: e.target.value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-name`}>署名者氏名</Label>
          <Input id={`${idPrefix}-name`} value={party.signatoryName} onChange={set("signatoryName")} placeholder="山田 太郎" />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-title`}>役職</Label>
          <Input id={`${idPrefix}-title`} value={party.title} onChange={set("title")} placeholder="代表取締役" />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-company`}>会社</Label>
          <Input id={`${idPrefix}-company`} value={party.company} onChange={set("company")} placeholder="株式会社〇〇" />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-address`}>通知先（メールまたは郵便住所）</Label>
          <Textarea id={`${idPrefix}-address`} value={party.noticeAddress} onChange={set("noticeAddress")} placeholder="example@company.com" rows={2} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DesignPartnerForm({ data, onChange }: Props) {
  const setField =
    (field: keyof Pick<DesignPartnerFormData, "effectiveDate" | "term" | "fees" | "product" | "governingLaw" | "chosenCourts">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="effectiveDate">発効日</Label>
            <Input id="effectiveDate" type="date" value={data.effectiveDate} onChange={setField("effectiveDate")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="term">契約期間</Label>
            <Input id="term" value={data.term} onChange={setField("term")} placeholder="例: 6ヶ月" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="fees">料金</Label>
            <Input id="fees" value={data.fees} onChange={setField("fees")} placeholder="例: なし、月額50,000円" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="product">製品・サービス名</Label>
            <Input id="product" value={data.product} onChange={setField("product")} placeholder="製品名を入力" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">準拠法および選択裁判所</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="governingLaw">準拠法（都道府県または国）</Label>
            <Input id="governingLaw" value={data.governingLaw} onChange={setField("governingLaw")} placeholder="東京都" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="chosenCourts">選択裁判所</Label>
            <Input id="chosenCourts" value={data.chosenCourts} onChange={setField("chosenCourts")} placeholder="東京地方裁判所" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <PartySection
        label="プロバイダー"
        idPrefix="provider"
        party={data.provider}
        onUpdate={(p) => onChange({ ...data, provider: p })}
      />
      <PartySection
        label="パートナー"
        idPrefix="partner"
        party={data.partner}
        onUpdate={(p) => onChange({ ...data, partner: p })}
      />
    </div>
  );
}
