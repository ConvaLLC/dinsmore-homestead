import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ChevronLeft, ChevronRight, Minus, Plus, Ticket, User, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  midnight:  "oklch(21.8% 0.036 251.3)",
  deepNavy:  "oklch(30.2% 0.056 255.4)",
  richNavy:  "oklch(34.6% 0.074 256.1)",
  cobalt:    "oklch(47.2% 0.088 247.4)",
  gold:      "oklch(74.2% 0.118 90.2)",
  goldBright:"oklch(76.7% 0.139 91.1)",
  cream:     "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
  warmWhite: "oklch(97.8% 0.008 89.6)",
  available: "oklch(55% 0.14 145)",
  limited:   "oklch(68% 0.15 65)",
  soldOut:   "oklch(52% 0.18 22)",
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["S","M","T","W","T","F","S"];

// ── Ticket type definitions ──────────────────────────────────────────────────
const TICKET_TYPES = [
  { key: "adult",  label: "Adult",                 price: 10.00, desc: "Ages 16+" },
  { key: "child",  label: "Child (5–15)",           price: 3.00,  desc: "Ages 5–15" },
  { key: "under5", label: "Under 5",               price: 0,     desc: "Free admission" },
  { key: "member", label: "Dinsmore Member",        price: 0,     desc: "Free admission" },
] as const;

type TicketKey = typeof TICKET_TYPES[number]["key"];

// ── Steps ────────────────────────────────────────────────────────────────────
type Step = "idle" | "date" | "time" | "tickets" | "info" | "confirm";

