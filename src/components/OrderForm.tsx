"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildOrderMessage,
  whatsappLink,
  telegramLink,
} from "@/lib/order-message";
import { useCustomer } from "@/contexts/CustomerContext";

type Option = { id: number; name: string; price: string };

type Props = {
  productId: number;
  productName: string;
  basePrice: string;
  unit: string;
  requiredInfo: string | null;
  options: Option[];
};

type Step = "form" | "summary" | "done";

export default function OrderForm({
  productId,
  productName,
  basePrice,
  unit,
  requiredInfo,
  options,
}: Props) {
  const { customer, setShowAuth } = useCustomer();
  const [step, setStep] = useState<Step>("form");
  const [optionId, setOptionId] = useState<number | null>(options[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [customerInput, setCustomerInput] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  // Auto-fill from logged-in customer
  useEffect(() => {
    if (customer) {
      if (!name) setName(customer.name);
      if (!phone) setPhone(customer.phone);
      if (!email && customer.email) setEmail(customer.email);
    }
  }, [customer]); // eslint-disable-line react-hooks/exhaustive-deps

  const option = options.find((o) => o.id === optionId) ?? null;
  const unitPrice = Number(option?.price ?? basePrice);
  const total = unitPrice * qty;

  const message = useMemo(
    () =>
      buildOrderMessage({
        code: code || "—",
        productName,
        optionName: option?.name,
        quantity: qty,
        unitPrice,
        total,
        customerName: name,
        phone,
        email,
        customerInput,
        notes,
      }),
    [code, productName, option, qty, unitPrice, total, name, phone, email, customerInput, notes],
  );

  function validate() {
    if (name.trim().length < 2) return "يرجى إدخال الاسم الكامل";
    if (phone.replace(/\D/g, "").length < 7) return "يرجى إدخال رقم هاتف صحيح";
    return "";
  }

  function goSummary(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    setStep("summary");
  }

  async function confirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          optionId,
          quantity: qty,
          customerName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          customerInput,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      const c: string = data.order.code;
      setCode(c);
      try {
        const saved = JSON.parse(localStorage.getItem("bfix-orders") || "[]");
        saved.unshift({
          id: data.order.id,
          code: c,
          productName: data.order.productName,
          qty,
          total: total.toFixed(2),
          date: Date.now(),
        });
        localStorage.setItem("bfix-orders", JSON.stringify(saved.slice(0, 50)));
      } catch {}
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full rounded-xl bg-black/30 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60 placeholder:text-white/35";

  /* ---------- DONE ---------- */
  if (step === "done") {
    return (
      <section className="glass fade-up rounded-3xl p-5 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-2 text-xl font-black">تم إنشاء طلبك بنجاح</h2>
        <p className="mt-1 text-sm text-white/60">رقم الطلب</p>
        <div className="mx-auto mt-1 inline-block rounded-xl bg-gold/10 px-4 py-1.5 font-mono text-lg font-black tracking-wider text-gold ring-1 ring-gold/30">
          {code}
        </div>
        <p className="mt-3 text-sm text-white/60">
          أرسل الطلب للإدارة الآن لإتمام الدفع والتسليم الفوري — الرسالة جاهزة
          تلقائياً.
        </p>
        <div className="mt-4 grid gap-2">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-black text-black active:scale-[0.98]"
          >
            💬 إرسال الطلب عبر واتساب
          </a>
          <a
            href={telegramLink(message)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-3.5 text-sm font-black text-white active:scale-[0.98]"
          >
            ✈️ إرسال الطلب عبر تليجرام
          </a>
          <button
            onClick={() => navigator.clipboard?.writeText(message)}
            className="rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 ring-1 ring-white/10"
          >
            نسخ تفاصيل الطلب
          </button>
        </div>
      </section>
    );
  }

  /* ---------- SUMMARY ---------- */
  if (step === "summary") {
    const rows: [string, string][] = [
      ["الخدمة", productName],
      ...(option ? ([["الخيار / المدة", option.name]] as [string, string][]) : []),
      ["الكمية", String(qty)],
      ["سعر الوحدة", `$${unitPrice.toLocaleString()}`],
      ["الاسم", name],
      ["الهاتف", phone],
      ...(email ? ([["البريد", email]] as [string, string][]) : []),
      ...(customerInput ? ([["بيانات الخدمة", customerInput]] as [string, string][]) : []),
      ...(notes ? ([["ملاحظات", notes]] as [string, string][]) : []),
    ];
    return (
      <section className="glass fade-up rounded-3xl p-5">
        <h2 className="text-base font-black">ملخص الطلب</h2>
        <dl className="mt-3 divide-y divide-white/5 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2">
              <dt className="shrink-0 text-white/50">{k}</dt>
              <dd className="text-left font-bold break-words">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between py-3">
            <dt className="font-black">الإجمالي</dt>
            <dd className="text-xl font-black text-gold">${total.toLocaleString()}</dd>
          </div>
        </dl>
        {error && <p className="text-sm font-bold text-rose-400">{error}</p>}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            onClick={() => setStep("form")}
            className="rounded-xl bg-white/5 px-4 py-3 text-sm font-bold ring-1 ring-white/10"
          >
            تعديل
          </button>
          <button
            disabled={loading}
            onClick={confirm}
            className="gold-btn col-span-2 rounded-xl px-4 py-3 text-sm font-black disabled:opacity-60"
          >
            {loading ? "جاري إنشاء الطلب..." : "تأكيد وإنشاء الطلب"}
          </button>
        </div>
      </section>
    );
  }

  /* ---------- FORM ---------- */
  return (
    <form onSubmit={goSummary} className="surface fade-up space-y-3" style={{ borderRadius: "var(--radius-xl)", padding: "1.25rem" }}>
      <h2 className="text-base font-black">اطلب الآن</h2>

      {!customer && (
        <button
          type="button"
          onClick={() => setShowAuth(true)}
          className="oneui-btn w-full"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
        >
          👤 سجّل دخولك لتعبئة البيانات تلقائياً
        </button>
      )}
      {customer && (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--surface-2)" }}>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-black text-white">
            {customer.name.charAt(0)}
          </span>
          <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
            مرحباً {customer.name} — البيانات معبأة تلقائياً
          </span>
        </div>
      )}

      {options.length > 0 && (
        <div>
          <div className="mb-1.5 text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>اختر المدة / الباقة</div>
          <div className="grid grid-cols-3 gap-2">
            {options.map((o) => (
              <button
                type="button"
                key={o.id}
                onClick={() => setOptionId(o.id)}
                className="oneui-btn px-2 py-2.5 text-center"
                style={{
                  background: o.id === optionId ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)" : "var(--surface-2)",
                  color: o.id === optionId ? "var(--text-on-gold)" : "var(--text-secondary)",
                  border: o.id === optionId ? "none" : "1px solid var(--border)",
                  boxShadow: o.id === optionId ? "var(--shadow-gold)" : "none",
                }}
              >
                <div className="text-xs font-black">{o.name}</div>
                <div className="text-[11px] font-bold opacity-80">${Number(o.price)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between oneui-input">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>الكمية {unit && !option ? `(${unit})` : ""}</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-lg text-lg font-black" style={{ background: "var(--surface-3)" }}>−</button>
          <span className="w-6 text-center font-black">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(100, q + 1))} className="h-8 w-8 rounded-lg text-lg font-black" style={{ background: "var(--surface-3)" }}>+</button>
        </div>
      </div>

      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل *" className="oneui-input" />
      <input required type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+967 7xx xxx xxx *" className="oneui-input text-right" />
      <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني (اختياري)" className="oneui-input text-right" />
      {requiredInfo && (
        <div>
          <div className="mb-1 text-xs font-bold" style={{ color: "var(--gold)" }}>📝 مطلوب: {requiredInfo}</div>
          <textarea value={customerInput} onChange={(e) => setCustomerInput(e.target.value)} rows={2} placeholder={requiredInfo} className="oneui-input" />
        </div>
      )}
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية (اختياري)" rows={2} className="oneui-input" />

      {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
      <button className="gold-btn oneui-btn w-full py-3.5 text-base">
        مراجعة الطلب — ${total.toLocaleString()}
      </button>
    </form>
  );
}
