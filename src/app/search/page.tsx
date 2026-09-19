import { getAllProducts, getCategories } from "@/lib/store";
import SearchClient from "@/components/SearchClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "الخدمات" };

import BackButton from "@/components/BackButton";

export default async function SearchPage() {
  const [items, cats] = await Promise.all([getAllProducts(), getCategories()]);
  return (
    <div className="pt-4">
      <div className="mb-3"><BackButton /></div>
      <h1 className="mb-3 text-xl font-black">جميع الخدمات</h1>
      <SearchClient
        items={items}
        cats={cats.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon }))}
      />
    </div>
  );
}
