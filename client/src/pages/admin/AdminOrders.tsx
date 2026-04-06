import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Ticket, ChevronDown, ChevronUp, Search } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState, useMemo } from "react";

const C = {
  midnight: "oklch(21.8% 0.036 251.3)",
  navy: "oklch(34.6% 0.074 256.1)",
  steel: "oklch(47.2% 0.088 247.4)",
  gold: "oklch(74.2% 0.118 90.2)",
  goldLight: "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(97.8% 0.008 89.6)",
  cream: "oklch(94.7% 0.029 89.6)",
  green: "oklch(85% 0.08 155)",
  greenDark: "oklch(25% 0.08 155)",
  red: "oklch(65% 0.2 25)",
};

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.tickets.adminList.useQuery();
  const [search, setSearch] = useState("");
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");

  // Group orders by date (from timeslot start time or order creation date)
  const groupedOrders = useMemo(() => {
    if (!orders) return {};
    let filtered = orders as any[];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((o: any) => {
        const status = (o.status || o.paymentStatus || "").toLowerCase();
        return status === filter;
      });
    }

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((o: any) =>
        (o.orderNumber || "").toLowerCase().includes(q) ||
        (o.buyerName || "").toLowerCase().includes(q) ||
        (o.buyerEmail || "").toLowerCase().includes(q)
      );
    }

    // Group by date
    const groups: Record<string, any[]> = {};
    filtered.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });

    return groups;
  }, [orders, search, filter]);

  const totalRevenue = useMemo(() => orders?.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || "0"), 0) || 0, [orders]);
  const totalOrders = orders?.length || 0;
  const totalGuests = useMemo(() => orders?.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0) || 0, [orders]);

  // Auth check AFTER all hooks
  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: C.gold, margin: "0 auto 1rem" }} />
        <h2>Admin Access Required</h2>
        <a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a>
      </div>
    );
  }

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: C.parchment, minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="mb-6">
            <span className="section-label">Admin</span>
            <h2 style={{ fontSize: "1.75rem" }}>Tour Bookings</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", color: C.steel, marginTop: "0.25rem" }}>
              All tour bookings grouped by date. Click a date to expand and see individual orders.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Bookings", value: totalOrders },
              { label: "Total Guests", value: totalGuests },
              { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
            ].map(s => (
              <div key={s.label} className="card-vintage p-4 text-center">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.navy }}>{s.value}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.steel }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search and filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1" style={{ minWidth: "200px" }}>
              <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: C.steel }} />
              <input
                type="text"
                placeholder="Search by name, email, or order number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.75rem 0.6rem 2.25rem",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.9rem",
                  border: `1px solid ${C.goldLight}`,
                  borderRadius: "4px",
                  background: "white",
                }}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "paid", "pending", "cancelled"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "0.5rem 1rem",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: filter === f ? C.midnight : "white",
                    color: filter === f ? C.gold : C.navy,
                    border: `1px solid ${filter === f ? C.midnight : C.goldLight}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: C.gold }}>Loading bookings...</div>
          ) : Object.keys(groupedOrders).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(groupedOrders).map(([date, dateOrders]) => {
                const isExpanded = expandedDates.has(date);
                const dateGuests = dateOrders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);
                const dateRevenue = dateOrders.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || "0"), 0);

                return (
                  <div key={date} className="card-vintage overflow-hidden">
                    {/* Date header — clickable */}
                    <button
                      onClick={() => toggleDate(date)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: isExpanded ? C.midnight : "white",
                        color: isExpanded ? C.gold : C.navy,
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 600 }}>{date}</div>
                        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: isExpanded ? C.goldLight : C.steel, marginTop: "0.15rem" }}>
                          {dateOrders.length} booking{dateOrders.length !== 1 ? "s" : ""} · {dateGuests} guest{dateGuests !== 1 ? "s" : ""} · ${dateRevenue.toFixed(2)}
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {/* Expanded order list */}
                    {isExpanded && (
                      <div style={{ borderTop: `1px solid ${C.goldLight}` }}>
                        <div className="overflow-x-auto">
                          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'EB Garamond', serif", fontSize: "0.85rem" }}>
                            <thead>
                              <tr style={{ background: C.cream }}>
                                {["Order #", "Guest", "Email", "Phone", "Qty", "Total", "Status", "Details"].map(h => (
                                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: C.steel }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dateOrders.map((order: any, i: number) => {
                                const status = (order.status || order.paymentStatus || "unknown").toLowerCase();
                                const isPaid = status === "paid" || status === "completed";
                                return (
                                  <tr key={order.id} style={{ background: i % 2 === 0 ? "white" : C.parchment, borderBottom: `1px solid ${C.goldLight}` }}>
                                    <td style={{ padding: "0.5rem 0.75rem", color: C.navy, fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: "0.8rem" }}>{order.orderNumber}</td>
                                    <td style={{ padding: "0.5rem 0.75rem" }}>{order.buyerName}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", color: C.gold }}>{order.buyerEmail}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", color: C.steel }}>{order.buyerPhone || "—"}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", fontWeight: 600 }}>{order.quantity}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>${order.totalAmount}</td>
                                    <td style={{ padding: "0.5rem 0.75rem" }}>
                                      <span style={{
                                        display: "inline-block",
                                        padding: "0.15rem 0.5rem",
                                        fontSize: "0.7rem",
                                        fontFamily: "'Playfair Display', serif",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        borderRadius: "3px",
                                        background: isPaid ? C.green : status === "pending" ? C.goldLight : "oklch(90% 0.05 25)",
                                        color: isPaid ? C.greenDark : status === "pending" ? C.navy : C.red,
                                      }}>
                                        {status}
                                      </span>
                                    </td>
                                    <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: C.steel, maxWidth: "200px" }}>
                                      {order.notes ? (
                                        <span title={order.notes} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {order.notes}
                                        </span>
                                      ) : "—"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Ticket size={48} style={{ color: C.goldLight, margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: C.gold, fontStyle: "italic" }}>
                {search || filter !== "all" ? "No bookings match your search or filter." : "No tour bookings yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
