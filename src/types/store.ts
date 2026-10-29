export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  stock?: number;
  priceDelta?: number;
}

export type ProductLabel = 'New Arrival' | 'Best Seller' | 'Limited Edition' | 'Curated Pick' | 'Promo' | '';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  stock: number;
  variants: ProductVariant[];
  primaryImage: string;
  gallery: string[];
  altText: string;
  label?: ProductLabel;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  description: string;
  accountNumber?: string;
  accountName?: string;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  subheadline: string;
  heroImage: string;
  heroBadgeText: string;
  announcementBarText: string;
  isAnnouncementBarActive: boolean;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  instagramUrl: string;
  operationalHours: string;
  address: string;
  freeShippingThreshold: number;
  promoBannerTitle: string;
  promoBannerSubtitle: string;
  promoBannerButtonText: string;
  paymentMethods: PaymentMethodConfig[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  shippingAddress: string;
  city: string;
  notes?: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
  whatsappSent: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}
