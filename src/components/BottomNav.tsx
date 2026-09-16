"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCustomer } from "@/contexts/CustomerContext";

const items = [
  { href: "/", label: "الرئيسية", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/search", label: "الخدمات", icon: "M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v7H4zM13 14h7v7h-7z" },
  { href: "/orders", label: "طلباتي", icon: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6" },
  { href: "/contact", label: "تواصل", icon: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" },
];

export default function BottomNav() {
  const path = usePathname();
  const { customer, setShowAuth } = useCustomer();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <div
        className="glass mx-auto flex max-w-md items-center justify-around rounded-2xl px-2 py-2"
        style={{
          boxShadow: "var(--shadow-lg)",
          borderColor: "var(--border)",
        }}
      >
        {items.map((it) => {
          const active =
            it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all duration-200"
              style={{
                background: active
                  ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)"
                  : "transparent",
                color: active ? "var(--text-on-gold)" : "var(--text-tertiary)",
                boxShadow: active ? "var(--shadow-gold)" : "none",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? "2.5" : "1.8"}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <path d={it.icon} />
              </svg>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
