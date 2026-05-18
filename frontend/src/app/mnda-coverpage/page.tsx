"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { makeDefaultFormData, MndaFormData } from "@/lib/mnda";
import { useSession } from "@/lib/session";
import MNDAForm from "@/components/MNDAForm";
import MNDACoverPageDocument from "@/components/MNDACoverPageDocument";
import ChatPanel from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function applyUpdates(current: MndaFormData, updates: Record<string, unknown>): MndaFormData {
  const next = { ...current };
  if (updates.purpose != null) next.purpose = updates.purpose as string;
  if (updates.effectiveDate != null) next.effectiveDate = updates.effectiveDate as string;
  if (updates.mndaTerm != null) {
    const t = updates.mndaTerm as { type: string; years?: number };
    if (t.type === "expires") {
      next.mndaTerm = { type: "expires", years: t.years ?? 1 };
    } else {
      next.mndaTerm = { type: "until_terminated" };
    }
  }
  if (updates.confidentialityTerm != null) {
    const t = updates.confidentialityTerm as { type: string; years?: number };
    if (t.type === "years") {
      next.confidentialityTerm = { type: "years", years: t.years ?? 1 };
    } else {
      next.confidentialityTerm = { type: "perpetuity" };
    }
  }
  if (updates.governingLaw != null) next.governingLaw = updates.governingLaw as string;
  if (updates.jurisdiction != null) next.jurisdiction = updates.jurisdiction as string;
  if (updates.modifications != null) next.modifications = updates.modifications as string;
  if (updates.party1 != null) {
    const p = updates.party1 as Partial<MndaFormData["party1"]>;
    next.party1 = {
      signatoryName: p.signatoryName ?? current.party1.signatoryName,
      title: p.title ?? current.party1.title,
      company: p.company ?? current.party1.company,
      noticeAddress: p.noticeAddress ?? current.party1.noticeAddress,
      date: p.date ?? current.party1.date,
    };
  }
  if (updates.party2 != null) {
    const p = updates.party2 as Partial<MndaFormData["party2"]>;
    next.party2 = {
      signatoryName: p.signatoryName ?? current.party2.signatoryName,
      title: p.title ?? current.party2.title,
      company: p.company ?? current.party2.company,
      noticeAddress: p.noticeAddress ?? current.party2.noticeAddress,
      date: p.date ?? current.party2.date,
    };
  }
  return next;
}

export default function MndaCoverpagePage() {
  const router = useRouter();
  const isLoggedIn = useSession();
  const [formData, setFormData] = useState<MndaFormData>(makeDefaultFormData);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "相互秘密保持契約 表紙",
    pageStyle: `
      @page { size: A4; margin: 20mm 15mm; }
      @media print {
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      }
    `,
  });

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-lg font-bold hover:opacity-80" style={{ color: "#032147" }}>
              Pre<span style={{ color: "#209dd7" }}>legal</span>
            </button>
            <span className="text-sm text-gray-500">相互秘密保持契約 表紙</span>
            <Badge variant="secondary">プロトタイプ</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm">PDFとして印刷・保存</Button>
            <Button onClick={() => { localStorage.removeItem("prelegal_session"); router.replace("/login"); }} variant="ghost" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">入力フォーム</h2>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <MNDAForm data={formData} onChange={setFormData} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">AIチャット</h2>
            <ChatPanel
              formData={formData as unknown as Record<string, unknown>}
              docType="mnda_coverpage"
              onFormUpdate={(updates) => setFormData((prev) => applyUpdates(prev, updates))}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">プレビュー</h2>
            <div className="bg-white border rounded-lg shadow-sm overflow-auto p-8" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <MNDACoverPageDocument ref={documentRef} data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
