import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Donation,
  EducationAccessRequest,
  EducationContent,
  EmailVerification,
  Event,
  EventTimeslot,
  HeroSlide,
  InsertDonation,
  InsertEducationAccessRequest,
  InsertEducationContent,
  InsertEmailVerification,
  InsertEvent,
  InsertEventTimeslot,
  InsertHeroSlide,
  InsertTicketOrder,
  InsertUser,
  TicketOrder,
  User,
  Membership,
  InsertMembership,
  donations,
  educationAccessRequests,
  educationContent,
  emailVerifications,
  eventTimeslots,
  events,
  heroSlides,
  memberships,
  ticketOrders,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

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

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value !== undefined) {
      values[field] = value ?? null;
      updateSet[field] = value ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function updateUserEducationAccess(userId: number, verified: boolean): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({
    educationVerified: verified,
    educationVerifiedAt: verified ? new Date() : null,
  }).where(eq(users.id, userId));
}

// ─── Email Verifications ──────────────────────────────────────────────────────

export async function createEmailVerification(data: InsertEmailVerification): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Invalidate old codes for this email+purpose
  await db.update(emailVerifications)
    .set({ used: true })
    .where(and(
      eq(emailVerifications.email, data.email),
      eq(emailVerifications.purpose, data.purpose),
      eq(emailVerifications.used, false)
    ));
  await db.insert(emailVerifications).values(data);
}

export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: "education_access" | "registration"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(emailVerifications).where(
    and(
      eq(emailVerifications.email, email),
      eq(emailVerifications.code, code),
      eq(emailVerifications.purpose, purpose),
      eq(emailVerifications.used, false),
      gte(emailVerifications.expiresAt, new Date())
    )
  ).limit(1);

  if (result.length === 0) return false;

  await db.update(emailVerifications)
    .set({ used: true })
    .where(eq(emailVerifications.id, result[0].id));
  return true;
}

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides)
    .where(eq(heroSlides.active, true))
    .orderBy(heroSlides.sortOrder);
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
}

export async function createHeroSlide(data: InsertHeroSlide): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(heroSlides).values(data);
}

export async function updateHeroSlide(id: number, data: Partial<InsertHeroSlide>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(heroSlides).set(data).where(eq(heroSlides.id, id));
}

export async function deleteHeroSlide(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getActiveEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events)
    .where(and(eq(events.active, true), gte(events.startDate, new Date(Date.now() - 86400000))))
    .orderBy(events.startDate);
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events)
    .where(and(eq(events.active, true), eq(events.featured, true), gte(events.startDate, new Date(Date.now() - 86400000))))
    .orderBy(events.startDate)
    .limit(6);
}

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(desc(events.startDate));
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result[0];
}

export async function getEventById(id: number): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
}

export async function createEvent(data: InsertEvent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(events).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateEvent(id: number, data: Partial<InsertEvent>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(events).where(eq(events.id, id));
}

// ─── Event Timeslots ──────────────────────────────────────────────────────────

export async function getTimeslotsForEvent(eventId: number): Promise<EventTimeslot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(eventTimeslots)
    .where(and(eq(eventTimeslots.eventId, eventId), eq(eventTimeslots.active, true)))
    .orderBy(eventTimeslots.slotDate);
}

// Return ALL slots (active + inactive) for admin view
export async function getAllTimeslotsForEvent(eventId: number): Promise<EventTimeslot[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(eventTimeslots)
    .where(eq(eventTimeslots.eventId, eventId))
    .orderBy(eventTimeslots.slotDate);
}

// Bulk-insert many timeslots at once
export async function bulkCreateTimeslots(slots: InsertEventTimeslot[]): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('DB unavailable');
  if (slots.length === 0) return 0;
  await db.insert(eventTimeslots).values(slots);
  return slots.length;
}

// Delete all slots for an event within a date range
export async function deleteTimeslotsInRange(
  eventId: number,
  fromDate: Date,
  toDate: Date
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(eventTimeslots).where(
    and(
      eq(eventTimeslots.eventId, eventId),
      gte(eventTimeslots.slotDate, fromDate),
      lte(eventTimeslots.slotDate, toDate)
    )
  );
}

export async function getTimeslotById(id: number): Promise<EventTimeslot | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(eventTimeslots).where(eq(eventTimeslots.id, id)).limit(1);
  return result[0];
}

export async function createTimeslot(data: InsertEventTimeslot): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(eventTimeslots).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateTimeslot(id: number, data: Partial<InsertEventTimeslot>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(eventTimeslots).set(data).where(eq(eventTimeslots.id, id));
}

export async function deleteTimeslot(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(eventTimeslots).where(eq(eventTimeslots.id, id));
}

export async function incrementTimeslotSold(timeslotId: number, qty: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(eventTimeslots)
    .set({ ticketsSold: sql`${eventTimeslots.ticketsSold} + ${qty}` })
    .where(eq(eventTimeslots.id, timeslotId));
}

// ─── Ticket Orders ────────────────────────────────────────────────────────────

export async function createTicketOrder(data: InsertTicketOrder): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(ticketOrders).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getTicketOrderByOrderNumber(orderNumber: string): Promise<TicketOrder | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ticketOrders).where(eq(ticketOrders.orderNumber, orderNumber)).limit(1);
  return result[0];
}

export async function updateTicketOrder(id: number, data: Partial<InsertTicketOrder>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(ticketOrders).set(data).where(eq(ticketOrders.id, id));
}

