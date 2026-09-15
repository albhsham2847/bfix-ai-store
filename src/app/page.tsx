import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/store";
import { CONTACT } from "@/lib/seed-data";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cats, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="space-y-7 pt-4">
      {/* Hero */}
      <section className="fade-up relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#151a2e] via-[#0e1322] to-[#1b1408] p-5">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-6 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold text-gold ring-1 ring-gold/30">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            خدمة فورية 24/7
          </span>
          <h1 className="mt-3 text-2xl font-black leading-snug">
            كل ما تحتاجه من <span className="gold-text">أدوات</span>،{" "}
            <span className="gold-text">ذكاء اصطناعي</span> وخدمات رقمية
          </h1>
          <p className="mt-2 text-sm text-white/60">
            تفعيلات رسمية، اشتراكات موثوقة، شحن فوري، ودعم فني مباشر عبر
            واتساب وتليجرام.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/search" className="gold-btn rounded-xl px-4 py-2.5 text-sm font-black">
              تصفح الخدمات
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold ring-1 ring-white/10"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-2">
        {[
          ["+5000", "عميل"],
          ["11", "قسم خدمات"],
          ["24/7", "دعم فني"],
        ].map(([v, l]) => (
          <div key={l} className="glass rounded-2xl p-3 text-center">
            <div className="text-lg font-black text-gold">{v}</div>
            <div className="text-[11px] text-white/55">{l}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">الأقسام</h2>
          <Link href="/search" className="text-xs font-bold text-gold">
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2.5 md:grid-cols-4 lg:grid-cols-6">
          {cats.map((c, i) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              style={{ animationDelay: `${i * 40}ms` }}
              className="glass card-hover fade-up flex flex-col items-center gap-2 rounded-2xl p-3 text-center"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-2xl shadow-lg`}
              >
                {c.icon}
              </div>
              <span className="text-[12px] font-bold leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">الأكثر طلباً 🔥</h2>
        </div>
        <div className="grid gap-2.5 lg:grid-cols-2">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="glass rounded-3xl p-5">
        <h2 className="text-base font-black">لماذا B-Fix Software؟</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/70">
          <li>✅ تفعيلات واشتراكات رسمية 100%</li>
          <li>⚡ تسليم فوري خلال دقائق</li>
          <li>🛡️ ضمان كامل على جميع الخدمات</li>
          <li>💬 دعم فني مباشر على مدار الساعة</li>
        </ul>
      </section>
    </div>
  );
}
