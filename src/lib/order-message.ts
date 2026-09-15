import { CONTACT } from "./seed-data";

export type OrderMessageData = {
  code: string;
  productName: string;
  optionName?: string | null;
  quantity: number;
  unitPrice: string | number;
  total: string | number;
  customerName: string;
  phone: string;
  email?: string | null;
  telegram?: string | null;
  customerInput?: string | null;
  notes?: string | null;
};

export function buildOrderMessage(d: OrderMessageData) {
  const lines = [
    "🟡 *طلب جديد — B-Fix Software | AI Store*",
    "━━━━━━━━━━━━━━━",
    `🧾 رقم الطلب: *${d.code}*`,
    `🛍️ الخدمة: ${d.productName}`,
    d.optionName ? `📦 الخيار/المدة: ${d.optionName}` : null,
    `🔢 الكمية: ${d.quantity}`,
    `💵 سعر الوحدة: $${Number(d.unitPrice).toLocaleString()}`,
    `💰 الإجمالي: *$${Number(d.total).toLocaleString()}*`,
    "━━━━━━━━━━━━━━━",
    `👤 الاسم: ${d.customerName}`,
    `📱 الهاتف: ${d.phone}`,
    d.email ? `📧 البريد: ${d.email}` : null,
    d.telegram ? `✈️ تليجرام: ${d.telegram}` : null,
    d.customerInput ? `📝 بيانات الخدمة: ${d.customerInput}` : null,
    d.notes ? `🗒️ ملاحظات: ${d.notes}` : null,
    "━━━━━━━━━━━━━━━",
    "أرجو تأكيد الطلب وإرسال طريقة الدفع. شكراً 🙏",
  ].filter(Boolean);
  return lines.join("\n");
}

export function whatsappLink(msg: string) {
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function telegramLink(msg: string) {
  // Opens chat with the admin account with the message pre-filled via share URL
  return `https://t.me/share/url?url=${encodeURIComponent("https://t.me/bfixSoftware")}&text=${encodeURIComponent(msg)}`;
}
