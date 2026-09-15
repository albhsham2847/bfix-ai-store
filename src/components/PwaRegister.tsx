"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void> };

export default function PwaRegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!deferred) return null;

  return (
    <button
      onClick={async () => {
        await deferred.prompt();
        setDeferred(null);
      }}
      className="gold-btn fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-black"
    >
      ⬇️ تثبيت التطبيق على هاتفك
    </button>
  );
}
