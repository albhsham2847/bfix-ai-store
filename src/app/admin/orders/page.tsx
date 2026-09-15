import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getOrders } from "@/lib/store";
import { STATUS_LABELS, type OrderStatus } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getOrders();
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-black">الطلبات ({list.length})</h1>
      {list.length === 0 && <div className="glass rounded-2xl p-6 text-center text-sm text-white/50">لا توجد طلبات</div>}
      {list.map((o) => (
        <Link key={o.id} href={`/admin/orders/${o.id}`} className="glass card-hover block rounded-2xl p-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-black text-gold">{o.code ?? `#${o.id}`}</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-bold ring-1 ring-white/10">
              {STATUS_LABELS[o.status as OrderStatus] ?? o.status}
            </span>
          </div>
          <div className="mt-1 font-extrabold">{o.productName}</div>
          <div className="mt-0.5 flex justify-between text-xs text-white/60">
            <span>{o.customerName} · <span dir="ltr">{o.phone}</span></span>
            <span className="font-black text-gold">${Number(o.total ?? 0).toLocaleString()}</span>
          </div>
          <div className="mt-1 text-[11px] text-white/40">{o.createdAt.toLocaleString("ar")}</div>
        </Link>
      ))}
    </div>
  );
}
