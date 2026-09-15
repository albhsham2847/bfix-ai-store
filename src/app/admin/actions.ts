"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  products,
  productOptions,
  orders,
  ORDER_STATUSES,
} from "@/db/schema";
import { ADMIN_COOKIE, adminPassword, adminToken, isAdmin } from "@/lib/admin-auth";

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const n = (f: FormData, k: string, d = 0) => Number(f.get(k)) || d;
const b = (f: FormData, k: string) => f.get(k) === "on";
const price = (f: FormData, k: string) => (Number(f.get(k)) || 0).toFixed(2);

function revalidateAll() {
  revalidatePath("/", "layout");
}

/* ---------- auth ---------- */
export async function login(_prev: string | null, form: FormData) {
  if (s(form, "password") !== adminPassword()) return "كلمة المرور غير صحيحة";
  const c = await cookies();
  c.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logout() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ---------- categories ---------- */
export async function saveCategory(form: FormData) {
  await guard();
  const id = n(form, "id");
  const data = {
    slug: s(form, "slug").toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    name: s(form, "name"),
    description: s(form, "description"),
    icon: s(form, "icon") || "✨",
    gradient: s(form, "gradient") || "from-amber-400 to-orange-600",
    imageUrl: s(form, "imageUrl") || null,
    active: b(form, "active"),
    sortOrder: n(form, "sortOrder"),
  };
  if (!data.name || !data.slug) return;
  if (id) await db.update(categories).set(data).where(eq(categories.id, id));
  else await db.insert(categories).values(data);
  revalidateAll();
  redirect("/admin/categories");
}

export async function deleteCategory(form: FormData) {
  await guard();
  await db.delete(categories).where(eq(categories.id, n(form, "id")));
  revalidateAll();
}

/* ---------- products ---------- */
export async function saveProduct(form: FormData) {
  await guard();
  const id = n(form, "id");
  const data = {
    categoryId: n(form, "categoryId"),
    name: s(form, "name"),
    description: s(form, "description"),
    details: s(form, "details") || null,
    imageUrl: s(form, "imageUrl") || null,
    price: price(form, "price"),
    unit: s(form, "unit"),
    badge: s(form, "badge") || null,
    requiredInfo: s(form, "requiredInfo") || null,
    featured: b(form, "featured"),
    active: b(form, "active"),
    sortOrder: n(form, "sortOrder"),
  };
  if (!data.name || !data.categoryId) return;
  let pid = id;
  if (id) await db.update(products).set(data).where(eq(products.id, id));
  else {
    const [row] = await db.insert(products).values(data).returning();
    pid = row.id;
  }
  revalidateAll();
  redirect(`/admin/products/${pid}`);
}

export async function deleteProduct(form: FormData) {
  await guard();
  await db.delete(products).where(eq(products.id, n(form, "id")));
  revalidateAll();
  redirect("/admin/products");
}

export async function addOption(form: FormData) {
  await guard();
  const productId = n(form, "productId");
  const name = s(form, "name");
  if (!productId || !name) return;
  await db.insert(productOptions).values({
    productId,
    name,
    price: price(form, "price"),
    sortOrder: n(form, "sortOrder"),
  });
  revalidateAll();
}

export async function deleteOption(form: FormData) {
  await guard();
  await db.delete(productOptions).where(eq(productOptions.id, n(form, "id")));
  revalidateAll();
}

/* ---------- orders ---------- */
export async function updateOrder(form: FormData) {
  await guard();
  const id = n(form, "id");
  const status = s(form, "status");
  if (!id || !(ORDER_STATUSES as readonly string[]).includes(status)) return;
  await db
    .update(orders)
    .set({ status, adminNote: s(form, "adminNote") || null, updatedAt: new Date() })
    .where(eq(orders.id, id));
  revalidatePath("/admin", "layout");
}

export async function deleteOrder(form: FormData) {
  await guard();
  await db.delete(orders).where(eq(orders.id, n(form, "id")));
  revalidatePath("/admin", "layout");
  redirect("/admin/orders");
}
