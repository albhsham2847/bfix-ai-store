import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, categories, customers, topupRequests, messages } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");

  const [[o], [p], [c], [cu], [tu], [unreadMsgs], [pendingTopups], [submittedOrders], byStatus, [rev]] = await Promise.all([
    db.select({ v: count() }).from(orders),
    db.select({ v: count() }).from(products),
    db.select({ v: count() }).from(categories),
    db.select({ v: count() }).from(customers),
    db.select({ v: count() }).from(topupRequests),
    db.select({ v: count() }).from(messages).where(eq(messages.read, false)),
    db.select({ v: count() }).from(topupRequests).where(eq(topupRequests.status, "pending")),
    db.select({ v: count() }).from(orders).where(eq(orders.paymentStatus, "submitted")),
    db.select({ status: orders.status, v: count() }).from(orders).groupBy(orders.status),
    db.select({ v: sql<string>`coalesce(sum(${orders.total}),0)` }).from(orders).where(eq(orders.status, "completed")),
  ]);

  const cards = [
    { label: "إجمالي الطلبات", value: o.v, icon: "🛒", color: "#3b82f6", href: "/admin/orders" },
    { label: "العملاء", value: cu.v, icon: "👥", color: "#8b5cf6", href: "/admin/customers" },
    { label: "طلبات الشحن", value: tu.v, icon: "💰", color: "#f59e0b", href: "/admin/topups" },
    { label: "الخدمات", value: p.v, icon: "🛍️", color: "#22c55e", href: "/admin/products" },
    { label: "الأقسام", value: c.v, icon: "📁", color: "#06b6d4", href: "/admin/categories" },
    { label: "إيرادات مكتملة", value: `$${Number(rev.v).toLocaleString()}`, icon: "💎", color: "#f5c542", href: "/admin/orders" },
  ];

  const alerts = [
    ...(Number(pendingTopups.v) > 0 ? [{ label: `${pendingTopups.v} طلب شحن بانتظار المراجعة`, href: "/admin/topups", color: "#f59e0b" }] : []),
    ...(Number(submittedOrders.v) > 0 ? [{ label: `${submittedOrders.v} إثبات دفع بانتظار المراجعة`, href: "/admin/orders", color: "#3b82f6" }] : []),
    ...(Number(unreadMsgs.v) > 0 ? [{ label: `${unreadMsgs.v} رسالة جديدة من العملاء`, href: "/admin/customers", color: "#8b5cf6" }] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--admin-text)" }}>لوحة التحكم</h1>
        <p style={{ color: "var(--admin-text-3)", fontSize: "0.875rem", marginTop: "0.25rem" }}>مرحباً بك في لوحة إدارة B-Fix Software</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <Link key={i} href={a.href} className="admin-card flex items-center gap-3" style={{ borderRightColor: a.color, borderRightWidth: 4 }}>
              <span className="text-xl">🔔</span>
              <span className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{a.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="admin-grid-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="stat-card admin-fade">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span style={{ width: 8, height: 8, borderRadius: 9999, background: card.color }} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--admin-text)" }}>{card.value}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-3)" }}>{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Status */}
      <div className="admin-card">
        <h2 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--admin-text)" }}>📊 حالة الطلبات</h2>
        <div className="flex flex-wrap gap-3">
          {byStatus.map((r) => (
            <div key={r.status} className="stat-card" style={{ padding: "0.75rem 1.25rem" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--admin-text)" }}>{r.v}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--admin-text-3)", textTransform: "capitalize" }}>{r.status}</div>
            </div>
          ))}
          {byStatus.length === 0 && <p style={{ color: "var(--admin-text-3)", fontSize: "0.875rem" }}>لا توجد طلبات بعد</p>}
        </div>
      </div>
    </div>
  );
}
