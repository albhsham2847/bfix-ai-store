import { NextResponse } from "next/server";
import { db } from "@/db";
import { promotions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(promotions).where(eq(promotions.active, true)).orderBy(desc(promotions.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const [p] = await db.insert(promotions).values({
      title: String(b.title ?? "").slice(0, 200),
      body: b.body ? String(b.body).slice(0, 2000) : null,
      image: b.image ? String(b.image).slice(0, 500_000) : null,
      link: b.link ? String(b.link).slice(0, 500) : null,
      categorySlug: b.categorySlug ? String(b.categorySlug).slice(0, 100) : null,
      active: b.active !== false,
    }).returning();
    return NextResponse.json(p);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
