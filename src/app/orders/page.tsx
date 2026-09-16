"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, type OrderStatus } from "@/db/schema";

type Saved = { id: number; code?: string; productName: string; qty: number; total: string; date: number };
type Remote = { code: string; status: OrderStatus; total: string | null };

const statusColors: Record<string, string> = {
  pending: "rgba(212,160,23,0.15)",
  confirmed: "rgba(37,99,235,0.15)",
  processing: "rgba(124,58,237,0.15)",
  completed: "rgba(22,163,74,0.15)",
  cancelled: "rgba(220,38,38,0.15)",
};

export default function OrdersPage() {
  const [list, setList] = useState<Saved[]>([]);
  const [status, setStatus] = useState<Record<string, Remote>>({});
  const [track, setTrack] = useState("");
  const [tracked, setTracked] = useState<Remote | null | "none">(null);

  useEffect(() => {
    try {
      const l: Saved[] = JSON.parse(localStorage.getItem("bfix-orders") || "[]");
      setList(l);
      l.filter((o) => o.code).forEach((o) =>
        fetch(`/api/orders/${o.code}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d && setStatus((s) => ({ ...s, [o.code!]: d })))
          .catch(() => {}),
      );
    } catch {}
  }, []);

  async function doTrack(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch(`/api/orders/${track.trim().toUpperCase()}`);
    setTracked(r.ok ? await r.json() : "none");
  }

  const badge = (s?: OrderStatus) =>
    s ? (
      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
        style={{ background: statusColors[s] ?? "var(--surface-2)", color: "var(--text-primary)" }}>
        {STATUS_LABELS[s]}
      </span>
    ) : null;

  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-black">طلباتي</h1>

      <form onSubmit={doTrack} className="surface flex gap-2 p-3" style={{ borderRadius: "var(--radius-md)" }}>
        <input value={track} onChange={(e) => setTrack(e.target.value)} placeholder="تتبع طلب: BF-XXXXXXXX" dir="ltr"
          className="oneui-input flex-1 text-right" />
        <button className="gold-btn oneui-btn px-4 text-sm">تتبع</button>
      </form>
      {tracked === "none" && <p className="text-sm text-rose-500">لم يتم العثور على الطلب</p>}
      {tracked && tracked !== "none" && (
        <div className="surface flex items-center justify-between p-4" style={{ borderRadius: "var(--radius-md)" }}>
          <div>
            <div className="font-mono text-sm font-black" style={{ color: "var(--gold)" }}>{tracked.code}</div>
            <div className="mt-1">{badge(tracked.status)}</div>
          </div>
          <div className="font-black">${Number(tracked.total ?? 0)}</div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="surface p-8 text-center" style={{ borderRadius: "var(--radius-xl)" }}>
          <div className="text-4xl">🧾</div>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>لا توجد طلبات بعد</p>
          <Link href="/search" className="gold-btn oneui-btn mt-4 inline-block">تصفح الخدمات</Link>
        </div>
      ) : (
        list.map((o) => (
          <div key={o.id} className="surface flex items-center justify-between p-4" style={{ borderRadius: "var(--radius-md)" }}>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>{o.productName}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <span className="font-mono" style={{ color: "var(--gold)" }}>{o.code ?? `#${o.id}`}</span>
                <span>· ×{o.qty}</span>
                <span>· {new Date(o.date).toLocaleDateString("ar")}</span>
              </div>
              <div className="mt-1">{o.code && badge(status[o.code]?.status)}</div>
            </div>
            <div className="font-black" style={{ color: "var(--gold)" }}>${Number(o.total).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
