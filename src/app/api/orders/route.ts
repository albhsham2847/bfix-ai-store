import { NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const customerName = String(b.customerName ?? "").trim();
    const phone = String(b.phone ?? "").trim();
    const productId = Number(b.productId);
    if (!productId || customerName.length < 2 || phone.replace(/\D/g, "").length < 7) {
      return NextResponse.json(
        { error: "يرجى إدخال الاسم ورقم هاتف صحيح" },
        { status: 400 },
      );
    }
    const result = await createOrder({
      productId,
      optionId: b.optionId ? Number(b.optionId) : null,
      quantity: Number(b.quantity) || 1,
      customerName,
      phone,
      email: b.email ? String(b.email).trim().slice(0, 200) : null,
      telegram: b.telegram ? String(b.telegram).trim().slice(0, 100) : null,
      customerInput: b.customerInput ? String(b.customerInput).slice(0, 1000) : null,
      notes: b.notes ? String(b.notes).slice(0, 1000) : null,
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "حدث خطأ غير متوقع";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
