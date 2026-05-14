"use client";

import { MndaFormData } from "@/lib/mnda";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  data: MndaFormData;
  onChange: (data: MndaFormData) => void;
}

function PartySection({
  label,
  idPrefix,
  party,
  onUpdate,
}: {
  label: string;
  idPrefix: string;
  party: MndaFormData["party1"];
  onUpdate: (party: MndaFormData["party1"]) => void;
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
        <div className="space-y-1">
          <Label htmlFor={`${idPrefix}-date`}>日付</Label>
          <Input id={`${idPrefix}-date`} type="date" value={party.date} onChange={set("date")} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function MNDAForm({ data, onChange }: Props) {
  const set =
    <K extends keyof MndaFormData>(field: K) =>
    (value: MndaFormData[K]) =>
      onChange({ ...data, [field]: value });

  const onInputChange =
    (field: keyof Pick<MndaFormData, "purpose" | "governingLaw" | "jurisdiction" | "modifications">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="purpose">目的</Label>
            <p className="text-xs text-muted-foreground">機密情報の使用方法</p>
            <Textarea
              id="purpose"
              value={data.purpose}
              onChange={onInputChange("purpose")}
              placeholder="相手方との事業関係を締結するかどうかの評価"
              rows={2}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="effectiveDate">発効日</Label>
            <Input id="effectiveDate" type="date" value={data.effectiveDate} onChange={(e) => onChange({ ...data, effectiveDate: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* MNDA Term */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">MNDA期間</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">このMNDAの有効期間</p>
          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="sr-only">MNDA期間の選択</legend>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTerm"
                checked={data.mndaTerm.type === "expires"}
                onChange={() => set("mndaTerm")({ type: "expires", years: data.mndaTerm.type === "expires" ? data.mndaTerm.years : 1 })}
                className="accent-primary"
              />
              <span className="text-sm">発効日から</span>
              <Input
                type="number"
                min={1}
                aria-label="MNDA期間（年数）"
                value={data.mndaTerm.type === "expires" ? data.mndaTerm.years : 1}
                onChange={(e) => set("mndaTerm")({ type: "expires", years: Math.max(1, Number(e.target.value) || 1) })}
                className="w-20 h-7 text-sm"
                disabled={data.mndaTerm.type !== "expires"}
              />
              <span className="text-sm">年後に失効</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mndaTerm"
                aria-label="MNDAの条件に従って終了するまで継続"
                checked={data.mndaTerm.type === "until_terminated"}
                onChange={() => set("mndaTerm")({ type: "until_terminated" })}
                className="accent-primary"
              />
              <span className="text-sm">MNDAの条件に従って終了するまで継続</span>
            </label>
          </fieldset>
        </CardContent>
      </Card>

      {/* Confidentiality Term */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">機密保持期間</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">機密情報が保護される期間</p>
          <fieldset className="space-y-2 border-0 p-0 m-0">
            <legend className="sr-only">機密保持期間の選択</legend>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityTerm"
                checked={data.confidentialityTerm.type === "years"}
                onChange={() =>
                  set("confidentialityTerm")({
                    type: "years",
                    years: data.confidentialityTerm.type === "years" ? data.confidentialityTerm.years : 1,
                  })
                }
                className="accent-primary"
              />
              <span className="text-sm">発効日から</span>
              <Input
                type="number"
                min={1}
                aria-label="機密保持期間（年数）"
                value={data.confidentialityTerm.type === "years" ? data.confidentialityTerm.years : 1}
                onChange={(e) => set("confidentialityTerm")({ type: "years", years: Math.max(1, Number(e.target.value) || 1) })}
                className="w-20 h-7 text-sm"
                disabled={data.confidentialityTerm.type !== "years"}
              />
              <span className="text-sm">年間（営業秘密を除く）</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidentialityTerm"
                aria-label="永久に"
                checked={data.confidentialityTerm.type === "perpetuity"}
                onChange={() => set("confidentialityTerm")({ type: "perpetuity" })}
                className="accent-primary"
              />
              <span className="text-sm">永久に</span>
            </label>
          </fieldset>
        </CardContent>
      </Card>

      {/* Governing Law */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">準拠法および管轄</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="governingLaw">準拠法（都道府県または州）</Label>
            <Input id="governingLaw" value={data.governingLaw} onChange={onInputChange("governingLaw")} placeholder="東京都" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="jurisdiction">管轄裁判所</Label>
            <Input id="jurisdiction" value={data.jurisdiction} onChange={onInputChange("jurisdiction")} placeholder="東京地方裁判所" />
          </div>
        </CardContent>
      </Card>

      {/* Modifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">MNDAの変更（任意）</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="modifications"
            value={data.modifications}
            onChange={onInputChange("modifications")}
            placeholder="標準条件への変更事項があれば記載してください"
            rows={3}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Parties */}
      <PartySection
        label="当事者1"
        idPrefix="party1"
        party={data.party1}
        onUpdate={(p) => onChange({ ...data, party1: p })}
      />
      <PartySection
        label="当事者2"
        idPrefix="party2"
        party={data.party2}
        onUpdate={(p) => onChange({ ...data, party2: p })}
      />
    </div>
  );
}
