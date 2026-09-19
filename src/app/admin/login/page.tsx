"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLogin() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <div className="admin-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: "1rem" }}>
      <form action={action} className="admin-card" style={{ maxWidth: 380, width: "100%", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: 9999, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", marginInline: "auto", boxShadow: "0 8px 30px rgba(59,130,246,0.3)" }}>🛡️</div>
          <h1 style={{ marginTop: "0.75rem", fontSize: "1.25rem", fontWeight: 900, color: "var(--admin-text)" }}>لوحة تحكم الإدارة</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--admin-text-3)" }}>B-Fix Software | AI Store</p>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input name="password" type="password" required placeholder="كلمة مرور الإدارة"
            className="admin-input" autoFocus style={{ textAlign: "center" }} />
        </div>
        {error && <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f87171", marginBottom: "0.75rem", textAlign: "center" }}>{error}</p>}
        <button disabled={pending} className="admin-btn admin-btn-primary w-full" style={{ padding: "0.75rem" }}>
          {pending ? "..." : "دخول لوحة التحكم"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="/" style={{ fontSize: "0.75rem", color: "var(--admin-text-3)", textDecoration: "none" }}>← العودة للمتجر</a>
        </p>
      </form>
    </div>
  );
}
