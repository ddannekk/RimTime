import { eq, and, gte, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, reviews, orders, orderItems, galleryUploads, InsertOrder, InsertGalleryUpload, promoCodes, InsertPromoCode, InsertProduct } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products);
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(products).values(product);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBestsellerProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isBestseller, 1)).limit(6);
}

export async function getReviewsByProductId(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.productId, productId));
}

// Order queries
export async function createOrder(
  order: InsertOrder,
  items: Array<{ productId: number; quantity: number; price: number; personalization?: string }>
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(orders).values(order);
  const orderId = Number((result as { insertId?: number }).insertId);

  if (orderId && items.length > 0) {
    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        personalization: item.personalization,
      }))
    );
  }

  return result;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(orders.createdAt);
}

export async function updateOrder(
  id: number,
  data: Partial<Pick<InsertOrder, "customerName" | "customerAddress" | "paymentMethod" | "status">> & {
    paymentStatus?: "pending" | "paid" | "unpaid";
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(orders).set(data).where(eq(orders.id, id));
}

// Gallery queries
export async function getGalleryUploads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryUploads).orderBy(galleryUploads.createdAt);
}

export async function createGalleryUpload(upload: InsertGalleryUpload) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(galleryUploads).values(upload);
}

export async function getPromoCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(promoCodes)
    .where(and(eq(promoCodes.code, code), eq(promoCodes.isActive, 1)))
    .limit(1);
  if (result.length === 0) return undefined;

  const promo = result[0];
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
    return undefined;
  }
  if (promo.maxUses !== null && promo.maxUses !== undefined && promo.currentUses >= promo.maxUses) {
    return undefined;
  }

  return promo;
}

export async function getAllPromoCodes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(promoCodes);
}

export async function createPromoCode(promo: InsertPromoCode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(promoCodes).values(promo);
}

export async function updatePromoCode(id: number, data: Partial<InsertPromoCode>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(promoCodes).set(data).where(eq(promoCodes.id, id));
}

export async function deletePromoCode(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(promoCodes).where(eq(promoCodes.id, id));
}

export async function incrementPromoCodeUsage(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(promoCodes).where(eq(promoCodes.code, code)).limit(1);
  if (existing.length === 0) throw new Error("Promo code not found");
  const promo = existing[0];
  return db
    .update(promoCodes)
    .set({ currentUses: promo.currentUses + 1 })
    .where(eq(promoCodes.id, promo.id));
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}

export async function getOrdersByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders)
    .where(and(gte(orders.createdAt, startDate), lt(orders.createdAt, endDate)))
    .orderBy(orders.createdAt);
}
