import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const { categories, products } = useStore();

  const getProductCount = (slug: string) => {
    return products.filter((p) => p.category.toLowerCase() === slug.toLowerCase()).length;
  };

  return (
    <section className="py-14 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C8275] font-medium">Kurasi Kategori</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1918] mt-1">
              Jelajahi Berdasarkan Kategori
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-[#8C7355] hover:text-[#1A1918] transition-colors flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Semua Koleksi ({products.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = getProductCount(cat.slug);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group text-left relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F2EFE9] border border-[#E8E2D5] focus:outline-none focus:ring-2 focus:ring-[#8C7355] transition-all hover:shadow-lg"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#EBE6DD] text-[#8C8275]">
                    <span className="font-serif text-lg">{cat.name}</span>
                  </div>
                )}

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity group-hover:from-black/85" />

                {/* Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-semibold text-white tracking-wide">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#E0DBCF] font-normal mt-0.5">
                        {count} Produk Pilihan
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
