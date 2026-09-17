"use client";

import { useState } from "react";

export default function ReviewPayment({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [done, setDone] = useState<string | null>(null);

  async function review(status: "accepted" | "rejected") {
    if (status === "rejected" && !reason.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reason: reason.trim() || undefined }),
      });
      if (!res.ok) throw new Error("خطأ");
      setDone(status === "accepted" ? "تم قبول الدفع ✅" : "تم رفض الدفع ❌");
    } catch {
      setDone("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="surface p-4 text-center" style={{ borderRadius: "var(--radius-lg)" }}>
        <div className="text-2xl">{done.includes("✅") ? "✅" : "❌"}</div>
        <div className="mt-1 font-black">{done}</div>
        <button onClick={() => location.reload()} className="mt-2 oneui-btn" style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
          تحديث الصفحة
        </button>
      </div>
    );
  }

  return (
    <div className="surface space-y-3 p-4" style={{ borderRadius: "var(--radius-lg)" }}>
      <h2 className="text-base font-black">مراجعة إثبات الدفع</h2>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)}
        placeholder="سبب الرفض (مطلوب عند الرفض)" rows={2} className="oneui-input" />
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => review("accepted")} disabled={loading}
          className="oneui-btn py-3 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }}>
          ✅ قبول الدفع
        </button>
        <button onClick={() => review("rejected")} disabled={loading || !reason.trim()}
          className="oneui-btn py-3 disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff" }}>
          ❌ رفض الدفع
        </button>
      </div>
    </div>
  );
}
