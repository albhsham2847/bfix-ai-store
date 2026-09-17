import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getOrders } from "@/lib/store";
import { STATUS_LABELS, PAYMENT_STATUS_LABELS, type OrderStatus, type PaymentStatusType } from "@/db/schema";

export const dynamic = "force-dynamic";

const payColors: Record<string, string> = {
  awaiting: "rgba(212,160,23,0.15)",
  submitted: "rgba(37,99,235,0.15)",
  accepted: "rgba(22,163,74,0.15)",
  rejected: "rgba(220,38,38,0.15)",
};

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getOrders();
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-black">الطلبات ({list.length})</h1>
      {list.length === 0 && (
        <div className="surface p-6 text-center text-sm" style={{ borderRadius: "var(--radius-md)", color: "var(--text-tertiary)" }}>
          لا توجد طلبات
        </div>
      )}
      {list.map((o) => {
        const ps = (o.paymentStatus ?? "awaiting") as PaymentStatusType;
        return (
          <Link key={o.id} href={`/admin/orders/${o.id}`}
            className="surface card-hover block p-4 text-sm" style={{ borderRadius: "var(--radius-md)" }}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-black" style={{ color: "var(--gold)" }}>{o.code ?? `#${o.id}`}</span>
              <div className="flex gap-1">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: payColors[ps] ?? "var(--surface-2)", color: "var(--text-primary)" }}>
                  {PAYMENT_STATUS_LABELS[ps]}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                  {STATUS_LABELS[o.status as OrderStatus] ?? o.status}
                </span>
              </div>
            </div>
            <div className="mt-1 font-extrabold" style={{ color: "var(--text-primary)" }}>{o.productName}</div>
            <div className="mt-0.5 flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>{o.customerName} · <span dir="ltr">{o.phone}</span></span>
              <span className="font-black" style={{ color: "var(--gold)" }}>${Number(o.total ?? 0)}</span>
            </div>
            {ps === "submitted" && (
              <div className="mt-1 text-[11px] font-bold" style={{ color: "#2563eb" }}>🔔 سند جديد بانتظار المراجعة</div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
