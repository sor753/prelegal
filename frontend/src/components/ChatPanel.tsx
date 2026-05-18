"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatApiResponse {
  reply: string;
  updates: Record<string, unknown>;
}

interface Props {
  formData: Record<string, unknown>;
  docType: string;
  onFormUpdate: (updates: Record<string, unknown>) => void;
}

export default function ChatPanel({ formData, docType, onFormUpdate }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // AI: refでformDataの最新値を保持し、async関数内のstale closure問題を回避する
  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  // AI: 初回マウント時にAIに最初の質問をさせる
  useEffect(() => {
    sendToAI([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendToAI = useCallback(async (msgs: ChatMessage[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, current_form: formDataRef.current, doc_type: docType }),
      });
      if (!res.ok) throw new Error("APIエラー");
      const data: ChatApiResponse = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      onFormUpdate(data.updates);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [docType, onFormUpdate]);

  async function handleSubmit() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await sendToAI(newMessages);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Card className="flex flex-col" style={{ height: "calc(100vh - 8rem)" }}>
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-base">AIアシスタント</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && loading && (
            <div className="rounded-lg p-3 text-sm text-gray-400 bg-blue-50">準備中...</div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-sm whitespace-pre-wrap ${
                msg.role === "assistant" ? "bg-blue-50" : "bg-gray-50 ml-6"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && messages.length > 0 && (
            <div className="rounded-lg p-3 text-sm text-gray-400 bg-blue-50">考え中...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 shrink-0">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力... (Enter で送信)"
            rows={2}
            disabled={loading}
            className="resize-none"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="self-end"
            style={{ backgroundColor: "#753991", color: "white" }}
          >
            送信
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
