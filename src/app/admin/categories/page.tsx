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
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>الأقسام ({list.length})</h1>
      <CategoryForm key={editing?.id ?? "new"} category={editing} action={saveCategory} />
      <div className="space-y-2">
        {list.map((c) => (
          <div key={c.id} className="admin-card flex items-center gap-3" style={{ opacity: c.active ? 1 : 0.5 }}>
            <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-xl`}>{c.icon}</span>
            <div className="flex-1 min-w-0">
              <div style={{ fontWeight: 800, color: "var(--admin-text)" }}>{c.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--admin-text-3)" }}>/{c.slug} · ترتيب {c.sortOrder}</div>
            </div>
            <a href={`/admin/categories?edit=${c.id}`} className="admin-btn admin-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}>تعديل</a>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button className="admin-btn admin-btn-danger" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}>حذف</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
