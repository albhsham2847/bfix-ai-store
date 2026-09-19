import { pool } from "@/db";

export async function migrateSchema() {
  const stmts = [
    // Categories
    `CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      description TEXT NOT NULL, icon TEXT NOT NULL, gradient TEXT NOT NULL,
      image_url TEXT, active BOOLEAN NOT NULL DEFAULT true, sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    // Products
    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY, category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL, description TEXT NOT NULL, details TEXT, image_url TEXT,
      price NUMERIC(10,2) NOT NULL, unit TEXT NOT NULL DEFAULT '', badge TEXT,
      required_info TEXT, featured BOOLEAN NOT NULL DEFAULT false, active BOOLEAN NOT NULL DEFAULT true,
      sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
    // Product Options
    `CREATE TABLE IF NOT EXISTS product_options (
      id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL, price NUMERIC(10,2) NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
    )`,
    // Customers
    `CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE,
      email TEXT, telegram TEXT, created_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
    // Orders
    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY, code TEXT UNIQUE, customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1, total NUMERIC(12,2), notes TEXT, channel TEXT,
      status TEXT NOT NULL DEFAULT 'pending', admin_note TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(), updated_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
    // Order Items
    `CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL, option_name TEXT, unit_price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1, subtotal NUMERIC(12,2) NOT NULL, customer_input TEXT
    )`,
  ];

  for (const s of stmts) {
    try { await pool.query(s); } catch { /* exists */ }
  }

  // Incremental column additions
  const alters = [
    // Customer auth & balance
    "ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT",
    "ALTER TABLE customers ADD COLUMN IF NOT EXISTS balance NUMERIC(12,2) DEFAULT 0",
    "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP",
    // Product images
    "ALTER TABLE products ADD COLUMN IF NOT EXISTS image_base64 TEXT",
    // Order payment columns
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'purchase'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_account TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_image TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reviewed_at TIMESTAMP",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS reject_reason TEXT",
  ];
  for (const s of alters) {
    try { await pool.query(s); } catch { /* exists */ }
  }

  // New tables
  const newTables = [
    `CREATE TABLE IF NOT EXISTS login_logs (
      id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      ip TEXT, user_agent TEXT, created_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS topup_requests (
      id SERIAL PRIMARY KEY, code TEXT UNIQUE,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL, phone TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL, payment_method TEXT NOT NULL,
      proof_text TEXT, proof_image TEXT,
      status TEXT NOT NULL DEFAULT 'pending', admin_note TEXT,
      reviewed_at TIMESTAMP, created_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      sender TEXT NOT NULL, content TEXT NOT NULL, image TEXT,
      read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMP NOT NULL DEFAULT now()
    )`,
  ];
  for (const s of newTables) {
    try { await pool.query(s); } catch { /* exists */ }
  }

  // Ensure payment_status column has default (may fail if constraint differs)
  try {
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'awaiting'");
  } catch { /* exists */ }
}

  // Promotions table
  try { await pool.query(`CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY, title TEXT NOT NULL, body TEXT,
    image TEXT, link TEXT, category_slug TEXT,
    active BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT now()
  )`); } catch {}
