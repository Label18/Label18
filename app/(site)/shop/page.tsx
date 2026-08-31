import { getCategoriesTree, type CategoryTree } from "@/lib/categories";
import { getProducts } from "@/lib/supabase/products";
import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

type Crumb = { label: string; href?: string };

// Walks the category tree to resolve the active category/sub/subsub names
// from the search params, so the breadcrumb reflects the real filter chain.
function buildBreadcrumbs(
  categories: CategoryTree[],
  params: { category?: string; sub?: string; subsub?: string }
): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

  if (!params.category) {
    crumbs.push({ label: "Shop" });
    return crumbs;
  }

  crumbs.push({ label: "Shop", href: "/shop" });

  const cat = categories.find((c) => c.id === params.category);
  if (!cat) return crumbs;

  const catHref = `/shop?category=${cat.id}`;
  if (!params.sub) {
    crumbs.push({ label: cat.name });
    return crumbs;
  }
  crumbs.push({ label: cat.name, href: catHref });

  const sub = cat.sub_categories.find((s) => s.id === params.sub);
  if (!sub) return crumbs;

  const subHref = `${catHref}&sub=${sub.id}`;
  if (!params.subsub) {
    crumbs.push({ label: sub.name });
    return crumbs;
  }
  crumbs.push({ label: sub.name, href: subHref });

  const leaf = sub.sub_sub_categories.find((l) => l.id === params.subsub);
  if (leaf) crumbs.push({ label: leaf.name });

  return crumbs;
}

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-outfit font-light text-[11px] tracking-[0.15em] uppercase">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-x-2">
            {i > 0 && <span className="text-[#9c7d23]/50">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-[#1A1A1A]/50 hover:text-[#9c7d23] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#1A1A1A]" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const categories = await getCategoriesTree();

  const page = params.page ? parseInt(params.page) : 1;
  const { items, total, pageSize } = await getProducts({
    categoryId: params.category,
    subCategoryId: params.sub,
    subSubCategoryId: params.subsub,
    search: params.q,
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    sort: (params.sort as any) ?? "newest",
    page,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const crumbs = buildBreadcrumbs(categories, {
    category: params.category,
    sub: params.sub,
    subsub: params.subsub,
  });

  return (
    <main className="min-h-screen bg-[#F8F6F0] text-[#1A1A1A] pt-32 md:pt-40 pb-24 px-6 lg:px-16 selection:bg-[#9c7d23]/30 selection:text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs crumbs={crumbs} />

        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#9c7d23]/50 mx-auto mb-6" />
          <span className="font-outfit font-light text-[10px] tracking-[0.5em] uppercase text-[#9c7d23] mb-4 block">
            The Collection
          </span>
          <h1
            className="font-normal text-4xl md:text-6xl text-[#1A1A1A] tracking-widest uppercase"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Shop{" "}
            <span
              className="text-[#9c7d23] italic font-normal tracking-normal lowercase"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              the edit
            </span>
          </h1>
          <p className="font-outfit font-light text-[12px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-5">
            {total} {total === 1 ? "product" : "products"}
            {params.q ? ` · matching "${params.q}"` : ""}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters rail */}
          <aside className="lg:w-64 shrink-0">
            <div className="rounded-xl bg-white border border-[#1A1A1A]/10 p-5">
              <ProductFilters categories={categories} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {items.length === 0 ? (
              <div className="text-center py-24 rounded-xl bg-white border border-[#1A1A1A]/10">
                <p className="font-outfit font-light text-[13px] tracking-[0.1em] uppercase text-[#1A1A1A]/50">
                  No products match these filters.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 text-[11px] tracking-[0.2em] uppercase font-outfit font-medium text-[#9c7d23] hover:text-[#1A1A1A] transition-colors"
                >
                  Clear filters →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const qp = new URLSearchParams({ ...params, page: String(p) } as any);
                  const isActive = p === page;
                  return (
                    <Link
                      key={p}
                      href={`/shop?${qp.toString()}`}
                      className={`text-[12px] font-outfit font-medium w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? "bg-[#9c7d23] text-white"
                          : "text-[#1A1A1A]/60 hover:text-[#9c7d23] border border-[#1A1A1A]/10 bg-white"
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