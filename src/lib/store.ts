import { db } from "@/db";
import {
  categories,
  products,
  productOptions,
  orders,
  orderItems,
  customers,
} from "@/db/schema";
import { asc, desc, eq, and, count, sql } from "drizzle-orm";
import { SEED_CATEGORIES, SEED_OPTIONS } from "./seed-data";
import { migrateSchema } from "./migrate";

let seeded = false;
let migrated = false;

export async function ensureSeeded() {
  if (seeded) return;

  // Run migration if tables don't exist
  if (!migrated) {
    try {
      await db.select({ value: count() }).from(categories);
      migrated = true;
    } catch {
      // Table doesn't exist → run migration
      await migrateSchema();
      migrated = true;
    }
  }

  // Check and seed categories/products individually for resilience
  const existingCats = await db.select().from(categories);
  const existingCatSlugs = new Set(existingCats.map((c) => c.slug));
  const existingProductCounts = new Map<number, number>();
  for (const cat of existingCats) {
    const [{ value }] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.categoryId, cat.id));
    existingProductCounts.set(cat.id, Number(value));
  }

  for (let i = 0; i < SEED_CATEGORIES.length; i++) {
    const c = SEED_CATEGORIES[i];
    let catId: number;
    const existing = existingCats.find((ec) => ec.slug === c.slug);
    if (existing) {
      catId = existing.id;
    } else {
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
        .returning();
      catId = cat.id;
    }
    // Seed products if category has none
    const prodCount = existingProductCounts.get(catId) ?? 0;
    if (prodCount === 0) {
      await db.insert(products).values(
        c.products.map((p, idx) => ({
          categoryId: catId,
          name: p.name,
          description: p.description,
          price: p.price,
          unit: p.unit ?? "",
          badge: p.badge ?? null,
          featured: p.featured ?? false,
          requiredInfo: c.requiredInfo ?? null,
          sortOrder: idx,
        })),
      );
    }
  }
  // Seed options once (idempotent: only for products without options)
  const [{ optCount }] = await db
    .select({ optCount: count() })
    .from(productOptions);
  if (Number(optCount) === 0) {
    for (const s of SEED_OPTIONS) {
      const [p] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.name, s.productName));
      if (!p) continue;
      await db.insert(productOptions).values(
        s.options.map((o, i) => ({
          productId: p.id,
          name: o.name,
          price: o.price,
          sortOrder: i,
        })),
      );
    }
  }
  seeded = true;
}

const productView = {
  id: products.id,
  categoryId: products.categoryId,
  name: products.name,
  description: products.description,
  details: products.details,
  imageUrl: products.imageUrl,
  price: products.price,
  unit: products.unit,
  badge: products.badge,
  requiredInfo: products.requiredInfo,
  featured: products.featured,
  active: products.active,
  categoryName: categories.name,
  categorySlug: categories.slug,
  gradient: categories.gradient,
  icon: categories.icon,
};

export async function getCategories(includeInactive = false) {
  await ensureSeeded();
  const q = db.select().from(categories);
  const rows = includeInactive
    ? await q.orderBy(asc(categories.sortOrder), asc(categories.id))
    : await q
        .where(eq(categories.active, true))
        .orderBy(asc(categories.sortOrder), asc(categories.id));
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  await ensureSeeded();
  const [cat] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.active, true)));
  return cat ?? null;
}

export async function getProductsByCategory(categoryId: number) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.active, true)))
    .orderBy(asc(products.sortOrder), asc(products.id));
}

export async function getFeaturedProducts() {
  await ensureSeeded();
  return db
    .select(productView)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.featured, true), eq(products.active, true), eq(categories.active, true)))
    .orderBy(asc(categories.sortOrder), asc(products.sortOrder), asc(products.id));
}

export async function getAllProducts(includeInactive = false) {
  await ensureSeeded();
  const q = db
    .select(productView)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));
  const rows = includeInactive
    ? await q.orderBy(asc(categories.sortOrder), asc(products.sortOrder), asc(products.id))
    : await q
        .where(and(eq(products.active, true), eq(categories.active, true)))
        .orderBy(asc(categories.sortOrder), asc(products.sortOrder), asc(products.id));
  return rows;
}

export async function getProduct(id: number) {
  await ensureSeeded();
  const [row] = await db
    .select(productView)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));
  if (!row) return null;
  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, id))
    .orderBy(asc(productOptions.sortOrder), asc(productOptions.id));
  return { ...row, options };
}

export async function getOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithItems(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));
  return { ...order, items };
}

export async function getOrderByCode(code: string) {
  const [order] = await db.select().from(orders).where(eq(orders.code, code));
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { ...order, items };
}

export type CreateOrderInput = {
  productId: number;
  optionId?: number | null;
  quantity: number;
  customerName: string;
  phone: string;
  email?: string | null;
  telegram?: string | null;
  customerInput?: string | null;
  notes?: string | null;
};

function genCode() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `BF-${t}${r}`;
}

export async function createOrder(input: CreateOrderInput) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.id, input.productId), eq(products.active, true)));
  if (!product) throw new Error("المنتج غير متاح");

  let optionName: string | null = null;
  let unitPrice = product.price;
  if (input.optionId) {
    const [opt] = await db
      .select()
      .from(productOptions)
      .where(
        and(
          eq(productOptions.id, input.optionId),
          eq(productOptions.productId, product.id),
        ),
      );
    if (!opt) throw new Error("الخيار غير صالح");
    optionName = opt.name;
    unitPrice = opt.price;
  }

  const qty = Math.max(1, Math.min(100, input.quantity || 1));
  const subtotal = (Number(unitPrice) * qty).toFixed(2);

  return db.transaction(async (tx) => {
    const [customer] = await tx
      .insert(customers)
      .values({
        name: input.customerName,
        phone: input.phone,
        email: input.email || null,
        telegram: input.telegram || null,
      })
      .onConflictDoUpdate({
        target: customers.phone,
        set: {
          name: input.customerName,
          email: sql`coalesce(${input.email || null}, ${customers.email})`,
          telegram: sql`coalesce(${input.telegram || null}, ${customers.telegram})`,
        },
      })
      .returning();

    const displayName = optionName ? `${product.name} (${optionName})` : product.name;

    const [order] = await tx
      .insert(orders)
      .values({
        code: genCode(),
        customerId: customer.id,
        productId: product.id,
        productName: displayName,
        customerName: input.customerName,
        phone: input.phone,
        quantity: qty,
        total: subtotal,
        notes: input.notes || null,
      })
      .returning();

    const [item] = await tx
      .insert(orderItems)
      .values({
        orderId: order.id,
        productId: product.id,
        productName: product.name,
        optionName,
        unitPrice,
        quantity: qty,
        subtotal,
        customerInput: input.customerInput || null,
      })
      .returning();

    return { order, items: [item], product };
  });
}
