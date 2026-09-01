"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export default function WishlistButton({
  productId,
  variationId,
  onRequireLogin,
}: {
  productId: string;
  variationId: string | null;
  onRequireLogin?: (reason?: string) => void;
}) {
  const { user, toggleWishlist, isInWishlist, refreshWishlist, openLoginModal } = useAuth();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setActive(false);
      return;
    }
    isInWishlist(productId).then(setActive).catch(() => {});
  }, [user, productId, isInWishlist]);

  async function handleClick() {
    if (!user) {
      toast("Please login first to save to wishlist", { icon: "⚠️" });
      if (onRequireLogin) {
        onRequireLogin("Please sign in to save items to your wishlist.");
      } else {
        openLoginModal("Please sign in to save items to your wishlist.");
      }
      return;
    }
    setLoading(true);
    try {
      const nowActive = await toggleWishlist(productId, variationId);
      setActive(nowActive);
      await refreshWishlist();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-pressed={active}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-11 h-11 flex items-center justify-center rounded border transition-all shrink-0 ${
        active
          ? "border-[#9c7d23] text-[#9c7d23] bg-[#9c7d23]/5"
          : "border-[#1A1A1A]/20 text-[#1A1A1A]/60 hover:border-[#9c7d23] hover:text-[#9c7d23]"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        fill={active ? "currentColor" : "none"}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}