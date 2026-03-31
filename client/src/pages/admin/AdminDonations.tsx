import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminNav } from "./AdminDashboard";
import { Lock, Heart } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminDonations() {
  const { user, isAuthenticated } = useAuth();
  const { data: donations, isLoading } = trpc.donations.adminList.useQuery();

  if (!isAuthenticated || (user as any)?.role !== "admin") {
    return <div className="py-24 text-center container"><Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} /><h2>Admin Access Required</h2><a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a></div>;
  }

  const total = donations?.reduce((sum: number, d: any) => sum + parseFloat(d.amount || "0"), 0) || 0;

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(97.8% 0.008 89.6)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div><span className="section-label">Admin</span><h2 style={{ fontSize: "1.75rem" }}>Donations</h2></div>
            <div className="card-vintage p-4 text-center">
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)", margin: 0 }}>Total Received</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "oklch(34.6% 0.074 256.1)", margin: 0 }}>${total.toFixed(2)}</p>
            </div>
          </div>
          {isLoading ? <div className="text-center py-12" style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)" }}>Loading...</div> : donations && donations.length > 0 ? (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'EB Garamond', serif", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "oklch(21.8% 0.036 251.3)", color: "oklch(87.6% 0.068 89.7)" }}>
                    {["Donor", "Email", "Amount", "Message", "Status", "Date"].map((h) => (
                      <th key={h} style={{ padding: "0.6rem 0.75rem", textAlign: "left", fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d: any, i: number) => (
                    <tr key={d.id} style={{ background: i % 2 === 0 ? "oklch(97.8% 0.008 89.6)" : "oklch(94.7% 0.029 89.6)", borderBottom: "1px solid oklch(87.6% 0.068 89.7)" }}>
                      <td style={{ padding: "0.5rem 0.75rem" }}>{d.isAnonymous ? "Anonymous" : d.donorName}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(74.2% 0.118 90.2)" }}>{d.donorEmail}</td>
                      <td style={{ padding: "0.5rem 0.75rem", fontWeight: 600, color: "oklch(34.6% 0.074 256.1)" }}>${d.amount}</td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(74.2% 0.118 90.2)", fontStyle: "italic", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.message || "—"}</td>
                      <td style={{ padding: "0.5rem 0.75rem" }}>
                        <span style={{ padding: "0.2rem 0.6rem", background: d.paymentStatus === "completed" ? "oklch(85% 0.08 155)" : "oklch(87.6% 0.068 89.7)", color: d.paymentStatus === "completed" ? "oklch(25% 0.08 155)" : "oklch(47.2% 0.088 247.4)", fontSize: "0.75rem", fontFamily: "'Playfair Display', serif" }}>{d.paymentStatus}</span>
                      </td>
                      <td style={{ padding: "0.5rem 0.75rem", color: "oklch(74.2% 0.118 90.2)", fontSize: "0.8rem" }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart size={48} style={{ color: "oklch(87.6% 0.068 89.7)", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)", fontStyle: "italic" }}>No donations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
