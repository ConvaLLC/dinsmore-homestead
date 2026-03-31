import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { BookOpen, Lock, Download, ChevronRight, FileText } from "lucide-react";
import { Streamdown } from "streamdown";

export default function EducationContentPage() {
  const params = useParams<{ slug: string }>();
  const { user, isAuthenticated } = useAuth();
  const hasAccess = isAuthenticated && (user as any)?.educationVerified;

  const { data: item, isLoading } = trpc.education.contentBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: hasAccess }
  );

  if (!isAuthenticated) {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} />
        <h2>Sign In Required</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
          Please sign in and verify your educator access to view this resource.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a>
          <Link href="/education/register" className="btn-vintage">Register for Access</Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} />
        <h2>Educator Verification Required</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
          Please complete the email verification process to access educational resources.
        </p>
        <Link href="/education/register" className="btn-vintage-filled">Complete Verification</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div style={{ width: "40px", height: "40px", border: "3px solid oklch(87.6% 0.068 89.7)", borderTopColor: "oklch(34.6% 0.074 256.1)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center container">
        <FileText size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} />
        <h2>Resource Not Found</h2>
        <Link href="/education" className="btn-vintage mt-4 inline-block">Back to Portal</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <div style={{ position: "absolute", inset: 0, background: "oklch(21.8% 0.036 251.3)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-8">
          <nav style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: "oklch(87.6% 0.068 89.7)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Link href="/education" style={{ color: "oklch(87.6% 0.068 89.7)" }}>Education Portal</Link>
            <ChevronRight size={12} />
            <span style={{ color: "oklch(87.6% 0.068 89.7)" }}>{item.title}</span>
          </nav>
          <span className="section-label" style={{ color: "oklch(74.2% 0.118 90.2)" }}>
            {item.category.replace("_", " ")}
          </span>
          <h1 style={{ color: "oklch(97.8% 0.008 89.6)", fontSize: "1.75rem" }}>{item.title}</h1>
        </div>
      </div>

      <section className="py-10" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="card-vintage p-6">
                {item.thumbnailUrl && (
                  <img src={item.thumbnailUrl} alt={item.title} className="img-vintage w-full mb-6" style={{ maxHeight: "300px", objectFit: "cover" }} />
                )}
                <div
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "1.05rem",
                    color: "oklch(47.2% 0.088 247.4)",
                    lineHeight: 1.8,
                  }}
                >
                  <Streamdown>{item.content || "Content coming soon."}</Streamdown>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-vintage-filled block text-center"
                >
                  <Download size={14} style={{ display: "inline", marginRight: "0.4rem" }} />
                  Download Resource
                </a>
              )}
              <div className="card-vintage p-4">
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", marginBottom: "0.75rem" }}>Details</h4>
                <dl className="space-y-2">
                  {item.gradeLevel && (
                    <>
                      <dt style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)" }}>Grade Level</dt>
                      <dd style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)", marginBottom: "0.5rem" }}>{item.gradeLevel}</dd>
                    </>
                  )}
                  {item.subject && (
                    <>
                      <dt style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)" }}>Subject</dt>
                      <dd style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)", marginBottom: "0.5rem" }}>{item.subject}</dd>
                    </>
                  )}
                  <dt style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(74.2% 0.118 90.2)" }}>Category</dt>
                  <dd style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)" }}>{item.category.replace("_", " ")}</dd>
                </dl>
              </div>
              <Link href="/education" className="btn-vintage block text-center text-xs">
                ← Back to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
