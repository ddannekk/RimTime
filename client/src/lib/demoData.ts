import { nanoid } from "nanoid";

type Product = {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  image: string;
  size: "30cm" | "45cm";
  style: "Motorsport" | "Classic" | "Black/Chrome";
  personalization: string | null;
  stock: number;
  upvotes: number;
  downvotes: number;
  isBestseller: number;
  createdAt: string;
  updatedAt: string;
};

type Review = {
  id: number;
  productId: number;
  userId: number | null;
  rating: number;
  comment: string | null;
  author: string;
  createdAt: string;
};

type Order = {
  id: number;
  orderNumber: string;
  userId: number | null;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  paymentMethod: "paypal" | "visa" | "klarna" | "vorkasse";
  paymentStatus: "pending" | "paid" | "unpaid";
  createdAt: string;
  updatedAt: string;
};

type GalleryUpload = {
  id: number;
  userId: number | null;
  author: string;
  imageUrl: string;
  title: string;
  description: string | null;
  likes: number;
  createdAt: string;
};

type PromoCode = {
  id: number;
  code: string;
  discountPercent: number;
  description: string | null;
  isActive: number;
  currentUses: number;
  maxUses: number | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

const STORAGE_KEYS = {
  products: "rimtime_demo_products",
  orders: "rimtime_demo_orders",
  gallery: "rimtime_demo_gallery",
  promoCodes: "rimtime_demo_promo_codes",
} as const;

const now = () => new Date().toISOString();

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "RIMtime Motorsport 30cm",
    description: "Kompakte Felgenuhr mit motorsport-inspiriertem Finish fur Gaming-Setup, Werkstatt oder Office.",
    basePrice: 7990,
    image: "/images/rimtime/motorsport-clock.png",
    size: "30cm",
    style: "Motorsport",
    personalization: null,
    stock: 12,
    upvotes: 148,
    downvotes: 6,
    isBestseller: 1,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 2,
    name: "RIMtime Motorsport 45cm",
    description: "Grossere Variante mit starker Wandwirkung und markanter Speichenoptik.",
    basePrice: 10990,
    image: "/images/rimtime/motorsport-clock.png",
    size: "45cm",
    style: "Motorsport",
    personalization: null,
    stock: 7,
    upvotes: 132,
    downvotes: 4,
    isBestseller: 1,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 3,
    name: "RIMtime Classic 30cm",
    description: "Klassischer Look mit ruhigerem Charakter fur Wohnraum oder stilvolles Office.",
    basePrice: 7490,
    image: "/images/rimtime/classic-clock.png",
    size: "30cm",
    style: "Classic",
    personalization: null,
    stock: 10,
    upvotes: 91,
    downvotes: 3,
    isBestseller: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 4,
    name: "RIMtime Classic 45cm",
    description: "Mehr Prasenz an der Wand bei gleichem klassischen Designansatz.",
    basePrice: 10490,
    image: "/images/rimtime/classic-clock.png",
    size: "45cm",
    style: "Classic",
    personalization: null,
    stock: 8,
    upvotes: 84,
    downvotes: 2,
    isBestseller: 0,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 5,
    name: "RIMtime Black/Chrome 30cm",
    description: "Dunkleres Premium-Finish mit starker Kontrastwirkung und moderner Tech-Atmosphare.",
    basePrice: 8490,
    image: "/images/rimtime/black-chrome-clock.png",
    size: "30cm",
    style: "Black/Chrome",
    personalization: null,
    stock: 9,
    upvotes: 118,
    downvotes: 5,
    isBestseller: 1,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 6,
    name: "RIMtime Black/Chrome 45cm",
    description: "Die grossformatige Black/Chrome-Version fur maximale Wirkung im Raum.",
    basePrice: 11490,
    image: "/images/rimtime/black-chrome-clock.png",
    size: "45cm",
    style: "Black/Chrome",
    personalization: null,
    stock: 5,
    upvotes: 110,
    downvotes: 4,
    isBestseller: 0,
    createdAt: now(),
    updatedAt: now(),
  },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 1, productId: 1, userId: null, rating: 5, comment: "Sieht live noch starker aus als auf den Fotos.", author: "Max K.", createdAt: now() },
  { id: 2, productId: 2, userId: null, rating: 5, comment: "Perfekt fur mein Setup im Hobbyraum.", author: "Julia P.", createdAt: now() },
  { id: 3, productId: 5, userId: null, rating: 4, comment: "Sehr sauber verarbeitet und schnell geliefert.", author: "Daniel S.", createdAt: now() },
];

const DEFAULT_GALLERY: GalleryUpload[] = [
  {
    id: 1,
    userId: null,
    author: "Marco",
    imageUrl: "/images/rimtime/inspiration-garage.png",
    title: "Garage Setup",
    description: "Motorsport-Look uber der Werkbank.",
    likes: 24,
    createdAt: now(),
  },
  {
    id: 2,
    userId: null,
    author: "Lena",
    imageUrl: "/images/rimtime/inspiration-gaming.png",
    title: "Gaming Corner",
    description: "Passt extrem gut zu RGB und dunklem Desk-Setup.",
    likes: 31,
    createdAt: now(),
  },
  {
    id: 3,
    userId: null,
    author: "Tobias",
    imageUrl: "/images/rimtime/inspiration-office.png",
    title: "Office Wall",
    description: "Im Office deutlich spannender als eine normale Wanduhr.",
    likes: 18,
    createdAt: now(),
  },
];

const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    id: 1,
    code: "RIM10",
    discountPercent: 10,
    description: "Demo-Rabattcode fur GitHub Pages",
    isActive: 1,
    currentUses: 0,
    maxUses: null,
    createdAt: now(),
    updatedAt: now(),
    expiresAt: null,
  },
];

function hasWindow() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (!hasWindow()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getDemoProducts() {
  return loadFromStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
}

export function saveDemoProducts(products: Product[]) {
  saveToStorage(STORAGE_KEYS.products, products);
}

export function getDemoReviews() {
  return DEFAULT_REVIEWS;
}

export function getDemoOrders() {
  return loadFromStorage<Order[]>(STORAGE_KEYS.orders, []);
}

export function saveDemoOrders(orders: Order[]) {
  saveToStorage(STORAGE_KEYS.orders, orders);
}

export function getDemoGallery() {
  return loadFromStorage(STORAGE_KEYS.gallery, DEFAULT_GALLERY);
}

export function saveDemoGallery(items: GalleryUpload[]) {
  saveToStorage(STORAGE_KEYS.gallery, items);
}

export function getDemoPromoCodes() {
  return loadFromStorage(STORAGE_KEYS.promoCodes, DEFAULT_PROMO_CODES);
}

export function saveDemoPromoCodes(codes: PromoCode[]) {
  saveToStorage(STORAGE_KEYS.promoCodes, codes);
}

export function nextNumericId(items: Array<{ id: number | string }>) {
  return items.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
}

export function createDemoOrderNumber() {
  return `RIM-${nanoid(8).toUpperCase()}`;
}

