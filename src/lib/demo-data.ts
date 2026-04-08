import type { Product, Category, Brand } from "@/types";

export const categories: Category[] = [
  { id: "1", name: "Surveillance & CCTV", slug: "surveillance", image: "/categories/surveillance.jpg", productCount: 156 },
  { id: "2", name: "Fire Alarm Systems", slug: "fire-alarm", image: "/categories/fire-alarm.jpg", productCount: 89 },
  { id: "3", name: "Access Control", slug: "access-control", image: "/categories/access-control.jpg", productCount: 124 },
  { id: "4", name: "Solar & Power", slug: "solar-systems", image: "/categories/solar.jpg", productCount: 67 },
  { id: "5", name: "Networking", slug: "networking", image: "/categories/networking.jpg", productCount: 203 },
  { id: "6", name: "ICT Equipment", slug: "ict-equipment", image: "/categories/ict.jpg", productCount: 178 },
  { id: "7", name: "Marine Accessories", slug: "marine-accessories", image: "/categories/marine.jpg", productCount: 95 },
  { id: "8", name: "Boat Engines", slug: "boat-engines", image: "/categories/boat-engines.jpg", productCount: 42 },
  { id: "9", name: "Safety Equipment", slug: "safety-equipment", image: "/categories/safety.jpg", productCount: 134 },
  { id: "10", name: "Dredging Equipment", slug: "dredging-equipment", image: "/categories/dredging.jpg", productCount: 28 },
  { id: "11", name: "Kitchen Equipment", slug: "kitchen-equipment", image: "/categories/kitchen.jpg", productCount: 56 },
  { id: "12", name: "UPS & Inverters", slug: "ups-inverters", image: "/categories/ups.jpg", productCount: 45 },
];

export const brands: Brand[] = [
  { id: "1", name: "Hikvision", slug: "hikvision", logo: "/brands/hikvision.png", productCount: 89 },
  { id: "2", name: "Dahua", slug: "dahua", logo: "/brands/dahua.png", productCount: 67 },
  { id: "3", name: "Yamaha", slug: "yamaha", logo: "/brands/yamaha.png", productCount: 34 },
  { id: "4", name: "Bosch", slug: "bosch", logo: "/brands/bosch.png", productCount: 45 },
  { id: "5", name: "Honeywell", slug: "honeywell", logo: "/brands/honeywell.png", productCount: 56 },
  { id: "6", name: "Axis", slug: "axis", logo: "/brands/axis.png", productCount: 23 },
  { id: "7", name: "Mercury", slug: "mercury", logo: "/brands/mercury.png", productCount: 28 },
  { id: "8", name: "Suzuki Marine", slug: "suzuki-marine", logo: "/brands/suzuki.png", productCount: 19 },
  { id: "9", name: "ZKTeco", slug: "zkteco", logo: "/brands/zkteco.png", productCount: 42 },
  { id: "10", name: "TP-Link", slug: "tp-link", logo: "/brands/tplink.png", productCount: 78 },
  { id: "11", name: "Cisco", slug: "cisco", logo: "/brands/cisco.png", productCount: 34 },
  { id: "12", name: "Caterpillar", slug: "caterpillar", logo: "/brands/caterpillar.png", productCount: 15 },
];

function makeProduct(
  id: string,
  name: string,
  categoryIndex: number,
  brandIndex: number,
  regularPrice: number,
  opts: Partial<Product> = {}
): Product {
  const cat = categories[categoryIndex];
  const brand = brands[brandIndex];
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  return {
    id,
    name,
    slug,
    type: "simple",
    sku: `${cat.slug.substring(0, 3).toUpperCase()}-${id.padStart(6, "0")}`,
    shortDescription: `Premium ${name} from ${brand.name}. Professional-grade quality for commercial and residential use.`,
    longDescription: "",
    brand,
    category: cat,
    regularPrice,
    costPrice: regularPrice * 0.6,
    images: [],
    variants: [],
    badges: [],
    inventory: [
      { locationId: "phc", locationName: "Port Harcourt", quantity: 25, lowStockThreshold: 5, backorderEnabled: false },
      { locationId: "lagos", locationName: "Lagos", quantity: 12, lowStockThreshold: 5, backorderEnabled: false },
    ],
    seo: { metaTitle: name, metaDescription: `Buy ${name} from Roshanal Global`, focusKeyword: name.toLowerCase(), altTexts: [] },
    specifications: {},
    tags: [],
    rating: 4 + Math.random(),
    reviewCount: Math.floor(Math.random() * 200) + 5,
    featured: false,
    status: "published",
    createdAt: "2026-01-15",
    updatedAt: "2026-03-20",
    ...opts,
  };
}

