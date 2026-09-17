import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

export async function POST(req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  try {
    const { customerId } = await params;
    const { sender, content, image } = await req.json();
    if (!sender || !content && !image) return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    const [m] = await db.insert(messages).values({
      customerId: Number(customerId), sender: String(sender),
      content: String(content ?? "").slice(0, 5000),
      image: image?.slice(0, 500_000) || null,
    }).returning();
    return NextResponse.json(m);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