export async function getAllTicketOrders(): Promise<TicketOrder[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ticketOrders).orderBy(desc(ticketOrders.createdAt));
}

// ─── Donations ────────────────────────────────────────────────────────────────

export async function createDonation(data: InsertDonation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(donations).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getDonationByPaypalOrderId(paypalOrderId: string): Promise<Donation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(donations).where(eq(donations.paypalOrderId, paypalOrderId)).limit(1);
  return result[0];
}

export async function updateDonation(id: number, data: Partial<InsertDonation>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(donations).set(data).where(eq(donations.id, id));
}

export async function getAllDonations(): Promise<Donation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(donations).orderBy(desc(donations.createdAt));
}

// ─── Education Access Requests ────────────────────────────────────────────────

export async function createEducationAccessRequest(data: InsertEducationAccessRequest): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(educationAccessRequests).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getEducationAccessRequestByEmail(email: string): Promise<EducationAccessRequest | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(educationAccessRequests).where(eq(educationAccessRequests.email, email)).limit(1);
  return result[0];
}

export async function updateEducationAccessRequest(id: number, data: Partial<InsertEducationAccessRequest>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(educationAccessRequests).set(data).where(eq(educationAccessRequests.id, id));
}

export async function getAllEducationAccessRequests(): Promise<EducationAccessRequest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(educationAccessRequests).orderBy(desc(educationAccessRequests.createdAt));
}

// ─── Education Content ────────────────────────────────────────────────────────

export async function getActiveEducationContent(category?: string): Promise<EducationContent[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(educationContent.active, true)];
  if (category) conditions.push(eq(educationContent.category, category as any));
  return db.select().from(educationContent)
    .where(and(...conditions))
    .orderBy(educationContent.sortOrder);
}

export async function getAllEducationContent(): Promise<EducationContent[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(educationContent).orderBy(educationContent.sortOrder);
}

export async function getEducationContentBySlug(slug: string): Promise<EducationContent | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(educationContent).where(eq(educationContent.slug, slug)).limit(1);
  return result[0];
}

export async function createEducationContent(data: InsertEducationContent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(educationContent).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function updateEducationContent(id: number, data: Partial<InsertEducationContent>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(educationContent).set(data).where(eq(educationContent.id, id));
}

export async function deleteEducationContent(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(educationContent).where(eq(educationContent.id, id));
}

// ─── Availability Calendar ────────────────────────────────────────────────────

export interface DayAvailability {
  date: string;          // "YYYY-MM-DD"
  totalSlots: number;
  availableSlots: number;
  soldOut: boolean;
  events: { eventId: number; eventTitle: string; eventSlug: string; slotId: number; startTime: string; endTime: string | null; capacity: number; ticketsSold: number; price: string | null }[];
}

/**
 * Returns per-day availability for all active events within a calendar month.
 * `year` and `month` are 1-based (e.g. month=4 for April).
 */
export async function getAvailabilityForMonth(year: number, month: number): Promise<DayAvailability[]> {
  const db = await getDb();
  if (!db) return [];

  const firstDay = new Date(year, month - 1, 1, 0, 0, 0);
  const lastDay  = new Date(year, month, 0, 23, 59, 59);

  const rows = await db
    .select({
      slotId:       eventTimeslots.id,
      slotDate:     eventTimeslots.slotDate,
      startTime:    eventTimeslots.startTime,
      endTime:      eventTimeslots.endTime,
      capacity:     eventTimeslots.capacity,
      ticketsSold:  eventTimeslots.ticketsSold,
      price:        eventTimeslots.price,
      eventId:      events.id,
      eventTitle:   events.title,
      eventSlug:    events.slug,
    })
    .from(eventTimeslots)
    .innerJoin(events, eq(eventTimeslots.eventId, events.id))
    .where(
      and(
        eq(eventTimeslots.active, true),
        eq(events.active, true),
        gte(eventTimeslots.slotDate, firstDay),
        lte(eventTimeslots.slotDate, lastDay)
      )
    )
    .orderBy(eventTimeslots.slotDate);

  // Group by date string
  const byDate = new Map<string, DayAvailability>();

  for (const row of rows) {
    const d = row.slotDate instanceof Date ? row.slotDate : new Date(row.slotDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!byDate.has(key)) {
      byDate.set(key, { date: key, totalSlots: 0, availableSlots: 0, soldOut: false, events: [] });
    }
    const day = byDate.get(key)!;
    const avail = row.capacity - row.ticketsSold;
    day.totalSlots += 1;
    if (avail > 0) day.availableSlots += 1;
    day.events.push({
      eventId:     row.eventId,
      eventTitle:  row.eventTitle,
      eventSlug:   row.eventSlug,
      slotId:      row.slotId,
      startTime:   row.startTime,
      endTime:     row.endTime ?? null,
      capacity:    row.capacity,
      ticketsSold: row.ticketsSold,
      price:       row.price ?? null,
    });
  }

  // Mark sold-out days
  const days = Array.from(byDate.values());
  for (const day of days) {
    day.soldOut = day.totalSlots > 0 && day.availableSlots === 0;
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Memberships ─────────────────────────────────────────────────────────────

export async function createMembership(data: InsertMembership): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(memberships).values(data);
  return Number(result[0].insertId);
}

export async function getAllMemberships(): Promise<Membership[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(memberships).orderBy(desc(memberships.createdAt));
}

export async function getMembershipsByEmail(email: string): Promise<Membership[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(memberships).where(eq(memberships.memberEmail, email)).orderBy(desc(memberships.createdAt));
}
