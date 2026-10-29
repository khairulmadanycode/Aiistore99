import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    openCheckout,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    settings
  } = useStore();

  if (!isCartOpen) return null;

  const threshold = settings?.freeShippingThreshold || 250000;
  const isFreeShipping = cartSubtotal >= threshold;
  const deficit = Math.max(0, threshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / threshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAFAF7] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#EBE6DD] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C7355]" />
            <h2 className="text-lg font-serif font-semibold text-[#1A1918]">Keranjang Belanja</h2>
            <span className="text-xs text-[#736E67] font-mono">({cart.length} item)</span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#736E67] hover:text-[#1A1918] transition-colors"
            aria-label="Tutup keranjang belanja"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F2EFE9] px-6 py-3 border-b border-[#E8E2D5]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium text-[#1A1918]">
              <Truck className="w-3.5 h-3.5 text-[#8C7355]" />
              {isFreeShipping ? 'Selamat! Anda berhak Bebas Ongkir' : `Tambah ${formatRupiah(deficit)} untuk Bebas Ongkir`}
            </span>
            <span className="font-mono text-[11px] text-[#736E67]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E0DBCF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A1918] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#736E67]">
              <div className="w-16 h-16 rounded-full bg-[#F2EFE9] flex items-center justify-center mb-4 text-[#8C7355]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-serif text-lg font-medium text-[#1A1918]">Keranjang Anda Kosong</p>
              <p className="text-xs text-[#736E67] mt-1 max-w-xs leading-relaxed">
                Jelajahi pilihan skincare, kosmetik, aksesoris, dan fashion elegan kami untuk mulai berbelanja.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 bg-[#1A1918] text-white rounded-full text-xs font-medium hover:bg-[#2C2A28] transition-colors"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-[#EBE6DD] shadow-2xs items-center"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#F7F5F0] shrink-0 border border-[#F2EFE9]"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-serif font-semibold text-[#1A1918] truncate">
                      {item.product.name}
                    </h4>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#8C8275] font-medium mt-0.5">
                        Varian: {item.selectedVariant.name}
                      </p>
                    )}
                    <p className="text-xs font-mono font-medium text-[#1A1918] mt-1">
                      {formatRupiah(itemPrice)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#D9D3C7] rounded bg-[#FAF8F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[#1A1918] hover:bg-[#EBE5DA]"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-[#1A1918] hover:bg-[#EBE5DA]"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[11px] text-[#736E67] font-mono">
                        = {formatRupiah(itemPrice * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-[#9E9B95] hover:text-rose-600 transition-colors"
                    title="Hapus produk ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-[#EBE6DD] bg-white space-y-4">
            <div className="space-y-1.5 text-xs text-[#595652]">
              <div className="flex justify-between">
                <span>Subtotal Produk</span>
                <span className="font-mono text-[#1A1918] font-medium">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Perkiraan Ongkos Kirim</span>
                <span className="font-mono text-[#1A1918] font-medium">
                  {isFreeShipping ? 'GRATIS' : 'Dihitung saat Checkout'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F2EFE9] text-sm font-semibold text-[#1A1918]">
                <span>Total Estimasi</span>
                <span className="font-mono text-base">{formatRupiah(cartSubtotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={clearCart}
                className="py-3 px-3 rounded-xl border border-[#D9D3C7] text-xs text-[#736E67] hover:text-[#1A1918] hover:bg-[#F2EFE9] transition-colors"
                title="Kosongkan Keranjang"
              >
                Kosongkan
              </button>

              <button
                onClick={openCheckout}
                className="flex-1 py-3 px-6 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
