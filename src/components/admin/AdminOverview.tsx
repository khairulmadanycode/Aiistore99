import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types/store';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Package,
  Layers,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface AdminOverviewProps {
  products: Product[];
  categories: Category[];
  onNavigateTab: (tab: string) => void;
  onAddProduct: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  categories,
  onNavigateTab,
  onAddProduct
}) => {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error('Error fetching orders:', e);
      }
    };
    fetchOrders();
  }, [token]);

  const activeProducts = products.filter((p) => p.isActive);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#1A1918] text-white p-6 sm:p-8 rounded-2xl border border-[#2D2A27] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Administrator Resmi</span>
          </span>
          <h2 className="text-2xl font-serif font-bold text-white">
            Selamat Datang di Dashboard AiiStore99
          </h2>
          <p className="text-xs text-[#A8A49C] max-w-lg leading-relaxed">
            Kelola katalog produk kecantikan & gaya hidup, pantau pesanan pelanggan via WhatsApp, dan perbarui foto editorial secara instan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddProduct}
            className="py-2.5 px-5 rounded-xl bg-[#FAFAF7] hover:bg-[#EBE6DD] text-[#1A1918] text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#8C7355]" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (4 columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#736E67]">
            <span className="text-xs font-medium">Total Produk</span>
            <Package className="w-4 h-4 text-[#8C7355]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1A1918] font-mono tabular-nums">
            {products.length}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {activeProducts.length} produk aktif di toko
          </p>
        </div>

        {/* Total Categories */}
        <div className="bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#736E67]">
            <span className="text-xs font-medium">Kategori Aktif</span>
            <Layers className="w-4 h-4 text-[#8C7355]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1A1918] font-mono tabular-nums">
            {categories.length}
          </p>
          <p className="text-[11px] text-[#736E67]">
            Skincare, Kosmetik, Aksesoris, Fashion
          </p>
        </div>

        {/* Stock Status */}
        <div className="bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#736E67]">
            <span className="text-xs font-medium">Stok Keseluruhan</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-[#8C7355]'}`} />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1A1918] font-mono tabular-nums">
            {totalStockUnits} <span className="text-xs font-sans font-normal text-[#736E67]">unit</span>
          </p>
          <p className={`text-[11px] font-medium ${lowStockProducts.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {lowStockProducts.length > 0 ? `${lowStockProducts.length} produk stok menipis` : 'Semua stok aman'}
          </p>
        </div>

        {/* Total Orders / Inquiries */}
        <div className="bg-white p-5 rounded-xl border border-[#EBE6DD] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#736E67]">
            <span className="text-xs font-medium">Pesanan Masuk</span>
            <ShoppingBag className="w-4 h-4 text-[#8C7355]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1A1918] font-mono tabular-nums">
            {orders.length}
          </p>
          <p className="text-[11px] text-[#736E67] font-mono">
            Omset tercatat: {formatRupiah(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Perhatian: Ada <strong>{lowStockProducts.length} produk</strong> dengan sisa stok 5 unit atau kurang ({lowStockProducts.map((p) => p.name).join(', ')}).
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-amber-800 font-semibold underline underline-offset-2 shrink-0 hover:text-amber-950"
          >
            Lihat Produk
          </button>
        </div>
      )}

      {/* Two Column Grid: Quick Shortcuts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#EBE6DD] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#1A1918]">
              Aktivitas Pesanan Terbaru
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#8C7355] hover:text-[#1A1918] flex items-center gap-1"
            >
              <span>Semua Pesanan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#736E67]">
              Belum ada pesanan masuk. Saat checkout WhatsApp dilakukan, order otomatis muncul di sini.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-xl border border-[#F2EFE9] bg-[#FAF8F5] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1A1918]">
                      #{ord.orderNumber} · {ord.customerName}
                    </p>
                    <p className="text-[11px] text-[#736E67] truncate mt-0.5">
                      {ord.items.map((i: any) => `${i.productName} (${i.quantity}x)`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-[#1A1918]">{formatRupiah(ord.total)}</p>
                    <span className="text-[10px] text-[#8C7355] uppercase font-semibold">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Admin Actions & Guide */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#EBE6DD] shadow-2xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#1A1918]">
            Pintasan & Manajemen
          </h3>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('products')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] text-left text-xs font-medium text-[#1A1918] flex items-center justify-between border border-[#EBE6DD] transition-colors"
            >
              <span>Katalog & Stok Produk</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C7355]" />
            </button>
            <button
              onClick={() => onNavigateTab('categories')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] text-left text-xs font-medium text-[#1A1918] flex items-center justify-between border border-[#EBE6DD] transition-colors"
            >
              <span>Atur Kategori & Urutan</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C7355]" />
            </button>
            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2EFE9] text-left text-xs font-medium text-[#1A1918] flex items-center justify-between border border-[#EBE6DD] transition-colors"
            >
              <span>Nomor WhatsApp & Banner</span>
              <ArrowUpRight className="w-4 h-4 text-[#8C7355]" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#F2EFE9] text-[11px] text-[#736E67] space-y-1">
            <p className="font-semibold text-[#1A1918]">Panduan Pemilik Toko:</p>
            <p>
              Untuk mengganti foto produk, Anda dapat mengupload langsung dari galeri HP atau laptop dan menggunakan editor built-in kami untuk memotong serta menyesuaikan kecerahan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
