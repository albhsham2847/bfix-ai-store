"use client";

import { useRef, useState } from "react";
import { fileToBase64 } from "@/lib/upload";

export default function ImagePicker({
  label,
  onImage,
  current,
}: {
  label: string;
  onImage: (base64: string) => void;
  current?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(current || "");

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setPreview(b64);
    onImage(b64);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-bold" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input ref={ref} type="file" accept="image/*" capture="environment" onChange={handle} className="hidden" />
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="w-full max-h-48 object-contain rounded-xl" style={{ border: "1px solid var(--border)" }} />
          <button type="button" onClick={() => { setPreview(""); onImage(""); ref.current!.value = ""; }}
            className="absolute top-2 left-2 h-7 w-7 rounded-full bg-rose-500 text-white text-xs font-black grid place-items-center">✕</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { if (ref.current) { ref.current.capture = "environment"; ref.current.click(); }}}
            className="oneui-btn py-3" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            📷 الكاميرا
          </button>
          <button type="button" onClick={() => { if (ref.current) { ref.current.removeAttribute("capture"); ref.current.click(); }}}
            className="oneui-btn py-3" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            🖼️ المعرض
          </button>
        </div>
      )}
    </div>
  );
}
