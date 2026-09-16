"use client";

import { useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";

export default function CustomerAuthModal() {
  const { customer, showAuth, setShowAuth, login, logout } = useCustomer();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!showAuth) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("يرجى إدخال الاسم الكامل");
    if (phone.replace(/\D/g, "").length < 7) return setError("يرجى إدخال رقم هاتف صحيح");
    login({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setName("");
    setPhone("");
    setEmail("");
  }

  return (
    <div className="modal-overlay" onClick={() => setShowAuth(false)}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        {customer ? (
          /* ─── Profile View ─── */
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl text-white shadow-lg">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-3 text-xl font-black">{customer.name}</h2>
            <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              📱 {customer.phone}
            </div>
            {customer.email && (
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                ✉️ {customer.email}
              </div>
            )}
            <div className="mt-5 grid gap-2">
              <button
                onClick={() => setShowAuth(false)}
                className="gold-btn oneui-btn w-full"
              >
                حسناً
              </button>
              <button
                onClick={() => { logout(); setShowAuth(false); }}
                className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : (
          /* ─── Login / Register Form ─── */
          <>
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white shadow-lg">
                👤
              </div>
              <h2 className="mt-3 text-xl font-black">تسجيل الدخول</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                أدخل بياناتك لإتمام الطلبات بسهولة
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                  الاسم الكامل *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="oneui-input"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                  رقم الهاتف *
                </label>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+967 7xx xxx xxx"
                  className="oneui-input text-right"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="oneui-input text-right"
                />
              </div>
              {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
              <button type="submit" className="gold-btn oneui-btn w-full">
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => setShowAuth(false)}
                className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
              >
                إلغاء
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
