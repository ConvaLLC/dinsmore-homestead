import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Clock, Users, Ticket, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  midnight:  "oklch(21.8% 0.036 251.3)",
  deepNavy:  "oklch(30.2% 0.056 255.4)",
  richNavy:  "oklch(34.6% 0.074 256.1)",
  cobalt:    "oklch(47.2% 0.088 247.4)",
  gold:      "oklch(74.2% 0.118 90.2)",
  goldBright:"oklch(76.7% 0.139 91.1)",
  cream:     "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
  nearWhite: "oklch(97.4% 0.014 88.7)",
  available: "oklch(55% 0.14 145)",   // green
  limited:   "oklch(68% 0.15 65)",    // amber
  soldOut:   "oklch(52% 0.18 22)",    // red
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface SlotInfo {
  eventId: number;
  eventTitle: string;
  eventSlug: string;
  slotId: number;
  startTime: string;
  endTime: string | null;
  capacity: number;
  ticketsSold: number;
  price: string | null;
}

interface DayData {
  date: string;
  totalSlots: number;
  availableSlots: number;
  soldOut: boolean;
  events: SlotInfo[];
}

function getDayStatus(day: DayData | undefined): "available" | "limited" | "soldOut" | "none" {
  if (!day || day.totalSlots === 0) return "none";
  if (day.soldOut) return "soldOut";
  const ratio = day.availableSlots / day.totalSlots;
  if (ratio <= 0.3) return "limited";
  return "available";
}

function StatusDot({ status }: { status: ReturnType<typeof getDayStatus> }) {
  if (status === "none") return null;
  const color = status === "available" ? C.available : status === "limited" ? C.limited : C.soldOut;
  return (
    <span
      style={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: color,
        marginTop: "2px",
      }}
    />
  );
}

interface AvailabilityCalendarProps {
  /** If provided, only show slots for this event ID */
  eventId?: number;
  /** Called when user clicks "Book" on a slot */
  onBook?: (slotId: number, eventId: number) => void;
}

