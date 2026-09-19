import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { topupRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import TopupReviewCard from "@/components/admin/TopupReviewCard";

export const dynamic = "force-dynamic";

export default async function AdminTopups() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await db.select().from(topupRequests).orderBy(desc(topupRequests.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 900 }}>💰 طلبات الشحن</h1>
        <span className="admin-badge admin-badge-warning">{list.length} طلب</span>
      </div>
      {list.length === 0 && <div className="admin-card text-center" style={{ color: "var(--admin-text-3)" }}>لا توجد طلبات شحن</div>}
      {list.map((t) => <TopupReviewCard key={t.id} t={t} />)}
    </div>
  );
}
