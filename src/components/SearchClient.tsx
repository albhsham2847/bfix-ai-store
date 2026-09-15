"use client";

import { useMemo, useState } from "react";
import ProductCard, { type ProductCardData } from "./ProductCard";

type Item = ProductCardData & { categorySlug: string; categoryName: string };

export default function SearchClient({
  items,
  cats,
}: {
  items: Item[];
  cats: { slug: string; name: string; icon: string }[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!cat || p.categorySlug === cat) &&
        (!s ||
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.categoryName.toLowerCase().includes(s)),
    );
  }, [items, q, cat]);

  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث: Unlock Tool, ChatGPT, شدات..."
        className="w-full rounded-2xl bg-black/30 px-4 py-3.5 text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
      />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setCat("")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${!cat ? "gold-btn" : "bg-white/5 ring-1 ring-white/10"}`}
        >
          الكل
        </button>
        {cats.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug === cat ? "" : c.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${cat === c.slug ? "gold-btn" : "bg-white/5 ring-1 ring-white/10"}`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/45">{list.length} خدمة</p>
      <div className="grid gap-2.5 lg:grid-cols-2">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {list.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-sm text-white/50">
            لا توجد نتائج
          </div>
        )}
      </div>
    </div>
  );
}
