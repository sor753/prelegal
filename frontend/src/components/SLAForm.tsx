"use client";

import { SlaFormData } from "@/lib/sla";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: SlaFormData;
  onChange: (data: SlaFormData) => void;
}

function PartySection({
  label,
  idPrefix,
  party,
  onUpdate,
}: {
  label: string;
  idPrefix: string;
  party: SlaFormData["provider"];
  onUpdate: (party: SlaFormData["provider"]) => void;
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

export default function SLAForm({ data, onChange }: Props) {
  const setField =
    (field: keyof Omit<SlaFormData, "provider" | "customer">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">稼働率</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="targetUptime">目標稼働率</Label>
            <Input id="targetUptime" value={data.targetUptime} onChange={setField("targetUptime")} placeholder="例: 99.9%" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subscriptionPeriod">サブスクリプション期間</Label>
            <Input id="subscriptionPeriod" value={data.subscriptionPeriod} onChange={setField("subscriptionPeriod")} placeholder="例: 1年間" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="scheduledDowntime">予定ダウンタイム</Label>
            <Input id="scheduledDowntime" value={data.scheduledDowntime} onChange={setField("scheduledDowntime")} placeholder="例: 毎週日曜日 2:00-4:00 JST" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">サポート</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="supportChannel">サポートチャンネル</Label>
            <Input id="supportChannel" value={data.supportChannel} onChange={setField("supportChannel")} placeholder="例: support@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="targetResponseTime">目標応答時間</Label>
            <Input id="targetResponseTime" value={data.targetResponseTime} onChange={setField("targetResponseTime")} placeholder="例: 4時間以内" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">サービスクレジット</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="uptimeCredit">稼働率クレジット</Label>
            <Input id="uptimeCredit" value={data.uptimeCredit} onChange={setField("uptimeCredit")} placeholder="例: 月額料金の10%" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="responseTimeCredit">応答時間クレジット</Label>
            <Input id="responseTimeCredit" value={data.responseTimeCredit} onChange={setField("responseTimeCredit")} placeholder="例: 月額料金の5%" />
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
        label="顧客"
        idPrefix="customer"
        party={data.customer}
        onUpdate={(p) => onChange({ ...data, customer: p })}
      />
    </div>
  );
}
