import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getCategories } from "@/lib/store";
import { saveCategory, deleteCategory } from "../actions";
import CategoryForm from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { edit } = await searchParams;
  const list = await getCategories(true);
  const editing = edit ? list.find((c) => c.id === Number(edit)) ?? null : null;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">الأقسام ({list.length})</h1>
      <CategoryForm key={editing?.id ?? "new"} category={editing} action={saveCategory} />
      <div className="space-y-2">
        {list.map((c) => (
          <div key={c.id} className={`glass flex items-center gap-3 rounded-2xl p-3 ${!c.active ? "opacity-50" : ""}`}>
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-xl`}>{c.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold">{c.name}</div>
              <div className="text-[11px] text-white/45">/{c.slug} · ترتيب {c.sortOrder}</div>
            </div>
            <a href={`/admin/categories?edit=${c.id}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold">تعديل</a>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-300">حذف</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
