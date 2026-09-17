"use client";

import { useState } from "react";
import { useCustomer } from "@/contexts/CustomerContext";

type View = "login" | "register" | "forgot";

export default function CustomerAuthModal() {
  const { customer, showAuth, setShowAuth, login, logout } = useCustomer();
  const [view, setView] = useState<View>("login");

  // Login fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Captcha
  const [captchaQ, setCaptchaQ] = useState("");
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");

  // Forgot
  const [forgotPhone, setForgotPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!showAuth) return null;

  function resetForm() {
    setPhone(""); setPassword(""); setName(""); setRegPhone(""); setRegEmail("");
    setRegPassword(""); setRegConfirm(""); setCaptchaInput(""); setError(""); setSuccess("");
    setForgotPhone(""); setNewPassword("");
  }

  function switchView(v: View) {
    resetForm();
    // Generate new captcha
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;
    if (op === "+") ans = a + b;
    else if (op === "-") ans = a - b;
    else ans = a * b;
    setCaptchaQ(`${a} ${op} ${b} = ?`);
    setCaptchaA(ans);
    setView(v);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (parseInt(captchaInput) !== captchaA) return setError("الكابتشا غير صحيحة — لست روبوت، أعد المحاولة");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      login(data.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      switchView("login"); // refresh captcha
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (parseInt(captchaInput) !== captchaA) return setError("الكابتشا غير صحيحة");
    if (regPassword.length < 6) return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (regPassword !== regConfirm) return setError("كلمتا المرور غير متطابقتين");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), phone: regPhone.trim(), email: regEmail.trim(),
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      login(data.customer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword.length < 6) return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: forgotPhone.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      setSuccess("تم إعادة تعيين كلمة المرور بنجاح — يمكنك تسجيل الدخول الآن");
      setTimeout(() => switchView("login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  const ic = "oneui-input";

  return (
    <div className="modal-overlay" onClick={() => setShowAuth(false)}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        {customer ? (
          /* ═══ Profile ═══ */
          <div className="text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-4xl text-white shadow-lg">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-3 text-xl font-black">{customer.name}</h2>
            <div className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>📱 {customer.phone}</div>
            {customer.email && <div className="text-sm" style={{ color: "var(--text-secondary)" }}>✉️ {customer.email}</div>}
            <div className="mt-3 rounded-xl p-3" style={{ background: "var(--surface-2)" }}>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>الرصيد</div>
              <div className="text-2xl font-black" style={{ color: "var(--gold)" }}>${customer.balance.toLocaleString()}</div>
            </div>
            <div className="mt-4 grid gap-2">
              <button onClick={() => setShowAuth(false)} className="gold-btn oneui-btn w-full">حسناً</button>
              <button onClick={() => { logout(); setShowAuth(false); }} className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>تسجيل الخروج</button>
            </div>
          </div>
        ) : view === "register" ? (
          /* ═══ Register ═══ */
          <form onSubmit={handleRegister}>
            <div className="text-center mb-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl text-white shadow-lg">📝</div>
              <h2 className="mt-2 text-xl font-black">إنشاء حساب جديد</h2>
            </div>
            <div className="space-y-3">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل *" className={ic} />
              <input required type="tel" dir="ltr" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+967 7xx xxx xxx *" className={`${ic} text-right`} />
              <input type="email" dir="ltr" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="البريد الإلكتروني" className={`${ic} text-right`} />
              <input required type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="كلمة المرور (6 أحرف على الأقل) *" className={ic} />
              <input required type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="تأكيد كلمة المرور *" className={ic} />
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface-2)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>أثبت أنك لست روبوت</div>
                <div className="text-lg font-black mb-2" style={{ color: "var(--gold)" }}>{captchaQ}</div>
                <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="الإجابة" type="number"
                  className={`${ic} text-center`} style={{ maxWidth: 140, marginInline: "auto" }} />
              </div>
              {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
              <button disabled={loading} className="gold-btn oneui-btn w-full disabled:opacity-60">
                {loading ? "..." : "إنشاء الحساب"}
              </button>
              <button type="button" onClick={() => switchView("login")} className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                لدي حساب بالفعل — تسجيل الدخول
              </button>
            </div>
          </form>
        ) : view === "forgot" ? (
          /* ═══ Forgot Password ═══ */
          <form onSubmit={handleForgot}>
            <div className="text-center mb-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-2xl text-white shadow-lg">🔑</div>
              <h2 className="mt-2 text-xl font-black">استعادة كلمة المرور</h2>
            </div>
            <div className="space-y-3">
              <input required type="tel" dir="ltr" value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} placeholder="رقم الهاتف المسجل *" className={`${ic} text-right`} />
              <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور الجديدة *" className={ic} />
              {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
              {success && <p className="text-sm font-bold text-emerald-500">{success}</p>}
              <button disabled={loading} className="gold-btn oneui-btn w-full disabled:opacity-60">
                {loading ? "..." : "إعادة التعيين"}
              </button>
              <button type="button" onClick={() => switchView("login")} className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>رجوع لتسجيل الدخول</button>
            </div>
          </form>
        ) : (
          /* ═══ Login ═══ */
          <form onSubmit={handleLogin}>
            <div className="text-center mb-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white shadow-lg">👤</div>
              <h2 className="mt-2 text-xl font-black">تسجيل الدخول</h2>
            </div>
            <div className="space-y-3">
              <input required type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف *" className={`${ic} text-right`} autoFocus />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور *" className={ic} />
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--surface-2)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>أثبت أنك لست روبوت</div>
                <div className="text-lg font-black mb-2" style={{ color: "var(--gold)" }}>{captchaQ}</div>
                <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="الإجابة" type="number"
                  className={`${ic} text-center`} style={{ maxWidth: 140, marginInline: "auto" }} />
              </div>
              {error && <p className="text-sm font-bold text-rose-500">{error}</p>}
              <button disabled={loading} className="gold-btn oneui-btn w-full disabled:opacity-60">
                {loading ? "..." : "دخول"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => switchView("register")} className="oneui-btn"
                  style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>حساب جديد</button>
                <button type="button" onClick={() => switchView("forgot")} className="oneui-btn"
                  style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>نسيت كلمة المرور</button>
              </div>
              <button type="button" onClick={() => setShowAuth(false)} className="oneui-btn w-full"
                style={{ background: "var(--surface-2)", color: "var(--text-tertiary)" }}>إلغاء</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
