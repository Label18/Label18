"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CategoryTree } from "@/lib/supabase/categories";

export default function ProductFilters({ categories }: { categories: CategoryTree[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("category") ?? "";
  const subCategoryId = searchParams.get("sub") ?? "";
  const subSubCategoryId = searchParams.get("subsub") ?? "";
  const search = searchParams.get("q") ?? "";
  const minPrice = searchParams.get("min") ?? "";
  const maxPrice = searchParams.get("max") ?? "";
  const sort = searchParams.get("sort") ?? "newest";

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // reset pagination on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  const inputClass =
    "w-full bg-[#F8F6F0] border border-[#1A1A1A]/10 rounded-lg px-3 py-2 text-[#1A1A1A] text-[12px] font-outfit font-light placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#9c7d23]/60 transition-colors";

  return (
    <div className="w-full space-y-7">
      {/* Search */}
      <div>
        <label className="block text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 font-outfit font-light mb-2">
          Search
        </label>
        <input
          defaultValue={search}
          onChange={(e) => updateParams({ q: e.target.value || null })}
          placeholder="Search products…"
          className={inputClass}
        />
      </div>

      {/* Category tree */}
      <div className="pt-1 border-t border-[#1A1A1A]/5">
        <label className="block text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 font-outfit font-light mb-2 mt-6">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateParams({ category: null, sub: null, subsub: null })}
            className={`block w-full text-left text-[11px] tracking-[0.15em] uppercase font-outfit font-light py-1.5 transition-colors ${
              !categoryId ? "text-[#9c7d23] font-medium" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => updateParams({ category: cat.id, sub: null, subsub: null })}
                className={`block w-full text-left text-[11px] tracking-[0.15em] uppercase font-outfit font-light py-1.5 transition-colors ${
                  categoryId === cat.id ? "text-[#9c7d23] font-medium" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                }`}
              >
                {cat.name}
              </button>

              {categoryId === cat.id && cat.sub_categories.length > 0 && (
                <div className="pl-3 space-y-1 border-l border-[#d4af37]/40 ml-1">
                  {cat.sub_categories.map((sub) => (
                    <div key={sub.id}>
                      <button
                        onClick={() => updateParams({ sub: sub.id, subsub: null })}
                        className={`block w-full text-left text-[10.5px] tracking-[0.12em] uppercase font-outfit font-light py-1 transition-colors ${
                          subCategoryId === sub.id ? "text-[#9c7d23] font-medium" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]/80"
                        }`}
                      >
                        {sub.name}
                      </button>

                      {subCategoryId === sub.id && sub.sub_sub_categories.length > 0 && (
                        <div className="pl-3 space-y-1 border-l border-[#d4af37]/30 ml-1">
                          {sub.sub_sub_categories.map((subSub) => (
                            <button
                              key={subSub.id}
                              onClick={() => updateParams({ subsub: subSub.id })}
                              className={`block w-full text-left text-[10px] tracking-[0.1em] uppercase font-outfit font-light py-1 transition-colors ${
                                subSubCategoryId === subSub.id
                                  ? "text-[#9c7d23] font-medium"
                                  : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
                              }`}
                            >
                              {subSub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="pt-1 border-t border-[#1A1A1A]/5">
        <label className="block text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 font-outfit font-light mb-2 mt-6">
          Price
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            defaultValue={minPrice}
            onChange={(e) => updateParams({ min: e.target.value || null })}
            placeholder="Min"
            className={`w-1/2 ${inputClass}`}
          />
          <span className="text-[#1A1A1A]/25 text-[11px]">–</span>
          <input
            type="number"
            defaultValue={maxPrice}
            onChange={(e) => updateParams({ max: e.target.value || null })}
            placeholder="Max"
            className={`w-1/2 ${inputClass}`}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="pt-1 border-t border-[#1A1A1A]/5">
        <label className="block text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/45 font-outfit font-light mb-2 mt-6">
          Sort by
        </label>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className={inputClass}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A–Z</option>
        </select>
      </div>
    </div>
  );
}