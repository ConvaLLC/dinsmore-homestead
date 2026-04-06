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
  getAllTimeslotsForEvent,
  bulkCreateTimeslots,
  deleteTimeslotsInRange,
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
  getAvailabilityForMonth,
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
    // Public: active slots only (for ticket purchase)
    forEvent: publicProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => getTimeslotsForEvent(input.eventId)),

    // Admin: all slots including inactive
    adminForEvent: adminProcedure
      .input(z.object({ eventId: z.number() }))
      .query(({ input }) => getAllTimeslotsForEvent(input.eventId)),

    // Admin: create a single slot
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

    // Admin: bulk generate slots by date range + interval
    bulkGenerate: adminProcedure
      .input(z.object({
        eventId: z.number(),
        startDate: z.string(),   // "YYYY-MM-DD"
        endDate: z.string(),     // "YYYY-MM-DD"
        startTime: z.string(),   // "09:00"
        endTime: z.string(),     // "17:00"  — last slot starts at or before this
        intervalMinutes: z.number().min(15).max(480), // 30, 60, 90, 120 …
        slotDurationMinutes: z.number().min(15).max(480).optional(), // length of each tour
        capacity: z.number().min(1),
        price: z.string().optional(),
        skipDays: z.array(z.number()).optional(), // 0=Sun … 6=Sat
        replaceExisting: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        const {
          eventId, startDate, endDate, startTime, endTime,
          intervalMinutes, slotDurationMinutes, capacity, price,
          skipDays = [], replaceExisting,
        } = input;

        // Parse date range
        const from = new Date(startDate + 'T00:00:00');
        const to   = new Date(endDate   + 'T23:59:59');
        if (from > to) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Start date must be before end date' });

        // Optionally wipe existing slots in range
        if (replaceExisting) {
          await deleteTimeslotsInRange(eventId, from, to);
        }

        // Parse start/end clock times
        const [sh, sm] = startTime.split(':').map(Number);
        const [eh, em] = endTime.split(':').map(Number);
        const startMinutes = sh * 60 + sm;
        const endMinutes   = eh * 60 + em;

        const slots: any[] = [];
        const cursor = new Date(from);

        while (cursor <= to) {
          const dow = cursor.getDay();
          if (!skipDays.includes(dow)) {
            let slotStart = startMinutes;
            while (slotStart <= endMinutes) {
              const slotEnd = slotDurationMinutes ? slotStart + slotDurationMinutes : slotStart + intervalMinutes;
              const fmtTime = (mins: number) => {
                const h = Math.floor(mins / 60);
                const m = mins % 60;
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 === 0 ? 12 : h % 12;
                return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
              };
              slots.push({
                eventId,
                slotDate: new Date(cursor),
                startTime: fmtTime(slotStart),
                endTime: fmtTime(slotEnd),
                capacity,
                ticketsSold: 0,
                price: price || null,
                active: true,
              });
              slotStart += intervalMinutes;
            }
          }
          cursor.setDate(cursor.getDate() + 1);
        }

        if (slots.length === 0) throw new TRPCError({ code: 'BAD_REQUEST', message: 'No slots generated — check your date range and times' });
        const count = await bulkCreateTimeslots(slots);
        return { count };
      }),

    // Admin: update a single slot (capacity, time, active, price)
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        slotDate: z.date().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        capacity: z.number().min(0).optional(),
        price: z.string().optional(),
        active: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateTimeslot(id, data as any);
      }),

    // Admin: delete a single slot (only if no tickets sold)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const slot = await getTimeslotById(input.id);
        if (slot && slot.ticketsSold > 0) {
          // Soft-delete: just deactivate so order history stays intact
          await updateTimeslot(input.id, { active: false });
        } else {
          await deleteTimeslot(input.id);
        }
      }),

    // Admin: delete all slots in a date range for an event
    deleteRange: adminProcedure
      .input(z.object({
        eventId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .mutation(({ input }) => {
        const from = new Date(input.startDate + 'T00:00:00');
        const to   = new Date(input.endDate   + 'T23:59:59');
        return deleteTimeslotsInRange(input.eventId, from, to);
      }),
  }),

  // ── Availability Calendar ─────────────────────────────────────────────────
  availability: router({
    /**
     * Returns per-day slot availability for a given calendar month.
     * Used by the AvailabilityCalendar component on the Events page.
     */
    forMonth: publicProcedure
      .input(z.object({ year: z.number().int().min(2020).max(2100), month: z.number().int().min(1).max(12) }))
      .query(({ input }) => getAvailabilityForMonth(input.year, input.month)),
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

    /**
     * Tour-specific order with multi-ticket-type pricing.
     * Ticket types: adult ($10), child_5_15 ($3), under_5 (free), member (free)
     */
    createTourOrder: publicProcedure
      .input(z.object({
        timeslotId: z.number(),
        buyerName: z.string().min(1),
        buyerEmail: z.string().email(),
        buyerPhone: z.string().optional(),
        tickets: z.object({
          adult: z.number().min(0).max(10).default(0),
          child: z.number().min(0).max(10).default(0),
          under5: z.number().min(0).max(10).default(0),
          member: z.number().min(0).max(10).default(0),
        }),
        origin: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { tickets } = input;
        const totalGuests = tickets.adult + tickets.child + tickets.under5 + tickets.member;
        if (totalGuests < 1) throw new TRPCError({ code: "BAD_REQUEST", message: "Please select at least one ticket" });

        const timeslot = await getTimeslotById(input.timeslotId);
        if (!timeslot) throw new TRPCError({ code: "NOT_FOUND", message: "Time slot not found" });

        const available = timeslot.capacity - timeslot.ticketsSold;
        if (available < totalGuests) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Only ${available} spots remaining for this time slot` });
        }

        const event = await getEventById(timeslot.eventId);
        if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

        // Calculate pricing
        const adultPrice = 10.00;
        const childPrice = 3.00;
        const total = (tickets.adult * adultPrice) + (tickets.child * childPrice);
        // under5 and member are free

        const orderNumber = `DHM-${Date.now()}-${nanoid(6).toUpperCase()}`;
        const ticketBreakdown = `Adult x${tickets.adult} ($${(tickets.adult * adultPrice).toFixed(2)}), Child x${tickets.child} ($${(tickets.child * childPrice).toFixed(2)}), Under 5 x${tickets.under5} (Free), Member x${tickets.member} (Free)`;

        // Create pending order in DB
        const orderId = await createTicketOrder({
          orderNumber,
          eventId: timeslot.eventId,
          timeslotId: input.timeslotId,
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          buyerPhone: input.buyerPhone,
          quantity: totalGuests,
          unitPrice: total > 0 ? (total / totalGuests).toFixed(2) : "0.00",
          totalAmount: total.toFixed(2),
          status: total > 0 ? "pending" : "paid", // Free orders auto-complete
          notes: ticketBreakdown,
        });

        if (total > 0) {
          // Create PayPal order for paid tickets
          const paypalOrder = await createPayPalOrder(
            total.toFixed(2),
            `Dinsmore Homestead Tour: ${ticketBreakdown}`,
            `${input.origin}/tickets/confirm?orderNumber=${orderNumber}`,
            `${input.origin}/tickets/cancel?orderNumber=${orderNumber}`
          );
          await updateTicketOrder(orderId, { paypalOrderId: paypalOrder.id });
          const approvalUrl = paypalOrder.links?.find((l: any) => l.rel === "approve")?.href;
          return { orderNumber, paypalOrderId: paypalOrder.id, approvalUrl, total: total.toFixed(2) };
        } else {
          // Free order — auto-confirm and increment sold count
          await incrementTimeslotSold(input.timeslotId, totalGuests);
          return { orderNumber, paypalOrderId: null, approvalUrl: null, total: "0.00" };
        }
      }),
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
