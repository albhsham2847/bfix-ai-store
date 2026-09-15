import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, categories, customers } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { STATUS_LABELS, type OrderStatus } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [[o], [p], [c], [cu], byStatus, [rev]] = await Promise.all([
    db.select({ v: count() }).from(orders),
    db.select({ v: count() }).from(products),
    db.select({ v: count() }).from(categories),
    db.select({ v: count() }).from(customers),
    db.select({ status: orders.status, v: count() }).from(orders).groupBy(orders.status),
    db.select({ v: sql<string>`coalesce(sum(${orders.total}),0)` }).from(orders).where(eq(orders.status, "completed")),
  ]);
  const stats = [
    ["الطلبات", o.v, "/admin/orders"],
    ["الخدمات", p.v, "/admin/products"],
    ["الأقسام", c.v, "/admin/categories"],
    ["العملاء", cu.v, "/admin/orders"],
  ] as const;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">لوحة التحكم</h1>
      <div className="grid grid-cols-2 gap-2">
        {stats.map(([l, v, href]) => (
          <Link key={l} href={href} className="glass card-hover rounded-2xl p-4">
            <div className="text-2xl font-black text-gold">{v}</div>
            <div className="text-xs text-white/60">{l}</div>
          </Link>
        ))}
        <div className="glass col-span-2 rounded-2xl p-4">
          <div className="text-2xl font-black text-emerald-300">${Number(rev.v).toLocaleString()}</div>
          <div className="text-xs text-white/60">إيرادات الطلبات المكتملة</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4">
        <h2 className="mb-2 text-sm font-black">الطلبات حسب الحالة</h2>
        <div className="flex flex-wrap gap-2">
          {byStatus.map((r) => (
            <span key={r.status} className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold ring-1 ring-white/10">
              {STATUS_LABELS[r.status as OrderStatus] ?? r.status}: {r.v}
            </span>
          ))}
          {byStatus.length === 0 && <span className="text-xs text-white/50">لا توجد طلبات بعد</span>}
        </div>
      </div>
    </div>
  );
}
