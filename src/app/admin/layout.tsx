import type { ReactNode } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ok = await isAdmin();
  if (!ok) return <div className="pt-4">{children}</div>;
  return (
    <div className="space-y-4 pt-4">
      <div className="glass flex items-center justify-between gap-2 rounded-2xl px-3 py-2" style={{ borderColor: "var(--border)" }}>
        <AdminNav />
        <form action={logout}>
          <button className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold"
            style={{ background: "rgba(220,38,38,0.12)", color: "#dc2626" }}>خروج</button>
        </form>
      </div>
      {children}
    </div>
  );
}
