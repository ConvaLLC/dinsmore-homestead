import { useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2, Ticket, Calendar, User } from "lucide-react";

export default function TicketConfirmPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("orderNumber");

  const { data: order, isLoading, isError } = trpc.tickets.getOrder.useQuery(
    { orderNumber: orderNumber || "" },
    { enabled: !!orderNumber }
  );

  if (!orderNumber) {
    return (
      <div className="py-24 text-center container">
        <XCircle size={56} style={{ color: "oklch(50% 0.18 25)", margin: "0 auto 1rem" }} />
        <h2>Invalid Order</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
          No order number was provided. Please try booking again.
        </p>
        <Link href="/events" className="btn-vintage inline-block">Back to Events</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 size={48} style={{ color: "oklch(34.6% 0.074 256.1)", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
        <h2>Loading Your Order...</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)" }}>
          Please wait while we retrieve your booking details.
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="py-24 text-center container">
        <XCircle size={56} style={{ color: "oklch(50% 0.18 25)", margin: "0 auto 1rem" }} />
        <h2>Order Not Found</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
          We could not find this order. If you believe this is an error, please contact us at info@dinsmorefarm.org.
        </p>
        <Link href="/events" className="btn-vintage inline-block">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="py-16" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card-vintage p-8 text-center">
          <CheckCircle size={56} style={{ color: "oklch(47.2% 0.088 247.4)", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Booking Confirmed!</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", marginBottom: "1.5rem" }}>
            Thank you for your purchase. Your tour is confirmed.
          </p>

          <div
            style={{
              background: "oklch(94.7% 0.029 89.6)",
              border: "1px solid oklch(87.6% 0.068 89.7)",
              padding: "1.25rem",
              textAlign: "left",
              marginBottom: "1.5rem",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Ticket size={14} />, label: "Order #", value: order.orderNumber },
                { icon: <User size={14} />, label: "Name", value: order.buyerName },
                { icon: <Calendar size={14} />, label: "Tickets", value: `${order.quantity} ticket(s)` },
                { icon: <Ticket size={14} />, label: "Total Paid", value: `$${order.totalAmount}` },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)", marginBottom: "0.2rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(21.8% 0.036 251.3)" }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            {order.notes && (
              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid oklch(87.6% 0.068 89.7)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)", marginBottom: "0.2rem" }}>
                  Ticket Details
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(21.8% 0.036 251.3)" }}>
                  {order.notes}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/visit" className="btn-vintage-filled">Plan Your Visit</Link>
            <Link href="/events" className="btn-vintage">View More Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
