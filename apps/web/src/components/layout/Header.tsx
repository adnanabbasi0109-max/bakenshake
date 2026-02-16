"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, MapPin, Menu, X, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import CartDrawer from "@/components/cart/CartDrawer";

const navLinks = [
  { label: "Cakes", href: "/category/cakes" },
  { label: "Custom Cake", href: "/custom-cake" },
  { label: "Bakery", href: "/category/bakery" },
  { label: "Beverages", href: "/category/beverages" },
  { label: "Food Menu", href: "/category/food-menu" },
  { label: "Combos", href: "/category/combos" },
  { label: "Hampers", href: "/category/festive-hampers" },
  { label: "Subscriptions", href: "/subscriptions" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { items, isOpen: cartOpen, openCart, closeCart } = useCartStore();
  const { selectedCity, openLocationModal } = useLocationStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Top bar with location */}
      <div className="bg-brand-cream border-b border-brand-sage/30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <button
            onClick={openLocationModal}
            className="flex items-center gap-1.5 text-text-secondary hover:text-brand-red transition-colors"
          >
            <MapPin size={14} />
            <span>
              Delivering to:{" "}
              <strong className="text-brand-red">
                {selectedCity === "pan-india"
                  ? "Pan India"
                  : selectedCity || "Select Location"}
              </strong>
            </span>
          </button>
          <div className="hidden md:flex items-center gap-4 text-text-muted">
            <span>Free delivery above ₹499</span>
            <span>|</span>
            <Link href="tel:+917898989898" className="hover:text-brand-red">
              Call: +91 78989 89898
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="https://bakenshake.in/web_components/images/logo.png"
                alt="Bake N' Shake"
                width={140}
                height={50}
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-text-primary font-medium hover:text-brand-red transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Orders */}
              <Link
                href="/orders"
                className="hidden md:flex p-2 hover:bg-brand-cream rounded-full transition-colors"
                title="My Orders"
              >
                <Package size={20} />
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden md:flex p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar (expandable) */}
          {searchOpen && (
            <div className="pb-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="Search for cakes, cookies, pastries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-brand-cream/50 border border-brand-sage/30 rounded-brand text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 text-text-primary font-medium hover:bg-brand-cream rounded-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-text-primary font-medium hover:bg-brand-cream rounded-brand transition-colors"
              >
                My Orders
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-text-primary font-medium hover:bg-brand-cream rounded-brand transition-colors"
              >
                My Account
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={closeCart} />
    </>
  );
}
