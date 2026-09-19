"use client";

import { useEffect, useState } from "react";
import ImagePicker from "@/components/ImagePicker";
import type { Promotion } from "@/db/schema";

export default function AdminPromotions() {
  const [list, setList] = useState<Promotion[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");

  useEffect(() => {
    fetch("/api/promotions").then((r) => r.json()).then(setList).catch(() => {});
  }, []);

  async function createPromo() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/promotions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, image, link, categorySlug }),
      });
      if (res.ok) {
        const p = await res.json();
        setList((prev) => [p, ...prev]);
        setTitle(""); setBody(""); setImage(""); setLink(""); setCategorySlug("");
      }
    } catch {} finally { setLoading(false); }
  }

  async function deletePromo(id: number) {
    await fetch(`/api/promotions/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((p) => p.id !== id));
  }

  async function broadcast() {
    if (!broadcastTitle.trim()) return;
    await fetch("/api/admin/broadcast", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: broadcastTitle, body: broadcastBody }),
    });
    alert("تم إرسال الإشعار لجميع العملاء");
    setBroadcastTitle(""); setBroadcastBody("");
  }

  const ic = "admin-input";

  return (
    <div className="space-y-6">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>📢 الإعلانات والإشعارات</h1>

      {/* Broadcast */}
      <div className="admin-card space-y-3">
        <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>🔔 إشعار جميع العملاء</h2>
        <input value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="عنوان الإشعار" className={ic} />
        <textarea value={broadcastBody} onChange={(e) => setBroadcastBody(e.target.value)} placeholder="نص الإشعار" rows={2} className={ic} />
        <button onClick={broadcast} className="admin-btn admin-btn-primary">إرسال إشعار لكل العملاء</button>
      </div>

      {/* Create promo */}
      <div className="admin-card space-y-3">
        <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>➕ إضافة إعلان جديد</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإعلان *" className={ic} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="نص الإعلان" rows={3} className={ic} />
        <ImagePicker label="صورة الإعلان" onImage={setImage} />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="رابط (اختياري — مثال: /product/1)" className={ic} dir="ltr" />
        <input value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} placeholder="قسم مرتبط (اختياري — مثال: tools)" className={ic} dir="ltr" />
        <button onClick={createPromo} disabled={loading} className="admin-btn admin-btn-gold">{loading ? "..." : "نشر الإعلان"}</button>
      </div>

      {/* List */}
      <div className="space-y-2">
        <h2 style={{ fontWeight: 800, fontSize: "1rem" }}>📋 الإعلانات الحالية ({list.length})</h2>
        {list.length === 0 && <div className="admin-card text-center" style={{ color: "var(--admin-text-3)" }}>لا توجد إعلانات</div>}
        {list.map((p) => (
          <div key={p.id} className="admin-card flex items-start gap-3">
            {p.image && <img src={p.image} alt="" style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }} />}
            <div className="flex-1 min-w-0">
              <div style={{ fontWeight: 800, color: "var(--admin-text)" }}>{p.title}</div>
              {p.body && <div style={{ fontSize: "0.75rem", color: "var(--admin-text-3)" }} className="truncate">{p.body}</div>}
              <div style={{ fontSize: "0.65rem", color: "var(--admin-text-3)" }}>{p.createdAt?.toLocaleDateString("ar")}</div>
            </div>
            <button onClick={() => deletePromo(p.id)} className="admin-btn admin-btn-danger" style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}>حذف</button>
          </div>
        ))}
      </div>
    </div>
  );
}
