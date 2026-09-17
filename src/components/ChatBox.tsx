"use client";

import { useEffect, useRef, useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { playNotificationSound, sendBrowserNotification } from "@/lib/notify";
import ImagePicker from "./ImagePicker";
import type { Message } from "@/db/schema";

export default function ChatBox() {
  const { customer, setShowAuth } = useCustomer();
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cust = customer;
    if (!cust) return;
    let lastCount = 0;
    const poll = async () => {
      try {
        const r = await fetch(`/api/messages/${cust.id}`);
        if (r.ok) {
          const data: Message[] = await r.json();
          if (data.length > lastCount && lastCount > 0) {
            const lastMsg = data[data.length - 1];
            if (lastMsg.sender === "admin") {
              playNotificationSound();
              sendBrowserNotification("رسالة من الإدارة", lastMsg.content.slice(0, 100));
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
  }, [customer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (!customer) {
    return (
      <div className="surface p-6 text-center" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-4xl">💬</div>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>سجّل دخولك للمحادثة</p>
        <button onClick={() => setShowAuth(true)} className="gold-btn oneui-btn mt-3">تسجيل الدخول</button>
      </div>
    );
  }

  async function send() {
    if (!text.trim() && !img || !customer) return;
    setLoading(true);
    try {
      await fetch(`/api/messages/${customer!.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: "customer", content: text, image: img || null }),
      });
      setText(""); setImg("");
      const r = await fetch(`/api/messages/${customer!.id}`);
      if (r.ok) setMsgs(await r.json());
    } catch {} finally { setLoading(false); }
  }

  return (
    <div className="surface flex flex-col" style={{ borderRadius: "var(--radius-xl)", height: "calc(100dvh - 200px)" }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ background: "var(--surface-2)" }}>
        {msgs.length === 0 && (
          <div className="text-center text-sm py-8" style={{ color: "var(--text-tertiary)" }}>
            ابدأ محادثة مع الإدارة 👋
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm" style={{
              background: m.sender === "customer" ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)" : "var(--surface)",
              color: m.sender === "customer" ? "var(--text-on-gold)" : "var(--text-primary)",
              borderBottomRightRadius: m.sender === "customer" ? 4 : undefined,
              borderBottomLeftRadius: m.sender === "admin" ? 4 : undefined,
            }}>
              {m.image && <img src={m.image} alt="" className="rounded-lg mb-1 max-h-32" />}
              {m.content && <div>{m.content}</div>}
              <div className="text-[10px] mt-1 opacity-60">{new Date(m.createdAt).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        {img && (
          <div className="mb-2 relative inline-block">
            <img src={img} alt="" className="h-16 rounded-lg" />
            <button onClick={() => setImg("")} className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center">✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="relative">
            <ImagePicker label="" onImage={setImg} current="" />
          </div>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="اكتب رسالتك..." className="oneui-input flex-1" />
          <button onClick={send} disabled={loading || (!text.trim() && !img)}
            className="gold-btn oneui-btn px-4 disabled:opacity-50">إرسال</button>
        </div>
      </div>
    </div>
  );
}
