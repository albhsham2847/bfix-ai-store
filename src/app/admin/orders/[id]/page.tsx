import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getOrderWithItems } from "@/lib/store";
import { ORDER_STATUSES, STATUS_LABELS } from "@/db/schema";
import { updateOrder, deleteOrder } from "../../actions";
import { CONTACT } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const o = await getOrderWithItems(Number(id));
  if (!o) notFound();
  const wa = `https://wa.me/${o.phone.replace(/\D/g, "")}`;
  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="text-xs font-bold text-white/50">← الطلبات</Link>
      <section className="glass rounded-2xl p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-black text-gold">{o.code ?? `#${o.id}`}</span>
          <span className="text-xs text-white/50">{o.createdAt.toLocaleString("ar")}</span>
        </div>
        <div className="mt-3 space-y-1">
          <div>👤 {o.customerName}</div>
          <div>📱 <a href={wa} target="_blank" className="text-emerald-300 underline" dir="ltr">{o.phone}</a></div>
          {o.notes && <div>🗒️ {o.notes}</div>}
        </div>
        <div className="mt-3 divide-y divide-white/5 rounded-xl bg-black/25 p-3">
          {o.items.map((it) => (
            <div key={it.id} className="py-2">
              <div className="flex justify-between font-bold">
                <span>{it.productName}{it.optionName ? ` (${it.optionName})` : ""}</span>
                <span>${Number(it.subtotal)}</span>
              </div>
              <div className="text-xs text-white/50">{it.quantity} × ${Number(it.unitPrice)}</div>
              {it.customerInput && <div className="mt-1 text-xs text-gold">📝 {it.customerInput}</div>}
            </div>
          ))}
          <div className="flex justify-between pt-2 font-black">
            <span>الإجمالي</span><span className="text-gold">${Number(o.total ?? 0)}</span>
          </div>
        </div>
      </section>

      <form action={updateOrder} className="glass space-y-3 rounded-2xl p-4">
        <input type="hidden" name="id" value={o.id} />
        <label className="block text-xs font-bold text-white/60">حالة الطلب</label>
        <select name="status" defaultValue={o.status} className="w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm ring-1 ring-white/10">
          {ORDER_STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
        </select>
        <textarea name="adminNote" defaultValue={o.adminNote ?? ""} placeholder="ملاحظة داخلية" rows={2} className="w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm ring-1 ring-white/10" />
        <button className="gold-btn w-full rounded-xl py-2.5 text-sm font-black">حفظ</button>
      </form>

      <div className="grid grid-cols-2 gap-2">
        <a href={`${wa}?text=${encodeURIComponent(`مرحباً ${o.customerName}، بخصوص طلبك ${o.code} في B-Fix Software`)}`} target="_blank" className="rounded-xl bg-[#25D366] py-2.5 text-center text-sm font-black text-black">مراسلة العميل</a>
        <form action={deleteOrder}>
          <input type="hidden" name="id" value={o.id} />
          <button className="w-full rounded-xl bg-rose-500/15 py-2.5 text-sm font-bold text-rose-300 ring-1 ring-rose-500/30">حذف الطلب</button>
        </form>
      </div>
      <p className="text-center text-[11px] text-white/30">إدارة: {CONTACT.phoneDisplay}</p>
    </div>
  );
}
