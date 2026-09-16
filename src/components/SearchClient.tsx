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
        (!s || p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.categoryName.toLowerCase().includes(s)),
    );
  }, [items, q, cat]);

  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث: Unlock Tool, ChatGPT, شدات..."
        className="oneui-input"
      />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setCat("")}
          className="oneui-btn shrink-0 px-3.5 py-1.5 text-xs"
          style={{
            background: !cat ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)" : "var(--surface-2)",
            color: !cat ? "var(--text-on-gold)" : "var(--text-secondary)",
            border: !cat ? "none" : "1px solid var(--border)",
            boxShadow: !cat ? "var(--shadow-gold)" : "none",
          }}
        >
          الكل
        </button>
        {cats.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug === cat ? "" : c.slug)}
            className="oneui-btn shrink-0 px-3.5 py-1.5 text-xs"
            style={{
              background: cat === c.slug ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)" : "var(--surface-2)",
              color: cat === c.slug ? "var(--text-on-gold)" : "var(--text-secondary)",
              border: cat === c.slug ? "none" : "1px solid var(--border)",
              boxShadow: cat === c.slug ? "var(--shadow-gold)" : "none",
            }}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{list.length} خدمة</p>
      <div className="grid gap-2.5 lg:grid-cols-2">
        {list.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
        {list.length === 0 && (
          <div className="surface p-8 text-center text-sm" style={{ borderRadius: "var(--radius-md)", color: "var(--text-tertiary)" }}>
            لا توجد نتائج
          </div>
        )}
      </div>
    </div>
  );
}
