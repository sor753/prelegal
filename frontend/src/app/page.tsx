"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, clearToken, getToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DOCUMENTS = [
  {
    href: "/mnda",
    name: "相互秘密保持契約",
    nameEn: "Mutual NDA",
    description: "両当事者が機密情報を共有するための標準的な相互秘密保持契約。",
  },
  {
    href: "/mnda-coverpage",
    name: "相互秘密保持契約 表紙",
    nameEn: "Mutual NDA Cover Page",
    description: "両当事者が記入・署名するための相互秘密保持契約の表紙のみ。",
  },
  {
    href: "/design-partner",
    name: "デザインパートナー契約",
    nameEn: "Design Partner Agreement",
    description: "フィードバック、機密保持、知的財産を含む早期アクセス製品テストパートナーシップの契約。",
  },
  {
    href: "/sla",
    name: "サービスレベル契約",
    nameEn: "Service Level Agreement",
    description: "稼働率目標、応答時間、サービスクレジットを定義するクラウドサービスのSLA。",
  },
] as const;

const DOC_TYPE_LABELS: Record<string, string> = {
  mnda: "MNDA",
  mnda_coverpage: "MNDA表紙",
  design_partner: "DPA",
  sla: "SLA",
};

const DOC_TYPE_HREFS: Record<string, string> = {
  mnda: "/mnda",
  mnda_coverpage: "/mnda-coverpage",
  design_partner: "/design-partner",
  sla: "/sla",
};

interface SavedDoc {
  id: number;
  doc_type: string;
  title: string;
  saved_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useSession();
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>([]);

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = getToken();
    if (!token) return;
    fetch("/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { clearToken(); router.replace("/login"); return []; }
        return res.ok ? res.json() : [];
      })
      .then((data: SavedDoc[]) => setSavedDocs(data))
      .catch(() => {});
  }, [isLoggedIn, router]);

  function handleDelete(id: number) {
    const token = getToken();
    if (!token) return;
    fetch(`/api/documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setSavedDocs((prev) => prev.filter((d) => d.id !== id));
    }).catch(() => {});
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
  }

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "#032147" }}>
            Pre<span style={{ color: "#209dd7" }}>legal</span>
          </h1>
          <Button
            onClick={() => { clearToken(); router.replace("/login"); }}
            variant="ghost"
            size="sm"
          >
            ログアウト
          </Button>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-12">
        {savedDocs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#032147" }}>保存済み文書</h2>
            <div className="space-y-2">
              {savedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Badge variant="secondary" className="shrink-0">{DOC_TYPE_LABELS[doc.doc_type] ?? doc.doc_type}</Badge>
                    <span className="font-medium truncate" style={{ color: "#032147" }}>{doc.title}</span>
                    <span className="text-xs shrink-0" style={{ color: "#888888" }}>{formatDate(doc.saved_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(DOC_TYPE_HREFS[doc.doc_type] ?? "/")}
                    >
                      開く
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: "#032147" }}>新規作成</h2>
            </div>
          </div>
        )}

        {savedDocs.length === 0 && (
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#032147" }}>
              作成する文書を選択してください
            </h2>
            <p className="text-sm" style={{ color: "#888888" }}>
              AIチャットがフィールドを自動入力します
            </p>
          </div>
        )}

        <div className="space-y-3">
          {DOCUMENTS.map((doc) => (
            <button
              key={doc.href}
              onClick={() => router.push(doc.href)}
              className="w-full text-left bg-white border rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base" style={{ color: "#032147" }}>
                      {doc.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {doc.nameEn}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#888888" }}>
                    {doc.description}
                  </p>
                </div>
                <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-xl mt-1">→</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="h-1 w-12 rounded-full mx-auto" style={{ backgroundColor: "#ecad0a" }} />
        </div>
      </main>
    </div>
  );
}
