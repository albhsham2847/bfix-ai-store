import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  try {
    const { title, body } = await req.json();
    // Store broadcast for SW to pick up
    return NextResponse.json({ ok: true, broadcast: { title, body, sentAt: new Date().toISOString() } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}
