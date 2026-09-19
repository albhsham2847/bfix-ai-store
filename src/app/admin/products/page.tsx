import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await getAllProducts(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>الخدمات</h1>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">+ إضافة خدمة</Link>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>الخدمة</th><th>القسم</th><th>السعر</th><th>الحالة</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5 }}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center text-sm`}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--admin-text)" }}>{p.name}</div>
                      {p.featured && <span style={{ fontSize: "0.65rem", color: "var(--admin-gold)" }}>⭐ مميز</span>}
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: "0.75rem" }}>{p.categoryName}</td>
                <td style={{ fontWeight: 900, color: "var(--admin-gold)" }}>${Number(p.price)}</td>
                <td><span className={`admin-badge ${p.active ? "admin-badge-success" : "admin-badge-danger"}`}>{p.active ? "مفعّل" : "معطّل"}</span></td>
                <td><Link href={`/admin/products/${p.id}`} className="admin-btn admin-btn-ghost" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}>تعديل</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
