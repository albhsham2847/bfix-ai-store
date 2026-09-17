import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, categories, customers, topupRequests, messages } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { STATUS_LABELS, type OrderStatus } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [[o], [p], [c], [cu], [tu], [unread], byStatus, [rev]] = await Promise.all([
    db.select({ v: count() }).from(orders),
    db.select({ v: count() }).from(products),
    db.select({ v: count() }).from(categories),
    db.select({ v: count() }).from(customers),
    db.select({ v: count() }).from(topupRequests),
    db.select({ v: count() }).from(messages).where(eq(messages.read, false)),
    db.select({ status: orders.status, v: count() }).from(orders).groupBy(orders.status),
    db.select({ v: sql<string>`coalesce(sum(${orders.total}),0)` }).from(orders).where(eq(orders.status, "completed")),
  ]);

  const stats = [
    ["🛒 الطلبات", o.v, "/admin/orders"],
    ["👥 العملاء", cu.v, "/admin/customers"],
    ["💰 طلبات الشحن", tu.v, "/admin/topups"],
    ["🛍️ الخدمات", p.v, "/admin/products"],
    ["📁 الأقسام", c.v, "/admin/categories"],
    ["💬 رسائل جديدة", unread.v, "/admin/customers"],
  ] as const;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">لوحة التحكم</h1>
      <div className="grid grid-cols-2 gap-2">
        {stats.map(([l, v, href]) => (
          <Link key={l} href={href} className="surface card-hover p-4" style={{ borderRadius: "var(--radius-md)" }}>
            <div className="text-2xl font-black" style={{ color: "var(--gold)" }}>{v}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{l}</div>
          </Link>
        ))}
        <div className="col-span-2 surface p-4" style={{ borderRadius: "var(--radius-md)" }}>
          <div className="text-2xl font-black" style={{ color: "#22c55e" }}>${Number(rev.v).toLocaleString()}</div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>إيرادات الطلبات المكتملة</div>
        </div>
      </div>
      <div className="surface p-4" style={{ borderRadius: "var(--radius-md)" }}>
        <h2 className="mb-2 text-sm font-black">الطلبات حسب الحالة</h2>
        <div className="flex flex-wrap gap-2">
          {byStatus.map((r) => (
            <span key={r.status} className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              {STATUS_LABELS[r.status as OrderStatus] ?? r.status}: {r.v}
            </span>
          ))}
          {byStatus.length === 0 && <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>لا توجد طلبات</span>}
        </div>
      </div>
    </div>
  );
}
