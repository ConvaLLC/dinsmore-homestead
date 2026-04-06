import { useState, useMemo, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ChevronLeft, ChevronRight, Minus, Plus, Ticket, User, Users, Loader2, Heart, Award } from "lucide-react";
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

// ── Membership tiers ─────────────────────────────────────────────────────────
const MEMBERSHIP_TIERS = [
  { key: "senior",     label: "Senior",     price: 20,  desc: "65 and older" },
  { key: "individual", label: "Individual", price: 35,  desc: "Single membership" },
  { key: "family",     label: "Family",     price: 60,  desc: "Household membership" },
  { key: "friends",    label: "Friends",    price: 100, desc: "Premium supporter" },
] as const;

type MembershipKey = typeof MEMBERSHIP_TIERS[number]["key"] | null;

const MEMBERSHIP_PERKS = [
  "Free admission for tours of the historic Dinsmore Home",
  "10% discount on all gift shop items (excl. consignments)",
  "Subscription to the Dinsmore Dispatch newsletter",
  "2 Guest passes per year",
];

// ── Quick donation presets ───────────────────────────────────────────────────
const DONATION_PRESETS = [5, 10, 25, 50];

// ── Steps ────────────────────────────────────────────────────────────────────
type Step = "idle" | "date" | "time" | "tickets" | "extras" | "info" | "confirm";

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

  // Extras state
  const [selectedMembership, setSelectedMembership] = useState<MembershipKey>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customDonation, setCustomDonation] = useState("");

  // Contact info
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
  const ticketTotal = (tickets.adult * 10) + (tickets.child * 3);
  const membershipTotal = selectedMembership
    ? (MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)?.price ?? 0)
    : 0;
  const grandTotal = ticketTotal + membershipTotal + donationAmount;
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
      if (newTotal > slotsAvailable) return prev;
      return newTickets;
    });
  };

  // ── Donation helpers ───────────────────────────────────────────────────────
  const handleDonationPreset = (amount: number) => {
    if (donationAmount === amount) {
      setDonationAmount(0);
      setCustomDonation("");
    } else {
      setDonationAmount(amount);
      setCustomDonation("");
    }
  };

  const handleCustomDonation = (val: string) => {
    setCustomDonation(val);
    const num = parseFloat(val);
    setDonationAmount(isNaN(num) || num < 0 ? 0 : Math.round(num * 100) / 100);
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
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
    setStep("extras");
  };

  const handleExtrasConfirm = () => {
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
        membership: selectedMembership
          ? { tier: selectedMembership, price: MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)!.price }
          : undefined,
        donation: donationAmount > 0 ? donationAmount : 0,
        origin: window.location.origin,
      });

      setConfirmationId(result.orderNumber || `DH-${Date.now().toString(36).toUpperCase()}`);
      setStep("confirm");
      setIsSubmitting(false);
      toast.success(grandTotal > 0 ? "Payment processed — tour booked!" : "Tour booked successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === "time") { setStep("date"); setSelectedSlotId(null); }
    else if (step === "tickets") setStep("time");
    else if (step === "extras") setStep("tickets");
    else if (step === "info") setStep("extras");
  };

  const resetAll = () => {
    setExpanded(false);
    setStep("idle");
    setSelectedDate(null);
    setSelectedSlotId(null);
    setConfirmationId(null);
    setBuyerName("");
    setBuyerEmail("");
    setBuyerPhone("");
    setTickets({ adult: 2, child: 0, under5: 0, member: 0 });
    setSelectedMembership(null);
    setDonationAmount(0);
    setCustomDonation("");
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const cinzelLabel: React.CSSProperties = {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.6rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.cobalt,
    display: "block",
    marginBottom: "0.35rem",
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1rem",
    color: C.midnight,
    textAlign: "center",
    marginBottom: "1rem",
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.parchment, overflow: "hidden" }}>
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
            color: C.cobalt,
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
            color: C.midnight,
            lineHeight: 1.2,
            marginBottom: "0.75rem",
            transition: "font-size 0.3s ease",
          }}
        >
          View Tour Openings &{" "}
          <span style={{ color: C.cobalt }}>Book Yours Today</span>
        </h2>
        {!expanded && (
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.05rem",
              color: C.cobalt,
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
              background: C.deepNavy,
              color: C.gold,
              border: "none",
              padding: "0.85rem 2.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 700,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.midnight; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.deepNavy; e.currentTarget.style.transform = "none"; }}
          >
            <Calendar size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.5rem" }} />
            Book a Tour Now
          </button>
        )}
      </div>

      {/* Expanding booking area */}
      <div
        style={{
          maxHeight: expanded ? "2000px" : "0",
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
            {(["date", "time", "tickets", "extras", "info"] as Step[]).map((s, i) => {
              const labels = ["Date", "Time", "Tickets", "Extras", "Info"];
              const stepOrder = ["date", "time", "tickets", "extras", "info"];
              const currentIdx = stepOrder.indexOf(step);
              const isCompleted = i < currentIdx;
              const isCurrent = s === step;
              return (
                <div key={s} className="flex items-center gap-1">
                  <div
                    style={{
                      width: "20px", height: "20px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.55rem", fontWeight: 700,
                      background: isCompleted ? C.available : isCurrent ? C.deepNavy : `${C.cobalt}22`,
                      color: isCompleted || isCurrent ? C.warmWhite : C.cobalt,
                      transition: "all 0.2s",
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.5rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: isCurrent ? C.deepNavy : C.cobalt,
                    fontWeight: isCurrent ? 700 : 400,
                  }}>
                    {labels[i]}
                  </span>
                  {i < stepOrder.length - 1 && (
                    <div style={{ width: "16px", height: "1px", background: `${C.cobalt}33` }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Back button */}
        {expanded && step !== "idle" && step !== "date" && step !== "confirm" && (
          <div style={{ padding: "0 1.5rem 0.5rem" }}>
            <button
              onClick={handleBack}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "transparent",
                border: "none",
                color: C.cobalt,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: 0,
              }}
            >
              <ChevronLeft size={12} /> Back
            </button>
          </div>
        )}

        <div style={{ padding: "0 1.5rem 2rem", maxWidth: "480px", margin: "0 auto" }}>

          {/* ── STEP 1: Calendar ── */}
          {step === "date" && (
            <div>
              <p style={sectionTitle}>Choose a Tour Date</p>

              {/* Month nav */}
              <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem" }}>
                <button onClick={prevMonth} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.cobalt, padding: "0.25rem" }}>
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.midnight, fontWeight: 600 }}>
                  {MONTH_NAMES[calMonth - 1]} {calYear}
                </span>
                <button onClick={nextMonth} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.cobalt, padding: "0.25rem" }}>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
                {DAY_LABELS.map((d, i) => (
                  <div key={i} style={{ textAlign: "center", fontFamily: "'Cinzel', serif", fontSize: "0.5rem", color: C.cobalt, letterSpacing: "0.05em", padding: "0.35rem 0" }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasSlots = availableDates.has(dateStr);
                  const isSelected = dateStr === selectedDate;
                  const isPast = new Date(dateStr + "T23:59:59") < today;

                  return (
                    <button
                      key={day}
                      disabled={!hasSlots || isPast}
                      onClick={() => hasSlots && !isPast && handleDateSelect(dateStr)}
                      style={{
                        aspectRatio: "1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSelected ? C.deepNavy : hasSlots && !isPast ? "white" : "transparent",
                        color: isSelected ? C.warmWhite : hasSlots && !isPast ? C.midnight : `${C.cobalt}44`,
                        border: hasSlots && !isPast ? `1px solid ${C.cobalt}33` : "1px solid transparent",
                        cursor: hasSlots && !isPast ? "pointer" : "default",
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.85rem",
                        fontWeight: isSelected ? 700 : 400,
                        transition: "all 0.15s",
                        position: "relative",
                      }}
                    >
                      {day}
                      {hasSlots && !isPast && (
                        <div style={{
                          width: "4px", height: "4px", borderRadius: "50%",
                          background: isSelected ? C.gold : C.available,
                          marginTop: "2px",
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {calLoading && (
                <div style={{ textAlign: "center", padding: "1rem", color: C.cobalt }}>
                  <Loader2 size={16} className="animate-spin" style={{ display: "inline" }} /> Loading availability…
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4" style={{ marginTop: "0.75rem" }}>
                <div className="flex items-center gap-1">
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.available }} />
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", color: C.cobalt }}>Tours Available</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Time Selection ── */}
          {step === "time" && selectedDayData && (
            <div>
              <p style={sectionTitle}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <div className="space-y-2">
                {selectedDayData.events.map(slot => {
                  const remaining = slot.capacity - slot.ticketsSold;
                  const isFull = remaining <= 0;
                  return (
                    <button
                      key={slot.slotId}
                      disabled={isFull}
                      onClick={() => !isFull && handleSlotSelect(slot.slotId)}
                      className="flex items-center justify-between w-full"
                      style={{
                        padding: "0.85rem 1rem",
                        background: isFull ? `${C.cobalt}08` : "white",
                        border: `1px solid ${isFull ? `${C.cobalt}22` : `${C.cobalt}33`}`,
                        cursor: isFull ? "not-allowed" : "pointer",
                        transition: "all 0.15s",
                        opacity: isFull ? 0.5 : 1,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock size={14} style={{ color: isFull ? C.cobalt : C.deepNavy }} />
                        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: isFull ? C.cobalt : C.midnight }}>
                          {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.55rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: isFull ? C.soldOut : remaining <= 3 ? C.limited : C.available,
                        fontWeight: 600,
                      }}>
                        {isFull ? "Sold Out" : `${remaining} spots`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 3: Ticket Quantities ── */}
          {step === "tickets" && selectedSlot && (
            <div>
              <p style={sectionTitle}>
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })} at {selectedSlot.startTime}
              </p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, textAlign: "center", marginBottom: "1rem" }}>
                {slotsAvailable} spots available · Select your tickets
              </p>

              <div className="space-y-3">
                {TICKET_TYPES.map(tt => (
                  <div key={tt.key} className="flex items-center justify-between" style={{ padding: "0.75rem 0", borderBottom: `1px solid ${C.cobalt}15` }}>
                    <div>
                      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: C.midnight }}>{tt.label}</div>
                      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: tt.price > 0 ? C.cobalt : C.available, fontWeight: tt.price > 0 ? 400 : 600 }}>
                        {tt.price > 0 ? `$${tt.price.toFixed(2)} · ${tt.desc}` : `FREE · ${tt.desc}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateTicket(tt.key, -1)}
                        disabled={tickets[tt.key] === 0}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: tickets[tt.key] === 0 ? `${C.cobalt}11` : `${C.cobalt}22`,
                          border: "none", cursor: tickets[tt.key] === 0 ? "default" : "pointer",
                          color: tickets[tt.key] === 0 ? `${C.cobalt}44` : C.midnight,
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: C.midnight, minWidth: "24px", textAlign: "center", fontWeight: 600 }}>
                        {tickets[tt.key]}
                      </span>
                      <button
                        onClick={() => updateTicket(tt.key, 1)}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: `${C.cobalt}22`,
                          border: "none", cursor: "pointer",
                          color: C.midnight,
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket subtotal */}
              <div className="flex justify-between items-center" style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: `1px solid ${C.cobalt}33` }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.deepNavy, fontWeight: 600 }}>
                  {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                </span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.deepNavy, fontWeight: 700 }}>
                  {ticketTotal > 0 ? `$${ticketTotal.toFixed(2)}` : "Free"}
                </span>
              </div>

              <button
                onClick={handleTicketsConfirm}
                disabled={totalGuests < 1}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: totalGuests < 1 ? `${C.cobalt}33` : C.deepNavy,
                  color: totalGuests < 1 ? `${C.cobalt}66` : C.gold,
                  border: "none",
                  padding: "0.85rem",
                  cursor: totalGuests < 1 ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                Continue
              </button>
            </div>
          )}

          {/* ── STEP 4: Extras (Membership + Donation) ── */}
          {step === "extras" && (
            <div>
              <p style={sectionTitle}>Enhance Your Visit</p>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt, textAlign: "center", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                These are optional — skip ahead anytime
              </p>

              {/* ── Membership Upsell ── */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
                  <Award size={16} style={{ color: C.gold }} />
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.deepNavy, fontWeight: 700 }}>
                    Join Dinsmore's Extended Family &amp; Friends Circle
                  </span>
                </div>

                {/* Perks */}
                <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, padding: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.5rem" }}>
                    Member Benefits
                  </div>
                  {MEMBERSHIP_PERKS.map((perk, i) => (
                    <div key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: C.midnight, lineHeight: 1.6, paddingLeft: "0.75rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: C.gold }}>✦</span>
                      {perk}
                    </div>
                  ))}
                </div>

                {/* Tier selection */}
                <div className="space-y-2">
                  {MEMBERSHIP_TIERS.map(tier => {
                    const isSelected = selectedMembership === tier.key;
                    return (
                      <button
                        key={tier.key}
                        onClick={() => setSelectedMembership(isSelected ? null : tier.key)}
                        className="flex items-center justify-between w-full"
                        style={{
                          padding: "0.7rem 0.85rem",
                          background: isSelected ? `${C.gold}22` : "white",
                          border: `2px solid ${isSelected ? C.gold : `${C.cobalt}22`}`,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.midnight, fontWeight: isSelected ? 600 : 400 }}>
                            {tier.label}
                          </div>
                          <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", color: C.cobalt }}>
                            {tier.desc}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.deepNavy, fontWeight: 700 }}>
                            ${tier.price}
                          </span>
                          <div style={{
                            width: "18px", height: "18px", borderRadius: "50%",
                            border: `2px solid ${isSelected ? C.gold : `${C.cobalt}44`}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isSelected ? C.gold : "transparent",
                          }}>
                            {isSelected && <span style={{ color: C.midnight, fontSize: "0.6rem", fontWeight: 700 }}>✓</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedMembership && (
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: C.available, textAlign: "center", marginTop: "0.5rem" }}>
                    ✦ Membership perks available at your next visit
                  </p>
                )}
              </div>

              {/* ── Donation ── */}
              <div style={{ borderTop: `1px solid ${C.cobalt}22`, paddingTop: "1.25rem" }}>
                <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
                  <Heart size={16} style={{ color: "oklch(52% 0.18 22)" }} />
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.deepNavy, fontWeight: 700 }}>
                    Add a Donation
                  </span>
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  Help preserve this 1842 homestead for future generations.
                </p>

                {/* Preset amounts */}
                <div className="flex gap-2" style={{ marginBottom: "0.5rem" }}>
                  {DONATION_PRESETS.map(amt => {
                    const isActive = donationAmount === amt && customDonation === "";
                    return (
                      <button
                        key={amt}
                        onClick={() => handleDonationPreset(amt)}
                        style={{
                          flex: 1,
                          padding: "0.6rem 0",
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "0.95rem",
                          fontWeight: isActive ? 700 : 400,
                          background: isActive ? `${C.gold}22` : "white",
                          border: `2px solid ${isActive ? C.gold : `${C.cobalt}22`}`,
                          color: C.midnight,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom amount */}
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)",
                    fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: C.cobalt,
                  }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={customDonation}
                    onChange={e => handleCustomDonation(e.target.value)}
                    placeholder="Other amount"
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem 0.6rem 1.5rem",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.95rem",
                      background: "white",
                      border: `1px solid ${C.cobalt}33`,
                      color: C.midnight,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Running total */}
              {(membershipTotal > 0 || donationAmount > 0) && (
                <div style={{ marginTop: "1rem", background: `${C.cobalt}08`, border: `1px solid ${C.cobalt}22`, padding: "0.75rem" }}>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, lineHeight: 1.8 }}>
                    <div className="flex justify-between">
                      <span>Tour tickets</span>
                      <span>{ticketTotal > 0 ? `$${ticketTotal.toFixed(2)}` : "Free"}</span>
                    </div>
                    {membershipTotal > 0 && (
                      <div className="flex justify-between">
                        <span>{MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)?.label} Membership</span>
                        <span>${membershipTotal.toFixed(2)}</span>
                      </div>
                    )}
                    {donationAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Donation</span>
                        <span>${donationAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between" style={{ borderTop: `1px solid ${C.cobalt}33`, paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.deepNavy, fontWeight: 700 }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.deepNavy, fontWeight: 700 }}>
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleExtrasConfirm}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: C.deepNavy,
                  color: C.gold,
                  border: "none",
                  padding: "0.85rem",
                  cursor: "pointer",
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                {membershipTotal > 0 || donationAmount > 0 ? "Continue" : "Skip — Continue to Checkout"}
              </button>
            </div>
          )}

          {/* ── STEP 5: Contact Info ── */}
          {step === "info" && selectedSlot && (
            <div>
              <p style={sectionTitle}>Almost there! Enter your details</p>

              <div className="space-y-3">
                <div>
                  <label style={cinzelLabel}>Full Name *</label>
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
                      background: "white",
                      border: `1px solid ${C.cobalt}33`,
                      color: C.midnight,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={cinzelLabel}>Email Address *</label>
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
                      background: "white",
                      border: `1px solid ${C.cobalt}33`,
                      color: C.midnight,
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={cinzelLabel}>Phone (optional)</label>
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
                      background: "white",
                      border: `1px solid ${C.cobalt}33`,
                      color: C.midnight,
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Order summary */}
              <div style={{ marginTop: "1.5rem", background: `${C.cobalt}08`, border: `1px solid ${C.cobalt}33`, padding: "1rem" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.deepNavy, marginBottom: "0.6rem" }}>
                  Order Summary
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt, lineHeight: 1.8 }}>
                  <div>{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
                  <div>{selectedSlot.startTime}{selectedSlot.endTime ? ` – ${selectedSlot.endTime}` : ""}</div>
                  {tickets.adult > 0 && <div>Adult × {tickets.adult} — ${(tickets.adult * 10).toFixed(2)}</div>}
                  {tickets.child > 0 && <div>Child (5–15) × {tickets.child} — ${(tickets.child * 3).toFixed(2)}</div>}
                  {tickets.under5 > 0 && <div>Under 5 × {tickets.under5} — Free</div>}
                  {tickets.member > 0 && <div>Member × {tickets.member} — Free</div>}
                  {selectedMembership && (
                    <div style={{ color: C.gold }}>
                      ✦ {MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)?.label} Membership — ${membershipTotal.toFixed(2)}
                    </div>
                  )}
                  {donationAmount > 0 && (
                    <div style={{ color: "oklch(52% 0.18 22)" }}>
                      ♥ Donation — ${donationAmount.toFixed(2)}
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2 pt-2" style={{ borderTop: `1px solid ${C.cobalt}33` }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.deepNavy, fontWeight: 700 }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: C.deepNavy, fontWeight: 700 }}>
                    {grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : "Free"}
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
                  background: isSubmitting ? `${C.cobalt}33` : C.deepNavy,
                  color: isSubmitting ? `${C.cobalt}66` : C.gold,
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
                ) : grandTotal > 0 ? (
                  <><Ticket size={14} /> Complete Purchase — ${grandTotal.toFixed(2)}</>
                ) : (
                  <><Ticket size={14} /> Confirm Free Booking</>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 6: Confirmation ── */}
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
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: C.deepNavy, marginBottom: "0.5rem" }}>
                  You're Booked!
                </h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt, lineHeight: 1.5 }}>
                  A confirmation has been sent to <strong style={{ color: C.midnight }}>{buyerEmail}</strong>
                </p>
              </div>

              {/* Confirmation card */}
              <div style={{ background: "white", border: `1px solid ${C.cobalt}33`, padding: "1.25rem" }}>
                {/* Confirmation number */}
                <div style={{ textAlign: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px dashed ${C.gold}33` }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.3rem" }}>
                    Confirmation Number
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: C.deepNavy, letterSpacing: "0.05em" }}>
                    {confirmationId}
                  </div>
                </div>

                {/* Tour details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.2rem" }}>Date</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.midnight }}>
                      {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : ""}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.2rem" }}>Time</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.midnight }}>
                      {selectedSlot?.startTime}{selectedSlot?.endTime ? ` – ${selectedSlot.endTime}` : ""}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.2rem" }}>Guest</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.midnight }}>{buyerName}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.cobalt, marginBottom: "0.2rem" }}>Guests</div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.midnight }}>{totalGuests}</div>
                  </div>
                </div>

                {/* Ticket breakdown */}
                <div style={{ borderTop: `1px solid ${C.cobalt}22`, paddingTop: "0.75rem", marginBottom: "0.75rem" }}>
                  {tickets.adult > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, marginBottom: "0.25rem" }}>
                      <span>Adult × {tickets.adult}</span><span>${(tickets.adult * 10).toFixed(2)}</span>
                    </div>
                  )}
                  {tickets.child > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, marginBottom: "0.25rem" }}>
                      <span>Child (5–15) × {tickets.child}</span><span>${(tickets.child * 3).toFixed(2)}</span>
                    </div>
                  )}
                  {tickets.under5 > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, marginBottom: "0.25rem" }}>
                      <span>Under 5 × {tickets.under5}</span><span>Free</span>
                    </div>
                  )}
                  {tickets.member > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, marginBottom: "0.25rem" }}>
                      <span>Member × {tickets.member}</span><span>Free</span>
                    </div>
                  )}
                  {selectedMembership && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.gold, marginBottom: "0.25rem" }}>
                      <span>✦ {MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)?.label} Membership</span>
                      <span>${membershipTotal.toFixed(2)}</span>
                    </div>
                  )}
                  {donationAmount > 0 && (
                    <div className="flex justify-between" style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: "oklch(52% 0.18 22)", marginBottom: "0.25rem" }}>
                      <span>♥ Donation</span>
                      <span>${donationAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ borderTop: `1px solid ${C.cobalt}33`, paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.deepNavy, fontWeight: 700 }}>Total Paid</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.deepNavy, fontWeight: 700 }}>
                      {grandTotal > 0 ? `$${grandTotal.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Membership confirmation */}
              {selectedMembership && (
                <div style={{ marginTop: "1rem", background: `${C.gold}11`, border: `1px solid ${C.gold}33`, padding: "0.85rem" }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.deepNavy, marginBottom: "0.5rem" }}>
                    ✦ Membership Enrolled
                  </div>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, lineHeight: 1.5 }}>
                    Welcome to the {MEMBERSHIP_TIERS.find(t => t.key === selectedMembership)?.label} tier of Dinsmore's Extended Family &amp; Friends Circle!
                    Your member perks will be available starting at your next visit.
                  </p>
                </div>
              )}

              {/* Practical info */}
              <div style={{ marginTop: "1rem", background: `${C.cobalt}08`, border: `1px solid ${C.cobalt}22`, padding: "1rem" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.deepNavy, marginBottom: "0.75rem" }}>
                  Before You Visit
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, lineHeight: 1.7 }}>
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
                    color: C.cobalt,
                    border: `1px solid ${C.cobalt}44`,
                    padding: "0.65rem",
                    cursor: "pointer",
                  }}
                >
                  Print Confirmation
                </button>
                <button
                  onClick={resetAll}
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
