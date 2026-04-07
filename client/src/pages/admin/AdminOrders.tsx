import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Ticket, ChevronDown, ChevronUp, Search, XCircle, AlertTriangle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState, useMemo, useCallback } from "react";

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
  redLight: "oklch(90% 0.05 25)",
  redBg: "oklch(95% 0.03 25)",
};

interface CancelDialogState {
  open: boolean;
  orderId: number | null;
  orderNumber: string;
  buyerName: string;
  totalAmount: string;
  hasMembership: boolean;
}

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.tickets.adminList.useQuery();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");
  const [cancelDialog, setCancelDialog] = useState<CancelDialogState>({
    open: false, orderId: null, orderNumber: "", buyerName: "", totalAmount: "0", hasMembership: false,
  });
  const [cancelReason, setCancelReason] = useState("");
  const [issueRefund, setIssueRefund] = useState(true);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const cancelMutation = trpc.tickets.adminCancel.useMutation({
    onSuccess: (result) => {
      utils.tickets.adminList.invalidate();
      setCancelDialog({ open: false, orderId: null, orderNumber: "", buyerName: "", totalAmount: "0", hasMembership: false });
      setCancelReason("");
      setIssueRefund(true);
      setCancelSuccess(
        `Order ${result.orderNumber} has been ${result.newStatus}.` +
        (result.refundAmount > 0 ? ` Refund: $${result.refundAmount.toFixed(2)}.` : "") +
        (result.membershipCancelled ? " Associated membership cancelled." : "")
      );
      setTimeout(() => setCancelSuccess(null), 6000);
    },
  });

  // Group orders by date
  const groupedOrders = useMemo(() => {
    if (!orders) return {};
    let filtered = orders as any[];

    if (filter !== "all") {
      filtered = filtered.filter((o: any) => {
        const status = (o.status || "").toLowerCase();
        if (filter === "cancelled") return status === "cancelled" || status === "refunded";
        return status === filter;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((o: any) =>
        (o.orderNumber || "").toLowerCase().includes(q) ||
        (o.buyerName || "").toLowerCase().includes(q) ||
        (o.buyerEmail || "").toLowerCase().includes(q)
      );
    }

    const groups: Record<string, any[]> = {};
    filtered.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });

    return groups;
  }, [orders, search, filter]);

  const totalRevenue = useMemo(() => orders?.reduce((sum: number, o: any) => {
    const status = (o.status || "").toLowerCase();
    if (status === "cancelled" || status === "refunded") return sum;
    return sum + parseFloat(o.totalAmount || "0");
  }, 0) || 0, [orders]);
  const totalOrders = orders?.length || 0;
  const totalGuests = useMemo(() => orders?.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0) || 0, [orders]);
  const cancelledCount = useMemo(() => orders?.filter((o: any) => o.status === "cancelled" || o.status === "refunded").length || 0, [orders]);

  const openCancelDialog = useCallback((order: any) => {
    const notes = (order.notes || "").toLowerCase();
    const hasMembership = notes.includes("membership:");
    setCancelDialog({
      open: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      buyerName: order.buyerName,
      totalAmount: order.totalAmount,
      hasMembership,
    });
    setCancelReason("");
    setIssueRefund(true);
  }, []);

  const handleCancel = () => {
    if (!cancelDialog.orderId || !cancelReason.trim()) return;
    cancelMutation.mutate({
      orderId: cancelDialog.orderId,
      reason: cancelReason.trim(),
      issueRefund,
    });
  };

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

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    const isPaid = s === "paid" || s === "completed";
    const isCancelled = s === "cancelled";
    const isRefunded = s === "refunded";
    return {
      background: isPaid ? C.green : s === "pending" ? C.goldLight : isRefunded ? "oklch(85% 0.1 280)" : C.redLight,
      color: isPaid ? C.greenDark : s === "pending" ? C.navy : isRefunded ? "oklch(30% 0.1 280)" : C.red,
    };
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
              Manage tour bookings — view details, cancel orders, and issue refunds.
            </p>
          </div>

          {/* Success toast */}
          {cancelSuccess && (
            <div style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              background: C.green,
              color: C.greenDark,
              borderRadius: "6px",
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <span style={{ fontWeight: 600 }}>✓</span> {cancelSuccess}
            </div>
          )}

          {/* Error toast */}
          {cancelMutation.error && (
            <div style={{
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              background: C.redBg,
              color: C.red,
              borderRadius: "6px",
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <AlertTriangle size={16} /> {cancelMutation.error.message}
            </div>
          )}

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Bookings", value: totalOrders },
              { label: "Total Guests", value: totalGuests },
              { label: "Active Revenue", value: `$${totalRevenue.toFixed(2)}` },
              { label: "Cancelled/Refunded", value: cancelledCount },
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
                                {["Order #", "Guest", "Email", "Qty", "Total", "Status", "Details", "Actions"].map(h => (
                                  <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: C.steel }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dateOrders.map((order: any, i: number) => {
                                const status = (order.status || "unknown").toLowerCase();
                                const isPaid = status === "paid" || status === "completed";
                                const isCancelledOrRefunded = status === "cancelled" || status === "refunded";
                                const badge = getStatusBadge(status);

                                return (
                                  <tr key={order.id} style={{
                                    background: isCancelledOrRefunded ? C.redBg : i % 2 === 0 ? "white" : C.parchment,
                                    borderBottom: `1px solid ${C.goldLight}`,
                                    opacity: isCancelledOrRefunded ? 0.7 : 1,
                                  }}>
                                    <td style={{ padding: "0.5rem 0.75rem", color: C.navy, fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: "0.8rem" }}>
                                      {order.orderNumber}
                                    </td>
                                    <td style={{ padding: "0.5rem 0.75rem" }}>{order.buyerName}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", color: C.gold }}>{order.buyerEmail}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", textAlign: "center", fontWeight: 600 }}>{order.quantity}</td>
                                    <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600, textDecoration: isCancelledOrRefunded ? "line-through" : "none" }}>
                                      ${order.totalAmount}
                                    </td>
                                    <td style={{ padding: "0.5rem 0.75rem" }}>
                                      <span style={{
                                        display: "inline-block",
                                        padding: "0.15rem 0.5rem",
                                        fontSize: "0.7rem",
                                        fontFamily: "'Playfair Display', serif",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        borderRadius: "3px",
                                        background: badge.background,
                                        color: badge.color,
                                      }}>
                                        {status}
                                      </span>
                                      {isCancelledOrRefunded && order.cancelReason && (
                                        <div style={{ fontSize: "0.75rem", color: C.red, marginTop: "0.2rem", fontStyle: "italic" }}>
                                          {order.cancelReason}
                                        </div>
                                      )}
                                    </td>
                                    <td style={{ padding: "0.5rem 0.75rem", fontSize: "0.8rem", color: C.steel, maxWidth: "180px" }}>
                                      {order.notes ? (
                                        <span title={order.notes} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                          {order.notes}
                                        </span>
                                      ) : "—"}
                                    </td>
                                    <td style={{ padding: "0.5rem 0.75rem" }}>
                                      {isPaid && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); openCancelDialog(order); }}
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.3rem",
                                            padding: "0.3rem 0.65rem",
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "0.65rem",
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            background: "white",
                                            color: C.red,
                                            border: `1px solid ${C.red}`,
                                            borderRadius: "3px",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                          }}
                                          onMouseEnter={e => { (e.target as HTMLElement).style.background = C.redBg; }}
                                          onMouseLeave={e => { (e.target as HTMLElement).style.background = "white"; }}
                                        >
                                          <XCircle size={12} /> Cancel
                                        </button>
                                      )}
                                      {isCancelledOrRefunded && (
                                        <span style={{ fontSize: "0.75rem", color: C.steel, fontStyle: "italic" }}>
                                          {order.cancelledBy ? `by ${order.cancelledBy}` : "—"}
                                        </span>
                                      )}
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

      {/* ── Cancel / Refund Dialog ──────────────────────────────────────────── */}
      {cancelDialog.open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setCancelDialog({ ...cancelDialog, open: false })}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "480px",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Dialog header */}
            <div style={{
              padding: "1.25rem 1.5rem",
              background: C.redBg,
              borderBottom: `1px solid ${C.redLight}`,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}>
              <AlertTriangle size={24} style={{ color: C.red, flexShrink: 0 }} />
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: C.navy, margin: 0 }}>
                  Cancel Order
                </h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.steel, margin: "0.15rem 0 0" }}>
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Dialog body */}
            <div style={{ padding: "1.5rem" }}>
              {/* Order summary */}
              <div style={{
                padding: "0.75rem 1rem",
                background: C.cream,
                borderRadius: "6px",
                marginBottom: "1.25rem",
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: C.steel }}>Order</span>
                  <span style={{ fontWeight: 600, color: C.navy }}>{cancelDialog.orderNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ color: C.steel }}>Guest</span>
                  <span style={{ fontWeight: 600, color: C.navy }}>{cancelDialog.buyerName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.steel }}>Total</span>
                  <span style={{ fontWeight: 600, color: C.navy }}>${cancelDialog.totalAmount}</span>
                </div>
                {cancelDialog.hasMembership && (
                  <div style={{ marginTop: "0.5rem", padding: "0.4rem 0.6rem", background: "oklch(90% 0.06 280)", borderRadius: "4px", fontSize: "0.8rem", color: "oklch(35% 0.1 280)" }}>
                    This order includes a membership purchase — it will also be cancelled.
                  </div>
                )}
              </div>

              {/* Refund toggle */}
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={issueRefund}
                  onChange={e => setIssueRefund(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: C.navy }}
                />
                <span>
                  Issue refund of <strong>${cancelDialog.totalAmount}</strong>
                </span>
              </label>

              {/* Reason */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{
                  display: "block",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.steel,
                  marginBottom: "0.4rem",
                }}>
                  Cancellation Reason *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g., Customer requested cancellation, weather closure, etc."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    border: `1px solid ${C.goldLight}`,
                    borderRadius: "4px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setCancelDialog({ ...cancelDialog, open: false })}
                  style={{
                    padding: "0.6rem 1.25rem",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: "white",
                    color: C.navy,
                    border: `1px solid ${C.goldLight}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim() || cancelMutation.isPending}
                  style={{
                    padding: "0.6rem 1.25rem",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    background: !cancelReason.trim() ? C.steel : C.red,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: !cancelReason.trim() ? "not-allowed" : "pointer",
                    opacity: cancelMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {cancelMutation.isPending ? "Cancelling..." : issueRefund ? "Cancel & Refund" : "Cancel Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
