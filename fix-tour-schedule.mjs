import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { events, eventTimeslots } from "./drizzle/schema.js";
import { eq, gte } from "drizzle-orm";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("No DATABASE_URL"); process.exit(1); }

  const pool = mysql.createPool(url);
  const db = drizzle(pool);

  // 1. Find the house tour event
  const [tourEvent] = await db.select().from(events).where(eq(events.slug, "dinsmore-house-tour")).limit(1);
  if (!tourEvent) { console.error("Tour event not found"); process.exit(1); }
  console.log("Found tour event:", tourEvent.id, tourEvent.title);

  // 2. Update event defaultCapacity to 20 just in case
  await db.update(events).set({ defaultCapacity: 20 }).where(eq(events.id, tourEvent.id));

  // 3. Delete ALL existing timeslots for this event (start fresh)
  const deleted = await db.delete(eventTimeslots).where(eq(eventTimeslots.eventId, tourEvent.id));
  console.log("Deleted all existing timeslots");

  // 4. Generate correct slots:
  //    Days: Friday (5), Saturday (6), Sunday (0) — JS getDay() values
  //    Times: 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM
  //    Range: today (Apr 8, 2026) through Dec 14, 2026
  const tourTimes = [
    { start: "1:00 PM", end: "2:00 PM" },
    { start: "2:00 PM", end: "3:00 PM" },
    { start: "3:00 PM", end: "4:00 PM" },
    { start: "4:00 PM", end: "5:00 PM" },
  ];

  // Valid JS getDay() values: 0=Sunday, 5=Friday, 6=Saturday
  const validDays = new Set([0, 5, 6]);

  const startDate = new Date("2026-04-08"); // today
  const endDate = new Date("2026-12-14");

  const slots = [];
  const d = new Date(startDate);

  while (d <= endDate) {
    const dow = d.getDay();
    if (validDays.has(dow)) {
      for (const t of tourTimes) {
        slots.push({
          eventId: tourEvent.id,
          slotDate: new Date(d),
          startTime: t.start,
          endTime: t.end,
          capacity: 20,
          ticketsSold: 0,
          price: "10.00",
          active: true,
        });
      }
    }
    d.setDate(d.getDate() + 1);
  }

  console.log(`Generating ${slots.length} slots from ${startDate.toDateString()} to ${endDate.toDateString()}`);

  // Verify the days are correct by sampling first 12 slots
  console.log("\nFirst 12 slots (should be Fri/Sat/Sun only):");
  slots.slice(0, 12).forEach(s => {
    const dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][s.slotDate.getDay()];
    console.log(`  ${s.slotDate.toISOString().slice(0,10)} (${dayName}) ${s.startTime}`);
  });

  // 5. Bulk insert in batches of 200
  for (let i = 0; i < slots.length; i += 200) {
    const batch = slots.slice(i, i + 200);
    await db.insert(eventTimeslots).values(batch);
    process.stdout.write(`  Inserted batch ${Math.floor(i/200) + 1} (${batch.length} slots)\r`);
  }

  console.log(`\nDone! ${slots.length} tour slots created.`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
