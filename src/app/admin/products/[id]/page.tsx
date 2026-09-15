import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getCategories, getProduct } from "@/lib/store";
import { saveProduct, deleteProduct, addOption, deleteOption } from "../../actions";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProduct({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const cats = await getCategories(true);
  const isNew = id === "new";
  const p = isNew ? null : await getProduct(Number(id));
  if (!isNew && !p) notFound();

  return (
    <div className="space-y-4">
      <Link href="/admin/products" className="text-xs font-bold text-white/50">← الخدمات</Link>
      <h1 className="text-xl font-black">{isNew ? "إضافة خدمة" : `تعديل: ${p!.name}`}</h1>
      <ProductForm product={p} categories={cats.map((c) => ({ id: c.id, name: c.name }))} action={saveProduct} />

      {p && (
        <>
          <section className="glass space-y-3 rounded-2xl p-4">
            <h2 className="text-sm font-black">الخيارات / المدد / الباقات</h2>
            {p.options.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2 text-sm">
                <span className="font-bold">{o.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-black text-gold">${Number(o.price)}</span>
                  <form action={deleteOption}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="text-xs font-bold text-rose-300">حذف</button>
                  </form>
                </div>
              </div>
            ))}
            <form action={addOption} className="grid grid-cols-5 gap-2">
              <input type="hidden" name="productId" value={p.id} />
              <input name="name" required placeholder="مثال: سنة" className="col-span-2 rounded-xl bg-black/30 px-3 py-2 text-sm ring-1 ring-white/10" />
              <input name="price" type="number" step="0.01" required placeholder="السعر $" className="rounded-xl bg-black/30 px-3 py-2 text-sm ring-1 ring-white/10" />
              <input name="sortOrder" type="number" placeholder="ترتيب" className="rounded-xl bg-black/30 px-3 py-2 text-sm ring-1 ring-white/10" />
              <button className="gold-btn rounded-xl text-xs font-black">إضافة</button>
            </form>
          </section>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={p.id} />
            <button className="w-full rounded-xl bg-rose-500/15 py-2.5 text-sm font-bold text-rose-300 ring-1 ring-rose-500/30">حذف الخدمة نهائياً</button>
          </form>
        </>
      )}
    </div>
  );
}
