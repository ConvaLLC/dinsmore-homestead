import { useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { IMAGES } from "../../../shared/images";
import { Calendar, Clock, Ticket, Users, ChevronRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

function TimeslotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const available = slot.capacity - slot.ticketsSold;
  const isFull = available <= 0;
  const slotDate = new Date(slot.slotDate);

  return (
    <button
      onClick={!isFull ? onSelect : undefined}
      disabled={isFull}
      style={{
        width: "100%",
        padding: "0.875rem 1rem",
        border: `2px solid ${selected ? "oklch(38% 0.12 22)" : "oklch(72% 0.05 62)"}`,
        background: selected ? "oklch(38% 0.12 22)" : isFull ? "oklch(87% 0.032 72)" : "oklch(96% 0.018 80)",
        color: selected ? "oklch(96% 0.018 80)" : isFull ? "oklch(55% 0.11 72)" : "oklch(22% 0.04 50)",
        cursor: isFull ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {format(slotDate, "EEEE, MMMM d, yyyy")}
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            opacity: 0.8,
          }}
        >
          {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
        </div>
      </div>
      <div className="text-right">
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {slot.price ? `$${slot.price}` : "See event price"}
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.75rem",
            color: isFull ? "oklch(50% 0.18 25)" : available <= 5 ? "oklch(55% 0.11 72)" : "inherit",
            opacity: 0.8,
          }}
        >
          {isFull ? "Sold out" : `${available} spots left`}
        </div>
      </div>
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
  const createOrder = trpc.tickets.createOrder.useMutation();

  const selectedTimeslot = timeslots?.find((s) => s.id === selectedSlot);
  const unitPrice = selectedTimeslot?.price
    ? parseFloat(selectedTimeslot.price)
    : event
    ? parseFloat(event.basePrice)
    : 0;
  const total = unitPrice * quantity;

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
                  {timeslots.map((slot) => (
                    <TimeslotCard
                      key={slot.id}
                      slot={slot}
                      selected={selectedSlot === slot.id}
                      onSelect={() => setSelectedSlot(slot.id)}
                    />
                  ))}
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
