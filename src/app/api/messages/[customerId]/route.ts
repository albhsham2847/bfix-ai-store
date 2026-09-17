import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const rows = await db.select().from(messages).where(eq(messages.customerId, Number(customerId))).orderBy(desc(messages.createdAt)).limit(100);
  return NextResponse.json(rows.reverse());
}
