import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createDonation,
  createEducationAccessRequest,
  createEducationContent,
  createEmailVerification,
  createEvent,
  createHeroSlide,
  createTicketOrder,
  createTimeslot,
  deleteEducationContent,
  deleteEvent,
  deleteHeroSlide,
  deleteTimeslot,
  getActiveEducationContent,
  getActiveEvents,
  getActiveHeroSlides,
  getAllDonations,
  getAllEducationAccessRequests,
  getAllEducationContent,
  getAllEvents,
  getAllHeroSlides,
  getAllTicketOrders,
  getDonationByPaypalOrderId,
  getEducationAccessRequestByEmail,
  getEducationContentBySlug,
  getEventById,
  getEventBySlug,
  getFeaturedEvents,
  getTicketOrderByOrderNumber,
  getTimeslotById,
  getTimeslotsForEvent,
  incrementTimeslotSold,
  updateDonation,
  updateEducationAccessRequest,
  updateEducationContent,
  updateEvent,
  updateHeroSlide,
  updateTicketOrder,
  updateTimeslot,
  updateUserEducationAccess,
  verifyEmailCode,
} from "./db";
import { nanoid } from "nanoid";
import axios from "axios";

// ─── Admin guard ──────────────────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Education guard ──────────────────────────────────────────────────────────

const educationProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user.educationVerified && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Education portal access required" });
  }
  return next({ ctx });
});

// ─── PayPal helpers ───────────────────────────────────────────────────────────

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "PayPal not configured" });

  const resp = await axios.post(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: { username: clientId, password: secret },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return resp.data.access_token;
}

async function createPayPalOrder(amount: string, description: string, returnUrl: string, cancelUrl: string) {
  const token = await getPayPalToken();
  const resp = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amount }, description }],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        brand_name: "Dinsmore Homestead Museum",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
      },
    },
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return resp.data;
}

async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalToken();
  const resp = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {},
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );
  return resp.data;
}

// ─── Email helper (uses Manus notification as fallback) ───────────────────────

async function sendVerificationEmail(email: string, code: string, name: string): Promise<void> {
  // In production, integrate with SendGrid/Mailgun/SES
  // For now, log the code (admin can see it in notifications)
  console.log(`[EMAIL] Verification code for ${email}: ${code}`);
  // TODO: Replace with real email service
}

