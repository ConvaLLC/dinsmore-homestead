import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2, Ticket, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export default function TicketConfirmPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("orderNumber");
  const paypalOrderId = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const captureOrder = trpc.tickets.captureOrder.useMutation();
  const { data: order } = trpc.tickets.getOrder.useQuery(
    { orderNumber: orderNumber || "" },
    { enabled: !!orderNumber && status === "success" }
  );

  useEffect(() => {
    if (!orderNumber || !paypalOrderId) {
      setStatus("error");
      return;
    }
    captureOrder
      .mutateAsync({ orderNumber, paypalOrderId })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="py-24 text-center">
        <Loader2 size={48} style={{ color: "oklch(38% 0.12 22)", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
        <h2>Confirming Your Order...</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)" }}>
          Please wait while we confirm your payment with PayPal.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-24 text-center container">
        <XCircle size={56} style={{ color: "oklch(50% 0.18 25)", margin: "0 auto 1rem" }} />
        <h2>Payment Could Not Be Confirmed</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
          We were unable to confirm your payment. If you were charged, please contact us at info@dinsmorefarm.org.
        </p>
        <Link href="/events" className="btn-vintage inline-block">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="py-16" style={{ background: "oklch(96% 0.018 80)" }}>
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card-vintage p-8 text-center">
          <CheckCircle size={56} style={{ color: "oklch(35% 0.08 155)", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Booking Confirmed!</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", marginBottom: "1.5rem" }}>
            Thank you for your purchase. A confirmation will be sent to your email.
          </p>

          {order && (
            <div
              style={{
                background: "oklch(93% 0.025 75)",
                border: "1px solid oklch(82% 0.04 65)",
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
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(55% 0.11 72)", marginBottom: "0.2rem" }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(22% 0.04 50)" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/visit" className="btn-vintage-filled">Plan Your Visit</Link>
            <Link href="/events" className="btn-vintage">View More Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
