import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  processing: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  gradient: text("gradient").notNull(),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  details: text("details"),
  imageUrl: text("image_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default(""),
  badge: text("badge"),
  requiredInfo: text("required_info"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/** Variants of a product: duration / package / edition, each with own price */
export const productOptions = pgTable("product_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  telegram: text("telegram"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").unique(),
  customerId: integer("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  quantity: integer("quantity").notNull().default(1),
  total: numeric("total", { precision: 12, scale: 2 }),
  notes: text("notes"),
  channel: text("channel"),
  paymentMethod: text("payment_method"),
  paymentAccount: text("payment_account"),
  paymentProof: text("payment_proof"),
  paymentStatus: text("payment_status").notNull().default("awaiting"),
  paymentReviewedAt: timestamp("payment_reviewed_at"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const PAYMENT_METHODS = [
  { id: "jawaly", name: "محفظة جيب", icon: "📱", details: ["777728478"] },
  { id: "onecash", name: "محفظة وان كاش", icon: "📱", details: ["777728478"] },
  { id: "bank_karimi_usd", name: "بنك الكريمي — دولار", icon: "🏦", details: ["3211501129"] },
  { id: "bank_karimi_sar", name: "بنك الكريمي — ريال سعودي", icon: "🏦", details: ["3178533238"] },
  { id: "bank_karimi_yer", name: "بنك الكريمي — ريال يمني", icon: "🏦", details: ["3211440658"] },
  { id: "mastercard", name: "مستر كارد", icon: "💳", details: ["5262160051739815"] },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];
export const PAYMENT_STATUS = ["awaiting", "submitted", "accepted", "rejected"] as const;
export type PaymentStatusType = (typeof PAYMENT_STATUS)[number];
export const PAYMENT_STATUS_LABELS: Record<PaymentStatusType, string> = {
  awaiting: "في انتظار الدفع",
  submitted: "تم إرسال الإثبات",
  accepted: "تم قبول الدفع ✅",
  rejected: "تم رفض الدفع ❌",
};

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  optionName: text("option_name"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  customerInput: text("customer_input"),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductOption = typeof productOptions.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
