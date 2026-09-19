import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { customers, orders, topupRequests } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  if (!(await isAdmin())) redirect("/admin/login");
  const custs = await db.select().from(customers).orderBy(desc(customers.createdAt));
  const orderCounts = await db.select({ cid: orders.customerId, cnt: count() }).from(orders).groupBy(orders.customerId);
  const oMap = new Map(orderCounts.map((r) => [r.cid, Number(r.cnt)]));
  const topupCounts = await db.select({ cid: topupRequests.customerId, cnt: count() }).from(topupRequests).groupBy(topupRequests.customerId);
  const tMap = new Map(topupCounts.map((r) => [r.cid, Number(r.cnt)]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>العملاء</h1>
        <span className="admin-badge admin-badge-purple">{custs.length} عميل</span>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>العميل</th>
              <th>الهاتف</th>
              <th>الرصيد</th>
              <th>الطلبات</th>
              <th>الشحنات</th>
              <th>آخر دخول</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {custs.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span style={{ width: 32, height: 32, borderRadius: 9999, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 900, color: "#fff" }}>{c.name.charAt(0)}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--admin-text)" }}>{c.name}</div>
                      {c.email && <div style={{ fontSize: "0.7rem", color: "var(--admin-text-3)" }}>{c.email}</div>}
                    </div>
                  </div>
                </td>
                <td dir="ltr" style={{ fontFamily: "monospace" }}>{c.phone}</td>
                <td style={{ fontWeight: 900, color: "var(--admin-gold)" }}>${Number(c.balance ?? 0)}</td>
                <td>{oMap.get(c.id) ?? 0}</td>
                <td>{tMap.get(c.id) ?? 0}</td>
                <td style={{ fontSize: "0.75rem" }}>{c.lastLoginAt?.toLocaleDateString("ar") ?? "—"}</td>
                <td>
                  <Link href={`/admin/chat/${c.id}`} className="admin-btn admin-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.75rem" }}>💬</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
