import React, { useState } from 'react';
import { Category } from '../../types/store';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  FolderTree,
  Upload
} from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, onRefresh }) => {
  const { token } = useAdminAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('/src/assets/images/product_skincare_serum_1793243311550.jpg');
    setIsAdding(true);
  };

  const handleStartEdit = (cat: Category) => {
    setIsAdding(false);
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  // Reorder category (Move Up / Down)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCats = [...categories];
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;

    const orderList = newCats.map((c, idx) => ({ id: c.id, order: idx + 1 }));

    try {
      const res = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderList })
      });
      if (res.ok) {
        showToast('Urutan kategori diperbarui.');
        onRefresh();
      }
    } catch {
      showToast('Gagal mengubah urutan kategori', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return;
    }

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          image
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Gagal menyimpan kategori');
      }

      showToast(`Kategori '${name}' berhasil disimpan.`);
      setIsAdding(false);
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Hapus kategori '${catName}'?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const d = await res.json();
      if (!res.ok) {
        showToast(d.error || 'Gagal menghapus kategori', 'error');
      } else {
        showToast(d.message || 'Kategori berhasil dihapus.');
        onRefresh();
      }
    } catch {
      showToast('Koneksi gagal', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-lg ${
            toastMsg.type === 'success'
              ? 'bg-[#1A1918] text-[#FAFAF7] border border-[#C5A880]/30'
              : 'bg-rose-600 text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-[#C5A880]" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1A1918]">Kategori Produk</h2>
          <p className="text-xs text-[#736E67]">
            Atur nama, slug, deskripsi, gambar kartu, dan urutan kategori tampilan toko.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="py-2.5 px-5 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#C5A880]" />
            <span>Tambah Kategori Baru</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Drawer/Box */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#EBE6DD] shadow-xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#1A1918]">
            {isAdding ? 'Tambah Kategori Baru' : 'Edit Kategori'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#595652] mb-1">
                Nama Kategori <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Fragrance / Haircare"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (isAdding) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#595652] mb-1">
                Slug (URL Filter)
              </label>
              <input
                type="text"
                placeholder="fragrance"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono text-[11px]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#595652] mb-1">
                Deskripsi Singkat Kategori
              </label>
              <input
                type="text"
                placeholder="Wewangian mewah dengan ketahanan aroma yang elegan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] outline-none focus:border-[#1A1918]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#595652] mb-1">
                URL Gambar Kategori
              </label>
              <input
                type="text"
                placeholder="/src/assets/images/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] outline-none focus:border-[#1A1918] font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              className="py-2 px-4 rounded-xl border border-[#D9D3C7] text-xs text-[#736E67] hover:bg-[#F2EFE9]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-6 rounded-xl bg-[#1A1918] text-white text-xs font-medium hover:bg-[#2C2A28]"
            >
              Simpan Kategori
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#EBE6DD] shadow-2xs gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Order Controls */}
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleMoveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-[#F2EFE9] text-[#736E67] disabled:opacity-20"
                  title="Naikkan Urutan"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveOrder(index, 'down')}
                  disabled={index === categories.length - 1}
                  className="p-1 rounded hover:bg-[#F2EFE9] text-[#736E67] disabled:opacity-20"
                  title="Turunkan Urutan"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Image thumbnail */}
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-lg object-cover bg-[#F7F5F0] border border-[#EBE6DD] shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-[#F2EFE9] flex items-center justify-center text-[#8C8275] shrink-0">
                  <FolderTree className="w-6 h-6" />
                </div>
              )}

              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#1A1918]">{cat.name}</h4>
                  <span className="text-[11px] font-mono text-[#8C8275] bg-[#F2EFE9] px-2 py-0.5 rounded">
                    slug: {cat.slug}
                  </span>
                </div>
                <p className="text-xs text-[#736E67] truncate max-w-md mt-0.5">
                  {cat.description || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleStartEdit(cat)}
                className="p-2 rounded-lg bg-[#FAF8F5] hover:bg-[#EBE5DA] text-[#1A1918] transition-colors"
                title="Edit Kategori"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="p-2 rounded-lg bg-[#FAF8F5] hover:bg-rose-50 text-[#8C8275] hover:text-rose-600 transition-colors"
                title="Hapus Kategori"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
