"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setToken } from "@/lib/session";

type Tab = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = tab === "signin" ? "/api/auth/signin" : "/api/auth/signup";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "エラーが発生しました");
        return;
      }
      setToken(data.token);
      router.push("/");
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => { setTab("signin"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === "signin"
                  ? "border-b-2 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={tab === "signin" ? { borderColor: "#209dd7", backgroundColor: "#209dd7" } : {}}
            >
              サインイン
            </button>
            <button
              onClick={() => { setTab("signup"); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === "signup"
                  ? "border-b-2 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={tab === "signup" ? { borderColor: "#209dd7", backgroundColor: "#209dd7" } : {}}
            >
              新規登録
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {tab === "signup" && (
                  <p className="text-xs" style={{ color: "#888888" }}>8文字以上で入力してください</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 cursor-pointer text-white border-0"
                style={{ backgroundColor: "#753991" }}
              >
                {loading ? "処理中..." : tab === "signin" ? "サインイン" : "アカウントを作成"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-12 rounded-full" style={{ backgroundColor: "#ecad0a" }} />
        </div>
      </div>
    </div>
  );
}
