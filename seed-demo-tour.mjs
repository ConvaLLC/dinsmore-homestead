/**
 * seed-demo-tour.mjs
 * Creates a demo "Dinsmore House Tour" event with bulk time slots
 * covering the next 60 days (Wed–Sun, 10am–4pm, every 60 minutes).
 *
 * Usage: node seed-demo-tour.mjs
 * (Uses DATABASE_URL from environment — already set in the dev server process)
 */

import { drizzle } from "drizzle-orm/mysql2";
import { eq, and, gte } from "drizzle-orm";
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

if (!process.env.DATABASE_URL) {
  console.error("❌  DATABASE_URL not set.");
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL);

// ── Inline schema (avoids TS compilation) ─────────────────────────────────────
const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  imageUrl: text("imageUrl"),
  eventType: mysqlEnum("eventType", ["tour", "special_event", "fundraiser", "program", "private"]).default("special_event").notNull(),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).default("0.00").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  usesTimeslots: boolean("usesTimeslots").default(true).notNull(),
  defaultCapacity: int("defaultCapacity").default(20).notNull(),
  active: boolean("active").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const eventTimeslots = mysqlTable("event_timeslots", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => events.id, { onDelete: "cascade" }),
  slotDate: timestamp("slotDate").notNull(),
  startTime: varchar("startTime", { length: 8 }).notNull(),
  endTime: varchar("endTime", { length: 8 }),
  capacity: int("capacity").notNull(),
  ticketsSold: int("ticketsSold").default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const SLUG = "dinsmore-house-tour";

  // 1. Upsert the event
  let eventId;
  const existing = await db.select().from(events).where(eq(events.slug, SLUG)).limit(1);

  if (existing.length > 0) {
    eventId = existing[0].id;
    console.log(`ℹ️  Event already exists (id=${eventId}), reusing.`);
  } else {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const result = await db.insert(events).values({
      title: "Dinsmore House Tour",
      slug: SLUG,
      description:
        "A guided tour of the 1842 Dinsmore Homestead, one of Kentucky's most authentically preserved 19th-century historic sites. Walk through the original rooms, view period furnishings, and hear stories of the Dinsmore family who lived here for over 100 years.",
      shortDescription:
        "Guided tours of the 1842 farmhouse — explore original rooms and period furnishings.",
      eventType: "tour",
      basePrice: "10.00",
      startDate,
      usesTimeslots: true,
      defaultCapacity: 12,
      active: true,
      featured: true,
    });
    eventId = result[0].insertId;
    console.log(`✅  Created event "Dinsmore House Tour" (id=${eventId})`);
  }

  // 2. Generate slots: next 60 days, Wed(3)–Sun(0,6,5,4,3), skip Mon(1)+Tue(2)
  const SKIP_DAYS = [1, 2]; // Mon, Tue
  const START_MIN = 10 * 60; // 10:00 AM
  const END_MIN   = 16 * 60; // 4:00 PM (last slot starts at 4pm)
  const INTERVAL  = 60;      // 60 minutes between slot starts
  const DURATION  = 75;      // each tour is 75 minutes
  const CAPACITY  = 12;
  const PRICE     = "10.00";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 60);

  // Delete existing future slots for this event to avoid duplicates
  await db.delete(eventTimeslots).where(
    and(
      eq(eventTimeslots.eventId, eventId),
      gte(eventTimeslots.slotDate, today)
    )
  );
  console.log("🗑️   Cleared existing future slots.");

  const slots = [];
  const cursor = new Date(today);

  while (cursor <= endDate) {
    const dow = cursor.getDay();
    if (!SKIP_DAYS.includes(dow)) {
      let slotStart = START_MIN;
      while (slotStart <= END_MIN) {
        slots.push({
          eventId,
          slotDate: new Date(cursor),
          startTime: fmtTime(slotStart),
          endTime: fmtTime(slotStart + DURATION),
          capacity: CAPACITY,
          ticketsSold: 0,
          price: PRICE,
          active: true,
        });
        slotStart += INTERVAL;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (slots.length === 0) {
    console.error("❌  No slots generated.");
    process.exit(1);
  }

  // Insert in batches of 50
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < slots.length; i += BATCH) {
    await db.insert(eventTimeslots).values(slots.slice(i, i + BATCH));
    inserted += Math.min(BATCH, slots.length - i);
  }

  console.log(`✅  Inserted ${inserted} time slots.`);
  console.log("🎉  Done! The availability calendar should now show highlighted dates.");
  process.exit(0);
}

main().catch(err => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
