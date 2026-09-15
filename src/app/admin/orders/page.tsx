import { getOrders } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "إدارة الطلبات" };

export default async function AdminOrders() {
  const list = await getOrders();
  return (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl font-black">لوحة الطلبات ({list.length})</h1>
      {list.length === 0 && (
        <div className="glass rounded-2xl p-6 text-center text-sm text-white/50">لا توجد طلبات</div>
      )}
      {list.map((o) => (
        <div key={o.id} className="glass rounded-2xl p-4 text-sm">
          <div className="flex justify-between">
            <span className="font-black">#{o.id} · {o.productName}</span>
            <span className="rounded-full bg-gold/15 px-2 text-[11px] font-bold text-gold">{o.status}</span>
          </div>
          <div className="mt-1 text-white/70">
            {o.customerName} · <span dir="ltr">{o.phone}</span> · الكمية {o.quantity}
          </div>
          {o.notes && <div className="mt-1 text-xs text-white/50">{o.notes}</div>}
          <div className="mt-1 text-[11px] text-white/40">{o.createdAt.toLocaleString("ar")}</div>
        </div>
      ))}
    </div>
  );
}
