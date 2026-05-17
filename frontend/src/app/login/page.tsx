"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("prelegal_session", "1");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#032147" }}>
            Pre<span style={{ color: "#209dd7" }}>legal</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#888888" }}>
            法的契約書をAIで簡単に作成
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#032147" }}>
            サインイン
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 cursor-pointer text-white border-0"
              style={{ backgroundColor: "#753991" }}
            >
              サインイン
            </Button>
          </form>

          <p className="mt-5 text-xs text-center" style={{ color: "#888888" }}>
            ※ デモ版のため、任意のメールアドレスとパスワードでサインインできます
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: "#ecad0a" }} />
        </div>
      </div>
    </div>
  );
}