export const products: Product[] = [
  // Surveillance
  makeProduct("1", "Hikvision 4MP IP Dome Camera DS-2CD2143G2-I", 0, 0, 85000, {
    salePrice: 72500,
    featured: true,
    badges: [{ type: "bestseller", active: true }, { type: "sale", active: true }],
    saleBadge: { label: "SALE", color: "#C8191C", placements: ["listing", "pdp", "cart"] },
  }),
  makeProduct("2", "Dahua 8-Channel NVR 4K Ultra HD", 0, 1, 195000, {
    featured: true,
    badges: [{ type: "hot", active: true }, { type: "featured", active: true }],
  }),
  makeProduct("3", "Hikvision 16-Channel Turbo HD DVR", 0, 0, 165000, {
    salePrice: 145000,
    badges: [{ type: "sale", active: true }],
    saleBadge: { label: "OFFER", color: "#C8191C", placements: ["listing", "pdp"] },
  }),
  makeProduct("4", "Dahua 2MP Full-Color Bullet Camera", 0, 1, 45000, {
    badges: [{ type: "new-arrival", active: true }],
  }),

  // Fire Alarm
  makeProduct("5", "Bosch Conventional Fire Alarm Panel FPA-1200", 1, 3, 320000, {
    featured: true,
    badges: [{ type: "featured", active: true }],
  }),
  makeProduct("6", "Honeywell Addressable Smoke Detector", 1, 4, 28500, {
    salePrice: 23800,
    badges: [{ type: "sale", active: true }, { type: "trending", active: true }],
    saleBadge: { label: "DEAL", color: "#C8191C", placements: ["listing", "pdp", "cart"] },
  }),

  // Access Control
  makeProduct("7", "ZKTeco ProFace X Biometric Terminal", 2, 8, 450000, {
    featured: true,
    badges: [{ type: "top-rated", active: true }],
  }),
  makeProduct("8", "Hikvision Face Recognition Terminal", 2, 0, 380000, {
    badges: [{ type: "new", active: true }],
  }),

  // Marine / Boat Engines
  makeProduct("9", "Yamaha F150 4-Stroke Outboard Engine 150HP", 7, 2, 4500000, {
    featured: true,
    badges: [{ type: "featured", active: true }, { type: "bestseller", active: true }],
  }),
  makeProduct("10", "Yamaha F75 4-Stroke Outboard Engine 75HP", 7, 2, 2800000, {
    salePrice: 2550000,
    badges: [{ type: "sale", active: true }],
    saleBadge: { label: "PROMO", color: "#C8191C", placements: ["listing", "pdp", "cart"] },
  }),
  makeProduct("11", "Mercury 200HP Verado Outboard", 7, 6, 6200000, {
    badges: [{ type: "top-rated", active: true }],
  }),
  makeProduct("12", "Suzuki DF140A 4-Stroke Outboard 140HP", 7, 7, 3900000, {
    badges: [{ type: "new-arrival", active: true }],
  }),
  makeProduct("13", "Yamaha F250 V6 Offshore Outboard 250HP", 7, 2, 7800000, {
    featured: true,
    badges: [{ type: "hot", active: true }],
  }),

  // Marine Accessories
  makeProduct("14", "Marine LED Navigation Light Kit", 6, 3, 45000, {
    badges: [{ type: "bestseller", active: true }],
  }),
  makeProduct("15", "Bilge Pump 2000 GPH Automatic", 6, 4, 32000, {
    salePrice: 27500,
    badges: [{ type: "sale", active: true }],
    saleBadge: { label: "SALE", color: "#C8191C", placements: ["listing", "pdp"] },
  }),

  // Safety Equipment
  makeProduct("16", "3M Full Face Respirator 6800 Series", 8, 4, 85000, {
    featured: true,
    badges: [{ type: "trending", active: true }],
  }),
  makeProduct("17", "Fire Extinguisher 9kg DCP", 8, 3, 18500, {
    badges: [{ type: "bestseller", active: true }],
  }),

  // Dredging
  makeProduct("18", "Cutter Suction Dredger 14-inch", 9, 11, 85000000, {
    featured: true,
    badges: [{ type: "featured", active: true }],
  }),

  // Networking
  makeProduct("19", "Cisco Catalyst 2960-X 48-Port Switch", 4, 10, 890000, {
    badges: [{ type: "top-rated", active: true }],
  }),
  makeProduct("20", "TP-Link Omada EAP670 Wi-Fi 6 Access Point", 4, 9, 125000, {
    salePrice: 108000,
    badges: [{ type: "sale", active: true }, { type: "new-arrival", active: true }],
    saleBadge: { label: "SALE", color: "#C8191C", placements: ["listing", "pdp", "cart"] },
  }),

  // Kitchen
  makeProduct("21", "Commercial Kitchen Extraction Hood 1200mm", 10, 3, 450000, {
    badges: [{ type: "featured", active: true }],
  }),
  makeProduct("22", "Outdoor BBQ Island Kit - Premium", 10, 4, 1200000, {
    featured: true,
    badges: [{ type: "hot", active: true }],
  }),

  // Solar
  makeProduct("23", "5kVA Hybrid Solar Inverter System", 3, 4, 1850000, {
    salePrice: 1650000,
    featured: true,
    badges: [{ type: "sale", active: true }, { type: "trending", active: true }],
    saleBadge: { label: "SALE", color: "#C8191C", placements: ["listing", "pdp", "cart"] },
  }),
  makeProduct("24", "450W Monocrystalline Solar Panel", 3, 3, 165000, {
    badges: [{ type: "bestseller", active: true }],
  }),
];

export const featuredProducts = products.filter((p) => p.featured);
export const saleProducts = products.filter((p) => p.salePrice);
export const trendingProducts = products.filter((p) => p.badges.some((b) => b.type === "trending" && b.active));
export const newArrivals = products.filter((p) => p.badges.some((b) => (b.type === "new" || b.type === "new-arrival") && b.active));
export const bestSellers = products.filter((p) => p.badges.some((b) => b.type === "bestseller" && b.active));
export const boatEngines = products.filter((p) => p.category.slug === "boat-engines");
