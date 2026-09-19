import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { customers, messages } from "@/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminChatList() {
  if (!(await isAdmin())) redirect("/admin/login");

  // Get customers with messages
  const withMsgs = await db.select({
    cid: messages.customerId, total: count(),
    lastMsg: sql<string>`max(${messages.content})`,
    lastAt: sql<Date>`max(${messages.createdAt})`,
    unread: sql<number>`sum(case when ${messages.sender}='customer' and ${messages.read}=false then 1 else 0 end)`,
  }).from(messages).groupBy(messages.customerId).orderBy(desc(sql`max(${messages.createdAt})`));

  return (
    <div className="space-y-4">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>💬 الدردشات</h1>
      {withMsgs.length === 0 && <div className="admin-card text-center" style={{ color: "var(--admin-text-3)" }}>لا توجد محادثات</div>}
      {withMsgs.map((m) => (
        <Link key={m.cid} href={`/admin/chat/${m.cid}`} className="admin-card flex items-center gap-3" style={{ textDecoration: "none" }}>
          <span style={{ width: 40, height: 40, borderRadius: 9999, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 900, color: "#fff" }}>💬</span>
          <div className="flex-1 min-w-0">
            <div style={{ fontWeight: 700, color: "var(--admin-text)" }}>عميل #{m.cid}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--admin-text-3)" }} className="truncate">{m.lastMsg}</div>
          </div>
          <div className="text-left">
            {Number(m.unread) > 0 && <span className="admin-badge admin-badge-danger">{m.unread}</span>}
            <div style={{ fontSize: "0.65rem", color: "var(--admin-text-3)" }}>{m.lastAt?.toLocaleDateString("ar")}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
