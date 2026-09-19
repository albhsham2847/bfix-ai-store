import { CONTACT } from "@/lib/seed-data";

export const metadata = { title: "تواصل معنا" };

const links = [
  { href: CONTACT.whatsapp, label: "واتساب", sub: CONTACT.phoneDisplay, icon: "💬", bg: "#25D366", fg: "#000" },
  { href: `tel:${CONTACT.phone}`, label: "اتصال مباشر", sub: CONTACT.phoneDisplay, icon: "📞", bg: "var(--surface-2)", fg: "var(--text-primary)" },
  { href: CONTACT.telegram, label: "تليجرام", sub: "@bfixSoftware", icon: "✈️", bg: "#229ED9", fg: "#fff" },
  { href: CONTACT.facebook, label: "فيسبوك", sub: "صفحتنا الرسمية", icon: "📘", bg: "#1877F2", fg: "#fff" },
];

import BackButton from "@/components/BackButton";

export default function ContactPage() {
  return (
    <div className="space-y-4 pt-4">
      <section className="surface fade-up p-5 text-center" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="text-5xl">🤝</div>
        <div className="mb-3"><BackButton /></div>
      <h1 className="mt-2 text-xl font-black">تواصل مع الإدارة</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>فريقنا متاح على مدار الساعة للرد على استفساراتك</p>
      </section>
      <div className="grid gap-2.5">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="card-hover flex items-center gap-3 p-4"
            style={{ borderRadius: "var(--radius-md)", background: l.bg, color: l.fg, border: "1px solid var(--border)" }}
          >
            <span className="text-2xl">{l.icon}</span>
            <div className="flex-1">
              <div className="font-black">{l.label}</div>
              <div className="text-xs opacity-75" dir="ltr">{l.sub}</div>
            </div>
            <span>←</span>
          </a>
        ))}
      </div>
      <p className="pt-2 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
        B-Fix Software | AI Store © {new Date().getFullYear()} ·{" "}
        <a href="/admin" style={{ color: "var(--text-tertiary)" }}>الإدارة</a>
      </p>
    </div>
  );
}
