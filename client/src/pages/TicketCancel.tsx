import { Link } from "wouter";
import { XCircle } from "lucide-react";

export default function TicketCancelPage() {
  return (
    <div className="py-24 text-center container">
      <XCircle size={56} style={{ color: "oklch(55% 0.11 72)", margin: "0 auto 1rem" }} />
      <h2>Order Cancelled</h2>
      <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
        Your order was cancelled and you have not been charged. You can try again at any time.
      </p>
      <Link href="/events" className="btn-vintage inline-block">Back to Events</Link>
    </div>
  );
}
