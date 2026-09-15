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
      className="glass card-hover fade-up flex items-center gap-3 rounded-2xl p-3"
    >
      {p.imageUrl ? (
        <Image
          src={p.imageUrl}
          alt={p.name}
          width={56}
          height={56}
          unoptimized
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.gradient ?? "from-gold to-gold-2"} text-2xl shadow-lg`}>
          {p.icon ?? "✨"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] font-extrabold">{p.name}</h3>
          {p.badge && (
            <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold ring-1 ring-gold/30">
              {p.badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/55">{p.description}</p>
        {p.categoryName && <p className="mt-0.5 text-[11px] text-white/40">{p.categoryName}</p>}
      </div>
      <div className="text-left">
        <div className="text-lg font-black text-gold">${Number(p.price).toLocaleString()}</div>
        {p.unit && <div className="text-[10px] text-white/45">{p.unit}</div>}
      </div>
    </Link>
  );
}
