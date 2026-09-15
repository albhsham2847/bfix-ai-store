"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, type OrderStatus } from "@/db/schema";

type Saved = { id: number; code?: string; productName: string; qty: number; total: string; date: number };
type Remote = { code: string; status: OrderStatus; total: string | null };

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
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        s === "completed" ? "bg-emerald-500/15 text-emerald-300" :
        s === "cancelled" ? "bg-rose-500/15 text-rose-300" :
        "bg-gold/15 text-gold"}`}>{STATUS_LABELS[s]}</span>
    ) : null;

  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-black">طلباتي</h1>

      <form onSubmit={doTrack} className="glass flex gap-2 rounded-2xl p-3">
        <input
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          placeholder="تتبع طلب: BF-XXXXXXXX"
          dir="ltr"
          className="flex-1 rounded-xl bg-black/30 px-3 py-2.5 text-right text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
        />
        <button className="gold-btn rounded-xl px-4 text-sm font-black">تتبع</button>
      </form>
      {tracked === "none" && <p className="text-sm text-rose-400">لم يتم العثور على الطلب</p>}
      {tracked && tracked !== "none" && (
        <div className="glass flex items-center justify-between rounded-2xl p-4">
          <div>
            <div className="font-mono text-sm font-black text-gold">{tracked.code}</div>
            <div className="mt-1">{badge(tracked.status)}</div>
          </div>
          <div className="font-black">${Number(tracked.total ?? 0)}</div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-4xl">🧾</div>
          <p className="mt-2 text-sm text-white/60">لا توجد طلبات بعد</p>
          <Link href="/search" className="gold-btn mt-4 inline-block rounded-xl px-5 py-2.5 text-sm font-black">
            تصفح الخدمات
          </Link>
        </div>
      ) : (
        list.map((o) => (
          <div key={o.id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold">{o.productName}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                <span className="font-mono text-gold">{o.code ?? `#${o.id}`}</span>
                <span>· ×{o.qty}</span>
                <span>· {new Date(o.date).toLocaleDateString("ar")}</span>
              </div>
              <div className="mt-1">{o.code && badge(status[o.code]?.status)}</div>
            </div>
            <div className="font-black text-gold">${Number(o.total).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
