"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "رجوع" }: { label?: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}
      className="flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-80"
      style={{ color: "var(--text-tertiary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
