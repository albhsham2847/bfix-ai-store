import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

/* ═══════════════════════════════════════════
   CATEGORIES & PRODUCTS
   ═══════════════════════════════════════════ */

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
  imageBase64: text("image_base64"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default(""),
  badge: text("badge"),
  requiredInfo: text("required_info"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productOptions = pgTable("product_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* ═══════════════════════════════════════════
   CUSTOMERS
   ═══════════════════════════════════════════ */

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  telegram: text("telegram"),
  passwordHash: text("password_hash"),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const loginLogs = pgTable("login_logs", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════
   ORDERS & PAYMENTS
   ═══════════════════════════════════════════ */

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

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").unique(),
  type: text("type").notNull().default("purchase"),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
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
  paymentImage: text("payment_image"),
  paymentStatus: text("payment_status").notNull().default("awaiting"),
  paymentReviewedAt: timestamp("payment_reviewed_at"),
  rejectReason: text("reject_reason"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  optionName: text("option_name"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  customerInput: text("customer_input"),
});

/* ═══════════════════════════════════════════
   TOP-UP REQUESTS
   ═══════════════════════════════════════════ */

export const TOPUP_STATUS = ["pending", "accepted", "rejected"] as const;
export type TopupStatusType = (typeof TOPUP_STATUS)[number];
export const TOPUP_STATUS_LABELS: Record<TopupStatusType, string> = {
  pending: "قيد المراجعة",
  accepted: "تم الشحن ✅",
  rejected: "مرفوض ❌",
};

export const topupRequests = pgTable("topup_requests", {
  id: serial("id").primaryKey(),
  code: text("code").unique(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  proofText: text("proof_text"),
  proofImage: text("proof_image"),
  status: text("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════
   CHAT MESSAGES
   ═══════════════════════════════════════════ */

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  sender: text("sender").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductOption = typeof productOptions.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type TopupRequest = typeof topupRequests.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type LoginLog = typeof loginLogs.$inferSelect;
