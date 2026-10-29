import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { AdminProductEditorModal } from './AdminProductEditorModal';
import { Product, Category } from '../../types/store';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { isAuthenticated, isLoading, logout, adminUser, token } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Fetch admin products (all, including inactive) & categories
  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/products?includeInactive=true'),
        fetch('/api/categories')
      ]);
      if (prodsRes.ok && catsRes.ok) {
        setProducts(await prodsRes.json());
        setCategories(await catsRes.json());
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onBackToStore={onBackToStore} />;
  }

  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'products', label: 'Produk & Stok', icon: Package, badge: products.length },
    { id: 'categories', label: 'Kategori', icon: Layers, badge: categories.length },
    { id: 'orders', label: 'Pesanan & WhatsApp', icon: ShoppingBag },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-[#1A1918] text-white px-4 sm:px-6 h-16 flex items-center justify-between border-b border-[#2D2A27]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-1.5 text-[#A8A49C] hover:text-white"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-white tracking-tight">AiiStore99</span>
            <span className="text-[10px] bg-[#C5A880] text-[#1A1918] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-[#2A2724] hover:bg-[#383430]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Tampilan Toko</span>
          </button>

          <div className="h-4 w-[1px] bg-[#383430] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#A8A49C]">
            <span className="text-white font-medium">{adminUser?.name || 'Admin'}</span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-[#A8A49C] hover:text-rose-400 transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-1.5 bg-white p-4 rounded-2xl border border-[#EBE6DD] h-fit shadow-2xs">
          <div className="pb-3 mb-2 border-b border-[#F2EFE9] px-2 text-xs font-semibold text-[#8C8275] uppercase tracking-wider">
            Menu Pengelola
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1A1918] text-[#FAFAF7] shadow-xs'
                    : 'text-[#595652] hover:bg-[#FAF8F5] hover:text-[#1A1918]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-[#8C7355]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#383430] text-[#C5A880]' : 'bg-[#F2EFE9] text-[#736E67]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileNavOpen(false)} />
            <div className="relative w-64 bg-white h-full p-4 z-10 shadow-2xl flex flex-col space-y-1">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F2EFE9]">
                <span className="font-serif font-bold text-sm text-[#1A1918]">Menu Admin</span>
                <button onClick={() => setIsMobileNavOpen(false)}>
                  <X className="w-5 h-5 text-[#736E67]" />
                </button>
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#1A1918] text-[#FAFAF7]'
                        : 'text-[#595652] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-[#8C7355]'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <AdminOverview
              products={products}
              categories={categories}
              onNavigateTab={(tab: string) => setActiveTab(tab as any)}
              onAddProduct={() => setIsAddProductModalOpen(true)}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategories
              categories={categories}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'orders' && <AdminOrders />}

          {activeTab === 'settings' && <AdminSettings onRefresh={fetchData} />}
        </main>
      </div>

      {/* Quick Add Product Modal from Overview */}
      {isAddProductModalOpen && (
        <AdminProductEditorModal
          product={null}
          categories={categories}
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onSaved={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};
