"use client";

export default function AdminTopbar() {
  return (
    <div className="admin-topbar">
      <button onClick={() => {
        document.getElementById("admin-sidebar")?.classList.toggle("open");
        document.getElementById("sidebar-overlay")?.classList.toggle("hidden");
      }} className="admin-btn admin-btn-ghost p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span className="mr-3 text-sm font-black" style={{ color: "var(--admin-accent-light)" }}>🛡️ B-Fix Admin</span>
    </div>
  );
}
