import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [c] = await db.select().from(customers).where(eq(customers.id, Number(id)));
  if (!c) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json({ id: c.id, name: c.name, phone: c.phone, email: c.email, balance: c.balance, lastLoginAt: c.lastLoginAt, createdAt: c.createdAt });
}
