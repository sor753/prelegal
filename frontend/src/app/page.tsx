"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/button";

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

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useSession();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: "#032147" }}>
            Pre<span style={{ color: "#209dd7" }}>legal</span>
          </h1>
          <Button
            onClick={() => { localStorage.removeItem("prelegal_session"); router.replace("/login"); }}
            variant="ghost"
            size="sm"
          >
            ログアウト
          </Button>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#032147" }}>
            作成する文書を選択してください
          </h2>
          <p className="text-sm" style={{ color: "#888888" }}>
            AIチャットがフィールドを自動入力します
          </p>
        </div>

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
