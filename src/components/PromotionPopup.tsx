"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Promotion } from "@/db/schema";

export default function PromotionPopup() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState<Promotion | null>(null);

  useEffect(() => {
    fetch("/api/promotions")
      .then((r) => r.json())
      .then((data: Promotion[]) => {
        if (!data.length) return;
        // Check which ones user hasn't dismissed
        const dismissed: string[] = JSON.parse(localStorage.getItem("bfix-dismissed-ads") || "[]");
        const unseen = data.filter((p) => !dismissed.includes(String(p.id)));
        if (unseen.length > 0) {
          setPromos(unseen);
          setCurrent(unseen[0]);
        }
      })
      .catch(() => {});
  }, []);

  function dismiss() {
    if (!current) return;
    const dismissed: string[] = JSON.parse(localStorage.getItem("bfix-dismissed-ads") || "[]");
    dismissed.push(String(current.id));
    localStorage.setItem("bfix-dismissed-ads", JSON.stringify(dismissed));
    // Show next or close
    const next = promos.find((p) => p.id !== current.id && !dismissed.includes(String(p.id)));
    setCurrent(next ?? null);
  }

  if (!current) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 200, background: "rgba(0,0,0,0.7)" }}>
      <div className="modal-content scale-in" style={{ maxWidth: 420, padding: 0, overflow: "hidden" }}>
        {/* Image */}
        {current.image && (
          <div style={{ width: "100%", maxHeight: 250, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.title} style={{ width: "100%", objectFit: "cover" }} />
          </div>
        )}

        <div style={{ padding: "1.25rem" }}>
          {/* Close button */}
          <button onClick={dismiss}
            style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderRadius: 9999, background: "rgba(0,0,0,0.5)", color: "#fff", display: "grid", placeItems: "center", fontSize: "1rem", fontWeight: 900, border: "none", cursor: "pointer", zIndex: 10 }}>
            ✕
          </button>

          <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{current.title}</h2>
          {current.body && <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", whiteSpace: "pre-line", marginBottom: "1rem" }}>{current.body}</p>}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {current.link && (
              <Link href={current.link} onClick={dismiss}
                className="gold-btn oneui-btn flex-1" style={{ textAlign: "center" }}>
                🛒 تصفح العرض
              </Link>
            )}
            {current.categorySlug && (
              <Link href={`/category/${current.categorySlug}`} onClick={dismiss}
                className="gold-btn oneui-btn flex-1" style={{ textAlign: "center" }}>
                تصفح القسم
              </Link>
            )}
            {!current.link && !current.categorySlug && (
              <button onClick={dismiss} className="gold-btn oneui-btn flex-1">حسناً</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
