/**
 * Reseed Dinsmore Homestead tour slots with the correct schedule:
 * - Fri, Sat, Sun only
 * - 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM (last tour at 4 PM)
 * - Closed Dec 15 – Apr 1
 * - Max 10 per slot
 * - $10.00 base price (Adult)
 *
 * Run: node reseed-tours.mjs
 */

import { execSync } from "child_process";

// We'll use the project's DB connection via a tsx script
const script = `
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { events, eventTimeslots } from "./drizzle/schema";
import { eq, and } from "drizzle-orm";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error("No DATABASE_URL"); process.exit(1); }

  const pool = mysql.createPool(url);
  const db = drizzle(pool);

  // 1. Find or create the tour event
  let [tourEvent] = await db.select().from(events).where(eq(events.slug, "dinsmore-house-tour")).limit(1);

  if (tourEvent) {
    // Update to correct pricing
    await db.update(events).set({
      basePrice: "10.00",
      defaultCapacity: 10,
      description: \`<p>Step inside the 1842 Dinsmore Homestead for a guided tour of one of Kentucky's most authentic 19th-century historic sites. Tours last approximately one hour and cover the main house, grounds, and outbuildings.</p>
<p><strong>Tour Schedule:</strong> Friday, Saturday & Sunday, 1:00 PM – 5:00 PM (last tour at 4:00 PM). Tours begin on the hour.</p>
<p><strong>Admission:</strong></p>
<ul>
<li>Adults: $10.00</li>
<li>Children (ages 5–15): $3.00</li>
<li>Children under 5: Free</li>
<li>Dinsmore Members: Free</li>
</ul>
<p><strong>Closed:</strong> December 15 – April 1</p>\`,
      shortDescription: "Guided tours of the 1842 Dinsmore Homestead. Fri-Sun, 1-5 PM. Adults $10, Children $3, Under 5 & Members Free.",
    }).where(eq(events.id, tourEvent.id));
    console.log("Updated existing tour event:", tourEvent.id);
  } else {
    const [result] = await db.insert(events).values({
      title: "Dinsmore Farm House Tour",
      slug: "dinsmore-house-tour",
      description: "Guided tour of the 1842 Dinsmore Homestead.",
      shortDescription: "Guided tours Fri-Sun, 1-5 PM. Adults $10, Children $3.",
      eventType: "tour",
      basePrice: "10.00",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2026-12-14"),
      usesTimeslots: true,
      defaultCapacity: 10,
      active: true,
      featured: true,
    });
    tourEvent = { id: result.insertId } as any;
    console.log("Created new tour event:", tourEvent.id);
  }

  // 2. Delete all existing timeslots for this event
  await db.delete(eventTimeslots).where(eq(eventTimeslots.eventId, tourEvent.id));
  console.log("Cleared existing timeslots");

  // 3. Generate new slots: Fri(5), Sat(6), Sun(0), 1PM-4PM hourly
  //    Season: Apr 1 – Dec 14 each year
  //    We'll generate for 2025 season (Apr 1 - Dec 14) and 2026 season (Apr 1 - Dec 14)
  const tourTimes = [
    { start: "1:00 PM", end: "2:00 PM" },
    { start: "2:00 PM", end: "3:00 PM" },
    { start: "3:00 PM", end: "4:00 PM" },
    { start: "4:00 PM", end: "5:00 PM" },
  ];
  const validDays = new Set([5, 6, 0]); // Fri, Sat, Sun

  const slots = [];

  // Generate for current open season and next
  const seasons = [
    { start: new Date("2025-04-01"), end: new Date("2025-12-14") },
    { start: new Date("2026-04-01"), end: new Date("2026-12-14") },
  ];

  for (const season of seasons) {
    const d = new Date(season.start);
    while (d <= season.end) {
      if (validDays.has(d.getDay())) {
        for (const t of tourTimes) {
          slots.push({
            eventId: tourEvent.id,
            slotDate: new Date(d),
            startTime: t.start,
            endTime: t.end,
            capacity: 10,
            ticketsSold: 0,
            price: "10.00",
            active: true,
          });
        }
      }
      d.setDate(d.getDate() + 1);
    }
  }

  // Bulk insert in batches of 200
  console.log(\`Inserting \${slots.length} tour slots...\`);
  for (let i = 0; i < slots.length; i += 200) {
    const batch = slots.slice(i, i + 200);
    await db.insert(eventTimeslots).values(batch);
    console.log(\`  Inserted batch \${Math.floor(i/200) + 1} (\${batch.length} slots)\`);
  }

  console.log(\`Done! \${slots.length} tour slots created across \${seasons.length} seasons.\`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
`;

// Write the tsx script to a temp file and run it
import { writeFileSync } from "fs";
writeFileSync("/tmp/reseed-tours.ts", script);
execSync("cd /home/ubuntu/dinsmore-homestead && npx tsx /tmp/reseed-tours.ts", { stdio: "inherit" });
