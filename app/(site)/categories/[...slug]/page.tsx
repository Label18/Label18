import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoriesTree, CategoryTree } from "@/lib/categories";
import { getProducts } from "@/lib/supabase/products";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  if (!slug || slug.length === 0 || slug.length > 3) notFound();

  const [categoryId, subCategoryId, subSubCategoryId] = slug;

  const categories = await getCategoriesTree();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) notFound();

  const subCategory = subCategoryId
    ? category.sub_categories.find((s) => s.id === subCategoryId)
    : undefined;
  if (subCategoryId && !subCategory) notFound();

  const subSubCategory = subSubCategoryId
    ? subCategory?.sub_sub_categories.find((s) => s.id === subSubCategoryId)
    : undefined;
  if (subSubCategoryId && !subSubCategory) notFound();

  const page = sp.page ? parseInt(sp.page) : 1;
  const { items, total, pageSize } = await getProducts({
    categoryId: category.id,
    subCategoryId: subCategory?.id,
    subSubCategoryId: subSubCategory?.id,
    search: sp.q,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (sp.sort as any) ?? "newest",
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentName = subSubCategory?.name ?? subCategory?.name ?? category.name;

  return (
    <main className="min-h-screen bg-black pt-32 md:pt-40 pb-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-[10.5px] tracking-[0.15em] uppercase font-outfit font-light text-white/40 flex-wrap">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
          <span>/</span>
          <Link
            href={`/categories/${category.id}`}
            className={`hover:text-[#d4af37] transition-colors ${!subCategory ? "text-[#d4af37]" : ""}`}
          >
            {category.name}
          </Link>
          {subCategory && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${category.id}/${subCategory.id}`}
                className={`hover:text-[#d4af37] transition-colors ${!subSubCategory ? "text-[#d4af37]" : ""}`}
              >
                {subCategory.name}
              </Link>
            </>
          )}
          {subSubCategory && (
            <>
              <span>/</span>
              <span className="text-[#d4af37]">{subSubCategory.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          <ProductFilters categories={categories} />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-outfit font-light text-2xl tracking-[0.15em] uppercase text-white">
                {currentName}
              </h1>
              <span className="text-white/40 text-[11px] tracking-[0.15em] uppercase font-outfit font-light">
                {total} products
              </span>
            </div>

            {items.length === 0 ? (
              <p className="text-white/50 font-outfit font-light text-[13px]">
                No products found in this category.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const qp = new URLSearchParams({ ...sp, page: String(p) } as any);
                  return (
                    <Link
                      key={p}
                      href={`/categories/${slug.join("/")}?${qp.toString()}`}
                      className={`text-[12px] font-outfit font-light w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                        p === page
                          ? "bg-[#d4af37] text-black"
                          : "text-white/60 hover:text-[#d4af37] border border-white/10"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}