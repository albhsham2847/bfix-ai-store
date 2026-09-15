import { db } from "@/db";
import { categories, products, orders } from "@/db/schema";
import { asc, desc, eq, count } from "drizzle-orm";
import { SEED_CATEGORIES } from "./seed-data";

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const [{ value }] = await db.select({ value: count() }).from(categories);
  if (Number(value) === 0) {
    for (let i = 0; i < SEED_CATEGORIES.length; i++) {
      const c = SEED_CATEGORIES[i];
      const [cat] = await db
        .insert(categories)
        .values({
          slug: c.slug,
          name: c.name,
          description: c.description,
          icon: c.icon,
          gradient: c.gradient,
          sortOrder: i,
        })
        .onConflictDoNothing()
        .returning();
      if (!cat) continue;
      await db.insert(products).values(
        c.products.map((p) => ({
          categoryId: cat.id,
          name: p.name,
          description: p.description,
          price: p.price,
          unit: p.unit ?? "",
          badge: p.badge ?? null,
          featured: p.featured ?? false,
        })),
      );
    }
  }
  seeded = true;
}

export async function getCategories() {
  await ensureSeeded();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  await ensureSeeded();
  const [cat] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
  return cat ?? null;
}

export async function getProductsByCategory(categoryId: number) {
  return db
    .select()
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(asc(products.id));
}

export async function getFeaturedProducts() {
  await ensureSeeded();
  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      badge: products.badge,
      categoryName: categories.name,
      categorySlug: categories.slug,
      gradient: categories.gradient,
      icon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.featured, true))
    .orderBy(asc(categories.sortOrder), asc(products.id));
}

export async function getAllProducts() {
  await ensureSeeded();
  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      badge: products.badge,
      categoryName: categories.name,
      categorySlug: categories.slug,
      gradient: categories.gradient,
      icon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(products.id));
}

export async function getProduct(id: number) {
  await ensureSeeded();
  const [row] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      badge: products.badge,
      categoryName: categories.name,
      categorySlug: categories.slug,
      gradient: categories.gradient,
      icon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));
  return row ?? null;
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}
