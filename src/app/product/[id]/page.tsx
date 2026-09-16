import Link from "next/link";
import Image from "next/image";
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
  if (!p || !p.active) notFound();

  const minPrice = p.options.length
    ? Math.min(...p.options.map((o) => Number(o.price)))
    : Number(p.price);

  return (
    <div className="space-y-5 pt-4">
      <Link href={`/category/${p.categorySlug}`} className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
        ← {p.categoryName}
      </Link>
      <section className="surface fade-up overflow-hidden" style={{ borderRadius: "var(--radius-xl)" }}>
        {p.imageUrl && (
          <div className="relative aspect-[16/9] w-full">
            <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {!p.imageUrl && (
              <div className={`grid h-16 w-16 shrink-0 place-items-center bg-gradient-to-br ${p.gradient} text-3xl shadow-lg`}
                style={{ borderRadius: "var(--radius-md)" }}>
                {p.icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {p.badge && (
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: "rgba(212,160,23,0.12)", color: "var(--gold)", border: "1px solid rgba(212,160,23,0.25)" }}>
                  {p.badge}
                </span>
              )}
              <h1 className="mt-1 text-xl font-black leading-snug" style={{ color: "var(--text-primary)" }}>{p.name}</h1>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
            </div>
          </div>
          {p.details && (
            <div className="mt-4 whitespace-pre-line p-4 text-sm leading-relaxed"
              style={{ borderRadius: "var(--radius-md)", background: "var(--surface-2)", color: "var(--text-secondary)" }}>
              {p.details}
            </div>
          )}
          <div className="mt-4 flex items-end justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{p.options.length ? "يبدأ من" : "السعر"}</div>
              <div className="text-3xl font-black" style={{ color: "var(--gold)" }}>
                ${minPrice.toLocaleString()}
                {p.unit && !p.options.length && (
                  <span className="mr-1 text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>/ {p.unit}</span>
                )}
              </div>
            </div>
            <div className="text-left text-xs" style={{ color: "var(--text-tertiary)" }}>
              ⚡ تسليم فوري<br />🛡️ ضمان كامل
            </div>
          </div>
        </div>
      </section>

      <OrderForm
        productId={p.id}
        productName={p.name}
        basePrice={p.price}
        unit={p.unit}
        requiredInfo={p.requiredInfo}
        options={p.options.map((o) => ({ id: o.id, name: o.name, price: o.price }))}
      />
    </div>
  );
}
