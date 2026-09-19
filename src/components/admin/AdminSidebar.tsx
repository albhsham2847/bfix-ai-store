"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const sections = [
  { label: "الرئيسية", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "الطلبات", href: "/admin/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "طلبات الشحن", href: "/admin/topups", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "الخدمات", href: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "الأقسام", href: "/admin/categories", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { label: "العملاء", href: "/admin/customers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  { label: "الإعلانات", href: "/admin/promotions", icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" },
      { label: "الدردشات", href: "/admin/chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div id="sidebar-overlay" className="fixed inset-0 z-40 bg-black/50 hidden lg:hidden" onClick={() => document.getElementById("admin-sidebar")?.classList.remove("open")} />
      <aside id="admin-sidebar" className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>🛡️ B-Fix Admin</h2>
          <small>لوحة التحكم الاحترافية</small>
        </div>
        <nav className="flex-1 py-2">
          {sections.map((s) => {
            const active = s.href === "/admin" ? path === "/admin" : path.startsWith(s.href);
            return (
              <Link key={s.href} href={s.href}
                className={`admin-nav-item ${active ? "active" : ""}`}
                onClick={() => document.getElementById("admin-sidebar")?.classList.remove("open")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
                {s.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
          <form action={logout}>
            <button className="admin-btn admin-btn-ghost w-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              تسجيل الخروج
            </button>
          </form>
          <Link href="/" target="_blank" className="admin-btn admin-btn-ghost w-full mt-2 text-center">
            🌐 فتح المتجر
          </Link>
        </div>
      </aside>
    </>
  );
}
