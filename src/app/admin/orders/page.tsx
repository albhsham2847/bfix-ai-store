import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getOrders } from "@/lib/store";
import { STATUS_LABELS, PAYMENT_STATUS_LABELS, type OrderStatus, type PaymentStatusType } from "@/db/schema";

export const dynamic = "force-dynamic";

const psBadge: Record<string, string> = {
  awaiting: "admin-badge-warning", submitted: "admin-badge-info", accepted: "admin-badge-success", rejected: "admin-badge-danger",
};

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getOrders();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>الطلبات</h1>
        <span className="admin-badge admin-badge-info">{list.length} طلب</span>
      </div>
      {list.length === 0 && <div className="admin-card text-center" style={{ color: "var(--admin-text-3)" }}>لا توجد طلبات</div>}
      <div className="space-y-2">
        {list.map((o) => {
          const ps = (o.paymentStatus ?? "awaiting") as PaymentStatusType;
          return (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="admin-card block" style={{ textDecoration: "none" }}>
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 800, color: "var(--admin-gold)" }}>{o.code ?? `#${o.id}`}</span>
                <div className="flex gap-1">
                  <span className={`admin-badge ${psBadge[ps] ?? "admin-badge-info"}`}>{PAYMENT_STATUS_LABELS[ps]}</span>
                  <span className="admin-badge admin-badge-purple">{STATUS_LABELS[o.status as OrderStatus] ?? o.status}</span>
                </div>
              </div>
              <div style={{ marginTop: "0.5rem", fontWeight: 800, fontSize: "0.875rem", color: "var(--admin-text)" }}>{o.productName}</div>
              <div className="flex justify-between mt-1" style={{ fontSize: "0.75rem", color: "var(--admin-text-3)" }}>
                <span>{o.customerName} · <span dir="ltr">{o.phone}</span></span>
                <span style={{ fontWeight: 900, color: "var(--admin-gold)" }}>${Number(o.total ?? 0)}</span>
              </div>
              {ps === "submitted" && <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", fontWeight: 700, color: "#60a5fa" }}>🔔 سند بانتظار المراجعة</div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
