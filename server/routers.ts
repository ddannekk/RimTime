import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, getBestsellerProducts, getReviewsByProductId, createOrder, getOrderByNumber, getAllOrders, getGalleryUploads, createGalleryUpload, updateProduct, getAllPromoCodes, getPromoCodeByCode } from "./db";
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
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProduct(id, data);
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
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          price: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        const orderNumber = `RIM-${nanoid(8).toUpperCase()}`;
        try {
          await createOrder({
            orderNumber,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerAddress: input.customerAddress,
            totalPrice: input.totalPrice,
            status: "pending",
            paymentMethod: "vorkasse",
          });
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
      // Only admins can see all orders
      if (ctx.user?.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      return getAllOrders();
    }),
  }),

  // Promo codes router
  promoCodes: router({
    getAll: publicProcedure.query(async () => {
      return getAllPromoCodes();
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
