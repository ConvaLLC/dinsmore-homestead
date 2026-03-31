import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { IMAGES } from "../../../shared/images";
import { BookOpen, Lock, FileText, Download, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "All Resources" },
  { value: "lesson_plan", label: "Lesson Plans" },
  { value: "research", label: "Research" },
  { value: "resource", label: "Resources" },
  { value: "newsletter", label: "Newsletters" },
  { value: "program", label: "Programs" },
];

function GatedMessage() {
  return (
    <div className="py-16 text-center">
      <div
        style={{
          width: "80px",
          height: "80px",
          background: "oklch(87.6% 0.068 89.7)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}
      >
        <Lock size={36} style={{ color: "oklch(74.2% 0.118 90.2)" }} />
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: "0.75rem" }}>
        Educator Access Required
      </h2>
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "1.05rem",
          color: "oklch(47.2% 0.088 247.4)",
          maxWidth: "500px",
          margin: "0 auto 2rem",
          lineHeight: 1.7,
        }}
      >
        The Education Portal contains lesson plans, primary sources, and curriculum materials 
        for educators and researchers. Registration is free and takes just a few minutes.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/education/register" className="btn-vintage-filled">
          Register for Free Access
        </Link>
        <a href={getLoginUrl()} className="btn-vintage">
          Sign In
        </a>
      </div>
    </div>
  );
}

export default function EducationPortalPage() {
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState("all");

  const { data: content, isLoading } = trpc.education.content.useQuery(
    { category: category === "all" ? undefined : category },
    { enabled: isAuthenticated && !!(user as any)?.educationVerified }
  );

  const hasAccess = isAuthenticated && (user as any)?.educationVerified;

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "260px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGES.farmHDR})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(20%)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.72)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-8">
          <span className="section-label" style={{ color: "oklch(74.2% 0.118 90.2)" }}>
            Dinsmore Homestead Museum
          </span>
          <h1 style={{ color: "oklch(97.8% 0.008 89.6)" }}>Education Portal</h1>
          <p style={{ color: "oklch(87.6% 0.068 89.7)", fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
            Lesson plans, primary sources, and curriculum resources for educators
          </p>
        </div>
      </div>

      <section className="py-10" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
        <div className="container">
          {!isAuthenticated ? (
            <GatedMessage />
          ) : !hasAccess ? (
            <div className="py-12 text-center">
              <Lock size={48} style={{ color: "oklch(74.2% 0.118 90.2)", margin: "0 auto 1rem" }} />
              <h2>Verify Your Email to Access Resources</h2>
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "500px", margin: "0 auto 1.5rem" }}>
                You're signed in, but your educator access hasn't been verified yet. 
                Complete the verification process to access all resources.
              </p>
              <Link href="/education/register" className="btn-vintage-filled">
                Complete Verification
              </Link>
            </div>
          ) : (
            <>
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "0.4rem 1rem",
                      border: "1px solid",
                      borderColor: category === cat.value ? "oklch(34.6% 0.074 256.1)" : "oklch(87.6% 0.068 89.7)",
                      background: category === cat.value ? "oklch(34.6% 0.074 256.1)" : "transparent",
                      color: category === cat.value ? "oklch(97.8% 0.008 89.6)" : "oklch(47.2% 0.088 247.4)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card-vintage" style={{ height: "160px", background: "oklch(87.6% 0.068 89.7)", animation: "pulse 2s infinite" }} />
                  ))}
                </div>
              ) : content && content.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {content.map((item: any) => (
                    <Link key={item.id} href={`/education/${item.slug}`} className="block group">
                      <div className="card-vintage p-5 h-full flex flex-col transition-all duration-200 group-hover:shadow-md">
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full object-cover mb-3"
                            style={{ height: "120px", filter: "sepia(10%)" }}
                          />
                        )}
                        <div className="flex items-start gap-2 mb-2">
                          <FileText size={16} style={{ color: "oklch(74.2% 0.118 90.2)", flexShrink: 0, marginTop: "0.15rem" }} />
                          <span className="section-label" style={{ fontSize: "0.6rem" }}>
                            {item.category.replace("_", " ")}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "oklch(21.8% 0.036 251.3)",
                            marginBottom: "0.5rem",
                            flex: 1,
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.gradeLevel && (
                          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(74.2% 0.118 90.2)", margin: 0 }}>
                            Grades: {item.gradeLevel}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          {item.fileUrl && (
                            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: "oklch(34.6% 0.074 256.1)" }}>
                              <Download size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
                              Download
                            </span>
                          )}
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(34.6% 0.074 256.1)", marginLeft: "auto" }}>
                            View <ChevronRight size={12} style={{ display: "inline" }} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen size={48} style={{ color: "oklch(87.6% 0.068 89.7)", margin: "0 auto 1rem" }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "oklch(47.2% 0.088 247.4)" }}>
                    No resources in this category yet
                  </h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(74.2% 0.118 90.2)" }}>
                    New educational content is added regularly. Check back soon!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
