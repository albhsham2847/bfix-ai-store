import { NextResponse } from "next/server";
import { db } from "@/db";
import { topupRequests, customers } from "@/db/schema";
import { eq } from "drizzle-orm";

function genCode() {
  return `TU-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const customerId = Number(b.customerId);
    const amount = Number(b.amount);
    const paymentMethod = String(b.paymentMethod ?? "").trim();
    if (!customerId || !amount || amount < 1 || !paymentMethod) {
      return NextResponse.json({ error: "يرجى تعبئة جميع الحقول" }, { status: 400 });
    }
    const [c] = await db.select().from(customers).where(eq(customers.id, customerId));
    if (!c) return NextResponse.json({ error: "العميل غير موجود" }, { status: 404 });

    const [req2] = await db.insert(topupRequests).values({
      code: genCode(), customerId, customerName: c.name, phone: c.phone,
      amount: amount.toFixed(2), paymentMethod,
      proofText: b.proofText?.slice(0, 5000) || null,
      proofImage: b.proofImage?.slice(0, 500_000) || null,
    }).returning();

    return NextResponse.json({ request: req2 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}

export async function GET() {
  const rows = await db.select().from(topupRequests).orderBy(topupRequests.createdAt);
  return NextResponse.json(rows);
}
