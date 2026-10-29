import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BrandStoryAndFaq } from './components/BrandStoryAndFaq';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminDashboard } from './components/admin/AdminDashboard';

function StorefrontContent() {
  const {
    setActiveCategory,
    isCheckoutOpen,
    closeCheckout,
    quickViewProduct,
    closeQuickView
  } = useStore();

  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')
      ? 'admin'
      : 'store';
  });

  // Listen to hash change
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView === 'admin') {
      setCurrentView('store');
      window.location.hash = '';
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    const shopEl = document.getElementById('shop');
    if (shopEl) {
      shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'admin') {
    return <AdminDashboard onBackToStore={handleBackToStore} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Navigation Header */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <HeroSection
          onShopClick={() => handleNavigateSection('shop')}
          onExploreClick={() => {
            setActiveCategory('all');
            handleNavigateSection('shop');
          }}
        />

        {/* Visual Category Showcase */}
        <CategoryShowcase onSelectCategory={handleCategorySelect} />

        {/* Product Catalog Grid with Filters & Sort */}
        <ProductCatalog />

        {/* Brand Story & FAQ */}
        <BrandStoryAndFaq />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Interactive Overlays & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
      <ProductDetailModal product={quickViewProduct} onClose={closeQuickView} />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <StoreProvider>
        <StorefrontContent />
      </StoreProvider>
    </AdminAuthProvider>
  );
}
