import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { IMAGES } from "../../../shared/images";
import { Calendar, Clock, Ticket, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

function SlotTimeButton({
  slot, selected, onSelect, unitPrice,
}: { slot: any; selected: boolean; onSelect: () => void; unitPrice: number; }) {
  const available = slot.capacity - slot.ticketsSold;
  const isFull = available <= 0;
  const isLow = !isFull && available <= 5;
  const slotPrice = slot.price ? parseFloat(slot.price) : unitPrice;
  return (
    <button
      onClick={!isFull ? onSelect : undefined}
      disabled={isFull}
      style={{
        padding: "0.6rem 0.85rem",
        border: `2px solid ${selected ? "oklch(38% 0.12 22)" : isFull ? "oklch(82% 0.04 65)" : "oklch(72% 0.05 62)"}`,
        background: selected ? "oklch(38% 0.12 22)" : isFull ? "oklch(90% 0.02 72)" : "oklch(96% 0.018 80)",
        color: selected ? "oklch(96% 0.018 80)" : isFull ? "oklch(60% 0.04 60)" : "oklch(22% 0.04 50)",
        cursor: isFull ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        textAlign: "center",
        minWidth: "110px",
        position: "relative",
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.2 }}>
        {slot.startTime}
      </div>
      {slot.endTime && (
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", opacity: 0.75 }}>to {slot.endTime}</div>
      )}
      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", marginTop: "0.3rem",
        color: selected ? "oklch(87% 0.032 72)" : isFull ? "oklch(50% 0.18 25)" : isLow ? "oklch(52% 0.14 55)" : "oklch(46% 0.06 56)",
        fontWeight: isFull ? 700 : isLow ? 600 : 400,
      }}>
        {isFull ? "SOLD OUT" : isLow ? `Only ${available} left!` : `${available} open`}
      </div>
      {slotPrice > 0 && (
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.75rem", marginTop: "0.15rem",
          color: selected ? "oklch(87% 0.032 72)" : "oklch(55% 0.11 72)" }}>
          ${slotPrice.toFixed(2)}/ticket
        </div>
      )}
    </button>
  );
}

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event, isLoading } = trpc.events.bySlug.useQuery({ slug: params.slug || "" });
  const { data: timeslots } = trpc.timeslots.forEvent.useQuery(
    { eventId: event?.id || 0 },
    { enabled: !!event?.id }
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const createOrder = trpc.tickets.createOrder.useMutation();

  const selectedTimeslot = timeslots?.find((s) => s.id === selectedSlot);
  const unitPrice = selectedTimeslot?.price
    ? parseFloat(selectedTimeslot.price)
    : event
    ? parseFloat(event.basePrice)
    : 0;
  const total = unitPrice * quantity;

  // Group slots by date
  const slotsByDate = useMemo(() => {
    if (!timeslots) return {};
    return timeslots.reduce<Record<string, any[]>>((acc, s) => {
      const key = new Date(s.slotDate).toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});
  }, [timeslots]);
  const sortedDates = useMemo(() => Object.keys(slotsByDate).sort(), [slotsByDate]);
  const slotsForSelectedDate = selectedDate ? (slotsByDate[selectedDate] ?? []) : [];

  const handlePurchase = async () => {
    if (!event) return;
    if (!buyerName || !buyerEmail) {
      toast.error("Please fill in your name and email address");
      return;
    }
    if (event.usesTimeslots && !selectedSlot) {
      toast.error("Please select a tour time");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder.mutateAsync({
        eventId: event.id,
        timeslotId: selectedSlot || undefined,
        buyerName,
        buyerEmail,
        buyerPhone,
        quantity,
        origin: window.location.origin,
      });

      if (result.approvalUrl) {
        window.location.href = result.approvalUrl;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid oklch(82% 0.04 65)",
            borderTopColor: "oklch(38% 0.12 22)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center container">
        <AlertCircle size={48} style={{ color: "oklch(55% 0.11 72)", margin: "0 auto 1rem" }} />
        <h2>Event Not Found</h2>
        <Link href="/events" className="btn-vintage mt-4 inline-block">
          Back to Events
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "320px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${event.imageUrl || IMAGES.farmHDR})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(15%) contrast(1.05)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.65)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <nav
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.85rem",
              color: "oklch(72% 0.05 62)",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Link href="/events" style={{ color: "oklch(72% 0.05 62)" }}>Events</Link>
            <ChevronRight size={12} />
            <span style={{ color: "oklch(87% 0.032 72)" }}>{event.title}</span>
          </nav>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(68% 0.12 75)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            {event.eventType.replace("_", " ")}
          </span>
          <h1 style={{ color: "oklch(96% 0.018 80)", marginBottom: "0.5rem" }}>{event.title}</h1>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              color: "oklch(87% 0.032 72)",
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.95rem",
              flexWrap: "wrap",
            }}
          >
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(startDate, "EEEE, MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Ticket size={14} />
              {parseFloat(event.basePrice) === 0 ? "Free" : `From $${event.basePrice}`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-10" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <div className="card-vintage p-6 mb-6">
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>About This Event</h2>
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "oklch(55% 0.11 72)",
                    marginBottom: "1.25rem",
                  }}
                />
                <div
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: "oklch(38% 0.055 54)",
                    lineHeight: 1.75,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: event.description || event.shortDescription || "Details coming soon.",
                  }}
                />
              </div>

              {/* Timeslots */}
              {event.usesTimeslots && timeslots && timeslots.length > 0 && (
                <div className="card-vintage p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} style={{ color: "oklch(38% 0.12 22)" }} />
                    <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Select a Tour Time</h2>
                  </div>
                  <div style={{ width: "40px", height: "2px", background: "oklch(55% 0.11 72)", marginBottom: "1.25rem" }} />

                  {/* Step 1: Pick a date */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.06 56)", marginBottom: "0.6rem" }}>Step 1 — Choose a Date</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {sortedDates.map(dateKey => {
                        const daySlots = slotsByDate[dateKey];
                        const allFull = daySlots.every((s: any) => s.ticketsSold >= s.capacity);
                        const totalAvail = daySlots.reduce((a: number, s: any) => a + Math.max(0, s.capacity - s.ticketsSold), 0);
                        const isSelected = selectedDate === dateKey;
                        const dt = new Date(dateKey + "T12:00:00");
                        return (
                          <button key={dateKey} onClick={() => { setSelectedDate(dateKey); setSelectedSlot(null); }} disabled={allFull}
                            style={{
                              padding: "0.55rem 0.85rem", textAlign: "center", minWidth: "90px",
                              border: `2px solid ${isSelected ? "oklch(38% 0.12 22)" : allFull ? "oklch(82% 0.04 65)" : "oklch(72% 0.05 62)"}`,
                              background: isSelected ? "oklch(38% 0.12 22)" : allFull ? "oklch(90% 0.02 72)" : "oklch(96% 0.018 80)",
                              color: isSelected ? "oklch(96% 0.018 80)" : allFull ? "oklch(60% 0.04 60)" : "oklch(22% 0.04 50)",
                              cursor: allFull ? "not-allowed" : "pointer", transition: "all 0.15s",
                            }}
                          >
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.8rem", fontWeight: 600 }}>{format(dt, "EEE")}</div>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, lineHeight: 1 }}>{format(dt, "d")}</div>
                            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.72rem" }}>{format(dt, "MMM yyyy")}</div>
                            <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.68rem", marginTop: "0.2rem",
                              color: isSelected ? "oklch(87% 0.032 72)" : allFull ? "oklch(50% 0.18 25)" : "oklch(46% 0.06 56)",
                              fontWeight: allFull ? 700 : 400,
                            }}>{allFull ? "Sold Out" : `${totalAvail} open`}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Pick a time on the selected date */}
                  {selectedDate && (
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(46% 0.06 56)", marginBottom: "0.6rem" }}>Step 2 — Choose a Time on {format(new Date(selectedDate + "T12:00:00"), "MMMM d, yyyy")}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {slotsForSelectedDate.map((slot: any) => (
                          <SlotTimeButton key={slot.id} slot={slot} selected={selectedSlot === slot.id} onSelect={() => setSelectedSlot(slot.id)} unitPrice={unitPrice} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking sidebar */}
            <div>
              <div
                className="card-vintage p-5"
                style={{ position: "sticky", top: "80px" }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    marginBottom: "1rem",
                  }}
                >
                  Reserve Your Tickets
                </h3>
                <div style={{ width: "30px", height: "2px", background: "oklch(55% 0.11 72)", marginBottom: "1rem" }} />

                {/* Quantity */}
                <div className="mb-4">
                  <label
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(46% 0.06 56)",
                      display: "block",
                      marginBottom: "0.4rem",
                    }}
                  >
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "1px solid oklch(72% 0.05 62)",
                        background: "transparent",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        minWidth: "2rem",
                        textAlign: "center",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(20, quantity + 1))}
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "1px solid oklch(72% 0.05 62)",
                        background: "transparent",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buyer info */}
                <div className="space-y-3 mb-4">
                  {[
                    { label: "Full Name *", value: buyerName, setter: setBuyerName, type: "text", placeholder: "Your name" },
                    { label: "Email Address *", value: buyerEmail, setter: setBuyerEmail, type: "email", placeholder: "your@email.com" },
                    { label: "Phone (optional)", value: buyerPhone, setter: setBuyerPhone, type: "tel", placeholder: "(555) 555-5555" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "oklch(46% 0.06 56)",
                          display: "block",
                          marginBottom: "0.3rem",
                        }}
                      >
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "1px solid oklch(72% 0.05 62)",
                          background: "oklch(93% 0.025 75)",
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "0.95rem",
                          color: "oklch(22% 0.04 50)",
                          outline: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Price summary */}
                <div
                  style={{
                    background: "oklch(93% 0.025 75)",
                    border: "1px solid oklch(82% 0.04 65)",
                    padding: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div className="flex justify-between mb-1">
                    <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(46% 0.06 56)" }}>
                      {quantity} × ${unitPrice.toFixed(2)}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", fontWeight: 600 }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.75rem",
                      color: "oklch(55% 0.11 72)",
                      fontStyle: "italic",
                    }}
                  >
                    Secure payment via PayPal
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={isSubmitting}
                  className="btn-vintage-filled w-full text-center"
                  style={{ opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? "Processing..." : total === 0 ? "Reserve Free Tickets" : `Pay $${total.toFixed(2)} via PayPal`}
                </button>

                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.75rem",
                    color: "oklch(55% 0.11 72)",
                    textAlign: "center",
                    marginTop: "0.75rem",
                    fontStyle: "italic",
                  }}
                >
                  You will be redirected to PayPal to complete your purchase securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
