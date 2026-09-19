import type { ReactNode } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import "../admin-styles/admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const ok = await isAdmin();
  if (!ok) return <div className="admin-root">{children}</div>;

  return (
    <div className="admin-root">
      <AdminTopbar />
      <AdminSidebar />
      <main className="admin-main admin-fade">{children}</main>
    </div>
  );
}
