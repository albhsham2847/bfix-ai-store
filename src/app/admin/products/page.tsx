import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getAllProducts(true);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">الخدمات ({list.length})</h1>
        <Link href="/admin/products/new" className="gold-btn rounded-xl px-4 py-2 text-xs font-black">+ إضافة خدمة</Link>
      </div>
      {list.map((p) => (
        <Link key={p.id} href={`/admin/products/${p.id}`} className={`glass card-hover flex items-center gap-3 rounded-2xl p-3 ${!p.active ? "opacity-50" : ""}`}>
          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.gradient} text-xl`}>{p.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-extrabold">{p.name} {p.featured && "⭐"}</div>
            <div className="text-[11px] text-white/45">{p.categoryName}</div>
          </div>
          <div className="font-black text-gold">${Number(p.price)}</div>
        </Link>
      ))}
    </div>
  );
}
