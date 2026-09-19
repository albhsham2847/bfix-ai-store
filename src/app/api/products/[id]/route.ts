import { NextResponse } from "next/server";
import { getProduct } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(Number(id));
  if (!p) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(p);
}
