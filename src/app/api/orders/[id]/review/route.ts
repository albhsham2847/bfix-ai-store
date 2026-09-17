import { NextResponse } from "next/server";
import { reviewPayment } from "@/lib/store";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const status = body.status as "accepted" | "rejected";
    if (status !== "accepted" && status !== "rejected") {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }
    await reviewPayment(Number(id), status, body.reason || undefined);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 400 });
  }
}
