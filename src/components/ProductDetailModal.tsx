import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types/store';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, Heart, MessageCircle, Check, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatRupiah, generateWhatsAppChatUrl } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, settings } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.primaryImage);
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setQuantity(1);
      setIsAddedFeedback(false);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.price + (selectedVariant?.priceDelta || 0);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const waMessage = `Halo AiiStore99, saya tertarik dengan produk *${product.name}*${
    selectedVariant ? ` (${selectedVariant.name})` : ''
  } seharga ${formatRupiah(currentPrice)}. Apakah stok ini tersedia dan bisa langsung dipesan?`;

  const waUrl = generateWhatsAppChatUrl(
    settings?.whatsappNumber || '6281234567890',
    waMessage
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] z-10 flex flex-col">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1A1918] shadow-sm flex items-center justify-center transition-colors"
          aria-label="Tutup jendela detail produk"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-[#F7F5F0] border border-[#EBE6DD]">
              <img
                src={selectedImage || product.primaryImage}
                alt={product.altText || product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {product.label && (
                <span className="absolute top-3 left-3 bg-[#1A1918]/85 backdrop-blur-xs text-white text-[10px] font-medium tracking-wider uppercase px-2.5 py-1 rounded">
                  {product.label}
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img ? 'border-[#1A1918]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights */}
            <div className="mt-4 pt-4 border-t border-[#F2EFE9] space-y-2 text-xs text-[#736E67]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8C7355] shrink-0" />
                <span>Jaminan keaslian kurasi toko AiiStore99</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#8C7355] shrink-0" />
                <span>Pengemasan rapi dan aman dengan bubble wrap berlapis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C8275] font-medium mb-1">
                <span>{product.category}</span>
                {product.sku && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">SKU: {product.sku}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-serif font-semibold text-[#1A1918] leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-medium text-[#1A1918] font-mono tabular-nums">
                  {formatRupiah(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#9E9B95] line-through font-mono tabular-nums">
                    {formatRupiah(product.originalPrice!)}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium ml-auto">
                    Stok Tersedia ({product.stock})
                  </span>
                ) : (
                  <span className="text-xs text-rose-800 bg-rose-50 px-2 py-0.5 rounded font-medium ml-auto">
                    Stok Habis
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-3 text-xs sm:text-sm text-[#595652] leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#F2EFE9]">
                  <p className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider mb-2.5">
                    Pilihan Varian / Ukuran:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3.5 py-2 text-xs rounded-lg font-medium transition-all border ${
                          selectedVariant?.id === variant.id
                            ? 'bg-[#1A1918] text-white border-[#1A1918] shadow-xs'
                            : 'bg-white text-[#4A4742] border-[#D9D3C7] hover:border-[#1A1918]'
                        }`}
                      >
                        <span>{variant.name}</span>
                        {variant.priceDelta && variant.priceDelta > 0 ? (
                          <span className="ml-1 opacity-80">(+{formatRupiah(variant.priceDelta)})</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-5 pt-4 border-t border-[#F2EFE9] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                  Kuantitas:
                </span>
                <div className="flex items-center border border-[#D9D3C7] rounded-lg bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#1A1918] hover:bg-[#EBE5DA] transition-colors rounded-l-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-mono font-medium text-[#1A1918]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center text-[#1A1918] hover:bg-[#EBE5DA] transition-colors rounded-r-lg font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] disabled:bg-[#9E9B95] text-white text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    {isAddedFeedback ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Berhasil Ditambahkan!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                        <span>Tambah ke Keranjang ({formatRupiah(currentPrice * quantity)})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'border-[#1A1918] bg-[#1A1918] text-[#C5A880]'
                        : 'border-[#D9D3C7] bg-white text-[#736E67] hover:text-[#1A1918]'
                    }`}
                    title={isWishlisted ? 'Hapus favorit' : 'Simpan ke favorit'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C5A880]' : ''}`} />
                  </button>
                </div>

                {/* Direct WhatsApp Consultation / Order */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Konsultasi & Pesan Cepat via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Full Formatted Description Accordion / Area */}
            <div className="mt-8 pt-6 border-t border-[#E8E2D5]">
              <h2 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider mb-2">
                Deskripsi Lengkap & Panduan
              </h2>
              <div className="text-xs text-[#595652] leading-relaxed whitespace-pre-line space-y-2 bg-[#F9F7F2] p-4 rounded-xl border border-[#EBE6DD]">
                {product.fullDescription || product.shortDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
