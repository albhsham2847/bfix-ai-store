type P = {
  id: number; categoryId: number; name: string; description: string; details: string | null;
  imageUrl: string | null; price: string; unit: string; badge: string | null;
  requiredInfo: string | null; featured: boolean; active: boolean;
} | null;

const cls = "w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-gold/60";

export default function ProductForm({ product: p, categories, action }: {
  product: P; categories: { id: number; name: string }[]; action: (f: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="glass grid grid-cols-2 gap-2 rounded-2xl p-4">
      <input type="hidden" name="id" value={p?.id ?? ""} />
      <input name="name" required defaultValue={p?.name} placeholder="اسم الخدمة" className={`${cls} col-span-2`} />
      <select name="categoryId" required defaultValue={p?.categoryId ?? categories[0]?.id} className={`${cls} col-span-2`}>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input name="description" required defaultValue={p?.description} placeholder="وصف مختصر" className={`${cls} col-span-2`} />
      <textarea name="details" defaultValue={p?.details ?? ""} rows={3} placeholder="تفاصيل الخدمة الكاملة (اختياري)" className={`${cls} col-span-2`} />
      <input name="price" type="number" step="0.01" required defaultValue={p?.price} placeholder="السعر الأساسي $" className={cls} />
      <input name="unit" defaultValue={p?.unit} placeholder="الوحدة (سنة/شهر/UC)" className={cls} />
      <input name="badge" defaultValue={p?.badge ?? ""} placeholder="شارة (الأكثر طلباً)" className={cls} />
      <input name="sortOrder" type="number" defaultValue={0} placeholder="الترتيب" className={cls} />
      <input name="imageUrl" defaultValue={p?.imageUrl ?? ""} placeholder="رابط صورة الخدمة (اختياري)" dir="ltr" className={`${cls} col-span-2`} />
      <input name="requiredInfo" defaultValue={p?.requiredInfo ?? ""} placeholder="البيانات المطلوبة من العميل (مثال: ID اللاعب)" className={`${cls} col-span-2`} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} /> مميز (الأكثر طلباً)</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> مفعّل</label>
      <button className="gold-btn col-span-2 rounded-xl py-2.5 text-sm font-black">حفظ الخدمة</button>
    </form>
  );
}
