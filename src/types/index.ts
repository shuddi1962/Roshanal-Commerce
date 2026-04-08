// Core Product Types
export type ProductType = "simple" | "variable" | "digital" | "service" | "bundle" | "rental" | "subscription";

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  sku: string;
  barcode?: string;
  shortDescription: string;
  longDescription: string;
  brand: Brand;
  category: Category;
  subcategory?: Category;
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  wholesalePrice?: number;
  rentalPrice?: number;
  subscriptionPrice?: number;
  subscriptionCycle?: "weekly" | "monthly" | "quarterly" | "annual";
  taxClass?: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  badges: ProductBadge[];
  saleBadge?: SaleBadgeConfig;
  countdown?: CountdownConfig;
  inventory: LocationInventory[];
  seo: SEOConfig;
  specifications?: Record<string, string>;
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  status: "draft" | "published" | "archived";
  vendorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  watermark: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
}

export interface ProductBadge {
  type: "new" | "sale" | "hot" | "featured" | "trending" | "new-arrival" | "bestseller" | "top-rated";
  active: boolean;
}

export interface SaleBadgeConfig {
  label: string;
  color: string;
  placements: ("listing" | "pdp" | "cart" | "related" | "email")[];
}

export interface CountdownConfig {
  enabled: boolean;
  label: string;
  startDate: string;
  endDate: string;
  style: "digital" | "circular";
  placements: ("pdp" | "listing" | "cart" | "related")[];
}

export interface LocationInventory {
  locationId: string;
  locationName: string;
  quantity: number;
  lowStockThreshold: number;
  backorderEnabled: boolean;
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  altTexts: string[];
}

// Category & Brand
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  productCount: number;
}

// Cart & Order
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  branchId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded" | "partial-refund";
  shippingAddress: Address;
  fulfillmentBranch: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "packed"
  | "dispatched"
  | "in-transit"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refund-requested"
  | "refunded"
  | "on-hold"
  | "awaiting-payment";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variant?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  lga?: string;
  country: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
}

// User & Auth
export type UserRole =
  | "super-admin"
  | "store-manager"
  | "accountant"
  | "marketing-manager"
  | "technical-team"
  | "field-technical"
  | "customer-support"
  | "content-editor"
  | "delivery-boy"
  | "warehouse-staff"
  | "location-manager"
  | "sales-staff"
  | "b2b-customer"
  | "vendor"
  | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  branchId?: string;
  vendorId?: string;
  loyaltyTier: "bronze" | "silver" | "gold" | "platinum";
  loyaltyPoints: number;
  walletBalance: number;
  createdAt: string;
}

// Vendor / Marketplace
export interface Vendor {
  id: string;
  userId: string;
  shopName: string;
  shopSlug: string;
  shopDescription: string;
  shopLogo: string;
  shopBanner: string;
  shopLayout: "single-product" | "multi-product" | "grid" | "list" | "custom";
  commission: number;
  status: "pending" | "approved" | "suspended" | "rejected";
  shippingMethods: VendorShippingMethod[];
  bankDetails: VendorBankDetails;
  rating: number;
  totalSales: number;
  totalRevenue: number;
  joinedAt: string;
}

export interface VendorShippingMethod {
  id: string;
  name: string;
  type: "flat-rate" | "weight-based" | "free" | "custom";
  cost: number;
  estimatedDays: string;
  zones: string[];
  active: boolean;
}

export interface VendorBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
}

export interface VendorAd {
  id: string;
  vendorId: string;
  productId?: string;
  type: "featured" | "banner" | "sponsored" | "promoted";
  pricingModel: "duration" | "cpc" | "cpm" | "cpa";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "expired" | "pending";
  creative?: string;
}

// Booking & Services
export interface Booking {
  id: string;
  serviceType: ServiceType;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "assigned" | "in-progress" | "completed" | "cancelled";
  technicianId?: string;
  deposit?: number;
  totalCost?: number;
  maintenanceFee?: number;
  notes?: string;
  completionPhotos?: string[];
  jobReport?: string;
  address: Address;
  createdAt: string;
}

export type ServiceType =
  | "cctv-installation"
  | "fire-alarm"
  | "access-control"
  | "kitchen-installation"
  | "dredging"
  | "boat-building"
  | "maintenance"
  | "consultation";

// Boat Building
export interface BoatConfiguration {
  id: string;
  vesselType: BoatVesselType;
  length: number;
  width: number;
  material: "fiberglass" | "aluminum" | "steel" | "wood" | "composite";
  engineIncluded: boolean;
  engineType?: string;
  engineBrand?: string;
  engineHorsepower?: number;
  features: string[];
  customRequirements?: string;
  estimatedCost: number;
  visualUrl?: string;
  threeDModelUrl?: string;
}

export type BoatVesselType =
  | "fishing-boat"
  | "speed-boat"
  | "pontoon"
  | "cabin-cruiser"
  | "catamaran"
  | "tugboat"
  | "barge"
  | "patrol-boat"
  | "ferry"
  | "workboat"
  | "houseboat"
  | "yacht"
  | "dinghy"
  | "jon-boat"
  | "center-console"
  | "custom";

// Location / Branch
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  hours: string;
  lat: number;
  lng: number;
  paymentMethods: string[];
  active: boolean;
}

// Role & Permission
export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  isEditable: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  action: "view" | "create" | "edit" | "delete" | "manage" | "export";
  granted: boolean;
}

// Analytics
export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  bingWebmasterToolsId?: string;
  facebookPixelId?: string;
  googleSearchConsoleVerification?: string;
  autoIndexingEnabled: boolean;
}

// Footer
export interface FooterColumn {
  id: string;
  title: string;
  position: number;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  type: "internal" | "external" | "image";
  imageUrl?: string;
  iconUrl?: string;
  position: number;
}

export interface FooterImageBox {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  position: number;
}
