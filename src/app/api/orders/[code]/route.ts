import { NextResponse } from "next/server";
import { getOrderByCode } from "@/lib/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const order = await getOrderByCode(code.toUpperCase());
  if (!order) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  // public-safe subset
  return NextResponse.json({
    code: order.code,
    productName: order.productName,
    quantity: order.quantity,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
  });
}
