import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getOrderWithItems } from "@/lib/store";
import { ORDER_STATUSES, STATUS_LABELS, PAYMENT_METHODS, PAYMENT_STATUS_LABELS, type PaymentStatusType } from "@/db/schema";
import { updateOrder, deleteOrder } from "../../actions";
import ReviewPayment from "@/components/admin/ReviewPayment";

export const dynamic = "force-dynamic";

const payColors: Record<string, string> = {
  awaiting: "rgba(212,160,23,0.15)", submitted: "rgba(37,99,235,0.15)",
  accepted: "rgba(22,163,74,0.15)", rejected: "rgba(220,38,38,0.15)",
};

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const o = await getOrderWithItems(Number(id));
  if (!o) notFound();
  const wa = `https://wa.me/${o.phone.replace(/\D/g, "")}`;
  const payMethod = PAYMENT_METHODS.find((m) => m.id === o.paymentMethod);
  const ps = (o.paymentStatus ?? "awaiting") as PaymentStatusType;

  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>← الطلبات</Link>
      <section className="surface p-4 text-sm" style={{ borderRadius: "var(--radius-lg)" }}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-lg font-black" style={{ color: "var(--gold)" }}>{o.code ?? `#${o.id}`}</span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{o.createdAt.toLocaleString("ar")}</span>
        </div>
        <div className="mt-3 space-y-1" style={{ color: "var(--text-secondary)" }}>
          <div>👤 {o.customerName} · 📱 <a href={wa} target="_blank" className="text-emerald-400 underline" dir="ltr">{o.phone}</a></div>
          {o.notes && <div>🗒️ {o.notes}</div>}
        </div>
        <div className="mt-3 divide-y rounded-xl p-3" style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}>
          {o.items.map((it) => (
            <div key={it.id} className="py-2">
              <div className="flex justify-between font-bold"><span>{it.productName}{it.optionName ? ` (${it.optionName})` : ""}</span><span>${Number(it.subtotal)}</span></div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{it.quantity} × ${Number(it.unitPrice)}</div>
              {it.customerInput && <div className="mt-1 text-xs" style={{ color: "var(--gold)" }}>📝 {it.customerInput}</div>}
            </div>
          ))}
          <div className="flex justify-between pt-2 font-black"><span>الإجمالي</span><span style={{ color: "var(--gold)" }}>${Number(o.total ?? 0)}</span></div>
        </div>
      </section>

      <section className="surface p-4 text-sm" style={{ borderRadius: "var(--radius-lg)" }}>
        <h2 className="mb-3 text-base font-black">💳 الدفع</h2>
        <div className="space-y-2">
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>طريقة الدفع</span><span className="font-bold">{payMethod ? `${payMethod.icon} ${payMethod.name}` : o.paymentMethod ?? "—"}</span></div>
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>الحالة</span>
            <span className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ background: payColors[ps] ?? "var(--surface-2)", color: "var(--text-primary)" }}>{PAYMENT_STATUS_LABELS[ps]}</span></div>
          {o.paymentImage && <img src={o.paymentImage} alt="إثبات" className="mt-2 max-h-48 rounded-xl" style={{ border: "1px solid var(--border)" }} />}
          {o.paymentProof && <div className="rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
            <div className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>إثبات الدفع:</div>
            <div className="mt-1 break-words font-mono text-sm">{o.paymentProof}</div>
          </div>}
          {o.adminNote && <div className="rounded-xl p-3" style={{ background: "rgba(220,38,38,0.08)" }}>
            <div className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>ملاحظة الإدارة:</div><div className="mt-1 text-sm">{o.adminNote}</div>
          </div>}
        </div>
      </section>

      {ps === "submitted" && <ReviewPayment orderId={o.id} />}

      <form action={updateOrder} className="surface space-y-3 p-4" style={{ borderRadius: "var(--radius-lg)" }}>
        <input type="hidden" name="id" value={o.id} />
        <label className="block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>حالة الطلب</label>
        <select name="status" defaultValue={o.status} className="oneui-input">
          {ORDER_STATUSES.map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
        </select>
        <textarea name="adminNote" defaultValue={o.adminNote ?? ""} placeholder="ملاحظة داخلية" rows={2} className="oneui-input" />
        <button className="gold-btn oneui-btn w-full">حفظ</button>
      </form>

      <div className="grid grid-cols-2 gap-2">
        <a href={`${wa}?text=${encodeURIComponent(`مرحباً ${o.customerName}، بخصوص طلبك ${o.code}`)}`}
          target="_blank" className="oneui-btn text-center" style={{ background: "#25D366", color: "#000" }}>مراسلة العميل</a>
        <form action={deleteOrder}><input type="hidden" name="id" value={o.id} />
          <button className="oneui-btn w-full" style={{ background: "rgba(220,38,38,0.12)", color: "#dc2626" }}>حذف الطلب</button>
        </form>
      </div>
    </div>
  );
}
