"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallOverlay() {
  const [show, setShow] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("bfix-install-dismissed")) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "linear-gradient(180deg, rgba(7,10,18,0.98) 0%, rgba(17,23,41,0.98) 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
    }}>
      {/* Close */}
      <button onClick={() => { setShow(false); localStorage.setItem("bfix-install-dismissed", "1"); }}
        style={{ position: "absolute", top: 16, left: 16, width: 40, height: 40, borderRadius: 9999, background: "rgba(255,255,255,0.1)", color: "#fff", display: "grid", placeItems: "center", fontSize: "1.25rem", fontWeight: 900, border: "none", cursor: "pointer" }}>
        ✕
      </button>

      <div style={{ width: 80, height: 80, borderRadius: 20, overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 8px 40px rgba(245,197,66,0.3)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-512.png" alt="B-Fix" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>
        <span style={{ background: "linear-gradient(120deg, #ffe58a, #f5c542, #d4a017)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>B-Fix</span> Software
      </h1>
      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "2rem", maxWidth: 300 }}>
        متجرك الرقمي المتكامل — أدوات برمجة، اشتراكات ذكاء اصطناعي، شحن ألعاب والمزيد
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: 320 }}>
        {deferred && (
          <button onClick={async () => { await deferred.prompt(); setShow(false); }}
            className="gold-btn oneui-btn" style={{ padding: "1rem", fontSize: "1rem" }}>
            ⬇️ تثبيت التطبيق
          </button>
        )}
        <button onClick={() => { setShow(false); localStorage.setItem("bfix-install-dismissed", "1"); }}
          className="oneui-btn" style={{ padding: "1rem", fontSize: "1rem", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
          🌐 تصفح عبر الويب
        </button>
      </div>

      <p style={{ marginTop: "2rem", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>
        B-Fix Software | AI Store © {new Date().getFullYear()}
      </p>
    </div>
  );
}
