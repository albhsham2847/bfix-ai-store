"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function AdminLogin() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="glass mx-auto mt-10 max-w-sm space-y-3 rounded-3xl p-6">
      <div className="text-center text-4xl">🔐</div>
      <h1 className="text-center text-xl font-black">دخول الإدارة</h1>
      <input
        name="password"
        type="password"
        required
        placeholder="كلمة المرور"
        className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold/60"
      />
      {error && <p className="text-sm font-bold text-rose-400">{error}</p>}
      <button disabled={pending} className="gold-btn w-full rounded-xl py-3 font-black disabled:opacity-60">
        {pending ? "..." : "دخول"}
      </button>
    </form>
  );
}
