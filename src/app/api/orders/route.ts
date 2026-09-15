import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrders } from "@/lib/store";

export async function GET() {
  const rows = await getOrders();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = Number(body.productId);
    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const quantity = Math.max(1, Math.min(100, Number(body.quantity) || 1));
    const notes = body.notes ? String(body.notes).slice(0, 1000) : null;

    if (!productId || customerName.length < 2 || phone.length < 6) {
      return NextResponse.json(
        { error: "يرجى إدخال الاسم ورقم الهاتف بشكل صحيح" },
        { status: 400 },
      );
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    const [order] = await db
      .insert(orders)
      .values({
        productId,
        productName: product.name,
        customerName,
        phone,
        quantity,
        notes,
      })
      .returning();

    return NextResponse.json({ order, product });
  } catch {
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
