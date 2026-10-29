import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, ProductLabel, Category } from '../../types/store';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminPhotoEditorModal } from './AdminPhotoEditorModal';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Sliders,
  Star,
  Eye,
  Check,
  Sparkles,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface AdminProductEditorModalProps {
  product: Product | null; // null = create new
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const AdminProductEditorModal: React.FC<AdminProductEditorModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSaved
}) => {
  const { token } = useAdminAuth();

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('skincare');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState<number>(100000);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(20);
  const [label, setLabel] = useState<ProductLabel>('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [altText, setAltText] = useState('');

  // Photos & Gallery
  const [primaryImage, setPrimaryImage] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>([]);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Photo Editor Modal state
  const [editingPhotoUrl, setEditingPhotoUrl] = useState<string | null>(null);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');

  // Description Preview Tab
  const [descTab, setDescTab] = useState<'edit' | 'preview'>('edit');

  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Populate form on edit or init on create
  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setCategory(product.category);
      setShortDescription(product.shortDescription || '');
      setFullDescription(product.fullDescription || '');
      setPrice(product.price);
      setOriginalPrice(product.originalPrice);
      setSku(product.sku || '');
      setStock(product.stock);
      setLabel(product.label || '');
      setIsActive(product.isActive !== false);
      setIsFeatured(Boolean(product.isFeatured));
      setAltText(product.altText || '');
      setPrimaryImage(product.primaryImage);
      setGallery(product.gallery || [product.primaryImage]);
      setVariants(product.variants || []);
    } else {
      // New product defaults
      setName('');
      setSlug('');
      setCategory(categories[0]?.slug || 'skincare');
      setShortDescription('');
      setFullDescription('');
      setPrice(150000);
      setOriginalPrice(undefined);
      setSku('');
      setStock(25);
      setLabel('New Arrival');
      setIsActive(true);
      setIsFeatured(false);
      setAltText('');
      const defaultImg = '/src/assets/images/product_skincare_serum_1793243311550.jpg';
      setPrimaryImage(defaultImg);
      setGallery([defaultImg]);
      setVariants([]);
    }
    setErrorMsg('');
  }, [product, categories, isOpen]);

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!product) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Upload local file from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Data = uploadEvent.target?.result as string;
      try {
        // Upload to server
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            filename: file.name
          })
        });

        if (res.ok) {
          const data = await res.json();
          const uploadedUrl = data.url;
          setGallery((prev) => [...prev, uploadedUrl]);
          if (!primaryImage) setPrimaryImage(uploadedUrl);
        } else {
          // If upload fails, fallback to base64
          setGallery((prev) => [...prev, base64Data]);
          if (!primaryImage) setPrimaryImage(base64Data);
        }
      } catch {
        setGallery((prev) => [...prev, base64Data]);
        if (!primaryImage) setPrimaryImage(base64Data);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Set primary photo
  const handleSetPrimary = (imgUrl: string) => {
    setPrimaryImage(imgUrl);
  };

  // Remove photo from gallery
  const handleRemovePhoto = (index: number) => {
    const target = gallery[index];
    const newGallery = gallery.filter((_, idx) => idx !== index);
    setGallery(newGallery);
    if (primaryImage === target && newGallery.length > 0) {
      setPrimaryImage(newGallery[0]);
    }
  };

  // Open photo editor for specific image
  const handleOpenPhotoEditor = (imgUrl: string, index: number) => {
    setEditingPhotoUrl(imgUrl);
    setEditingPhotoIndex(index);
  };

  // Save edited photo callback
  const handleSaveEditedPhoto = (newUrl: string) => {
    if (editingPhotoIndex !== null) {
      const newGallery = [...gallery];
      const oldUrl = newGallery[editingPhotoIndex];
      newGallery[editingPhotoIndex] = newUrl;
      setGallery(newGallery);
      if (primaryImage === oldUrl) {
        setPrimaryImage(newUrl);
      }
    }
  };

  // Variant operations
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: 'var-' + Date.now(),
        name: 'Varian Baru',
        sku: `${sku || 'VAR'}-${prev.length + 1}`,
        stock: 10,
        priceDelta: 0
      }
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Quick insertion helpers for formatted description
  const handleInsertDescText = (textToAppend: string) => {
    setFullDescription((prev) => (prev ? `${prev}\n\n${textToAppend}` : textToAppend));
  };

  // Save product form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama produk wajib diisi.');
      return;
    }
    if (price < 0) {
      setErrorMsg('Harga produk tidak valid.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        shortDescription,
        fullDescription,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        sku,
        stock: Number(stock),
        label,
        isActive,
        isFeatured,
        altText: altText || name,
        primaryImage: primaryImage || gallery[0] || '/src/assets/images/product_skincare_serum_1793243311550.jpg',
        gallery: gallery.length > 0 ? gallery : [primaryImage],
        variants
      };

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan produk');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Editor Modal */}
      <div className="relative bg-[#FAFAF7] rounded-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] z-10 flex flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DD]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-medium">
              {product ? 'Edit Data Produk' : 'Tambah Produk Baru'}
            </span>
            <h2 className="text-xl font-serif font-semibold text-[#1A1918]">
              {product ? product.name : 'Formulir Produk AiiStore99'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#736E67] hover:text-[#1A1918]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-6 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
              1. Informasi Utama & Kategori
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Radiance Botanical Glow Dropper Serum"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Kategori Produk
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Label Promosi / Koleksi
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value as ProductLabel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
                >
                  <option value="">Tanpa Label</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Curated Pick">Curated Pick</option>
                  <option value="Promo">Promo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Kode SKU Produk (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="SKIN-RAD-01"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="radiance-botanical-glow-dropper-serum"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-[#EBE6DD]">
            <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
              2. Harga & Ketersediaan Stok
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Harga Jual (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Harga Coret / Asli (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Opsional diskon"
                  value={originalPrice || ''}
                  onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Jumlah Stok Fisik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono"
                />
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#1A1918] rounded"
                />
                <span className="text-xs font-medium text-[#1A1918]">
                  Tampilkan di Toko (Produk Aktif)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#1A1918] rounded"
                />
                <span className="text-xs font-medium text-[#1A1918]">
                  Jadikan Produk Unggulan (Featured)
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Product Photos & Built-in Photo Editor */}
          <div className="space-y-4 pt-4 border-t border-[#EBE6DD]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                  3. Foto Produk & Editor Gambar
                </h3>
                <p className="text-[11px] text-[#736E67]">
                  Upload foto dari perangkat. Anda dapat melakukan crop, rotasi, penyesuaian pencahayaan, dan kompresi langsung.
                </p>
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer py-2 px-3.5 bg-[#1A1918] hover:bg-[#2C2A28] text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Upload Foto dari Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL Input fallback */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE6DD]">
              <input
                type="text"
                placeholder="Atau masukkan URL gambar langsung (https://... atau /src/...)"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (customImageUrl.trim()) {
                    setGallery((prev) => [...prev, customImageUrl.trim()]);
                    if (!primaryImage) setPrimaryImage(customImageUrl.trim());
                    setCustomImageUrl('');
                  }
                }}
                className="py-1.5 px-3 rounded-lg bg-[#1A1918] text-white text-xs font-medium hover:bg-[#2C2A28]"
              >
                + Tambah
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((img, idx) => {
                const isPrimary = primaryImage === img;
                return (
                  <div
                    key={idx}
                    className={`relative group rounded-xl overflow-hidden bg-white border-2 p-1 flex flex-col justify-between ${
                      isPrimary ? 'border-[#1A1918]' : 'border-[#EBE6DD]'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#F7F5F0]">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {isPrimary && (
                      <span className="absolute top-2 left-2 bg-[#1A1918] text-[#C5A880] text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                        Foto Utama
                      </span>
                    )}

                    <div className="pt-2 flex items-center justify-between gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img)}
                        disabled={isPrimary}
                        className={`text-[10px] px-2 py-1 rounded transition-colors ${
                          isPrimary
                            ? 'text-emerald-700 font-semibold'
                            : 'text-[#736E67] hover:text-[#1A1918] bg-[#F2EFE9]'
                        }`}
                      >
                        {isPrimary ? '✓ Utama' : 'Jadikan Utama'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenPhotoEditor(img, idx)}
                          className="p-1 rounded bg-[#FAF8F5] hover:bg-[#EBE5DA] text-[#8C7355]"
                          title="Buka Editor Foto (Crop, Putar, Kecerahan)"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="p-1 rounded bg-[#FAF8F5] hover:bg-rose-50 text-[#736E67] hover:text-rose-600"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#595652] mb-1">
                Alt Text Gambar (Aksesibilitas & SEO)
              </label>
              <input
                type="text"
                placeholder="Deskripsi singkat foto produk untuk kenyamanan pembeli"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
              />
            </div>
          </div>

          {/* Section 4: Variants Manager */}
          <div className="space-y-4 pt-4 border-t border-[#EBE6DD]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                  4. Varian Produk (Shade, Ukuran, Volume)
                </h3>
                <p className="text-[11px] text-[#736E67]">
                  Tambahkan opsi seperti ukuran ml, shade kosmetik, atau size pakaian.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="py-1.5 px-3 rounded-lg border border-[#D9D3C7] hover:bg-white text-xs font-medium text-[#1A1918] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Tambah Varian</span>
              </button>
            </div>

            {variants.length > 0 ? (
              <div className="space-y-2.5">
                {variants.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white rounded-xl border border-[#EBE6DD]"
                  >
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] text-[#8C8275] uppercase font-semibold mb-0.5">
                        Nama Varian (contoh: 30 ml / Warm Nude / Size M)
                      </label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E0DBCF] text-xs outline-none focus:border-[#1A1918]"
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-[10px] text-[#8C8275] uppercase font-semibold mb-0.5">
                        SKU Varian
                      </label>
                      <input
                        type="text"
                        value={v.sku || ''}
                        onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E0DBCF] text-xs outline-none focus:border-[#1A1918] font-mono"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <label className="block text-[10px] text-[#8C8275] uppercase font-semibold mb-0.5">
                        Stok
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={v.stock ?? 10}
                        onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E0DBCF] text-xs outline-none focus:border-[#1A1918] font-mono"
                      />
                    </div>
                    <div className="w-full sm:w-36">
                      <label className="block text-[10px] text-[#8C8275] uppercase font-semibold mb-0.5">
                        Tambahan Harga (Rp)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={v.priceDelta || 0}
                        onChange={(e) => handleUpdateVariant(idx, 'priceDelta', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E0DBCF] text-xs outline-none focus:border-[#1A1918] font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-2 text-[#9E9B95] hover:text-rose-600 sm:self-end mb-1"
                      title="Hapus varian"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8C8275] italic">
                Belum ada varian. Produk ini akan dijual sebagai produk standar (single variant).
              </p>
            )}
          </div>

          {/* Section 5: Description Editor with Live Preview */}
          <div className="space-y-4 pt-4 border-t border-[#EBE6DD]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                  5. Deskripsi & Panduan Pemakaian
                </h3>
                <p className="text-[11px] text-[#736E67]">
                  Dukungan paragraf rapi dan poin bullet list tanpa klaim sembarangan.
                </p>
              </div>

              {/* Edit / Preview Tabs */}
              <div className="flex items-center gap-1 p-1 bg-[#F2EFE9] rounded-lg">
                <button
                  type="button"
                  onClick={() => setDescTab('edit')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    descTab === 'edit' ? 'bg-white text-[#1A1918] shadow-xs' : 'text-[#736E67]'
                  }`}
                >
                  Editor Teks
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab('preview')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    descTab === 'preview' ? 'bg-white text-[#1A1918] shadow-xs' : 'text-[#736E67]'
                  }`}
                >
                  Preview Toko
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#595652] mb-1">
                Deskripsi Singkat (Ditampilkan pada Card & Ringkasan)
              </label>
              <textarea
                rows={2}
                placeholder="Deskripsi 1-2 kalimat yang menarik dan jelas..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
              />
            </div>

            {descTab === 'edit' ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#8C8275]">Bantuan Format:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertDescText('Keunggulan Formula:\n• Tekstur nyaman dan ringan\n• Hidrasi optimal tahan lama\n• Cocok untuk pemakaian harian')}
                    className="px-2.5 py-1 rounded bg-white border border-[#D9D3C7] text-[11px] text-[#595652] hover:text-[#1A1918]"
                  >
                    + Poin Keunggulan (•)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertDescText('Cara Pemakaian:\nGunakan 2-3 tetes atau pulasan halus pada area yang diinginkan secara merata setiap pagi dan malam hari.')}
                    className="px-2.5 py-1 rounded bg-white border border-[#D9D3C7] text-[11px] text-[#595652] hover:text-[#1A1918]"
                  >
                    + Cara Pakai
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertDescText('Petunjuk Perawatan / Penyimpanan:\nSimpan di tempat sejuk dan terhindar dari sinar matahari langsung.')}
                    className="px-2.5 py-1 rounded bg-white border border-[#D9D3C7] text-[11px] text-[#595652] hover:text-[#1A1918]"
                  >
                    + Perawatan
                  </button>
                </div>

                <textarea
                  rows={6}
                  placeholder="Deskripsi lengkap produk dengan detail formula, bahan, dan cara penggunaan..."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] bg-white text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-sans leading-relaxed"
                />
              </div>
            ) : (
              <div className="p-5 bg-white rounded-xl border border-[#EBE6DD] text-xs text-[#4A4742] leading-relaxed whitespace-pre-line">
                <p className="font-semibold text-sm text-[#1A1918] mb-2 font-serif">{name || 'Nama Produk'}</p>
                {fullDescription || 'Belum ada deskripsi lengkap.'}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#EBE6DD] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl border border-[#D9D3C7] text-xs font-medium text-[#736E67] hover:bg-[#F2EFE9] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-8 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] disabled:opacity-50 text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-md transition-all"
            >
              <Check className="w-4 h-4 text-[#C5A880]" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Built-in Photo Editor Modal */}
      {editingPhotoUrl && (
        <AdminPhotoEditorModal
          imageUrl={editingPhotoUrl}
          isOpen={!!editingPhotoUrl}
          onClose={() => setEditingPhotoUrl(null)}
          onSave={handleSaveEditedPhoto}
        />
      )}
    </div>
  );
};
