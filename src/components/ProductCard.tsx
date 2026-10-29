import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart, openQuickView } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      // If product has variants, open detail modal so user selects variant
      openQuickView(product);
    } else {
      addToCart(product, undefined, 1);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => openQuickView(product)}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-[#EBE6DD] hover:border-[#D9D3C7] transition-all duration-300 hover:shadow-md"
    >
      {/* Product Image Container (65-75% visual weight) */}
      <div className="relative aspect-[4/3] bg-[#F7F5F0] overflow-hidden">
        {product.primaryImage ? (
          <img
            src={product.primaryImage}
            alt={product.altText || product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F2EFE9] text-[#8C8275] text-xs">
            Foto Produk
          </div>
        )}

        {/* Quiet Tag / Label (Single text tag, no pill clusters) */}
        {product.label && (
          <div className="absolute top-3 left-3 bg-[#1A1918]/85 backdrop-blur-xs text-[#FAFAF7] text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded">
            {product.label}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-[#1A1918] text-[#C5A880]'
              : 'bg-white/80 hover:bg-white text-[#736E67] hover:text-[#1A1918]'
          } shadow-sm`}
          title={isWishlisted ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          aria-label={isWishlisted ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C5A880]' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#1A1918] text-xs font-medium rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>Detail</span>
          </button>
          {product.stock <= 0 ? (
            <button
              disabled
              className="py-2 px-3 bg-[#EBE6DD] text-[#8C8275] text-xs font-medium rounded-lg shadow-sm cursor-not-allowed"
            >
              Habis
            </button>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="py-2 px-3 bg-[#1A1918] hover:bg-[#2C2A28] text-white text-xs font-medium rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline">Beli</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Status Separator */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#8C8275] font-medium mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.stock > 0 ? `${product.stock} Tersedia` : 'Habis'}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-serif font-medium text-[#1A1918] line-clamp-2 leading-snug group-hover:text-[#8C7355] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#736E67] line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Variant baseline */}
        <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-medium text-[#1A1918] font-mono tabular-nums">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#9E9B95] line-through font-mono tabular-nums">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <span className="text-[11px] text-[#8C8275] font-medium">
              {product.variants.length} Varian
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
