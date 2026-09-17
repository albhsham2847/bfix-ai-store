import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminChatBox from "@/components/admin/AdminChatBox";

export const dynamic = "force-dynamic";

export default async function AdminChatPage({ params }: { params: Promise<{ customerId: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { customerId } = await params;
  const [c] = await db.select().from(customers).where(eq(customers.id, Number(customerId)));
  if (!c) notFound();
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-black">💬 دردشة مع {c.name}</h1>
      <AdminChatBox customerId={c.id} />
    </div>
  );
}
