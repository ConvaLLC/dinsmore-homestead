import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Ticket } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.tickets.adminList.useQuery();

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return <div className="py-24 text-center container"><Lock size={48} style={{ color: "oklch(64.3% 0.161 143.4)", margin: "0 auto 1rem" }} /><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>;
  }

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(96% 0.014 110)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="mb-6"><span className="section-label">Admin</span><h2 style={{ fontSize: "1.75rem" }}>Ticket Orders</h2></div>
          {isLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)" }}>Loading...</div> : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'EB Garamond', serif", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "oklch(27% 0.045 50)", color: "oklch(86.6% 0.079 130.9)" }}>
                    {["Order #", "Buyer", "Email", "Event", "Qty", "Total", "Status", "Date"].map((h) => (
                      <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any, i: number) => (
                    <tr key={order.id} style={{ background: i % 2 === 0 ? "oklch(96% 0.014 110)" : "oklch(93.6% 0.037 136.6)", borderBottom: "1px solid oklch(86.6% 0.079 130.9)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(33.1% 0.064 144.7)", fontWeight: 600 }}>{order.orderNumber}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{order.buyerName}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(64.3% 0.161 143.4)" }}>{order.buyerEmail}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{order.eventId}</td>
                      <td style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>{order.quantity}</td>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>${order.totalAmount}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", background: order.paymentStatus === "completed" ? "oklch(85% 0.08 155)" : "oklch(86.6% 0.079 130.9)", color: order.paymentStatus === "completed" ? "oklch(25% 0.08 155)" : "oklch(44% 0.055 144)", fontSize: "0.75rem", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(64.3% 0.161 143.4)", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Ticket size={48} style={{ color: "oklch(78% 0.055 135)", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)", fontStyle: "italic" }}>No ticket orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
