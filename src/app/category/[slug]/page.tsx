import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const items = await getProductsByCategory(cat.id);

  return (
    <div className="space-y-5 pt-4">
      <Link href="/" className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>← الرئيسية</Link>
      <section
        className={`fade-up relative overflow-hidden bg-gradient-to-br ${cat.gradient} p-5 text-black shadow-xl`}
        style={{ borderRadius: "var(--radius-xl)" }}
      >
        <div className="text-4xl">{cat.icon}</div>
        <h1 className="mt-2 text-2xl font-black">{cat.name}</h1>
        <p className="mt-1 text-sm font-semibold opacity-80">{cat.description}</p>
      </section>
      <div className="grid gap-2.5 lg:grid-cols-2">
        {items.map((p) => (
          <ProductCard key={p.id} p={{ ...p, icon: cat.icon, gradient: cat.gradient }} />
        ))}
      </div>
    </div>
  );
}
