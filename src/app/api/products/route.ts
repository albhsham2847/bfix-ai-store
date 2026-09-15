import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/store";

export async function GET() {
  const rows = await getAllProducts();
  return NextResponse.json(rows);
}
