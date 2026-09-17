"use client";

import { useEffect, useRef, useState } from "react";
import { playNotificationSound, sendBrowserNotification } from "@/lib/notify";
import type { Message } from "@/db/schema";

export default function AdminChatBox({ customerId }: { customerId: number }) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastCount = 0;
    const poll = async () => {
      try {
        const r = await fetch(`/api/messages/${customerId}`);
        if (r.ok) {
          const data: Message[] = await r.json();
          if (data.length > lastCount && lastCount > 0) {
            const last = data[data.length - 1];
            if (last.sender === "customer") {
              playNotificationSound();
              sendBrowserNotification("رسالة جديدة من العميل", last.content.slice(0, 100));
            }
          }
          lastCount = data.length;
          setMsgs(data);
        }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [customerId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send() {
    if (!text.trim()) return;
    await fetch(`/api/messages/${customerId}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "admin", content: text }),
    });
    setText("");
    const r = await fetch(`/api/messages/${customerId}`);
    if (r.ok) setMsgs(await r.json());
  }

  return (
    <div className="surface flex flex-col" style={{ borderRadius: "var(--radius-xl)", height: "calc(100dvh - 200px)" }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ background: "var(--surface-2)" }}>
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm" style={{
              background: m.sender === "admin" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "var(--surface)",
              color: m.sender === "admin" ? "#fff" : "var(--text-primary)",
            }}>
              {m.image && <img src={m.image} alt="" className="rounded-lg mb-1 max-h-32" />}
              {m.content && <div>{m.content}</div>}
              <div className="text-[10px] mt-1 opacity-60">{new Date(m.createdAt).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
          placeholder="اكتب رد..." className="oneui-input flex-1" />
        <button onClick={send} disabled={!text.trim()}
          className="oneui-btn px-4 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>إرسال</button>
      </div>
    </div>
  );
}
