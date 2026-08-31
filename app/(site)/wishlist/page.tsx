"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

type WishlistRow = {
  id: string;
  product_id: string;
  variation_id: string | null;
  products: {
    id: string;
    name: string;
    sku: string;
    image_url: string | null;
  } | null;
  product_variations: {
    id: string;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    color: string | null;
    size: string | null;
    image_url: string | null;
  } | null;
};

export default function WishlistPage() {
  const { user, loading: authLoading, openLoginModal, toggleWishlist, addToCart, refreshWishlist, refreshCart } = useAuth();
  const supabase = createClient();

  const [items, setItems] = useState<WishlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [movedIds, setMovedIds] = useState<Set<string>>(new Set());

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("wishlist")
      .select(
        "id, product_id, variation_id, products(id, name, sku, image_url), product_variations(id, price, compare_at_price, stock_quantity, color, size, image_url)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as unknown as WishlistRow[]);
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading) loadWishlist();
  }, [authLoading, loadWishlist]);

  function setPending(productId: string, on: boolean) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }

  async function handleRemove(productId: string) {
    setPending(productId, true);
    try {
      await toggleWishlist(productId, null);
      await loadWishlist();
      await refreshWishlist();
    } catch (err: any) {
      setError(err?.message ?? "Couldn't remove item.");
    } finally {
      setPending(productId, false);
    }
  }

  async function handleMoveToCart(item: WishlistRow) {
    if (!item.variation_id) return; // no specific variation saved — send them to the product page instead
    setPending(item.product_id, true);
    try {
      await addToCart(item.product_id, item.variation_id, 1);
      await refreshCart();
      setMovedIds((prev) => new Set(prev).add(item.id));
    } catch (err: any) {
      setError(err?.message ?? "Couldn't add to cart.");
    } finally {
      setPending(item.product_id, false);
    }
  }

  if (!authLoading && !user) {
    return (
      <main className="w-full min-h-screen bg-[#F8F6F0] text-[#1A1A1A] pt-32 pb-16 px-6 lg:px-16 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1
            className="text-2xl uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Your Wishlist
          </h1>
          <p className="text-sm text-[#1A1A1A]/60 font-outfit font-light mb-6">
            Sign in to view items you&apos;ve saved.
          </p>
          <button
            onClick={openLoginModal}
            className="px-8 py-3 rounded bg-[#1A1A1A] text-[#F8F6F0] text-[11px] tracking-[0.3em] uppercase font-outfit font-medium hover:bg-[#9c7d23] transition-all"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#F8F6F0] text-[#1A1A1A] pt-24 md:pt-32 pb-16 px-6 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-2xl md:text-3xl uppercase tracking-[0.15em] mb-10"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Your Wishlist
        </h1>

        {error && (
          <p className="text-[12px] font-outfit text-red-600/90 mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-[#1A1A1A]/50 font-outfit font-light">Loading wishlist...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#1A1A1A]/60 font-outfit font-light mb-6">
              Your wishlist is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded bg-[#1A1A1A] text-[#F8F6F0] text-[11px] tracking-[0.3em] uppercase font-outfit font-medium hover:bg-[#9c7d23] transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => {
              const product = item.products;
              const variation = item.product_variations;
              const image = variation?.image_url || product?.image_url;
              const price = variation?.price != null ? Number(variation.price) : null;
              const isPending = pendingIds.has(item.product_id);
              const outOfStock = variation ? (variation.stock_quantity ?? 0) <= 0 : false;
              const moved = movedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-md border border-[#1A1A1A]/10 rounded-lg overflow-hidden group"
                >
                  <Link href={`/product/${item.product_id}`} className="relative block aspect-[4/5] bg-white">
                    {image ? (
                      <Image
                        src={image}
                        alt={product?.name ?? "Product"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">
                        No Image
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(item.product_id);
                      }}
                      disabled={isPending}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-[#1A1A1A]/60 hover:text-red-600 shadow-sm disabled:opacity-40"
                    >
                      ✕
                    </button>
                  </Link>

                  <div className="p-4">
                    <Link
                      href={`/product/${item.product_id}`}
                      className="block text-sm font-outfit font-medium uppercase tracking-wide hover:text-[#9c7d23] transition-colors line-clamp-2"
                    >
                      {product?.name ?? "Product"}
                    </Link>

                    {variation && (
                      <p className="text-[11px] text-[#1A1A1A]/50 font-outfit font-light mt-1">
                        {[variation.color, variation.size].filter(Boolean).join(" / ")}
                      </p>
                    )}

                    {price !== null && (
                      <p
                        className="text-base font-outfit font-medium text-[#9c7d23] mt-2"
                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                      >
                        ₹{price.toLocaleString()}
                      </p>
                    )}

                    {outOfStock && (
                      <p className="text-[10px] uppercase tracking-widest text-red-600/80 font-outfit font-medium mt-1">
                        Out of stock
                      </p>
                    )}

                    {item.variation_id ? (
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isPending || outOfStock || moved}
                        className="w-full mt-3 py-2.5 rounded text-[10px] tracking-[0.25em] uppercase font-outfit font-medium bg-[#1A1A1A] text-[#F8F6F0] hover:bg-[#9c7d23] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {moved ? "Added ✓" : outOfStock ? "Unavailable" : "Move to Cart"}
                      </button>
                    ) : (
                      <Link
                        href={`/product/${item.product_id}`}
                        className="block w-full mt-3 py-2.5 rounded text-[10px] tracking-[0.25em] uppercase font-outfit font-medium bg-[#1A1A1A] text-[#F8F6F0] hover:bg-[#9c7d23] transition-all text-center"
                      >
                        Select Options
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}