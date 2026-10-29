import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Search, Menu, X, Shield, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface HeaderProps {
  onOpenAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onNavigateSection }) => {
  const {
    totalCartItems,
    cartSubtotal,
    openCart,
    openWishlist,
    wishlist,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const navLinks = [
    { label: 'Home', action: () => onNavigateSection('hero') },
    { label: 'Shop', action: () => { setActiveCategory('all'); onNavigateSection('shop'); } },
    { label: 'Skincare', action: () => { setActiveCategory('skincare'); onNavigateSection('shop'); } },
    { label: 'Cosmetics', action: () => { setActiveCategory('cosmetics'); onNavigateSection('shop'); } },
    { label: 'Accessories', action: () => { setActiveCategory('accessories'); onNavigateSection('shop'); } },
    { label: 'Fashion', action: () => { setActiveCategory('fashion'); onNavigateSection('shop'); } },
    { label: 'About', action: () => onNavigateSection('about') },
    { label: 'Contact', action: () => onNavigateSection('contact') }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#EBE6DD] transition-all">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-[#1A1918] hover:text-[#C5A880] transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigateSection('hero');
            }}
            className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1A1918] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 flex items-baseline gap-1"
          >
            <span>AiiStore99</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] inline-block mb-1"></span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Single-line, quiet hover underline) */}
        <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium tracking-wide text-[#595652]">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className={`hover:text-[#1A1918] transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                activeCategory === link.label.toLowerCase() ? 'text-[#1A1918] font-semibold' : ''
              }`}
            >
              {link.label}
              {activeCategory === link.label.toLowerCase() && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1A1918]" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Interactive Affordances & Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Search Toggle / Input */}
          <div className="relative flex items-center">
            {isSearchExpanded ? (
              <div className="flex items-center bg-[#F2EFE9] rounded-full px-3 py-1.5 border border-[#E0DBCF] shadow-sm animate-in fade-in duration-200">
                <Search className="w-4 h-4 text-[#736E67] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari skincare, lipstik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none w-36 sm:w-48"
                />
                <button
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                  className="text-[#736E67] hover:text-[#1A1918] ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 text-[#595652] hover:text-[#1A1918] transition-colors"
                title="Cari Produk"
                aria-label="Cari Produk"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist Indicator */}
          <button
            onClick={openWishlist}
            className="p-2 text-[#595652] hover:text-[#1A1918] transition-colors relative"
            title="Wishlist Favorit"
            aria-label="Wishlist Favorit"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 w-4 h-4 bg-[#C5A880] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Bag / Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1A1918] text-[#FAFAF7] hover:bg-[#2C2A28] rounded-full transition-all text-xs font-medium shadow-sm"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
            <span className="hidden sm:inline font-mono tabular-nums">{formatRupiah(cartSubtotal)}</span>
            <span className="w-4 h-4 rounded-full bg-[#C5A880] text-[#1A1918] font-bold text-[10px] flex items-center justify-center">
              {totalCartItems}
            </span>
          </button>

          {/* Admin Entry Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#736E67] hover:text-[#1A1918] transition-colors"
            title="Portal Pengelola Toko (Admin)"
            aria-label="Portal Pengelola Toko"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAFAF7] h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#EBE6DD]">
              <span className="text-2xl font-serif tracking-tight text-[#1A1918]">AiiStore99</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#736E67] hover:text-[#1A1918]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="mt-6">
              <div className="flex items-center bg-[#F2EFE9] rounded-lg px-3 py-2.5 border border-[#E0DBCF]">
                <Search className="w-4 h-4 text-[#736E67] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari produk impian Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-[#1A1918] placeholder-[#9E9B95] outline-none w-full"
                />
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="mt-8 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    link.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-base font-medium text-[#1A1918] py-2 border-b border-[#F2EFE9] text-left"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#B8AF9F]" />
                </button>
              ))}
            </nav>

            {/* Admin Entry in Mobile Drawer */}
            <div className="mt-auto pt-8 border-t border-[#EBE6DD]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#F2EFE9] hover:bg-[#EBE6DD] text-xs font-semibold text-[#1A1918] flex items-center justify-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-[#C5A880]" />
                <span>Masuk Dashboard Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
