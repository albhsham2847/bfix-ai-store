import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, loginLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) return NextResponse.json({ error: "يرجى إدخال الرقم وكلمة المرور" }, { status: 400 });

    const [c] = await db.select().from(customers).where(eq(customers.phone, phone.trim()));
    if (!c) return NextResponse.json({ error: "رقم الهاتف غير مسجل" }, { status: 404 });
    if (!c.passwordHash || !verifyPassword(password, c.passwordHash)) {
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    await db.insert(loginLogs).values({ customerId: c.id, ip: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
    await db.update(customers).set({ lastLoginAt: new Date() }).where(eq(customers.id, c.id));

    return NextResponse.json({
      customer: { id: c.id, name: c.name, phone: c.phone, email: c.email ?? "", balance: Number(c.balance ?? 0) },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
