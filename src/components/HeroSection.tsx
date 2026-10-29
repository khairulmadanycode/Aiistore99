import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick, onExploreClick }) => {
  const { settings } = useStore();

  const heroImage = settings?.heroImage || '/src/assets/images/hero_editorial_beauty_1793243310383.jpg';
  const headline = settings?.tagline || 'Your Everyday Beauty & Style.';
  const subheadline = settings?.subheadline || 'Discover beauty, essentials, and timeless style in one place.';
  const badgeText = settings?.heroBadgeText || "Editorial Curations '26";

  return (
    <section id="hero" className="relative overflow-hidden bg-[#F7F5F0] border-b border-[#EBE6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4">
            {/* Subtle editorial kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8C8275] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-[#1A1918] leading-[1.12] text-balance">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#595652] font-normal leading-relaxed max-w-xl">
              {subheadline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopClick}
                className="px-7 py-3.5 bg-[#1A1918] text-[#FAFAF7] hover:bg-[#2C2A28] rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 bg-transparent hover:bg-[#EBE6DD]/60 text-[#1A1918] border border-[#D9D3C7] rounded-full text-xs sm:text-sm font-medium tracking-wide transition-colors"
              >
                Explore Collection
              </button>
            </div>

            {/* Editorial Quote / Note */}
            <div className="pt-6 border-t border-[#E8E2D5] flex items-center gap-4 text-xs text-[#736E67]">
              <span className="font-serif italic text-sm text-[#1A1918]">AiiStore99</span>
              <span aria-hidden="true" className="text-[#C5A880]">·</span>
              <span>Koleksi terkurasi untuk memancarkan pesona anggun sehari-hari</span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Anchor */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/11] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#EAE5DC] shadow-xl border border-white/60">
              <img
                src={heroImage}
                alt="AiiStore99 Editorial Beauty & Fashion"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-[#1A1918] flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#8C8275] font-medium">Koleksi Terpilih</p>
                  <p className="text-sm font-serif font-semibold text-[#1A1918]">Glow & Timeless Aesthetics</p>
                </div>
                <span className="text-xs font-medium text-[#8C7355] underline underline-offset-4">Lihat Katalog</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Trust Markers */}
        <div className="mt-14 pt-8 border-t border-[#E8E2D5] grid grid-cols-2 md:grid-cols-4 gap-6 text-[#4A4742]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBE5DA] flex items-center justify-center shrink-0 text-[#8C7355]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1918]">100% Produk Terpilih</p>
              <p className="text-[11px] text-[#736E67]">Kurasi editorial berkualitas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBE5DA] flex items-center justify-center shrink-0 text-[#8C7355]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1918]">Pengiriman Aman</p>
              <p className="text-[11px] text-[#736E67]">Gratis ongkir tersedia</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBE5DA] flex items-center justify-center shrink-0 text-[#8C7355]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1918]">Respon Cepat</p>
              <p className="text-[11px] text-[#736E67]">Konsultasi WhatsApp ramah</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EBE5DA] flex items-center justify-center shrink-0 text-[#8C7355]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1A1918]">Belanja Terpercaya</p>
              <p className="text-[11px] text-[#736E67]">Konfirmasi pesanan transparan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
