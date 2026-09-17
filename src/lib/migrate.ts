import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * Creates all tables idempotently (IF NOT EXISTS).
 * Runs automatically on first request if tables are missing.
 */
export async function migrateSchema() {
  // Use raw SQL for idempotent table creation
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      gradient TEXT NOT NULL,
      image_url TEXT,
      active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      details TEXT,
      image_url TEXT,
      price NUMERIC(10,2) NOT NULL,
      unit TEXT NOT NULL DEFAULT '',
      badge TEXT,
      required_info TEXT,
      featured BOOLEAN NOT NULL DEFAULT false,
      active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS product_options (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      email TEXT,
      telegram TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      total NUMERIC(12,2),
      notes TEXT,
      channel TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      admin_note TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      option_name TEXT,
      unit_price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      subtotal NUMERIC(12,2) NOT NULL,
      customer_input TEXT
    );

  `);

  // Add payment columns idempotently (runs every time but IF NOT EXISTS is safe)
  await db.execute(sql`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reviewed_at TIMESTAMP;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reject_reason TEXT;
  `);

  // Add payment_status with default if missing
  try {
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'awaiting'`);
  } catch {
    // Column may already exist with different constraint
  }
}
