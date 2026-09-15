import type { Category } from "@/db/schema";

const GRADIENTS = [
  "from-amber-400 to-orange-600", "from-cyan-400 to-blue-600", "from-violet-500 to-fuchsia-600",
  "from-emerald-400 to-teal-600", "from-yellow-400 to-amber-600", "from-rose-400 to-pink-600",
  "from-sky-400 to-indigo-600", "from-lime-400 to-green-600", "from-blue-400 to-blue-700",
  "from-orange-400 to-red-600", "from-indigo-400 to-purple-700",
];

const cls = "w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-gold/60";

export default function CategoryForm({ category, action }: { category: Category | null; action: (f: FormData) => Promise<void> }) {
  const c = category;
  return (
    <form action={action} className="glass grid grid-cols-2 gap-2 rounded-2xl p-4">
      <input type="hidden" name="id" value={c?.id ?? ""} />
      <h2 className="col-span-2 text-sm font-black">{c ? "تعديل القسم" : "إضافة قسم جديد"}</h2>
      <input name="name" required defaultValue={c?.name} placeholder="اسم القسم" className={cls} />
      <input name="slug" required defaultValue={c?.slug} placeholder="slug (en)" dir="ltr" className={cls} />
      <input name="description" required defaultValue={c?.description} placeholder="وصف مختصر" className={`${cls} col-span-2`} />
      <input name="icon" defaultValue={c?.icon} placeholder="أيقونة (إيموجي)" className={cls} />
      <select name="gradient" defaultValue={c?.gradient ?? GRADIENTS[0]} className={cls}>
        {GRADIENTS.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <input name="imageUrl" defaultValue={c?.imageUrl ?? ""} placeholder="رابط صورة (اختياري)" dir="ltr" className={`${cls} col-span-2`} />
      <input name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} placeholder="الترتيب" className={cls} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={c?.active ?? true} /> مفعّل</label>
      <button className="gold-btn col-span-2 rounded-xl py-2.5 text-sm font-black">حفظ</button>
      {c && <a href="/admin/categories" className="col-span-2 text-center text-xs text-white/50">إلغاء التعديل</a>}
    </form>
  );
}
