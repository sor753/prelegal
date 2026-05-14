"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { makeDefaultFormData, MndaFormData } from "@/lib/mnda";
import MNDAForm from "@/components/MNDAForm";
import MNDADocument from "@/components/MNDADocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [formData, setFormData] = useState<MndaFormData>(makeDefaultFormData);
  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "相互秘密保持契約書",
    pageStyle: `
      @page { size: A4; margin: 20mm 15mm; }
      @media print {
        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      }
    `,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">MNDA作成ツール</h1>
            <Badge variant="secondary">プロトタイプ</Badge>
          </div>
          <Button onClick={handlePrint} size="sm">
            PDFとして印刷・保存
          </Button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">入力フォーム</h2>
            <MNDAForm data={formData} onChange={setFormData} />
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">プレビュー</h2>
            <div className="bg-white border rounded-lg shadow-sm overflow-auto max-h-[calc(100vh-8rem)] p-8">
              <MNDADocument ref={documentRef} data={formData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
