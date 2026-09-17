import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, loginLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, phone, email, password } = await req.json();
    if (!name || name.length < 2) return NextResponse.json({ error: "يرجى إدخال الاسم" }, { status: 400 });
    if (!phone || phone.replace(/\D/g, "").length < 7) return NextResponse.json({ error: "يرجى إدخال رقم هاتف صحيح" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });

    const existing = await db.select().from(customers).where(eq(customers.phone, phone.trim()));
    if (existing.length > 0) return NextResponse.json({ error: "رقم الهاتف مسجل مسبقاً — سجّل دخولك" }, { status: 400 });

    const [c] = await db.insert(customers).values({
      name: name.trim(), phone: phone.trim(), email: email?.trim() || null,
      passwordHash: hashPassword(password),
    }).returning();

    await db.insert(loginLogs).values({ customerId: c.id, ip: req.headers.get("x-forwarded-for") || "", userAgent: req.headers.get("user-agent") || "" });
    await db.update(customers).set({ lastLoginAt: new Date() }).where(eq(customers.id, c.id));

    return NextResponse.json({ customer: { id: c.id, name: c.name, phone: c.phone, email: c.email ?? "", balance: 0 } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
