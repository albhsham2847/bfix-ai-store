"use client";

import { useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/db/schema";
import { CONTACT } from "@/lib/seed-data";
import ImagePicker from "./ImagePicker";

type Step = "amount" | "payment" | "proof" | "done";

export default function TopUpForm() {
  const { customer, setShowAuth, refreshBalance } = useCustomer();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethodId | "">("");
  const [proofText, setProofText] = useState("");
  const [proofImage, setProofImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const selectedPay = PAYMENT_METHODS.find((m) => m.id === payMethod);

  if (!customer) {
    return (
      <div className="surface p-6 text-center" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-4xl">👤</div>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>يجب تسجيل الدخول لشحن الرصيد</p>
        <button onClick={() => setShowAuth(true)} className="gold-btn oneui-btn mt-3">تسجيل الدخول</button>
      </div>
    );
  }

  async function submitTopUp() {
    if (!customer) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/topup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer!.id, amount: Number(amount), paymentMethod: payMethod,
          proofText: proofText || null, proofImage: proofImage || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setCode(data.request.code);
      refreshBalance();
      setStep("done");
    } catch (err) { setError(err instanceof Error ? err.message : "حدث خطأ"); }
    finally { setLoading(false); }
  }

  function whatsappLink() {
    const msg = `🟡 *طلب شحن رصيد — B-Fix Software*\n━━━━━━━━━━\n👤 ${customer!.name}\n📱 ${customer!.phone}\n💰 المبلغ: $${amount}\n💳 طريقة الدفع: ${selectedPay?.name}\n━━━━━━━━━━\nأرجو تأكيد الشحن.`;
    return `${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  const ic = "oneui-input";

  if (step === "done") {
    return (
      <div className="surface fade-up p-5 text-center space-y-3" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-black">تم إرسال طلب الشحن</h2>
        <div className="mx-auto inline-block rounded-xl px-4 py-1.5 font-mono text-lg font-black"
          style={{ background: "rgba(212,160,23,0.12)", color: "var(--gold)" }}>{code}</div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          سيتم مراجعة الطلب وإضافة الرصيد في أقرب وقت
        </p>
        <a href={whatsappLink()} target="_blank" rel="noreferrer"
          className="oneui-btn w-full" style={{ background: "#25D366", color: "#000", fontWeight: 900 }}>
          💬 إرسال أيضاً عبر واتساب
        </a>
      </div>
    );
  }

  if (step === "proof") {
    return (
      <div className="surface fade-up space-y-3 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
        <h2 className="text-lg font-black">📸 إثبات التحويل (اختياري)</h2>
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--surface-2)" }}>
          <div>المبلغ: <span className="font-black" style={{ color: "var(--gold)" }}>${Number(amount)}</span></div>
          <div>طريقة الدفع: {selectedPay?.name}</div>
        </div>
        <ImagePicker label="صورة الإثبات (الكاميرا أو المعرض)" onImage={setProofImage} />
        <textarea value={proofText} onChange={(e) => setProofText(e.target.value)} rows={2}
          placeholder="أو رقم السند / وصف التحويل" className={ic} />
        {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
        <div className="space-y-2">
          <button onClick={submitTopUp} disabled={loading} className="gold-btn oneui-btn w-full py-3 disabled:opacity-60">
            {loading ? "..." : "إرسال الطلب للإدارة"}
          </button>
          <a href={whatsappLink()} target="_blank" rel="noreferrer"
            className="oneui-btn w-full py-3" style={{ background: "#25D366", color: "#000", fontWeight: 900 }}>
            💬 إرسال عبر واتساب مباشرة
          </a>
          <button onClick={() => setStep("payment")} className="oneui-btn w-full py-3"
            style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>رجوع</button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="surface fade-up space-y-3 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
        <h2 className="text-lg font-black">اختر طريقة الدفع</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <button key={m.id} onClick={() => { setPayMethod(m.id); setStep("proof"); }}
              className="card-hover flex items-center gap-3 w-full p-4 text-right"
              style={{ borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>{m.name}</div>
                <div className="text-xs font-mono" dir="ltr" style={{ color: "var(--text-tertiary)" }}>{m.details[0]}</div>
              </div>
              <span style={{ color: "var(--text-tertiary)" }}>←</span>
            </button>
          ))}
        </div>
        <button onClick={() => setStep("amount")} className="oneui-btn w-full py-3"
          style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>رجوع</button>
      </div>
    );
  }

  return (
    <div className="surface fade-up space-y-3 p-5" style={{ borderRadius: "var(--radius-xl)" }}>
      <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface-2)" }}>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>رصيدك الحالي</div>
        <div className="text-2xl font-black" style={{ color: "var(--gold)" }}>${customer.balance.toLocaleString()}</div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>المبلغ بالدولار</label>
        <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder="مثال: 50" className={`${ic} text-center text-xl font-black`} dir="ltr" />
      </div>
      {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
      <button onClick={() => {
        if (!amount || Number(amount) < 1) return setError("يرجى إدخال مبلغ صحيح");
        setError(""); setStep("payment");
      }} className="gold-btn oneui-btn w-full py-3.5 text-base">متابعة — ${amount || "0"}</button>
    </div>
  );
}
