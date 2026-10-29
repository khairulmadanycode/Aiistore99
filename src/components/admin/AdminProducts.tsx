import React, { useState } from 'react';
import { Product, Category } from '../../types/store';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminProductEditorModal } from './AdminProductEditorModal';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Copy,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const { token } = useAdminAuth();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filter products
  const filtered = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Duplicate Product
  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Produk berhasil diduplikasi.');
        onRefresh();
      } else {
        const d = await res.json();
        showToast(d.error || 'Gagal menduplikasi produk', 'error');
      }
    } catch {
      showToast('Koneksi gagal', 'error');
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !product.isActive })
      });
      if (res.ok) {
        showToast(`Status '${product.name}' berhasil diperbarui.`);
        onRefresh();
      }
    } catch {
      showToast('Gagal mengubah status produk', 'error');
    }
  };

  // Delete Product
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Produk berhasil dihapus dari database.');
        setDeleteConfirmId(null);
        onRefresh();
      } else {
        const d = await res.json();
        showToast(d.error || 'Gagal menghapus produk', 'error');
      }
    } catch {
      showToast('Gagal menghubungi server', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-in fade-in duration-200 ${
            toastMsg.type === 'success'
              ? 'bg-[#1A1918] text-[#FAFAF7] border border-[#C5A880]/30'
              : 'bg-rose-600 text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-[#C5A880]" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1A1918]">Kelola Produk Toko</h2>
          <p className="text-xs text-[#736E67]">
            Total {products.length} produk terdaftar dalam database persisten AiiStore99.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsEditorOpen(true);
          }}
          className="py-2.5 px-5 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#C5A880]" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-xl border border-[#EBE6DD]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-[#E0DBCF] text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#8C7355] shrink-0" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E0DBCF] text-xs font-medium text-[#1A1918] outline-none bg-white w-full sm:w-44"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-[#EBE6DD] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE6DD] text-[#736E67] uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">Tampil</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C8275]">
                    Tidak ada produk yang cocok dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Product Name & Thumb */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.primaryImage}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#F7F5F0] border border-[#EBE6DD] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1A1918] truncate max-w-xs">{prod.name}</p>
                          <p className="text-[11px] text-[#8C8275] font-mono">
                            {prod.sku ? `SKU: ${prod.sku}` : 'Tanpa SKU'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-[#595652] capitalize">
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1A1918]">
                      {formatRupiah(prod.price)}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-semibold ${
                          prod.stock <= 5 ? 'text-rose-600' : 'text-[#1A1918]'
                        }`}
                      >
                        {prod.stock} unit
                      </span>
                    </td>

                    {/* Label */}
                    <td className="py-3.5 px-4">
                      {prod.label ? (
                        <span className="text-[10px] uppercase font-medium bg-[#F2EFE9] text-[#1A1918] px-2 py-0.5 rounded">
                          {prod.label}
                        </span>
                      ) : (
                        <span className="text-[#B8AF9F]">-</span>
                      )}
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          prod.isActive
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-[#8C8275] bg-[#F2EFE9] hover:bg-[#EBE6DD]'
                        }`}
                        title={prod.isActive ? 'Klik untuk sembunyikan' : 'Klik untuk tampilkan di toko'}
                      >
                        {prod.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setIsEditorOpen(true);
                          }}
                          className="p-1.5 rounded bg-[#FAF8F5] hover:bg-[#EBE5DA] text-[#1A1918] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(prod.id)}
                          className="p-1.5 rounded bg-[#FAF8F5] hover:bg-[#EBE5DA] text-[#8C7355] transition-colors"
                          title="Duplikasi Produk"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="p-1.5 rounded bg-[#FAF8F5] hover:bg-rose-50 text-[#8C8275] hover:text-rose-600 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EBE6DD] z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A1918]">Konfirmasi Hapus Produk</h3>
              <p className="text-xs text-[#736E67] mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus produk ini dari database? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9D3C7] text-xs font-medium text-[#736E67] hover:bg-[#F2EFE9]"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Editor Modal */}
      {isEditorOpen && (
        <AdminProductEditorModal
          product={editingProduct}
          categories={categories}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            showToast('Produk berhasil disimpan ke database!');
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
