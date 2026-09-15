import { CONTACT } from "@/lib/seed-data";

export const metadata = { title: "تواصل معنا" };

const links = [
  { href: CONTACT.whatsapp, label: "واتساب", sub: CONTACT.phoneDisplay, color: "bg-[#25D366] text-black", icon: "💬" },
  { href: `tel:${CONTACT.phone}`, label: "اتصال مباشر", sub: CONTACT.phoneDisplay, color: "bg-white/10 text-white", icon: "📞" },
  { href: CONTACT.telegram, label: "تليجرام", sub: "@bfixSoftware", color: "bg-[#229ED9] text-white", icon: "✈️" },
  { href: CONTACT.facebook, label: "فيسبوك", sub: "صفحتنا الرسمية", color: "bg-[#1877F2] text-white", icon: "📘" },
];

export default function ContactPage() {
  return (
    <div className="space-y-4 pt-4">
      <section className="glass fade-up rounded-3xl p-5 text-center">
        <div className="text-5xl">🤝</div>
        <h1 className="mt-2 text-xl font-black">تواصل مع الإدارة</h1>
        <p className="mt-1 text-sm text-white/60">فريقنا متاح على مدار الساعة للرد على استفساراتك وتنفيذ طلباتك</p>
      </section>
      <div className="grid gap-2.5">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={`card-hover flex items-center gap-3 rounded-2xl p-4 ${l.color} border border-white/10`}
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
      <p className="pt-2 text-center text-xs text-white/40">
        B-Fix Software | AI Store © {new Date().getFullYear()} ·{" "}
        <a href="/admin" className="text-white/30">الإدارة</a>
      </p>
    </div>
  );
}
