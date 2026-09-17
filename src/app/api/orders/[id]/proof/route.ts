import { NextResponse } from "next/server";
import { submitPaymentProof } from "@/lib/store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const proof = String(body.proof ?? "").trim();
    if (!proof || proof.length < 3) {
      return NextResponse.json({ error: "يرجى إرسال إثبات الدفع" }, { status: 400 });
    }
    await submitPaymentProof(Number(id), proof.slice(0, 5000));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 400 });
  }
}
