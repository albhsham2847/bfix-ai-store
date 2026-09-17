"use client";

import { useEffect, useMemo, useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/db/schema";
import { playNotificationSound, sendBrowserNotification } from "@/lib/notify";
import ImagePicker from "./ImagePicker";

type Option = { id: number; name: string; price: string };
type Step = "form" | "payment" | "confirm" | "proof" | "done";

type Props = {
  productId: number;
  productName: string;
  basePrice: string;
  unit: string;
  requiredInfo: string | null;
  options: Option[];
};

const inputCls = "oneui-input";

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
  const [orderId, setOrderId] = useState(0);
  const [payMethod, setPayMethod] = useState<PaymentMethodId | "">("");
  const [proofText, setProofText] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [proofSubmitted, setProofSubmitted] = useState(false);

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
  const selectedPay = PAYMENT_METHODS.find((m) => m.id === payMethod);

  function validate() {
    if (name.trim().length < 2) return "يرجى إدخال الاسم الكامل";
    if (phone.replace(/\D/g, "").length < 7) return "يرجى إدخال رقم هاتف صحيح";
    return "";
  }

  async function createOrder() {
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
          paymentMethod: payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setCode(data.order.code);
      setOrderId(data.order.id);
      try {
        const saved = JSON.parse(localStorage.getItem("bfix-orders") || "[]");
        saved.unshift({
          id: data.order.id,
          code: data.order.code,
          productName: data.order.productName,
          qty,
          total: total.toFixed(2),
          date: Date.now(),
        });
        localStorage.setItem("bfix-orders", JSON.stringify(saved.slice(0, 50)));
      } catch {}
      setStep("proof");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function submitProof() {
    if (!proofText.trim() && !proofImage) return setError("يرجى إرسال إثبات الدفع (صورة أو نص)");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proof: proofText.trim(), image: proofImage || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setProofSubmitted(true);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  /* ═══════ DONE ═══════ */
  if (step === "done") {
    return (
      <div className="surface fade-up space-y-4 p-5 text-center" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-black">تم إرسال طلبك بنجاح</h2>
        <div className="mx-auto inline-block rounded-xl px-4 py-1.5 font-mono text-lg font-black tracking-wider"
          style={{ background: "rgba(212,160,23,0.12)", color: "var(--gold)", border: "1px solid rgba(212,160,23,0.25)" }}>
          {code}
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          تم إرسال إثبات الدفع إلى الإدارة.<br />
          إذا كانت بيانات التحويل صحيحة، سيتم شحن حسابك في أقرب وقت.
        </p>
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--surface-2)" }}>
          <div className="font-bold" style={{ color: "var(--text-primary)" }}>📋 ملخص الطلب</div>
          <div style={{ color: "var(--text-secondary)" }}>{productName} × {qty} — ${total.toLocaleString()}</div>
          <div style={{ color: "var(--text-secondary)" }}>💳 {selectedPay?.name}</div>
        </div>
      </div>
    );
  }

  /* ═══════ PROOF ═══════ */
  if (step === "proof") {
    return (
      <div className="surface fade-up space-y-4 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-center">
          <div className="text-4xl">📸</div>
          <h2 className="mt-2 text-lg font-black">أرسل إثبات الدفع</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            أرسل لقطة شاشة للتحويل أو رقم السند أو وصف التحويل
          </p>
        </div>

        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--surface-2)" }}>
          <div className="font-black" style={{ color: "var(--gold)" }}>الطلب: {code}</div>
          <div style={{ color: "var(--text-secondary)" }}>{productName} × {qty} — ${total.toLocaleString()}</div>
          <div style={{ color: "var(--text-secondary)" }}>طريقة الدفع: {selectedPay?.name}</div>
          <div style={{ color: "var(--text-secondary)" }}>المبلغ المطلوب: <span className="font-black" style={{ color: "var(--gold)" }}>${total.toLocaleString()}</span></div>
        </div>

        <ImagePicker label="صورة إثبات الدفع (الكاميرا أو المعرض)" onImage={setProofImage} />
        <div>
          <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
            أو اكتب رقم السند / وصف التحويل
          </label>
          <textarea
            value={proofText}
            onChange={(e) => setProofText(e.target.value)}
            rows={2}
            placeholder="مثال: رقم التحويل 123456"
            className={inputCls}
          />
        </div>

        {error && <p className="text-sm font-bold text-rose-500">{error}</p>}

        <button onClick={submitProof} disabled={loading} className="gold-btn oneui-btn w-full py-3.5 text-base disabled:opacity-60">
          {loading ? "جاري الإرسال..." : "إرسال إثبات الدفع"}
        </button>
        <button onClick={() => setStep("confirm")} className="oneui-btn w-full py-3"
          style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
          رجوع
        </button>
      </div>
    );
  }

  /* ═══════ CONFIRM (payment method selected) ═══════ */
  if (step === "confirm" && selectedPay) {
    return (
      <div className="surface fade-up space-y-4 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
        <h2 className="text-lg font-black">تأكيد الطلب والدفع</h2>

        <div className="rounded-xl p-4" style={{ background: "var(--surface-2)" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{selectedPay.icon}</span>
            <div>
              <div className="font-black">{selectedPay.name}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>حوّل المبلغ إلى:</div>
            </div>
          </div>
          {selectedPay.details.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg p-3 mb-2"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="font-mono text-lg font-black" dir="ltr" style={{ color: "var(--gold)" }}>{d}</span>
              <button onClick={() => navigator.clipboard?.writeText(d)}
                className="rounded-lg px-3 py-1 text-xs font-bold"
                style={{ background: "var(--surface-3)", color: "var(--text-secondary)" }}>
                نسخ
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--surface-2)" }}>
          <div className="flex justify-between"><span style={{ color: "var(--text-secondary)" }}>الخدمة</span><span className="font-bold">{productName}</span></div>
          {option && <div className="flex justify-between mt-1"><span style={{ color: "var(--text-secondary)" }}>الخيار</span><span className="font-bold">{option.name}</span></div>}
          <div className="flex justify-between mt-1"><span style={{ color: "var(--text-secondary)" }}>الكمية</span><span className="font-bold">{qty}</span></div>
          <div className="flex justify-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
            <span className="font-black">المبلغ المطلوب</span>
            <span className="text-xl font-black" style={{ color: "var(--gold)" }}>${total.toLocaleString()}</span>
          </div>
        </div>

        {error && <p className="text-sm font-bold text-rose-500">{error}</p>}

        <button onClick={createOrder} disabled={loading} className="gold-btn oneui-btn w-full py-3.5 text-base disabled:opacity-60">
          {loading ? "جاري إنشاء الطلب..." : `شراء — $${total.toLocaleString()}`}
        </button>
        <button onClick={() => setStep("payment")} className="oneui-btn w-full py-3"
          style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
          تغيير طريقة الدفع
        </button>
      </div>
    );
  }

  /* ═══════ PAYMENT METHOD SELECTION ═══════ */
  if (step === "payment") {
    return (
      <div className="surface fade-up space-y-4 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
        <h2 className="text-lg font-black">اختر طريقة الدفع</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>المبلغ المطلوب: <span className="font-black" style={{ color: "var(--gold)" }}>${total.toLocaleString()}</span></p>

        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setPayMethod(m.id); setStep("confirm"); }}
              className="card-hover flex items-center gap-3 w-full p-4 text-right"
              style={{ borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>{m.name}</div>
                <div className="text-xs font-mono" dir="ltr" style={{ color: "var(--text-tertiary)" }}>{m.details[0]}</div>
              </div>
              <span style={{ color: "var(--text-tertiary)" }}>←</span>
            </button>
          ))}
        </div>

        <button onClick={() => setStep("form")} className="oneui-btn w-full py-3"
          style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
          رجوع
        </button>
      </div>
    );
  }

  /* ═══════ FORM (default) ═══════ */
  return (
    <form onSubmit={(e) => { e.preventDefault(); const v = validate(); if (v) return setError(v); setError(""); setStep("payment"); }}
      className="surface fade-up space-y-3 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
      <h2 className="text-base font-black">اطلب الآن</h2>

      {!customer && (
        <button type="button" onClick={() => setShowAuth(true)} className="oneui-btn w-full"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
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
              <button type="button" key={o.id} onClick={() => setOptionId(o.id)}
                className="oneui-btn px-2 py-2.5 text-center"
                style={{
                  background: o.id === optionId ? "linear-gradient(135deg, #ffe58a, #f5c542, #d4a017)" : "var(--surface-2)",
                  color: o.id === optionId ? "var(--text-on-gold)" : "var(--text-secondary)",
                  border: o.id === optionId ? "none" : "1px solid var(--border)",
                  boxShadow: o.id === optionId ? "var(--shadow-gold)" : "none",
                }}>
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

      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل *" className={inputCls} />
      <input required type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+967 7xx xxx xxx *" className={`${inputCls} text-right`} />
      <input type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني (اختياري)" className={`${inputCls} text-right`} />
      {requiredInfo && (
        <div>
          <div className="mb-1 text-xs font-bold" style={{ color: "var(--gold)" }}>📝 مطلوب: {requiredInfo}</div>
          <textarea value={customerInput} onChange={(e) => setCustomerInput(e.target.value)} rows={2} placeholder={requiredInfo} className={inputCls} />
        </div>
      )}
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية (اختياري)" rows={2} className={inputCls} />

      {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
      <button type="submit" className="gold-btn oneui-btn w-full py-3.5 text-base">
        اختيار طريقة الدفع — ${total.toLocaleString()}
      </button>
    </form>
  );
}
