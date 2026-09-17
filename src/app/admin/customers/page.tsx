import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { customers, orders, loginLogs, topupRequests } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  if (!(await isAdmin())) redirect("/admin/login");

  const custs = await db.select().from(customers).orderBy(desc(customers.createdAt));
  const orderCounts = await db.select({ customerId: orders.customerId, cnt: count() }).from(orders).groupBy(orders.customerId);
  const orderMap = new Map(orderCounts.map((r) => [r.customerId, Number(r.cnt)]));
  const topupCounts = await db.select({ customerId: topupRequests.customerId, cnt: count() }).from(topupRequests).groupBy(topupRequests.customerId);
  const topupMap = new Map(topupCounts.map((r) => [r.customerId, Number(r.cnt)]));

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-black">العملاء ({custs.length})</h1>
      {custs.map((c) => (
        <div key={c.id} className="surface p-4 text-sm" style={{ borderRadius: "var(--radius-md)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">
                {c.name.charAt(0)}
              </span>
              <div>
                <div className="font-extrabold" style={{ color: "var(--text-primary)" }}>{c.name}</div>
                <div className="text-xs font-mono" dir="ltr" style={{ color: "var(--text-tertiary)" }}>{c.phone}</div>
              </div>
            </div>
            <div className="text-left">
              <div className="font-black" style={{ color: "var(--gold)" }}>${Number(c.balance ?? 0)}</div>
              <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>الرصيد</div>
            </div>
          </div>
          <div className="mt-2 flex gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>🛒 {orderMap.get(c.id) ?? 0} طلب</span>
            <span>💰 {topupMap.get(c.id) ?? 0} شحن</span>
            {c.email && <span>✉️ {c.email}</span>}
          </div>
          <div className="mt-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            التسجيل: {c.createdAt.toLocaleDateString("ar")}
            {c.lastLoginAt && <> · آخر دخول: {c.lastLoginAt.toLocaleString("ar")}</>}
          </div>
          <div className="mt-2 flex gap-2">
            <Link href={`/admin/chat/${c.id}`} className="oneui-btn text-xs px-3 py-1.5"
              style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              💬 دردشة
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
