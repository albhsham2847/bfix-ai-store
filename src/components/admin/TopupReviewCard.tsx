"use client";

import { useState } from "react";
import { PAYMENT_METHODS, TOPUP_STATUS_LABELS, type TopupStatusType, type TopupRequest } from "@/db/schema";

export default function TopupReviewCard({ t }: { t: TopupRequest }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [adminAmount, setAdminAmount] = useState(String(Number(t.amount)));
  const [reason, setReason] = useState("");
  const pm = PAYMENT_METHODS.find((m) => m.id === t.paymentMethod);
  const ps = (t.status ?? "pending") as TopupStatusType;

  async function review(status: "accepted" | "rejected") {
    if (status === "rejected" && !reason.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/topup/${t.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote: reason || null, amount: status === "accepted" ? Number(adminAmount) : undefined }),
      });
      setDone(true);
    } catch {} finally { setLoading(false); }
  }

  if (done) return (
    <div className="surface p-4 text-center" style={{ borderRadius: "var(--radius-md)" }}>
      <div className="font-black">✅ تمت المعالجة</div>
      <button onClick={() => location.reload()} className="mt-2 text-xs underline" style={{ color: "var(--text-secondary)" }}>تحديث</button>
    </div>
  );

  return (
    <div className="surface p-4 text-sm" style={{ borderRadius: "var(--radius-md)" }}>
      <div className="flex items-center justify-between">
        <span className="font-mono font-black" style={{ color: "var(--gold)" }}>{t.code}</span>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: ps === "accepted" ? "rgba(22,163,74,0.15)" : ps === "rejected" ? "rgba(220,38,38,0.15)" : "rgba(212,160,23,0.15)", color: "var(--text-primary)" }}>
          {TOPUP_STATUS_LABELS[ps]}
        </span>
      </div>
      <div className="mt-2" style={{ color: "var(--text-secondary)" }}>
        <div>👤 {t.customerName} · 📱 {t.phone}</div>
        <div>💳 {pm?.name ?? t.paymentMethod}</div>
        <div>💰 المبلغ: <span className="font-black" style={{ color: "var(--gold)" }}>${Number(t.amount)}</span></div>
      </div>
      {t.proofImage && <img src={t.proofImage} alt="إثبات" className="mt-2 max-h-32 rounded-xl" style={{ border: "1px solid var(--border)" }} />}
      {t.proofText && <div className="mt-2 rounded-xl p-2 text-xs" style={{ background: "var(--surface-2)" }}>{t.proofText}</div>}
      <div className="mt-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>{t.createdAt.toLocaleString("ar")}</div>

      {ps === "pending" && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>المبلغ الفعلي للشحن</label>
            <input type="number" value={adminAmount} onChange={(e) => setAdminAmount(e.target.value)}
              className="oneui-input mt-1" dir="ltr" />
          </div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="سبب الرفض (مطلوب عند الرفض)" rows={2} className="oneui-input" />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => review("accepted")} disabled={loading}
              className="oneui-btn py-2.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff" }}>
              ✅ قبول وشحن ${adminAmount}
            </button>
            <button onClick={() => review("rejected")} disabled={loading || !reason.trim()}
              className="oneui-btn py-2.5 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff" }}>
              ❌ رفض
            </button>
          </div>
        </div>
      )}
      {t.adminNote && <div className="mt-2 rounded-xl p-2 text-xs" style={{ background: "rgba(220,38,38,0.08)" }}>📝 {t.adminNote}</div>}
    </div>
  );
}
