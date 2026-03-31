import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Ticket } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.tickets.adminList.useQuery();

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return <div className="py-24 text-center container"><Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} /><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>;
  }

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(97.8% 0.008 89.6)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="mb-6"><span className="section-label">Admin</span><h2 style={{ fontSize: "1.75rem" }}>Ticket Orders</h2></div>
          {isLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)" }}>Loading...</div> : orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'EB Garamond', serif", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "oklch(21.8% 0.036 251.3)", color: "oklch(87.6% 0.068 89.7)" }}>
                    {["Order #", "Buyer", "Email", "Event", "Qty", "Total", "Status", "Date"].map((h) => (
                      <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any, i: number) => (
                    <tr key={order.id} style={{ background: i % 2 === 0 ? "oklch(97.8% 0.008 89.6)" : "oklch(94.7% 0.029 89.6)", borderBottom: "1px solid oklch(87.6% 0.068 89.7)" }}>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(34.6% 0.074 256.1)", fontWeight: 600 }}>{order.orderNumber}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{order.buyerName}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(74.2% 0.118 90.2)" }}>{order.buyerEmail}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{order.eventId}</td>
                      <td style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>{order.quantity}</td>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>${order.totalAmount}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", background: order.paymentStatus === "completed" ? "oklch(85% 0.08 155)" : "oklch(87.6% 0.068 89.7)", color: order.paymentStatus === "completed" ? "oklch(25% 0.08 155)" : "oklch(47.2% 0.088 247.4)", fontSize: "0.75rem", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em" }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(74.2% 0.118 90.2)", fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Ticket size={48} style={{ color: "oklch(87.6% 0.068 89.7)", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)", fontStyle: "italic" }}>No ticket orders yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