// ─── App Router ───────────────────────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,

  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Hero Slides ───────────────────────────────────────────────────────────
  heroSlides: router({
    list: publicProcedure.query(() => getActiveHeroSlides()),
    adminList: adminProcedure.query(() => getAllHeroSlides()),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        subtitle: z.string().optional(),
        imageUrl: z.string().url(),
        linkUrl: z.string().optional(),
        linkText: z.string().optional(),
        sortOrder: z.number().default(0),
        active: z.boolean().default(true),
      }))
      .mutation(({ input }) => createHeroSlide(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        imageUrl: z.string().url().optional(),
        linkUrl: z.string().optional(),
        linkText: z.string().optional(),
        sortOrder: z.number().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateHeroSlide(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteHeroSlide(input.id)),
  }),

  // ── Events ────────────────────────────────────────────────────────────────
  events: router({
    list: publicProcedure.query(() => getActiveEvents()),
    featured: publicProcedure.query(() => getFeaturedEvents()),
    adminList: adminProcedure.query(() => getAllEvents()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getEventBySlug(input.slug)),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEventById(input.id)),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        imageUrl: z.string().optional(),
        eventType: z.enum(["tour", "special_event", "fundraiser", "program", "private"]).default("special_event"),
        basePrice: z.string().default("0.00"),
        startDate: z.date(),
        endDate: z.date().optional(),
        usesTimeslots: z.boolean().default(true),
        defaultCapacity: z.number().default(20),
        active: z.boolean().default(true),
        featured: z.boolean().default(false),
      }))
      .mutation(({ input }) => createEvent(input as any)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        imageUrl: z.string().optional(),
        eventType: z.enum(["tour", "special_event", "fundraiser", "program", "private"]).optional(),
        basePrice: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        usesTimeslots: z.boolean().optional(),
        defaultCapacity: z.number().optional(),
        active: z.boolean().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateEvent(id, data as any);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteEvent(input.id)),
  }),

  // ── Timeslots ─────────────────────────────────────────────────────────────
  timeslots: router({
    forEvent: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => getTimeslotsForEvent(input.eventId)),
    create: adminProcedure
      .input(z.object({
        eventId: z.number(),
        slotDate: z.date(),
        startTime: z.string(),
        endTime: z.string().optional(),
        capacity: z.number().min(1),
        price: z.string().optional(),
        active: z.boolean().default(true),
      }))
      .mutation(({ input }) => createTimeslot(input as any)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slotDate: z.date().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        capacity: z.number().optional(),
        price: z.string().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateTimeslot(id, data as any);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTimeslot(input.id)),
  }),

  // ── Tickets / PayPal ──────────────────────────────────────────────────────
  tickets: router({
    createOrder: publicProcedure
      .input(z.object({
        eventId: z.number(),
        timeslotId: z.number().optional(),
        buyerName: z.string().min(1),
        buyerEmail: z.string().email(),
        buyerPhone: z.string().optional(),
        quantity: z.number().min(1).max(20),
        origin: z.string(),
      }))
      .mutation(async ({ input }) => {
        const event = await getEventById(input.eventId);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

        let unitPrice = parseFloat(event.basePrice);
        let timeslot = null;

        if (input.timeslotId) {
          timeslot = await getTimeslotById(input.timeslotId);
          if (!timeslot) throw new TRPCError({ code: "NOT_FOUND", message: "Timeslot not found" });
          if (timeslot.price) unitPrice = parseFloat(timeslot.price);

          const available = timeslot.capacity - timeslot.ticketsSold;
          if (available < input.quantity) {
            throw new TRPCError({ code: "BAD_REQUEST", message: `Only ${available} tickets available for this time slot` });
          }
        }

        const total = (unitPrice * input.quantity).toFixed(2);
        const orderNumber = `DHM-${Date.now()}-${nanoid(6).toUpperCase()}`;

        // Create pending order in DB
        const orderId = await createTicketOrder({
          orderNumber,
          eventId: input.eventId,
          timeslotId: input.timeslotId,
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          buyerPhone: input.buyerPhone,
          quantity: input.quantity,
          unitPrice: unitPrice.toFixed(2),
          totalAmount: total,
          status: "pending",
        });

        // Create PayPal order
        const paypalOrder = await createPayPalOrder(
          total,
          `${input.quantity}x ticket(s) for ${event.title}`,
          `${input.origin}/tickets/confirm?orderNumber=${orderNumber}`,
          `${input.origin}/tickets/cancel?orderNumber=${orderNumber}`
        );

        // Save PayPal order ID
        await updateTicketOrder(orderId, { paypalOrderId: paypalOrder.id });

        const approvalUrl = paypalOrder.links?.find((l: any) => l.rel === "approve")?.href;
        return { orderNumber, paypalOrderId: paypalOrder.id, approvalUrl };
      }),

    captureOrder: publicProcedure
      .input(z.object({ orderNumber: z.string(), paypalOrderId: z.string() }))
      .mutation(async ({ input }) => {
        const order = await getTicketOrderByOrderNumber(input.orderNumber);
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        if (order.status === "paid") return { success: true, order };

        const capture = await capturePayPalOrder(input.paypalOrderId);
        const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id;

        await updateTicketOrder(order.id, {
          status: "paid",
          paypalCaptureId: captureId,
        });

        // Increment timeslot sold count
        if (order.timeslotId) {
          await incrementTimeslotSold(order.timeslotId, order.quantity);
        }

        const updatedOrder = await getTicketOrderByOrderNumber(input.orderNumber);
        return { success: true, order: updatedOrder };
      }),

    getOrder: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(({ input }) => getTicketOrderByOrderNumber(input.orderNumber)),

    adminList: adminProcedure.query(() => getAllTicketOrders()),
  }),

  // ── Donations ─────────────────────────────────────────────────────────────
  donations: router({
    createOrder: publicProcedure
      .input(z.object({
        donorName: z.string().min(1),
        donorEmail: z.string().email(),
        amount: z.string(),
        donationType: z.enum(["one_time", "recurring"]).default("one_time"),
        frequency: z.enum(["monthly", "quarterly", "annually"]).optional(),
        dedicationName: z.string().optional(),
        message: z.string().optional(),
        anonymous: z.boolean().default(false),
        origin: z.string(),
      }))
      .mutation(async ({ input }) => {
        const donationId = await createDonation({
          donorName: input.donorName,
          donorEmail: input.donorEmail,
          amount: input.amount,
          donationType: input.donationType,
          frequency: input.frequency,
          dedicationName: input.dedicationName,
          message: input.message,
          anonymous: input.anonymous,
          status: "pending",
        });

        const paypalOrder = await createPayPalOrder(
          input.amount,
          `Donation to Dinsmore Homestead Museum`,
          `${input.origin}/donate/confirm`,
          `${input.origin}/donate`
        );

        await updateDonation(donationId, { paypalOrderId: paypalOrder.id });

        const approvalUrl = paypalOrder.links?.find((l: any) => l.rel === "approve")?.href;
        return { donationId, paypalOrderId: paypalOrder.id, approvalUrl };
      }),

    captureOrder: publicProcedure
      .input(z.object({ paypalOrderId: z.string() }))
      .mutation(async ({ input }) => {
        const donation = await getDonationByPaypalOrderId(input.paypalOrderId);
        if (!donation) throw new TRPCError({ code: "NOT_FOUND", message: "Donation not found" });
        if (donation.status === "completed") return { success: true };

        const capture = await capturePayPalOrder(input.paypalOrderId);
        const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id;

        await updateDonation(donation.id, { status: "completed", paypalCaptureId: captureId });
        return { success: true };
      }),

    adminList: adminProcedure.query(() => getAllDonations()),
  }),

  // ── Education Portal ──────────────────────────────────────────────────────
  education: router({
    // Public: request access
    requestAccess: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        organization: z.string().optional(),
        role: z.string().optional(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const existing = await getEducationAccessRequestByEmail(input.email);

        const code = Math.random().toString().slice(2, 8);
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

        if (existing) {
          await updateEducationAccessRequest(existing.id, {
            verificationCode: code,
            codeExpiresAt: expiresAt,
            verified: false,
          });
        } else {
          await createEducationAccessRequest({
            ...input,
            verificationCode: code,
            codeExpiresAt: expiresAt,
          });
        }

        await sendVerificationEmail(input.email, code, input.name);
        return { success: true, message: "Verification code sent to your email" };
      }),

    // Public: verify code and grant access
    verifyCode: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        code: z.string().length(6),
      }))
      .mutation(async ({ ctx, input }) => {
        const request = await getEducationAccessRequestByEmail(input.email);
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "No access request found for this email" });
        if (request.verified) {
          // Already verified, grant access
          await updateUserEducationAccess(ctx.user.id, true);
          return { success: true };
        }

        if (request.verificationCode !== input.code) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid verification code" });
        }
        if (request.codeExpiresAt && new Date() > request.codeExpiresAt) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Verification code has expired" });
        }

        await updateEducationAccessRequest(request.id, {
          verified: true,
          verifiedAt: new Date(),
          approved: true,
        });
        await updateUserEducationAccess(ctx.user.id, true);
        return { success: true };
      }),

    // Gated: list content
    content: educationProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(({ input }) => getActiveEducationContent(input.category)),

    contentBySlug: educationProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getEducationContentBySlug(input.slug)),

    // Admin: manage content
    adminList: adminProcedure.query(() => getAllEducationContent()),
    adminCreate: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        category: z.enum(["lesson_plan", "research", "resource", "newsletter", "program"]),
        gradeLevel: z.string().optional(),
        subject: z.string().optional(),
        content: z.string(),
        fileUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        sortOrder: z.number().default(0),
        active: z.boolean().default(true),
      }))
      .mutation(({ input }) => createEducationContent(input)),
    adminUpdate: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
        gradeLevel: z.string().optional(),
        subject: z.string().optional(),
        fileUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateEducationContent(id, data);
      }),
    adminDelete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteEducationContent(input.id)),

    adminRequests: adminProcedure.query(() => getAllEducationAccessRequests()),

    adminApproveRequest: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await updateEducationAccessRequest(input.id, { approved: true, verified: true });
        return { success: true };
      }),
  }),

  // ── File Upload ───────────────────────────────────────────────────────────
  upload: router({
    getUploadUrl: adminProcedure
      .input(z.object({ filename: z.string(), contentType: z.string() }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import("./storage");
        const key = `uploads/${Date.now()}-${input.filename}`;
        // Return a placeholder - actual upload done client-side via presigned URL
        // For now return the key for the admin to use
        return { key, message: "Use the CDN upload workflow for images" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
