"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { makeDefaultFormData, MndaFormData } from "@/lib/mnda";
import MNDAForm from "@/components/MNDAForm";
import MNDADocument from "@/components/MNDADocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [formData, setFormData] = useState<MndaFormData>(makeDefaultFormData);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("prelegal_session")) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

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

  function handleLogout() {
    localStorage.removeItem("prelegal_session");
    router.replace("/login");
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold" style={{ color: "#032147" }}>
              Pre<span style={{ color: "#209dd7" }}>legal</span>
            </h1>
            <span className="text-sm text-gray-500">MNDA作成ツール</span>
            <Badge variant="secondary">プロトタイプ</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm">
              PDFとして印刷・保存
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              ログアウト
            </Button>
          </div>
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
