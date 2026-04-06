import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Users, Crown } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useMemo } from "react";

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

const TIER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  senior: { label: "Senior", color: C.navy, bg: C.cream },
  individual: { label: "Individual", color: "oklch(30% 0.1 250)", bg: "oklch(92% 0.03 250)" },
  family: { label: "Family", color: "oklch(25% 0.08 155)", bg: "oklch(92% 0.04 155)" },
  friends: { label: "Friends", color: "oklch(35% 0.12 50)", bg: "oklch(90% 0.06 50)" },
};

export default function AdminMemberships() {
  const { user, isAuthenticated } = useAuth();
  const { data: memberships, isLoading } = trpc.memberships.adminList.useQuery();

  const activeMemberships = useMemo(() => memberships?.filter((m: any) => m.status === "active") || [], [memberships]);
  const totalMemberRevenue = useMemo(() => memberships?.reduce((sum: number, m: any) => sum + parseFloat(m.amount || "0"), 0) || 0, [memberships]);

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

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: C.parchment, minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="mb-6">
            <span className="section-label">Admin</span>
            <h2 style={{ fontSize: "1.75rem" }}>Memberships</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", color: C.steel, marginTop: "0.25rem" }}>
              Dinsmore's Extended Family & Friends Circle members.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Members", value: memberships?.length || 0 },
              { label: "Active Members", value: activeMemberships.length },
              { label: "Membership Revenue", value: `$${totalMemberRevenue.toFixed(2)}` },
            ].map(s => (
              <div key={s.label} className="card-vintage p-4 text-center">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.navy }}>{s.value}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.steel }}>{s.label}</div>
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: C.gold }}>Loading memberships...</div>
          ) : memberships && memberships.length > 0 ? (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'EB Garamond', serif", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: C.midnight, color: C.gold }}>
                    {["Member", "Email", "Tier", "Amount", "Status", "Starts", "Expires"].map(h => (
                      <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((m: any, i: number) => {
                    const tier = TIER_LABELS[m.tier] || { label: m.tier, color: C.navy, bg: C.cream };
                    const isActive = m.status === "active";
                    const isExpired = new Date(m.expiresAt) < new Date();
                    return (
                      <tr key={m.id} style={{ background: i % 2 === 0 ? "white" : C.parchment, borderBottom: `1px solid ${C.goldLight}` }}>
                        <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>{m.memberName}</td>
                        <td style={{ padding: "0.5rem 0.75rem", color: C.gold }}>{m.memberEmail}</td>
                        <td style={{ padding: "0.5rem 0.75rem" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            padding: "0.15rem 0.6rem",
                            fontSize: "0.7rem",
                            fontFamily: "'Playfair Display', serif",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            borderRadius: "3px",
                            background: tier.bg,
                            color: tier.color,
                          }}>
                            {m.tier === "friends" && <Crown size={12} />}
                            {tier.label}
                          </span>
                        </td>
                        <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600 }}>${m.amount}</td>
                        <td style={{ padding: "0.5rem 0.75rem" }}>
                          <span style={{
                            padding: "0.15rem 0.5rem",
                            fontSize: "0.7rem",
                            fontFamily: "'Playfair Display', serif",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            borderRadius: "3px",
                            background: isActive && !isExpired ? C.green : "oklch(90% 0.05 25)",
                            color: isActive && !isExpired ? C.greenDark : C.red,
                          }}>
                            {isExpired ? "expired" : m.status}
                          </span>
                        </td>
                        <td style={{ padding: "0.5rem 0.75rem", color: C.steel, fontSize: "0.8rem" }}>{new Date(m.startsAt).toLocaleDateString()}</td>
                        <td style={{ padding: "0.5rem 0.75rem", color: C.steel, fontSize: "0.8rem" }}>{new Date(m.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users size={48} style={{ color: C.goldLight, margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: C.gold, fontStyle: "italic" }}>No memberships yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
