import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, newPassword } = await req.json();
    if (!phone || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "يرجى إدخال الرقم وكلمة المرور الجديدة" }, { status: 400 });
    }
    const [c] = await db.select().from(customers).where(eq(customers.phone, phone.trim()));
    if (!c) return NextResponse.json({ error: "رقم الهاتف غير مسجل" }, { status: 404 });

    await db.update(customers).set({ passwordHash: hashPassword(newPassword) }).where(eq(customers.id, c.id));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
