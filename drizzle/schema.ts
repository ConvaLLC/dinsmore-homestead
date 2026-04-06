import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "educator"]).default("user").notNull(),
  // Education portal access
  educationVerified: boolean("educationVerified").default(false).notNull(),
  educationVerifiedAt: timestamp("educationVerifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Email Verification ───────────────────────────────────────────────────────

export const emailVerifications = mysqlTable("email_verifications", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  code: varchar("code", { length: 8 }).notNull(),
  purpose: mysqlEnum("purpose", ["education_access", "registration"]).notNull(),
  used: boolean("used").default(false).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;

// ─── Hero Slider ──────────────────────────────────────────────────────────────

export const heroSlides = mysqlTable("hero_slides", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("imageUrl").notNull(),
  linkUrl: varchar("linkUrl", { length: 500 }),
  linkText: varchar("linkText", { length: 100 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeroSlide = typeof heroSlides.$inferSelect;
export type InsertHeroSlide = typeof heroSlides.$inferInsert;

// ─── Events ───────────────────────────────────────────────────────────────────

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  imageUrl: text("imageUrl"),
  eventType: mysqlEnum("eventType", ["tour", "special_event", "fundraiser", "program", "private"]).default("special_event").notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).default("0.00").notNull(),
  // Date range for recurring or multi-day events
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  // Whether this event uses timeslots or is open-ended
  usesTimeslots: boolean("usesTimeslots").default(true).notNull(),
  // Default capacity if no per-slot limits
  defaultCapacity: int("defaultCapacity").default(20).notNull(),
  active: boolean("active").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── Event Timeslots ──────────────────────────────────────────────────────────

export const eventTimeslots = mysqlTable("event_timeslots", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
  slotDate: timestamp("slotDate").notNull(),
  startTime: varchar("startTime", { length: 8 }).notNull(), // "10:00 AM"
  endTime: varchar("endTime", { length: 8 }),               // "11:30 AM"
  capacity: int("capacity").notNull(),
  ticketsSold: int("ticketsSold").default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }), // Override event base price if set
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventTimeslot = typeof eventTimeslots.$inferSelect;
export type InsertEventTimeslot = typeof eventTimeslots.$inferInsert;

// ─── Ticket Orders ────────────────────────────────────────────────────────────

export const ticketOrders = mysqlTable("ticket_orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  eventId: int("eventId").notNull().references(() => events.id),
  timeslotId: int("timeslotId").references(() => eventTimeslots.id),
  // Purchaser info
  buyerName: varchar("buyerName", { length: 255 }).notNull(),
  buyerEmail: varchar("buyerEmail", { length: 320 }).notNull(),
  buyerPhone: varchar("buyerPhone", { length: 20 }),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  // PayPal
  paypalOrderId: varchar("paypalOrderId", { length: 100 }),
  paypalCaptureId: varchar("paypalCaptureId", { length: 100 }),
  status: mysqlEnum("status", ["pending", "paid", "cancelled", "refunded"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TicketOrder = typeof ticketOrders.$inferSelect;
export type InsertTicketOrder = typeof ticketOrders.$inferInsert;

// ─── Donations ────────────────────────────────────────────────────────────────

export const donations = mysqlTable("donations", {
  id: int("id").autoincrement().primaryKey(),
  donorName: varchar("donorName", { length: 255 }).notNull(),
  donorEmail: varchar("donorEmail", { length: 320 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  donationType: mysqlEnum("donationType", ["one_time", "recurring"]).default("one_time").notNull(),
  frequency: mysqlEnum("frequency", ["monthly", "quarterly", "annually"]),
  dedicationName: varchar("dedicationName", { length: 255 }), // In memory/honor of
  message: text("message"),
  // PayPal
  paypalOrderId: varchar("paypalOrderId", { length: 100 }),
  paypalCaptureId: varchar("paypalCaptureId", { length: 100 }),
  paypalSubscriptionId: varchar("paypalSubscriptionId", { length: 100 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "cancelled"]).default("pending").notNull(),
  anonymous: boolean("anonymous").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

// ─── Memberships ─────────────────────────────────────────────────────────────

export const memberships = mysqlTable("memberships", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").references(() => ticketOrders.id),
  memberName: varchar("memberName", { length: 255 }).notNull(),
  memberEmail: varchar("memberEmail", { length: 320 }).notNull(),
  tier: mysqlEnum("tier", ["senior", "individual", "family", "friends"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  startsAt: timestamp("startsAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;

// ─── Education Content ────────────────────────────────────────────────────────

export const educationContent = mysqlTable("education_content", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: mysqlEnum("category", ["lesson_plan", "research", "resource", "newsletter", "program"]).notNull(),
  gradeLevel: varchar("gradeLevel", { length: 100 }), // e.g. "3-5", "6-8", "K-12"
  subject: varchar("subject", { length: 100 }),
  content: text("content").notNull(),
  fileUrl: text("fileUrl"), // PDF or downloadable resource
  thumbnailUrl: text("thumbnailUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationContent = typeof educationContent.$inferSelect;
export type InsertEducationContent = typeof educationContent.$inferInsert;

// ─── Education Access Requests ────────────────────────────────────────────────

export const educationAccessRequests = mysqlTable("education_access_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  organization: varchar("organization", { length: 255 }),
  role: varchar("role", { length: 100 }), // teacher, researcher, etc.
  reason: text("reason"),
  verificationCode: varchar("verificationCode", { length: 8 }),
  codeExpiresAt: timestamp("codeExpiresAt"),
  verified: boolean("verified").default(false).notNull(),
  verifiedAt: timestamp("verifiedAt"),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EducationAccessRequest = typeof educationAccessRequests.$inferSelect;
export type InsertEducationAccessRequest = typeof educationAccessRequests.$inferInsert;
