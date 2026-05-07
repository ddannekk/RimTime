import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/routers";
import {
  createDemoOrderNumber,
  getDemoGallery,
  getDemoOrders,
  getDemoProducts,
  getDemoPromoCodes,
  getDemoReviews,
  nextNumericId,
  saveDemoGallery,
  saveDemoOrders,
  saveDemoProducts,
  saveDemoPromoCodes,
} from "./demoData";

type DemoMutationResult = { success: true; [key: string]: unknown };

function notFound(message: string) {
  throw new Error(message);
}

function isPromoActive(promo: {
  isActive: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt: string | null;
}) {
  if (!promo.isActive) return false;
  if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) return false;
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) return false;
  return true;
}

function resolveDemoOperation(path: string, input: any, type: "query" | "mutation" | "subscription") {
  if (type === "subscription") {
    throw new Error(`Subscriptions are not supported in demo mode: ${path}`);
  }

  switch (path) {
    case "auth.me":
      return null;
    case "auth.logout":
      return { success: true } satisfies DemoMutationResult;
    case "products.getAll":
      return getDemoProducts();
    case "products.getById": {
      const product = getDemoProducts().find((item) => item.id === input.id);
      return product ?? null;
    }
    case "products.getBestsellers":
      return getDemoProducts().filter((item) => item.isBestseller === 1);
    case "products.getReviews":
      return getDemoReviews().filter((item) => item.productId === input.productId);
    case "products.upvote": {
      const products = getDemoProducts();
      const nextProducts = products.map((item) =>
        item.id === input.productId ? { ...item, upvotes: item.upvotes + 1, updatedAt: new Date().toISOString() } : item
      );
      saveDemoProducts(nextProducts);
      const updated = nextProducts.find((item) => item.id === input.productId);
      return { success: true, upvotes: updated?.upvotes ?? 0 };
    }
    case "products.downvote": {
      const products = getDemoProducts();
      const nextProducts = products.map((item) =>
        item.id === input.productId ? { ...item, downvotes: item.downvotes + 1, updatedAt: new Date().toISOString() } : item
      );
      saveDemoProducts(nextProducts);
      const updated = nextProducts.find((item) => item.id === input.productId);
      return { success: true, downvotes: updated?.downvotes ?? 0 };
    }
    case "products.update": {
      const products = getDemoProducts();
      const index = products.findIndex((item) => item.id === input.id);
      if (index < 0) notFound("Product not found");
      const nextProducts = [...products];
      nextProducts[index] = {
        ...nextProducts[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      saveDemoProducts(nextProducts);
      return { success: true } satisfies DemoMutationResult;
    }
    case "products.create": {
      const products = getDemoProducts();
      const nextProducts = [
        ...products,
        {
          id: nextNumericId(products),
          ...input,
          upvotes: 0,
          downvotes: 0,
          isBestseller: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      saveDemoProducts(nextProducts);
      return { success: true } satisfies DemoMutationResult;
    }
    case "products.delete": {
      const nextProducts = getDemoProducts().filter((item) => item.id !== input.id);
      saveDemoProducts(nextProducts);
      return { success: true } satisfies DemoMutationResult;
    }
    case "orders.create": {
      const orders = getDemoOrders();
      const orderNumber = createDemoOrderNumber();
      const paymentStatus: "pending" | "paid" = input.paymentMethod === "vorkasse" ? "pending" : "paid";
      const nextOrders = [
        ...orders,
        {
          id: nextNumericId(orders),
          orderNumber,
          userId: null,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerAddress: input.customerAddress,
          totalPrice: input.totalPrice,
          status: "pending" as const,
          paymentMethod: input.paymentMethod,
          paymentStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      saveDemoOrders(nextOrders);
      return { success: true, orderNumber };
    }
    case "orders.getByNumber":
      return getDemoOrders().find((item) => item.orderNumber === input.orderNumber) ?? null;
    case "orders.getAll":
      return getDemoOrders();
    case "orders.update": {
      const orders = getDemoOrders();
      const nextOrders = orders.map((item) =>
        item.id === input.id ? { ...item, ...input, updatedAt: new Date().toISOString() } : item
      );
      saveDemoOrders(nextOrders);
      return { success: true } satisfies DemoMutationResult;
    }
    case "promoCodes.getAll":
      return getDemoPromoCodes();
    case "promoCodes.create": {
      const promoCodes = getDemoPromoCodes();
      const nextPromoCodes = [
        ...promoCodes,
        {
          id: nextNumericId(promoCodes),
          code: String(input.code).toUpperCase(),
          discountPercent: input.discountPercent,
          description: input.description ?? null,
          isActive: input.isActive ? 1 : 0,
          currentUses: input.currentUses ?? 0,
          maxUses: input.maxUses ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: input.expiresAt ?? null,
        },
      ];
      saveDemoPromoCodes(nextPromoCodes);
      return { success: true } satisfies DemoMutationResult;
    }
    case "promoCodes.update": {
      const promoCodes = getDemoPromoCodes();
      const nextPromoCodes = promoCodes.map((item) =>
        item.id === input.id
          ? {
              ...item,
              ...input,
              code: String(input.code).toUpperCase(),
              isActive: input.isActive ? 1 : 0,
              maxUses: input.maxUses ?? null,
              expiresAt: input.expiresAt ?? null,
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      saveDemoPromoCodes(nextPromoCodes);
      return { success: true } satisfies DemoMutationResult;
    }
    case "promoCodes.delete": {
      const nextPromoCodes = getDemoPromoCodes().filter((item) => item.id !== input.id);
      saveDemoPromoCodes(nextPromoCodes);
      return { success: true } satisfies DemoMutationResult;
    }
    case "promoCodes.validate": {
      const normalizedCode = String(input.code).trim().toUpperCase();
      const promo = getDemoPromoCodes().find((item) => item.code === normalizedCode);
      if (!promo || !isPromoActive(promo)) {
        return { valid: false, discount: 0 };
      }
      return { valid: true, discount: promo.discountPercent };
    }
    case "gallery.getAll":
      return getDemoGallery();
    case "gallery.upload": {
      const gallery = getDemoGallery();
      const nextGallery = [
        {
          id: nextNumericId(gallery),
          userId: null,
          author: input.author,
          imageUrl: input.imageUrl,
          title: input.title,
          description: input.description ?? null,
          likes: 0,
          createdAt: new Date().toISOString(),
        },
        ...gallery,
      ];
      saveDemoGallery(nextGallery);
      return { success: true } satisfies DemoMutationResult;
    }
    default:
      throw new Error(`Unsupported demo API operation: ${path}`);
  }
}

export function createDemoTrpcLink(): TRPCLink<AppRouter> {
  return () => {
    return ({ op }) =>
      observable<any, any>((observer) => {
        try {
          const data = resolveDemoOperation(op.path, op.input, op.type);
          observer.next({
            context: op.context,
            result: {
              data,
              type: "data",
            },
          } as any);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }

        return () => undefined;
      });
  };
}
