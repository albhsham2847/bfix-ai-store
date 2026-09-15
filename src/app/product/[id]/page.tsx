import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/store";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pid = Number(id);
  if (!pid) notFound();
  const p = await getProduct(pid);
  if (!p) notFound();

  return (
    <div className="space-y-5 pt-4">
      <Link href={`/category/${p.categorySlug}`} className="text-xs font-bold text-white/50">
        ← {p.categoryName}
      </Link>
      <section className="glass fade-up rounded-3xl p-5">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${p.gradient} text-3xl shadow-lg`}
          >
            {p.icon}
          </div>
          <div className="min-w-0 flex-1">
            {p.badge && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold ring-1 ring-gold/30">
                {p.badge}
              </span>
            )}
            <h1 className="mt-1 text-xl font-black leading-snug">{p.name}</h1>
            <p className="mt-1 text-sm text-white/60">{p.description}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <div className="text-xs text-white/50">السعر</div>
            <div className="text-3xl font-black text-gold">
              ${Number(p.price).toLocaleString()}
              {p.unit && <span className="mr-1 text-sm font-bold text-white/50">/ {p.unit}</span>}
            </div>
          </div>
          <div className="text-left text-xs text-white/55">
            ⚡ تسليم فوري
            <br />
            🛡️ ضمان كامل
          </div>
        </div>
      </section>

      <OrderForm productId={p.id} productName={p.name} price={p.price} />
    </div>
  );
}
