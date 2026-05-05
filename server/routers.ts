import { COOKIE_NAME, NOT_ADMIN_ERR_MSG } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, getBestsellerProducts, getReviewsByProductId, createOrder, getOrderByNumber, getAllOrders, getGalleryUploads, createGalleryUpload, updateProduct, getAllPromoCodes, getPromoCodeByCode, createProduct, deleteProduct, updateOrder, createPromoCode, updatePromoCode, deletePromoCode, incrementPromoCodeUsage } from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products router
  products: router({
    getAll: publicProcedure.query(async () => {
      return getAllProducts();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),

    getBestsellers: publicProcedure.query(async () => {
      return getBestsellerProducts();
    }),

    getReviews: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return getReviewsByProductId(input.productId);
      }),

    upvote: publicProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new Error('Product not found');
        return { success: true, upvotes: product.upvotes + 1 };
      }),

    downvote: publicProcedure
      .input(z.object({ productId: z.number() }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new Error('Product not found');
        return { success: true, downvotes: product.downvotes + 1 };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        basePrice: z.number().optional(),
        image: z.string().optional(),
        size: z.enum(["30cm", "45cm"]).optional(),
        style: z.enum(["Motorsport", "Classic", "Black/Chrome"]).optional(),
        personalization: z.string().nullable().optional(),
        stock: z.number().int().min(0).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProduct(id, data);
        return { success: true };
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        basePrice: z.number().int().min(0),
        image: z.string().min(1),
        size: z.enum(["30cm", "45cm"]),
        style: z.enum(["Motorsport", "Classic", "Black/Chrome"]),
        personalization: z.string().nullable().optional(),
        stock: z.number().int().min(0).default(10),
      }))
      .mutation(async ({ input }) => {
        await createProduct({
          name: input.name,
          description: input.description,
          basePrice: input.basePrice,
          image: input.image,
          size: input.size,
          style: input.style,
          personalization: input.personalization ?? null,
          stock: input.stock,
        });
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // Orders router
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerAddress: z.string(),
        totalPrice: z.number(),
        paymentMethod: z.enum(["paypal", "visa", "klarna", "vorkasse"]),
        promoCode: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.number(),
          personalization: z.string().optional(),
        })),
      }))
      .mutation(async ({ input }) => {
        const orderNumber = `RIM-${nanoid(8).toUpperCase()}`;
        try {
          if (input.promoCode) {
            const validPromo = await getPromoCodeByCode(input.promoCode);
            if (!validPromo) {
              throw new TRPCError({ code: "BAD_REQUEST", message: "Ungültiger Promo-Code" });
            }
          }

          await createOrder(
            {
              orderNumber,
              customerName: input.customerName,
              customerEmail: input.customerEmail,
              customerAddress: input.customerAddress,
              totalPrice: input.totalPrice,
              status: "pending",
              paymentMethod: input.paymentMethod,
              paymentStatus: input.paymentMethod === "vorkasse" ? "pending" : "paid",
            },
            input.items
          );
          if (input.promoCode) {
            await incrementPromoCodeUsage(input.promoCode);
          }
          return { success: true, orderNumber };
        } catch (error) {
          console.error("Error creating order:", error);
          throw new Error("Failed to create order");
        }
      }),

    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        return getOrderByNumber(input.orderNumber);
      }),

    getAll: publicProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role === "admin") {
        return getAllOrders();
      }

      // Local demo mode allows dashboard usage without full OAuth role setup.
      if (ENV.localDemoMode && !ENV.isProduction) {
        return getAllOrders();
      }

      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          customerName: z.string().min(1),
          customerAddress: z.string().min(1),
          paymentMethod: z.enum(["paypal", "visa", "klarna", "vorkasse"]),
          paymentStatus: z.enum(["pending", "paid", "unpaid"]),
          status: z.enum(["pending", "confirmed", "shipped", "delivered"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && !(ENV.localDemoMode && !ENV.isProduction)) {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        await updateOrder(input.id, {
          customerName: input.customerName,
          customerAddress: input.customerAddress,
          paymentMethod: input.paymentMethod,
          paymentStatus: input.paymentStatus,
          status: input.status,
        });

        return { success: true };
      }),
  }),

  // Promo codes router
  promoCodes: router({
    getAll: publicProcedure.query(async () => {
      return getAllPromoCodes();
    }),

    create: publicProcedure
      .input(
        z.object({
          code: z.string().min(1),
          discountPercent: z.number().int().min(1).max(100),
          description: z.string().optional(),
          isActive: z.boolean().default(true),
          currentUses: z.number().int().min(0).default(0),
          maxUses: z.number().int().min(1).nullable().optional(),
          expiresAt: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && !(ENV.localDemoMode && !ENV.isProduction)) {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        await createPromoCode({
          code: input.code.toUpperCase(),
          discountPercent: input.discountPercent,
          description: input.description,
          isActive: input.isActive ? 1 : 0,
          currentUses: input.currentUses,
          maxUses: input.maxUses ?? null,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        });

        return { success: true };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          code: z.string().min(1),
          discountPercent: z.number().int().min(1).max(100),
          description: z.string().optional(),
          isActive: z.boolean(),
          currentUses: z.number().int().min(0),
          maxUses: z.number().int().min(1).nullable().optional(),
          expiresAt: z.string().nullable().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && !(ENV.localDemoMode && !ENV.isProduction)) {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        await updatePromoCode(input.id, {
          code: input.code.toUpperCase(),
          discountPercent: input.discountPercent,
          description: input.description,
          isActive: input.isActive ? 1 : 0,
          currentUses: input.currentUses,
          maxUses: input.maxUses ?? null,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        });

        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin" && !(ENV.localDemoMode && !ENV.isProduction)) {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }

        await deletePromoCode(input.id);
        return { success: true };
      }),

    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const promo = await getPromoCodeByCode(input.code);
        return promo ? { valid: true, discount: promo.discountPercent } : { valid: false, discount: 0 };
      }),
  }),

  // Gallery router
  gallery: router({
    getAll: publicProcedure.query(async () => {
      return getGalleryUploads();
    }),

    upload: publicProcedure
      .input(z.object({
        author: z.string(),
        imageUrl: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await createGalleryUpload({
            author: input.author,
            imageUrl: input.imageUrl,
            title: input.title,
            description: input.description,
          });
          return { success: true };
        } catch (error) {
          console.error("Error uploading to gallery:", error);
          throw new Error("Failed to upload to gallery");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
