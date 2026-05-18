"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { makeDefaultFormData, DesignPartnerFormData } from "@/lib/design-partner";
import { useSession } from "@/lib/session";
import DesignPartnerForm from "@/components/DesignPartnerForm";
import DesignPartnerDocument from "@/components/DesignPartnerDocument";
import ChatPanel from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function applyUpdates(current: DesignPartnerFormData, updates: Record<string, unknown>): DesignPartnerFormData {
  const next = { ...current };
  if (updates.effectiveDate != null) next.effectiveDate = updates.effectiveDate as string;
  if (updates.term != null) next.term = updates.term as string;
  if (updates.fees != null) next.fees = updates.fees as string;
  if (updates.product != null) next.product = updates.product as string;
  if (updates.governingLaw != null) next.governingLaw = updates.governingLaw as string;
  if (updates.chosenCourts != null) next.chosenCourts = updates.chosenCourts as string;
  if (updates.provider != null) {
    const p = updates.provider as Partial<DesignPartnerFormData["provider"]>;
    next.provider = {
      signatoryName: p.signatoryName ?? current.provider.signatoryName,
      title: p.title ?? current.provider.title,
      company: p.company ?? current.provider.company,
      noticeAddress: p.noticeAddress ?? current.provider.noticeAddress,
    };
  }
  if (updates.partner != null) {
    const p = updates.partner as Partial<DesignPartnerFormData["partner"]>;
    next.partner = {
      signatoryName: p.signatoryName ?? current.partner.signatoryName,
      title: p.title ?? current.partner.title,
      company: p.company ?? current.partner.company,
      noticeAddress: p.noticeAddress ?? current.partner.noticeAddress,
    };
  }
  return next;
}

export default function DesignPartnerPage() {
  const router = useRouter();
  const isLoggedIn = useSession();
  const [formData, setFormData] = useState<DesignPartnerFormData>(makeDefaultFormData);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "デザインパートナー契約",
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
            <span className="text-sm text-gray-500">デザインパートナー契約</span>
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
              <DesignPartnerForm data={formData} onChange={setFormData} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">AIチャット</h2>
            <ChatPanel
              formData={formData as unknown as Record<string, unknown>}
              docType="design_partner"
              onFormUpdate={(updates) => setFormData((prev) => applyUpdates(prev, updates))}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">プレビュー</h2>
            <div className="bg-white border rounded-lg shadow-sm overflow-auto p-8" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <DesignPartnerDocument ref={documentRef} data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
