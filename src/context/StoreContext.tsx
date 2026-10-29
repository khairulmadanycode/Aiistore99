import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, Category, StoreSettings, CartItem, ProductVariant } from '../types/store';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  cart: CartItem[];
  wishlist: string[];
  activeCategory: string;
  searchQuery: string;
  sortBy: string;
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isWishlistOpen: boolean;
  quickViewProduct: Product | null;
  // Actions
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  refreshData: () => Promise<void>;
  // Computed
  totalCartItems: number;
  cartSubtotal: number;
  filteredProducts: Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aiistore99_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aiistore99_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Save cart and wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aiistore99_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('aiistore99_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Fetch initial data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, catsRes, settRes] = await Promise.all([
        fetch('/api/products?includeInactive=false'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      if (!prodsRes.ok || !catsRes.ok || !settRes.ok) {
        throw new Error('Gagal memuat data dari server');
      }

      const prodsData = await prodsRes.json();
      const catsData = await catsRes.json();
      const settData = await settRes.json();

      setProducts(prodsData);
      setCategories(catsData);
      setSettings(settData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching store data:', err);
      setError(err.message || 'Terjadi kesalahan memuat data toko');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Cart operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const variantId = variant?.id || 'standard';
      const cartItemId = `${product.id}_${variantId}`;
      const existing = prev.find((item) => item.id === cartItemId);

      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedVariant: variant,
            quantity
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Modals
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);
  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Computed values
  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const basePrice = item.product.price;
      const delta = item.selectedVariant?.priceDelta || 0;
      return sum + (basePrice + delta) * item.quantity;
    }, 0);
  }, [cart]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        cart,
        wishlist,
        activeCategory,
        searchQuery,
        sortBy,
        isLoading,
        error,
        isCartOpen,
        isCheckoutOpen,
        isWishlistOpen,
        quickViewProduct,
        setActiveCategory,
        setSearchQuery,
        setSortBy,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        openWishlist,
        closeWishlist,
        openQuickView,
        closeQuickView,
        refreshData,
        totalCartItems,
        cartSubtotal,
        filteredProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
