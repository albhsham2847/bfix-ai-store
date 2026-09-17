import { NextResponse } from "next/server";
import { db } from "@/db";
import { topupRequests, customers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const { id } = await params;
    const { status, adminNote, amount } = await req.json();
    if (status !== "accepted" && status !== "rejected") return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });

    const [t] = await db.select().from(topupRequests).where(eq(topupRequests.id, Number(id)));
    if (!t) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

    await db.update(topupRequests).set({ status, adminNote: adminNote || null, reviewedAt: new Date() }).where(eq(topupRequests.id, Number(id)));

    if (status === "accepted") {
      const topupAmount = amount ? Number(amount) : Number(t.amount);
      await db.update(customers).set({
        balance: sql`coalesce(${customers.balance}, 0) + ${topupAmount.toFixed(2)}`,
      }).where(eq(customers.id, t.customerId));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
