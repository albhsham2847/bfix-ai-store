import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const proof = String(body.proof ?? "").trim();
    const image = body.image ? String(body.image).slice(0, 500_000) : null;
    if (!proof && !image) return NextResponse.json({ error: "يرجى إرسال إثبات الدفع" }, { status: 400 });

    await db.update(orders).set({
      paymentProof: proof || null,
      paymentImage: image,
      paymentStatus: "submitted",
      updatedAt: new Date(),
    }).where(eq(orders.id, Number(id)));

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 400 });
  }
}
