import Link from "next/link";
import Image from "next/image";

export type ProductCardData = {
  id: number;
  name: string;
  description: string;
  price: string;
  unit: string;
  badge: string | null;
  imageUrl?: string | null;
  icon?: string;
  gradient?: string;
  categoryName?: string;
};

export default function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <Link
      href={`/product/${p.id}`}
      prefetch
      className="surface card-hover fade-up flex items-center gap-3"
      style={{ borderRadius: "var(--radius-md)", padding: "0.75rem" }}
    >
      {p.imageUrl ? (
        <Image
          src={p.imageUrl}
          alt={p.name}
          width={56}
          height={56}
          unoptimized
          loading="lazy"
          className="h-14 w-14 shrink-0 object-cover"
          style={{ borderRadius: "var(--radius-sm)" }}
        />
      ) : (
        <div
          className={`grid h-14 w-14 shrink-0 place-items-center bg-gradient-to-br ${p.gradient ?? "from-amber-400 to-orange-500"} text-2xl shadow-lg`}
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          {p.icon ?? "✨"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-extrabold" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
          {p.badge && (
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: "rgba(212,160,23,0.12)", color: "var(--gold)", border: "1px solid rgba(212,160,23,0.25)" }}
            >
              {p.badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs" style={{ color: "var(--text-tertiary)" }}>{p.description}</p>
        {p.categoryName && <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-tertiary)" }}>{p.categoryName}</p>}
      </div>
      <div className="text-left">
        <div className="text-lg font-black" style={{ color: "var(--gold)" }}>${Number(p.price).toLocaleString()}</div>
        {p.unit && <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{p.unit}</div>}
      </div>
    </Link>
  );
}
