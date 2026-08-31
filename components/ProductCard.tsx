import Link from "next/link";
import Image from "next/image";
import { ProductWithPrice } from "@/lib/supabase/products";

export default function ProductCard({ product }: { product: ProductWithPrice }) {
  const image = product.image_url || product.product_variations[0]?.image_url;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl border border-white/10 bg-black/40 hover:border-[#d4af37]/40 transition-colors overflow-hidden"
    >
      <div className="relative aspect-square bg-white/5 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-[11px] uppercase tracking-widest">
            No Image
          </div>
        )}
        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-black/80 text-white/70 text-[10px] tracking-[0.15em] uppercase px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-outfit font-light text-[12px] tracking-[0.1em] uppercase text-white/90 truncate">
          {product.name}
        </h3>
        <p className="mt-1 font-outfit font-light text-[13px] text-[#d4af37]">
          {product.minPrice != null
            ? product.minPrice === product.maxPrice
              ? `₹${product.minPrice.toLocaleString()}`
              : `From ₹${product.minPrice.toLocaleString()}`
            : "Price unavailable"}
        </p>
      </div>
    </Link>
  );
}