export default function TourBookingWidget() {
  const [step, setStep] = useState<Step>("idle");
  const [expanded, setExpanded] = useState(false);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1);

  // Selection state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Record<TicketKey, number>>({
    adult: 2, child: 0, under5: 0, member: 0,
  });
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  // Data queries
  const { data: availability, isLoading: calLoading } = trpc.availability.forMonth.useQuery(
    { year: calYear, month: calMonth },
    { enabled: expanded }
  );

  // Get timeslots for selected date
  const selectedDayData = useMemo(() => {
    if (!availability || !selectedDate) return null;
    return availability.find(d => d.date === selectedDate) ?? null;
  }, [availability, selectedDate]);

  const selectedSlot = useMemo(() => {
    if (!selectedDayData || !selectedSlotId) return null;
    return selectedDayData.events.find(s => s.slotId === selectedSlotId) ?? null;
  }, [selectedDayData, selectedSlotId]);

  const totalGuests = tickets.adult + tickets.child + tickets.under5 + tickets.member;
  const totalPrice = (tickets.adult * 10) + (tickets.child * 3);
  const slotsAvailable = selectedSlot ? selectedSlot.capacity - selectedSlot.ticketsSold : 0;

  const createTourOrder = trpc.tickets.createTourOrder.useMutation();

  // ── Calendar helpers ───────────────────────────────────────────────────────
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth - 1, 1).getDay();

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    if (availability) {
      for (const day of availability) {
        if (day.availableSlots > 0) set.add(day.date);
      }
    }
    return set;
  }, [availability]);

  const prevMonth = useCallback(() => {
    if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12); }
    else setCalMonth(m => m - 1);
  }, [calMonth]);

  const nextMonth = useCallback(() => {
    if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1); }
    else setCalMonth(m => m + 1);
  }, [calMonth]);

  // ── Ticket quantity helpers ────────────────────────────────────────────────
  const updateTicket = (key: TicketKey, delta: number) => {
    setTickets(prev => {
      const newVal = Math.max(0, Math.min(10, prev[key] + delta));
      const newTickets = { ...prev, [key]: newVal };
      const newTotal = newTickets.adult + newTickets.child + newTickets.under5 + newTickets.member;
      if (newTotal > slotsAvailable) return prev; // Don't exceed capacity
      return newTickets;
    });
  };

  // ── Start booking ──────────────────────────────────────────────────────────
  const handleStart = () => {
    setExpanded(true);
    setStep("date");
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlotId(null);
    setStep("time");
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlotId(slotId);
    setTickets({ adult: 2, child: 0, under5: 0, member: 0 });
    setStep("tickets");
  };

  const handleTicketsConfirm = () => {
    if (totalGuests < 1) {
      toast.error("Please select at least one ticket");
      return;
    }
    setStep("info");
  };

  const handleSubmit = async () => {
    if (!buyerName.trim()) { toast.error("Please enter your name"); return; }
    if (!buyerEmail.trim() || !buyerEmail.includes("@")) { toast.error("Please enter a valid email"); return; }
    if (!selectedSlotId) return;

    setIsSubmitting(true);
    try {
      const result = await createTourOrder.mutateAsync({
        timeslotId: selectedSlotId,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim() || undefined,
        tickets,
        origin: window.location.origin,
      });

      // Store confirmation number
      setConfirmationId(result.orderNumber || `DH-${Date.now().toString(36).toUpperCase()}`);

      // Payment is processed server-side (sandbox mock or Square) — show inline confirmation
      setStep("confirm");
      setIsSubmitting(false);
      toast.success(totalPrice > 0 ? "Payment processed — tour booked!" : "Tour booked successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === "time") { setStep("date"); setSelectedSlotId(null); }
    else if (step === "tickets") setStep("time");
    else if (step === "info") setStep("tickets");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.midnight, overflow: "hidden" }}>
      {/* CTA Header — always visible */}
      <div
        style={{
          padding: expanded ? "2rem 1.5rem 1rem" : "3rem 1.5rem",
          textAlign: "center",
          cursor: expanded ? "default" : "pointer",
          transition: "padding 0.3s ease",
        }}
        onClick={!expanded ? handleStart : undefined}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            letterSpacing: "0.35em",
            color: C.gold,
            marginBottom: "0.75rem",
            textTransform: "uppercase",
          }}
        >
          ✦ Book Your Tour ✦
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: expanded ? "clamp(1.4rem, 2.5vw, 1.8rem)" : "clamp(1.8rem, 3vw, 2.6rem)",
            color: C.warmWhite,
            lineHeight: 1.2,
            marginBottom: "0.75rem",
            transition: "font-size 0.3s ease",
          }}
        >
          View Tour Openings &{" "}
          <span style={{ color: C.gold }}>Book Yours Today</span>
        </h2>
        {!expanded && (
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.05rem",
              color: C.cream,
              lineHeight: 1.6,
              maxWidth: "550px",
              margin: "0 auto 1.5rem",
            }}
          >
            Tours run Friday, Saturday &amp; Sunday, 1:00 PM – 5:00 PM.
            Adults $10 · Children (5–15) $3 · Under 5 &amp; Members Free.
          </p>
        )}
        {!expanded && (
          <button
            onClick={handleStart}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: C.gold,
              color: C.midnight,
              border: "none",
              padding: "0.85rem 2.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 700,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.goldBright; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = "none"; }}
          >
            <Calendar size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.5rem" }} />
            Book a Tour Now
          </button>
        )}
      </div>

      {/* Expanding booking area */}
      <div
        style={{
          maxHeight: expanded ? "1200px" : "0",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        {/* Step indicator */}
        {expanded && step !== "idle" && step !== "confirm" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0 1.5rem 1rem",
            }}
          >
            {(["date", "time", "tickets", "info"] as Step[]).map((s, i) => {
              const labels = ["Date", "Time", "Tickets", "Info"];
              const stepOrder = ["date", "time", "tickets", "info"];
              const currentIdx = stepOrder.indexOf(step);
              const isActive = step === s;
              const isDone = stepOrder.indexOf(s) < currentIdx;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                      background: isActive ? C.gold : isDone ? C.cobalt : `${C.cream}22`,
                      color: isActive ? C.midnight : isDone ? C.warmWhite : `${C.cream}66`,
                      transition: "all 0.2s",
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: isActive ? C.gold : isDone ? C.cream : `${C.cream}55`,
                    }}
                  >
                    {labels[i]}
                  </span>
                  {i < 3 && (
                    <div style={{ width: "20px", height: "1px", background: isDone ? C.cobalt : `${C.cream}22`, margin: "0 0.25rem" }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back button */}
        {expanded && step !== "date" && step !== "idle" && step !== "confirm" && (
          <div style={{ padding: "0 1.5rem 0.5rem" }}>
            <button
              onClick={handleBack}
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.85rem",
                color: C.cream,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.25rem 0",
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>
          </div>
        )}

        <div style={{ padding: "0 1.5rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
          {/* ── STEP 1: Calendar ── */}
          {step === "date" && (
            <div>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cream, textAlign: "center", marginBottom: "1rem" }}>
                Select a date to see available tour times
              </p>

              {/* Month nav */}
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", padding: "0.4rem" }}>
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.warmWhite, fontWeight: 600 }}>
                  {MONTH_NAMES[calMonth - 1]} {calYear}
                </span>
                <button onClick={nextMonth} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", padding: "0.4rem" }}>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
                {DAY_LABELS.map((d, i) => (
                  <div key={i} style={{ textAlign: "center", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", color: `${C.cream}77`, letterSpacing: "0.05em", padding: "0.3rem 0" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isAvailable = availableDates.has(dateStr);
                  const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                  const isPast = new Date(dateStr) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={day}
                      onClick={isAvailable && !isPast ? () => handleDateSelect(dateStr) : undefined}
                      disabled={!isAvailable || isPast}
                      style={{
                        aspectRatio: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: isSelected ? `2px solid ${C.gold}` : isToday ? `1px solid ${C.gold}55` : "1px solid transparent",
                        background: isSelected ? `${C.gold}22` : isAvailable && !isPast ? `${C.available}15` : "transparent",
                        color: isPast ? `${C.cream}33` : isAvailable ? C.warmWhite : `${C.cream}44`,
                        cursor: isAvailable && !isPast ? "pointer" : "default",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "0.9rem",
                        fontWeight: isAvailable ? 600 : 400,
                        transition: "all 0.15s",
                        position: "relative",
                      }}
                    >
                      {day}
                      {isAvailable && !isPast && (
                        <span style={{
                          width: "4px", height: "4px", borderRadius: "50%",
                          background: C.available, marginTop: "2px",
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {calLoading && (
                <div style={{ textAlign: "center", padding: "1rem", color: C.gold, fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}>
                  Loading availability…
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.available, display: "inline-block" }} />
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.78rem", color: C.cream }}>Tours Available</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Time Selection ── */}
          {step === "time" && selectedDate && selectedDayData && (
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.warmWhite, textAlign: "center", marginBottom: "0.5rem" }}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cream, textAlign: "center", marginBottom: "1.25rem" }}>
                Choose your tour time
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                {selectedDayData.events.map(slot => {
                  const avail = slot.capacity - slot.ticketsSold;
                  const isFull = avail <= 0;
                  const isSelected = selectedSlotId === slot.slotId;

                  return (
                    <button
                      key={slot.slotId}
                      onClick={!isFull ? () => handleSlotSelect(slot.slotId) : undefined}
                      disabled={isFull}
                      style={{
                        padding: "1rem",
                        border: isSelected ? `2px solid ${C.gold}` : `1px solid ${isFull ? `${C.cream}22` : `${C.cream}33`}`,
                        background: isSelected ? `${C.gold}18` : isFull ? `${C.soldOut}10` : `${C.warmWhite}08`,
                        cursor: isFull ? "not-allowed" : "pointer",
                        textAlign: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: isFull ? `${C.cream}44` : C.warmWhite }}>
                        {slot.startTime}
                      </div>
                      {slot.endTime && (
                        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: `${C.cream}77`, marginTop: "0.15rem" }}>
                          to {slot.endTime}
                        </div>
                      )}
                      <div style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.78rem",
                        marginTop: "0.4rem",
                        color: isFull ? C.soldOut : avail <= 3 ? C.limited : C.available,
                        fontWeight: isFull ? 600 : 400,
                      }}>
                        {isFull ? "Sold Out" : `${avail} spots available`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: Ticket Types ── */}
          {step === "tickets" && selectedSlot && (
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.warmWhite, textAlign: "center", marginBottom: "0.25rem" }}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} at {selectedSlot.startTime}
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cream, textAlign: "center", marginBottom: "1.25rem" }}>
                {slotsAvailable} spots available — select your tickets
              </p>

              <div className="space-y-3">
                {TICKET_TYPES.map(tt => (
                  <div
                    key={tt.key}
                    className="flex items-center justify-between"
                    style={{
                      background: `${C.warmWhite}08`,
                      border: `1px solid ${C.cream}22`,
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: C.warmWhite, fontWeight: 600 }}>
                        {tt.label}
                      </div>
                      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: `${C.cream}88` }}>
                        {tt.price > 0 ? `$${tt.price.toFixed(2)}` : "Free"} · {tt.desc}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTicket(tt.key, -1)}
                        disabled={tickets[tt.key] <= 0}
                        style={{
                          width: "28px", height: "28px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${C.cream}33`,
                          background: "transparent",
                          color: tickets[tt.key] <= 0 ? `${C.cream}33` : C.cream,
                          cursor: tickets[tt.key] <= 0 ? "not-allowed" : "pointer",
                          borderRadius: "2px",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: C.warmWhite,
                        minWidth: "24px",
                        textAlign: "center",
                      }}>
                        {tickets[tt.key]}
                      </span>
                      <button
                        onClick={() => updateTicket(tt.key, 1)}
                        disabled={totalGuests >= slotsAvailable}
                        style={{
                          width: "28px", height: "28px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${C.cream}33`,
                          background: "transparent",
                          color: totalGuests >= slotsAvailable ? `${C.cream}33` : C.cream,
                          cursor: totalGuests >= slotsAvailable ? "not-allowed" : "pointer",
                          borderRadius: "2px",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ marginTop: "1.25rem", borderTop: `1px solid ${C.gold}44`, paddingTop: "1rem" }}>
                <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cream, marginBottom: "0.3rem" }}>
                  <span>Total Guests</span>
                  <span style={{ fontWeight: 600 }}>{totalGuests}</span>
                </div>
                <div className="flex justify-between" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: C.gold, fontWeight: 700 }}>
                  <span>Total</span>
                  <span>{totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "Free"}</span>
                </div>
              </div>

              <button
                onClick={handleTicketsConfirm}
                disabled={totalGuests < 1}
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: totalGuests < 1 ? `${C.cream}33` : C.gold,
                  color: totalGuests < 1 ? `${C.cream}66` : C.midnight,
                  border: "none",
                  padding: "0.85rem",
                  cursor: totalGuests < 1 ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                Continue to Checkout
              </button>
            </div>
          )}

          {/* ── STEP 4: Contact Info ── */}
          {step === "info" && selectedSlot && (
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.warmWhite, textAlign: "center", marginBottom: "1rem" }}>
                Almost there! Enter your details
              </p>

              <div className="space-y-3">
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cream, display: "block", marginBottom: "0.35rem" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={e => setBuyerName(e.target.value)}
                    placeholder="John Smith"
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "1rem",
                      background: `${C.warmWhite}0a`,
                      border: `1px solid ${C.cream}33`,
                      color: C.warmWhite,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cream, display: "block", marginBottom: "0.35rem" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={e => setBuyerEmail(e.target.value)}
                    placeholder="john@example.com"
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "1rem",
                      background: `${C.warmWhite}0a`,
                      border: `1px solid ${C.cream}33`,
                      color: C.warmWhite,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cream, display: "block", marginBottom: "0.35rem" }}>
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={e => setBuyerPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.85rem",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "1rem",
                      background: `${C.warmWhite}0a`,
                      border: `1px solid ${C.cream}33`,
                      color: C.warmWhite,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Order summary */}
              <div style={{ marginTop: "1.5rem", background: `${C.warmWhite}08`, border: `1px solid ${C.gold}33`, padding: "1rem" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.gold, marginBottom: "0.6rem" }}>
                  Order Summary
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cream, lineHeight: 1.8 }}>
                  <div>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                  <div>{selectedSlot.startTime}{selectedSlot.endTime ? ` – ${selectedSlot.endTime}` : ""}</div>
                  {tickets.adult > 0 && <div>Adult × {tickets.adult} — ${(tickets.adult * 10).toFixed(2)}</div>}
                  {tickets.child > 0 && <div>Child (5–15) × {tickets.child} — ${(tickets.child * 3).toFixed(2)}</div>}
                  {tickets.under5 > 0 && <div>Under 5 × {tickets.under5} — Free</div>}
                  {tickets.member > 0 && <div>Member × {tickets.member} — Free</div>}
                </div>
                <div className="flex justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${C.gold}33` }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.gold, fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.gold, fontWeight: 700 }}>
                    {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "Free"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: isSubmitting ? `${C.cream}33` : C.gold,
                  color: isSubmitting ? `${C.cream}66` : C.midnight,
                  border: "none",
                  padding: "0.85rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Processing…</>
                ) : totalPrice > 0 ? (
                  <><Ticket size={14} /> Complete Purchase — ${totalPrice.toFixed(2)}</>
                ) : (
                  <><Ticket size={14} /> Confirm Free Booking</>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 5: Confirmation ── */}
          {step === "confirm" && (
            <div style={{ padding: "1rem 0" }}>
              {/* Success header */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    width: "56px", height: "56px",
                    borderRadius: "50%",
                    background: C.available,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "1.5rem", color: C.warmWhite,
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.gold, marginBottom: "0.5rem" }}>
                  You're Booked!
                </h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cream, lineHeight: 1.5 }}>
                  A confirmation email has been sent to <strong style={{ color: C.warmWhite }}>{buyerEmail}</strong>
                </p>
              </div>

              {/* Confirmation card */}
              <div style={{ background: `${C.warmWhite}08`, border: `1px solid ${C.gold}44`, padding: "1.25rem" }}>
                {/* Confirmation number */}
                <div style={{ textAlign: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px dashed ${C.gold}33` }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: `${C.cream}88`, marginBottom: "0.3rem" }}>
                    Confirmation Number
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.gold, letterSpacing: "0.05em" }}>
                    {confirmationId}
                  </div>
                </div>

                {/* Tour details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${C.cream}77`, marginBottom: "0.2rem" }}>Date</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.warmWhite }}>
                      {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : ""}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${C.cream}77`, marginBottom: "0.2rem" }}>Time</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.warmWhite }}>
                      {selectedSlot?.startTime}{selectedSlot?.endTime ? ` – ${selectedSlot.endTime}` : ""}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${C.cream}77`, marginBottom: "0.2rem" }}>Guest</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.warmWhite }}>{buyerName}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${C.cream}77`, marginBottom: "0.2rem" }}>Guests</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.warmWhite }}>{totalGuests}</div>
                  </div>
                </div>

                {/* Ticket breakdown */}
                <div style={{ borderTop: `1px solid ${C.gold}22`, paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                  {tickets.adult > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cream, marginBottom: "0.25rem" }}>
                      <span>Adult × {tickets.adult}</span><span>${(tickets.adult * 10).toFixed(2)}</span>
                    </div>
                  )}
                  {tickets.child > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cream, marginBottom: "0.25rem" }}>
                      <span>Child (5–15) × {tickets.child}</span><span>${(tickets.child * 3).toFixed(2)}</span>
                    </div>
                  )}
                  {tickets.under5 > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cream, marginBottom: "0.25rem" }}>
                      <span>Under 5 × {tickets.under5}</span><span>Free</span>
                    </div>
                  )}
                  {tickets.member > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cream, marginBottom: "0.25rem" }}>
                      <span>Member × {tickets.member}</span><span>Free</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ borderTop: `1px solid ${C.gold}33`, paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.gold, fontWeight: 700 }}>Total Paid</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.gold, fontWeight: 700 }}>
                      {totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Practical info */}
              <div style={{ marginTop: "1.25rem", background: `${C.warmWhite}06`, border: `1px solid ${C.cream}15`, padding: "1rem" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginBottom: "0.75rem" }}>
                  Before You Visit
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cream, lineHeight: 1.7 }}>
                  <div style={{ marginBottom: "0.4rem" }}>📍 5656 Burlington Pike, Burlington, KY 41005</div>
                  <div style={{ marginBottom: "0.4rem" }}>👟 Wear comfortable walking shoes — the tour includes gravel paths</div>
                  <div style={{ marginBottom: "0.4rem" }}>📷 Photography is welcome inside the homestead</div>
                  <div>🕐 Please arrive 10 minutes before your tour time</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3" style={{ marginTop: "1.25rem" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: "transparent",
                    color: C.cream,
                    border: `1px solid ${C.cream}44`,
                    padding: "0.65rem",
                    cursor: "pointer",
                  }}
                >
                  Print Confirmation
                </button>
                <button
                  onClick={() => { setExpanded(false); setStep("idle"); setSelectedDate(null); setSelectedSlotId(null); setConfirmationId(null); setBuyerName(""); setBuyerEmail(""); setBuyerPhone(""); setTickets({ adult: 2, child: 0, under5: 0, member: 0 }); }}
                  style={{
                    flex: 1,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    background: C.gold,
                    color: C.midnight,
                    border: "none",
                    padding: "0.65rem",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
