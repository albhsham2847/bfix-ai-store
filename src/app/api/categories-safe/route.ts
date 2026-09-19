import { NextResponse } from "next/server";
import { getCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const cats = await getCategories();
  return NextResponse.json(cats.map(c => ({
    id: c.id, slug: c.slug, name: c.name, description: c.description,
    icon: c.icon, gradient: c.gradient, sortOrder: c.sortOrder,
  })));
}
