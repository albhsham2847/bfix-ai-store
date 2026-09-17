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
    <div className="space-y-3">
      <h1 className="text-xl font-black">طلبات الشحن ({list.length})</h1>
      {list.length === 0 && <div className="surface p-6 text-center text-sm" style={{ borderRadius: "var(--radius-md)", color: "var(--text-tertiary)" }}>لا توجد طلبات شحن</div>}
      {list.map((t) => <TopupReviewCard key={t.id} t={t} />)}
    </div>
  );
}
