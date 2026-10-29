import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    filteredProducts,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    settings,
    isLoading
  } = useStore();

  const [visibleCount, setVisibleCount] = React.useState(8);

  React.useEffect(() => {
    setVisibleCount(8);
  }, [activeCategory, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="shop" className="py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C8275] font-medium">Katalog Lengkap</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1A1918] mt-1.5">
            Koleksi Esensial AiiStore99
          </h2>
          <p className="text-sm text-[#736E67] mt-2">
            Produk kecantikan, kosmetik, aksesoris, dan fashion pilihan yang siap menyempurnakan hari Anda.
          </p>
        </div>

        {/* Filter Tabs & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE6DD]">
          {/* Category Tabs (Segmented control button group) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#1A1918] text-[#FAFAF7] shadow-xs'
                  : 'bg-white text-[#595652] hover:text-[#1A1918] border border-[#E8E2D5]'
              }`}
            >
              Semua Koleksi
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.slug
                    ? 'bg-[#1A1918] text-[#FAFAF7] shadow-xs'
                    : 'bg-white text-[#595652] hover:text-[#1A1918] border border-[#E8E2D5]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector & Active Search Indicator */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {searchQuery && (
              <div className="flex items-center gap-1.5 text-xs text-[#736E67] bg-[#F2EFE9] px-3 py-1.5 rounded-full border border-[#E0DBCF]">
                <span>Pencarian: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#1A1918]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#E8E2D5] text-xs text-[#595652]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8C7355]" />
              <label htmlFor="sort-select" className="sr-only">Urutkan Produk</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-[#1A1918] outline-none cursor-pointer pr-1"
              >
                <option value="newest">Koleksi Terbaru</option>
                <option value="price-low">Harga: Terendah ke Tertinggi</option>
                <option value="price-high">Harga: Tertinggi ke Terendah</option>
                <option value="name-asc">Nama Produk: A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#736E67]">Memuat koleksi produk AiiStore99...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#EBE6DD] p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#8C7355] flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-[#1A1918]">Tidak ada produk yang cocok</h3>
            <p className="text-xs text-[#736E67] mt-1.5 leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori untuk menemukan produk yang diinginkan.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 bg-[#1A1918] text-white rounded-full text-xs font-medium hover:bg-[#2C2A28] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Product Grid (3-column desktop, 2-column mobile/tablet) */}
        {!isLoading && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="mt-12 text-center">
                <p className="text-xs text-[#736E67] mb-2.5 font-mono">
                  Menampilkan {displayedProducts.length} dari {filteredProducts.length} produk pilihan
                </p>
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="py-3 px-8 rounded-full border border-[#D9D3C7] bg-white hover:bg-[#F2EFE9] text-xs font-semibold text-[#1A1918] transition-colors shadow-2xs"
                >
                  Tampilkan Lebih Banyak Produk
                </button>
              </div>
            )}
          </>
        )}

        {/* Editorial Collection / Promo Banner (Admin editable) */}
        {settings && (
          <div className="mt-16 rounded-2xl overflow-hidden bg-[#1A1918] text-white p-8 sm:p-12 relative border border-[#2D2A27]">
            <div className="max-w-2xl relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Editorial Highlight</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-white leading-tight">
                {settings.promoBannerTitle}
              </h3>
              <p className="text-sm text-[#C8C4BD] font-normal leading-relaxed">
                {settings.promoBannerSubtitle}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-6 py-3 bg-[#FAFAF7] text-[#1A1918] hover:bg-[#EBE6DD] rounded-full text-xs font-medium tracking-wide transition-colors"
                >
                  {settings.promoBannerButtonText || 'Lihat Semua'}
                </button>
              </div>
            </div>
            {/* Subtle decorative motif */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        )}
      </div>
    </section>
  );
};
