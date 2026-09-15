"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/seed-data";

export default function OrderForm({
  productId,
  productName,
  price,
}: {
  productId: number;
  productName: string;
  price: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);

  const total = (Number(price) * qty).toLocaleString();

  const message = encodeURIComponent(
    `مرحباً B-Fix Software 👋\nأرغب بطلب: ${productName}\nالكمية: ${qty}\nالإجمالي: $${total}\nالاسم: ${name}\nالهاتف: ${phone}${notes ? `\nملاحظات: ${notes}` : ""}${orderId ? `\nرقم الطلب: #${orderId}` : ""}`,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, customerName: name, phone, quantity: qty, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setOrderId(data.order.id);
      try {
        const saved = JSON.parse(localStorage.getItem("bfix-orders") || "[]");
        saved.unshift({ id: data.order.id, productName, qty, total, date: Date.now() });
        localStorage.setItem("bfix-orders", JSON.stringify(saved.slice(0, 50)));
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  if (orderId) {
    return (
      <section className="glass fade-up rounded-3xl p-5 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-2 text-xl font-black">تم استلام طلبك</h2>
        <p className="mt-1 text-sm text-white/60">
          رقم الطلب <span className="font-black text-gold">#{orderId}</span> — أكمل الطلب
          بالتواصل معنا لإتمام الدفع والتسليم الفوري.
        </p>
        <div className="mt-4 grid gap-2">
          <a
            href={`${CONTACT.whatsapp}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-black"
          >
            إتمام الطلب عبر واتساب
          </a>
          <a
            href={CONTACT.telegram}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-black text-white"
          >
            إتمام الطلب عبر تليجرام
          </a>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="glass fade-up space-y-3 rounded-3xl p-5">
      <h2 className="text-base font-black">اطلب الآن</h2>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="الاسم الكامل"
        className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
      />
      <input
        required
        type="tel"
        dir="ltr"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+967 7xx xxx xxx"
        className="w-full rounded-xl bg-black/30 px-4 py-3 text-right text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
      />
      <div className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 ring-1 ring-white/10">
        <span className="text-sm text-white/70">الكمية</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-lg bg-white/10 text-lg font-black">
            −
          </button>
          <span className="w-6 text-center font-black">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(100, q + 1))} className="h-8 w-8 rounded-lg bg-white/10 text-lg font-black">
            +
          </button>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="ملاحظات (ID اللعبة، البريد الإلكتروني، ...)"
        rows={2}
        className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
      />
      {error && <p className="text-sm font-bold text-rose-400">{error}</p>}
      <button
        disabled={loading}
        className="gold-btn w-full rounded-xl px-4 py-3.5 text-base font-black disabled:opacity-60"
      >
        {loading ? "جاري الإرسال..." : `تأكيد الطلب — $${total}`}
      </button>
    </form>
  );
}
