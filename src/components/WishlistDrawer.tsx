import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const WishlistDrawer: React.FC = () => {
  const {
    products,
    wishlist,
    isWishlistOpen,
    closeWishlist,
    toggleWishlist,
    addToCart,
    openQuickView
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#FAFAF7] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#EBE6DD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8C7355] fill-[#8C7355]" />
            <h2 className="text-lg font-serif font-semibold text-[#1A1918]">Favorit & Wishlist</h2>
            <span className="text-xs text-[#736E67] font-mono">({wishlistedProducts.length})</span>
          </div>
          <button
            onClick={closeWishlist}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#736E67] hover:text-[#1A1918] transition-colors"
            aria-label="Tutup daftar favorit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#736E67]">
              <div className="w-16 h-16 rounded-full bg-[#F2EFE9] flex items-center justify-center mb-4 text-[#8C7355]">
                <Heart className="w-7 h-7" />
              </div>
              <p className="font-serif text-lg font-medium text-[#1A1918]">Wishlist Masih Kosong</p>
              <p className="text-xs text-[#736E67] mt-1 max-w-xs leading-relaxed">
                Tekan tombol ikon hati pada produk apa pun untuk menyimpannya di daftar favorit Anda.
              </p>
              <button
                onClick={closeWishlist}
                className="mt-6 px-6 py-2.5 bg-[#1A1918] text-white rounded-full text-xs font-medium hover:bg-[#2C2A28] transition-colors"
              >
                Jelajahi Produk
              </button>
            </div>
          ) : (
            wishlistedProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#EBE6DD] shadow-2xs items-center"
              >
                <img
                  src={prod.primaryImage}
                  alt={prod.name}
                  className="w-16 h-16 rounded-lg object-cover bg-[#F7F5F0] shrink-0 border border-[#F2EFE9] cursor-pointer"
                  onClick={() => {
                    closeWishlist();
                    openQuickView(prod);
                  }}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-semibold text-[#8C8275] tracking-wider">
                    {prod.category}
                  </p>
                  <h4
                    onClick={() => {
                      closeWishlist();
                      openQuickView(prod);
                    }}
                    className="text-xs font-serif font-semibold text-[#1A1918] truncate cursor-pointer hover:text-[#8C7355]"
                  >
                    {prod.name}
                  </h4>
                  <p className="text-xs font-mono font-medium text-[#1A1918] mt-0.5">
                    {formatRupiah(prod.price)}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (prod.variants && prod.variants.length > 0) {
                          closeWishlist();
                          openQuickView(prod);
                        } else {
                          addToCart(prod, undefined, 1);
                        }
                      }}
                      className="py-1 px-3 bg-[#1A1918] hover:bg-[#2C2A28] text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C5A880]" />
                      <span>+ Keranjang</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-1 text-[#9E9B95] hover:text-rose-600 transition-colors"
                      title="Hapus dari wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
