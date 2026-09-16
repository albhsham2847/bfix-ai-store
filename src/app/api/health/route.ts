import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // Basic env check
  checks.env = process.env.DATABASE_URL ? "ok" : "missing DATABASE_URL";

  // Database ping
  try {
    const result = await db.execute(sql`select now() as now`);
    const row = result.rows[0] as Record<string, unknown>;
    checks.database = "ok";
    checks.dbTime = String(row.now);
  } catch (e) {
    checks.database = "fail";
    checks.dbError = e instanceof Error ? e.message.slice(0, 200) : "unknown";
  }

  // Table check
  try {
    const result = await db.execute(
      sql`select count(*)::int as cnt from information_schema.tables where table_schema='public'`,
    );
    const row = result.rows[0] as Record<string, unknown>;
    checks.tables = `${row.cnt} tables`;
  } catch {
    checks.tables = "fail";
  }

  return NextResponse.json({ ok: checks.database === "ok", ...checks });
}
