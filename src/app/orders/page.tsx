"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Saved = { id: number; productName: string; qty: number; total: string; date: number };

export default function OrdersPage() {
  const [list, setList] = useState<Saved[]>([]);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem("bfix-orders") || "[]"));
    } catch {}
  }, []);

  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-black">طلباتي</h1>
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
            <div>
              <div className="text-sm font-extrabold">{o.productName}</div>
              <div className="text-xs text-white/50">
                #{o.id} · الكمية {o.qty} · {new Date(o.date).toLocaleDateString("ar")}
              </div>
            </div>
            <div className="font-black text-gold">${o.total}</div>
          </div>
        ))
      )}
    </div>
  );
}