export default function AvailabilityCalendar({ eventId, onBook }: AvailabilityCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: availability = [], isLoading } = trpc.availability.forMonth.useQuery(
    { year, month },
    { staleTime: 60_000 }
  );

  // Build a lookup map: "YYYY-MM-DD" → DayData
  const dayMap = useMemo(() => {
    const m = new Map<string, DayData>();
    for (const d of availability) {
      // Filter by eventId if provided
      if (eventId !== undefined) {
        const filtered = d.events.filter(e => e.eventId === eventId);
        if (filtered.length > 0) {
          m.set(d.date, {
            ...d,
            events: filtered,
            totalSlots: filtered.length,
            availableSlots: filtered.filter(e => e.capacity - e.ticketsSold > 0).length,
            soldOut: filtered.every(e => e.capacity - e.ticketsSold <= 0),
          });
        }
      } else {
        m.set(d.date, d);
      }
    }
    return m;
  }, [availability, eventId]);

  // Calendar grid: first day of month, total days
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  }

  const selectedDay = selectedDate ? dayMap.get(selectedDate) : null;

  return (
    <div style={{ fontFamily: "'EB Garamond', serif" }}>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: C.midnight, borderBottom: `1px solid ${C.gold}33` }}
      >
        <button
          onClick={prevMonth}
          style={{ color: C.cream, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h3
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            color: C.nearWhite,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <button
          onClick={nextMonth}
          style={{ color: C.cream, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Day-of-week labels ── */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          background: C.deepNavy,
          borderBottom: `1px solid ${C.gold}22`,
        }}
      >
        {DAY_LABELS.map(d => (
          <div
            key={d}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: C.cream,
              textAlign: "center",
              padding: "0.4rem 0",
              textTransform: "uppercase",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(7, 1fr)",
          background: C.richNavy,
          gap: "1px",
          backgroundColor: `${C.gold}18`,
          opacity: isLoading ? 0.6 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} style={{ background: C.midnight, minHeight: "56px" }} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayData = dayMap.get(dateStr);
          const status = getDayStatus(dayData);
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;

          let bg = C.midnight;
          if (isSelected) bg = `${C.gold}22`;
          else if (isToday) bg = `${C.richNavy}`;

          return (
            <button
              key={dateStr}
              onClick={() => !isPast && dayData && setSelectedDate(isSelected ? null : dateStr)}
              disabled={isPast || !dayData}
              style={{
                background: bg,
                border: isSelected ? `1px solid ${C.gold}` : isToday ? `1px solid ${C.gold}44` : "none",
                minHeight: "56px",
                cursor: isPast || !dayData ? "default" : "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "6px 4px 4px",
                gap: "3px",
                opacity: isPast ? 0.35 : 1,
                transition: "background 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => {
                if (!isPast && dayData && !isSelected) {
                  (e.currentTarget as HTMLElement).style.background = `${C.gold}15`;
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.background = isToday ? C.richNavy : C.midnight;
                }
              }}
              aria-label={`${dateStr}${dayData ? ` — ${dayData.availableSlots} of ${dayData.totalSlots} slots available` : ""}`}
            >
              <span
                style={{
                  fontFamily: isToday ? "'Cinzel', serif" : "'EB Garamond', serif",
                  fontSize: "0.85rem",
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? C.gold : C.cream,
                  lineHeight: 1,
                }}
              >
                {day}
              </span>
              <StatusDot status={status} />
              {dayData && (
                <span style={{ fontSize: "0.6rem", color: C.cream, opacity: 0.7, lineHeight: 1 }}>
                  {dayData.availableSlots > 0
                    ? `${dayData.availableSlots} open`
                    : "Full"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div
        className="flex items-center gap-4 flex-wrap px-4 py-2"
        style={{ background: C.deepNavy, borderTop: `1px solid ${C.gold}22` }}
      >
        {[
          { color: C.available, label: "Available" },
          { color: C.limited,   label: "Limited" },
          { color: C.soldOut,   label: "Sold Out" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block" }} />
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.78rem", color: C.cream }}>{label}</span>
          </div>
        ))}
        {isLoading && (
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.78rem", color: C.gold, marginLeft: "auto", fontStyle: "italic" }}>
            Loading…
          </span>
        )}
      </div>

      {/* ── Selected day slot panel ── */}
      {selectedDate && selectedDay && (
        <div
          style={{
            background: C.parchment,
            borderTop: `2px solid ${C.gold}`,
            padding: "1rem 1.25rem",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} style={{ color: C.richNavy }} />
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                color: C.midnight,
                margin: 0,
              }}
            >
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </h4>
          </div>

          <div className="space-y-2">
            {selectedDay.events.map(slot => {
              const avail = slot.capacity - slot.ticketsSold;
              const isFull = avail <= 0;
              const isLow = avail > 0 && avail <= 3;
              const price = slot.price ?? null;

              return (
                <div
                  key={slot.slotId}
                  className="flex items-center justify-between gap-3 flex-wrap"
                  style={{
                    background: isFull ? `${C.soldOut}10` : "white",
                    border: `1px solid ${isFull ? C.soldOut + "44" : C.cream}`,
                    padding: "0.6rem 0.875rem",
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.9rem",
                        color: C.midnight,
                        fontWeight: 600,
                      }}
                    >
                      {slot.eventTitle}
                    </span>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1" style={{ fontSize: "0.82rem", color: C.cobalt }}>
                        <Clock size={12} style={{ color: C.gold }} />
                        {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                      </span>
                      <span className="flex items-center gap-1" style={{ fontSize: "0.82rem", color: isFull ? C.soldOut : isLow ? C.limited : C.cobalt }}>
                        <Users size={12} />
                        {isFull ? "Sold out" : isLow ? `Only ${avail} left` : `${avail} available`}
                      </span>
                      {price && (
                        <span style={{ fontSize: "0.82rem", color: C.cobalt }}>
                          ${parseFloat(price).toFixed(2)} / ticket
                        </span>
                      )}
                    </div>
                  </div>

                  {!isFull && (
                    onBook ? (
                      <button
                        onClick={() => onBook(slot.slotId, slot.eventId)}
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: C.richNavy,
                          color: C.nearWhite,
                          border: "none",
                          padding: "0.4rem 0.875rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          flexShrink: 0,
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = C.cobalt)}
                        onMouseLeave={e => (e.currentTarget.style.background = C.richNavy)}
                      >
                        <Ticket size={11} />
                        Book
                      </button>
                    ) : (
                      <Link
                        href={`/events/${slot.eventSlug}?slot=${slot.slotId}&date=${selectedDate}`}
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          background: C.richNavy,
                          color: C.nearWhite,
                          padding: "0.4rem 0.875rem",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          flexShrink: 0,
                          transition: "background 0.2s",
                        }}
                      >
                        <Ticket size={11} />
                        Book
                      </Link>
                    )
                  )}
                  {isFull && (
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        color: C.soldOut,
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      Sold Out
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state when no events this month */}
      {!isLoading && availability.length === 0 && (
        <div
          style={{
            background: C.parchment,
            borderTop: `1px solid ${C.cream}`,
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <Calendar size={28} style={{ color: C.gold, margin: "0 auto 0.5rem" }} />
          <p style={{ color: C.cobalt, fontStyle: "italic", margin: 0 }}>
            No tours or events scheduled for {MONTH_NAMES[month - 1]} {year}.
          </p>
          <p style={{ color: C.cobalt, fontSize: "0.88rem", margin: "0.4rem 0 0" }}>
            Check back soon or browse other months.
          </p>
        </div>
      )}
    </div>
  );
}
