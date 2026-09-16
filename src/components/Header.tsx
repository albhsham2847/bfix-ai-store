"use client";

import Link from "next/link";
import Image from "next/image";
import { useCustomer } from "@/contexts/CustomerContext";
import ThemeToggle from "./auth/ThemeToggle";

export default function Header() {
  const { customer, setShowAuth } = useCustomer();

  return (
    <header className="sticky top-0 z-40 px-4 safe-top">
      <div
        className="glass mt-3 flex items-center justify-between rounded-2xl px-4 py-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icons/icon-192.png"
            alt="B-Fix"
            width={40}
            height={40}
            priority
            className="rounded-xl"
          />
          <div className="leading-tight">
            <div className="text-[15px] font-black tracking-wide">
              <span className="gold-text">B-Fix</span>{" "}
              <span style={{ color: "var(--text-primary)" }}>Software</span>
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              AI Store
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setShowAuth(true)}
            aria-label="حسابي"
            className="relative grid h-10 w-10 place-items-center rounded-xl transition-all duration-200"
            style={{
              background: customer
                ? "linear-gradient(135deg, #d4a017, #f5c542)"
                : "var(--surface-2)",
              border: `1px solid ${customer ? "transparent" : "var(--border)"}`,
              color: customer ? "var(--text-on-gold)" : "var(--text-secondary)",
            }}
          >
            {customer ? (
              <span className="text-sm font-black">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
            {customer && (
              <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 bg-emerald-400" style={{ borderColor: "var(--surface)" }} />
            )}
          </button>

          <Link
            href="/search"
            aria-label="بحث"
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
