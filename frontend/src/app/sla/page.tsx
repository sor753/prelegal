"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { makeDefaultFormData, SlaFormData } from "@/lib/sla";
import { useSession, clearToken, getToken } from "@/lib/session";
import SLAForm from "@/components/SLAForm";
import SLADocument from "@/components/SLADocument";
import ChatPanel from "@/components/ChatPanel";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function applyUpdates(current: SlaFormData, updates: Record<string, unknown>): SlaFormData {
  const next = { ...current };
  if (updates.targetUptime != null) next.targetUptime = updates.targetUptime as string;
  if (updates.subscriptionPeriod != null) next.subscriptionPeriod = updates.subscriptionPeriod as string;
  if (updates.supportChannel != null) next.supportChannel = updates.supportChannel as string;
  if (updates.targetResponseTime != null) next.targetResponseTime = updates.targetResponseTime as string;
  if (updates.scheduledDowntime != null) next.scheduledDowntime = updates.scheduledDowntime as string;
  if (updates.uptimeCredit != null) next.uptimeCredit = updates.uptimeCredit as string;
  if (updates.responseTimeCredit != null) next.responseTimeCredit = updates.responseTimeCredit as string;
  if (updates.provider != null) {
    const p = updates.provider as Partial<SlaFormData["provider"]>;
    next.provider = {
      signatoryName: p.signatoryName ?? current.provider.signatoryName,
      title: p.title ?? current.provider.title,
      company: p.company ?? current.provider.company,
      noticeAddress: p.noticeAddress ?? current.provider.noticeAddress,
    };
  }
  if (updates.customer != null) {
    const p = updates.customer as Partial<SlaFormData["customer"]>;
    next.customer = {
      signatoryName: p.signatoryName ?? current.customer.signatoryName,
      title: p.title ?? current.customer.title,
      company: p.company ?? current.customer.company,
      noticeAddress: p.noticeAddress ?? current.customer.noticeAddress,
    };
  }
  return next;
}

export default function SlaPage() {
  const router = useRouter();
  const isLoggedIn = useSession();
  const [formData, setFormData] = useState<SlaFormData>(makeDefaultFormData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "サービスレベル契約",
    pageStyle: `
      @page { size: A4; margin: 20mm 15mm; }
      @media print {
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      }
    `,
  });

  async function handleSave() {
    const token = getToken();
    if (!token) return;
    setSaveStatus("saving");
    const company = formData.provider?.company;
    const title = company ? `SLA - ${company}` : `SLA - ${new Date().toLocaleDateString("ja-JP")}`;
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ doc_type: "sla", title, form_data: formData }),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("idle");
    }
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-lg font-bold hover:opacity-80" style={{ color: "#032147" }}>
              Pre<span style={{ color: "#209dd7" }}>legal</span>
            </button>
            <span className="text-sm text-gray-500">サービスレベル契約 (SLA)</span>
            <Badge variant="secondary">プロトタイプ</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm">PDFとして印刷・保存</Button>
            <Button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              size="sm"
              variant="outline"
            >
              {saveStatus === "saved" ? "保存完了" : saveStatus === "saving" ? "保存中..." : "保存"}
            </Button>
            <Button onClick={() => { clearToken(); router.replace("/login"); }} variant="ghost" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <DisclaimerBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">入力フォーム</h2>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <SLAForm data={formData} onChange={setFormData} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">AIチャット</h2>
            <ChatPanel
              formData={formData as unknown as Record<string, unknown>}
              docType="sla"
              onFormUpdate={(updates) => setFormData((prev) => applyUpdates(prev, updates))}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">プレビュー</h2>
            <div className="bg-white border rounded-lg shadow-sm overflow-auto p-8" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <SLADocument ref={documentRef} data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
