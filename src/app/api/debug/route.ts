import { NextResponse } from "next/server";
import { pool } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const colCheck = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name LIKE 'payment%'"
    );
    const cols = colCheck.rows.map((r: Record<string, unknown>) => r.column_name);

    const stmts = [
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account TEXT",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reviewed_at TIMESTAMP",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reject_reason TEXT",
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'awaiting'",
    ];
    const results = [];
    for (const s of stmts) {
      try {
        await pool.query(s);
        results.push({ s: s.slice(40, 80), ok: true });
      } catch (e) {
        results.push({ s: s.slice(40, 80), ok: false, err: e instanceof Error ? e.message.slice(0, 80) : "err" });
      }
    }

    const colCheck2 = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name LIKE 'payment%'"
    );
    const cols2 = colCheck2.rows.map((r: Record<string, unknown>) => r.column_name);

    return NextResponse.json({ before: cols, results, after: cols2 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "unknown" }, { status: 500 });
  }
}
