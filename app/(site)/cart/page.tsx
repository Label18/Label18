"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

type CartRow = {
  id: string;
  quantity: number;
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
    size: string | null;
    color: string | null;
    color_hex: string | null;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    sku: string;
    image_url: string | null;
  } | null;
};

export default function CartPage() {
  const { user, loading: authLoading, openLoginModal, updateCartQuantity, removeFromCart, refreshCart } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const loadCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        "id, quantity, product_id, variation_id, products(id, name, sku, image_url), product_variations(id, size, color, color_hex, price, compare_at_price, stock_quantity, sku, image_url)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as unknown as CartRow[]);
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading) loadCart();
  }, [authLoading, loadCart]);

  function setPending(id: string, on: boolean) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleQuantityChange(cartItemId: string, next: number) {
    setPending(cartItemId, true);
    try {
      await updateCartQuantity(cartItemId, next);
      await loadCart();
      await refreshCart();
    } catch (err: any) {
      setError(err?.message ?? "Couldn't update quantity.");
    } finally {
      setPending(cartItemId, false);
    }
  }

  async function handleRemove(cartItemId: string) {
    setPending(cartItemId, true);
    try {
      await removeFromCart(cartItemId);
      await loadCart();
      await refreshCart();
    } catch (err: any) {
      setError(err?.message ?? "Couldn't remove item.");
    } finally {
      setPending(cartItemId, false);
    }
  }

  function handleCheckout() {
    if (!user) {
      openLoginModal();
      return;
    }
    router.push("/checkout");
  }

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product_variations?.price ?? 0);
    return sum + price * item.quantity;
  }, 0);

  const hasOutOfStockItem = items.some((item) => (item.product_variations?.stock_quantity ?? 0) <= 0);

  if (!authLoading && !user) {
    return (
      <main className="w-full min-h-screen bg-[#F8F6F0] text-[#1A1A1A] pt-32 pb-16 px-6 lg:px-16 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <h1
            className="text-2xl uppercase tracking-[0.15em] mb-4"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Your Cart
          </h1>
          <p className="text-sm text-[#1A1A1A]/60 font-outfit font-light mb-6">
            Sign in to view items you&apos;ve added to your cart.
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
      <div className="max-w-[1000px] mx-auto">
        <h1
          className="text-2xl md:text-3xl uppercase tracking-[0.15em] mb-10"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Your Cart
        </h1>

        {error && (
          <p className="text-[12px] font-outfit text-red-600/90 mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-[#1A1A1A]/50 font-outfit font-light">Loading cart...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#1A1A1A]/60 font-outfit font-light mb-6">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded bg-[#1A1A1A] text-[#F8F6F0] text-[11px] tracking-[0.3em] uppercase font-outfit font-medium hover:bg-[#9c7d23] transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const variation = item.product_variations;
                const product = item.products;
                const image = variation?.image_url || product?.image_url;
                const price = Number(variation?.price ?? 0);
                const isPending = pendingIds.has(item.id);
                const outOfStock = (variation?.stock_quantity ?? 0) <= 0;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white/70 backdrop-blur-md border border-[#1A1A1A]/10 rounded-lg p-4 md:p-5"
                  >
                    <div className="relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 rounded overflow-hidden bg-white border border-[#1A1A1A]/10">
                      {image ? (
                        <Image src={image} alt={product?.name ?? "Product"} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-widest text-[#1A1A1A]/30">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.product_id}`}
                          className="text-sm md:text-base font-outfit font-medium uppercase tracking-wide hover:text-[#9c7d23] transition-colors line-clamp-2"
                        >
                          {product?.name ?? "Product"}
                        </Link>
                        <p className="text-[11px] text-[#1A1A1A]/50 font-outfit font-light mt-1">
                          {[variation?.color, variation?.size].filter(Boolean).join(" / ") || variation?.sku}
                        </p>
                        {outOfStock && (
                          <p className="text-[10px] uppercase tracking-widest text-red-600/80 font-outfit font-medium mt-1">
                            Out of stock
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#1A1A1A]/20 rounded">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isPending}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/70 hover:text-[#9c7d23] disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-outfit">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isPending}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/70 hover:text-[#9c7d23] disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        <p
                          className="text-base font-outfit font-medium text-[#9c7d23]"
                          style={{ fontFamily: '"Times New Roman", Times, serif' }}
                        >
                          ₹{(price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={isPending}
                        className="self-start mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 hover:text-red-600/80 font-outfit transition-colors disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white/70 backdrop-blur-md border border-[#1A1A1A]/10 rounded-lg p-6 sticky top-28">
                <h2
                  className="text-[11px] tracking-[0.3em] uppercase font-outfit font-medium text-[#9c7d23] mb-5"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  Order Summary
                </h2>
                <div className="flex justify-between text-sm font-outfit font-light mb-2">
                  <span className="text-[#1A1A1A]/60">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#1A1A1A]/40 font-outfit font-light mb-5">
                  Shipping and taxes calculated at checkout.
                </p>

                {hasOutOfStockItem && (
                  <p className="text-[11px] text-red-600/90 font-outfit mb-3">
                    Remove out-of-stock items before checking out.
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={hasOutOfStockItem}
                  className="w-full py-4 rounded bg-[#1A1A1A] text-[#F8F6F0] text-[11px] tracking-[0.3em] uppercase font-outfit font-medium hover:bg-[#9c7d23] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}