"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CategoryNavItem from "@/components/CategoryNavItem";
import CategoryAccordionMobile from "@/components/CategoryAccordionMobile";
import { getCategoriesTree, CategoryTree } from "@/lib/categories";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, profile, signOut, cartCount, wishlistCount } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategoriesTree().then(setCategories);
  }, []);

  // Close the user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "Account";

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
  };

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-[1300px] z-50 transition-all duration-700 ease-in-out rounded-2xl md:rounded-[2rem] border ${
        scrolled
          ? "top-4 md:top-6 bg-black/60 backdrop-blur-2xl border-white/10 py-4 md:py-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : "top-6 md:top-8 bg-transparent py-5 md:py-6 border-transparent"
      }`}
    >
      <div className="w-full h-full mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center">
          {/* 1. Left: Image Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="inline-block transition-transform duration-300 hover:opacity-80">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={80}
                height={80}
                priority
                className="h-12 w-12 md:h-14 md:w-14 object-contain rounded-sm"
              />
            </Link>
          </div>

          {/* 2. Center: Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center gap-8 lg:gap-14">
            <Link
              href="/"
              className="group relative text-white/70 hover:text-[#d4af37] transition-colors duration-300 font-outfit font-light text-[11px] tracking-[0.25em] uppercase py-2 whitespace-nowrap"
            >
              Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#d4af37] transition-all duration-500 ease-out group-hover:w-full opacity-70"></span>
            </Link>

            {/* Up to 4 categories shown directly in the nav */}
            {categories.slice(0, 4).map((category) => (
              <CategoryNavItem key={category.id} category={category} />
            ))}

            <Link
              href="/shop"
              className="group relative text-white/70 hover:text-[#d4af37] transition-colors duration-300 font-outfit font-light text-[11px] tracking-[0.25em] uppercase py-2 whitespace-nowrap"
            >
              Shop
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#d4af37] transition-all duration-500 ease-out group-hover:w-full opacity-70"></span>
            </Link>

            <Link
              href="/about"
              className="group relative text-white/70 hover:text-[#d4af37] transition-colors duration-300 font-outfit font-light text-[11px] tracking-[0.25em] uppercase py-2 whitespace-nowrap"
            >
              About Us
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#d4af37] transition-all duration-500 ease-out group-hover:w-full opacity-70"></span>
            </Link>
          </nav>

          {/* 3. Right: Actions (Search, Wishlist, Cart, Login/Account & Mobile Menu) */}
          <div className="flex-1 flex items-center justify-end gap-5 md:gap-6">
            {/* Search Button */}
            <button className="text-white/70 hover:text-[#d4af37] transition-all duration-300 group hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative text-white/70 hover:text-[#d4af37] transition-all duration-300 group hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-outfit font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-white/70 hover:text-[#d4af37] transition-all duration-300 group hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.876-4.145 2.147-4.72.174-.373-.041-.813-.417-.813H5.106M7.5 14.25 5.106 5.272M6 21a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-outfit font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login / Account */}
            {user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="group flex items-center gap-2 text-white/70 hover:text-[#d4af37] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="hidden lg:block font-outfit font-light text-[11px] tracking-[0.2em] uppercase pt-[2px] max-w-[100px] truncate">
                    {firstName}
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-[calc(100%+0.75rem)] w-48 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 origin-top-right ${
                    isUserMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <Link
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-5 py-3 text-white/70 hover:text-[#d4af37] hover:bg-white/5 transition-colors font-outfit font-light text-[11px] tracking-[0.2em] uppercase"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-5 py-3 text-white/70 hover:text-[#d4af37] hover:bg-white/5 transition-colors font-outfit font-light text-[11px] tracking-[0.2em] uppercase"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-5 py-3 text-white/70 hover:text-[#d4af37] hover:bg-white/5 transition-colors font-outfit font-light text-[11px] tracking-[0.2em] uppercase"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="group hidden md:flex items-center gap-2 text-white/70 hover:text-[#d4af37] transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="hidden lg:block font-outfit font-light text-[11px] tracking-[0.2em] uppercase pt-[2px]">
                  Login
                </span>
              </button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/70 hover:text-[#d4af37] transition-colors focus:outline-none"
              >
                <svg className="h-6 w-6 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-[calc(100%+1rem)] left-0 w-full overflow-hidden transition-all duration-500 ease-in-out bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
          isMenuOpen ? "max-h-[36rem] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-2 text-center">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-white/70 hover:text-[#d4af37] transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase py-3"
          >
            Home
          </Link>

          {/* Categories accordion (mobile) */}
          <CategoryAccordionMobile
            categories={categories}
            onNavigate={() => setIsMenuOpen(false)}
          />

          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-white/70 hover:text-[#d4af37] transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase py-3"
          >
            About Us
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setIsMenuOpen(false)}
            className="text-white/70 hover:text-[#d4af37] transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase py-3"
          >
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>

          <Link
            href="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="text-white/70 hover:text-[#d4af37] transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase py-3"
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>

          {/* Divider for mobile menu */}
          <div className="w-12 h-[1px] bg-white/10 mx-auto my-2"></div>

          {/* Mobile Login / Account */}
          {user ? (
            <>
              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#d4af37] hover:text-white transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase py-3"
              >
                My Orders
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="text-[#d4af37] hover:text-white transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase flex items-center justify-center space-x-2 py-3"
              >
                <span>Logout ({firstName})</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsLoginOpen(true);
              }}
              className="text-[#d4af37] hover:text-white transition-colors font-outfit font-light text-[12px] tracking-[0.25em] uppercase flex items-center justify-center space-x-2 py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>Login / Account</span>
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}