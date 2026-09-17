"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["/admin", "لوحة التحكم"],
  ["/admin/orders", "الطلبات"],
  ["/admin/topups", "الشحنات"],
  ["/admin/products", "الخدمات"],
  ["/admin/categories", "الأقسام"],
  ["/admin/customers", "العملاء"],
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto">
      {nav.map(([href, label]) => {
        const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold ${active ? "gold-btn" : ""}`}
            style={{ color: active ? undefined : "var(--text-secondary)" }}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
