import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { IMAGES } from "../../../shared/images";
import { BookOpen, Mail, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";

type Step = "info" | "request" | "verify" | "done";

export default function EducationRegisterPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("info");

  // Request access fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("teacher");
  const [reason, setReason] = useState("");

  // Verify fields
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestAccess = trpc.education.requestAccess.useMutation();
  const verifyCodeMutation = trpc.education.verifyCode.useMutation();

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in your name and email address");
      return;
    }
    setIsLoading(true);
    try {
      await requestAccess.mutateAsync({ name, email, organization, role, reason });
      setStep("verify");
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error("Please enter the 6-digit code from your email");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please sign in first to verify your access.");
      return;
    }
    setIsLoading(true);
    try {
      await verifyCodeMutation.mutateAsync({ email, code });
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "240px" }}>
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
          <span className="section-label" style={{ color: "oklch(64.3% 0.161 143.4)" }}>
            Educator Access
          </span>
          <h1 style={{ color: "oklch(96% 0.014 110)" }}>Education Portal</h1>
        </div>
      </div>

      <section className="py-12" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Form */}
            <div>
              {step === "done" ? (
                <div className="card-vintage p-8 text-center">
                  <CheckCircle size={56} style={{ color: "oklch(42.3% 0.087 144.3)", margin: "0 auto 1rem" }} />
                  <h2>Access Granted!</h2>
                  <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(44% 0.055 144)", marginBottom: "1.5rem" }}>
                    Your email has been verified. You now have full access to the Education Portal.
                  </p>
                  <Link href="/education" className="btn-vintage-filled">
                    Enter the Education Portal
                  </Link>
                </div>
              ) : step === "verify" ? (
                <div className="card-vintage p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail size={20} style={{ color: "oklch(33.1% 0.064 144.7)" }} />
                    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Verify Your Email</h2>
                  </div>
                  <div style={{ width: "40px", height: "2px", background: "oklch(64.3% 0.161 143.4)", marginBottom: "1.25rem" }} />
                  <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(44% 0.055 144)", marginBottom: "1rem" }}>
                    We sent a 6-digit verification code to <strong>{email}</strong>. 
                    Please check your inbox and enter the code below.
                  </p>
                  {!isAuthenticated && (
                    <div
                      style={{
                        background: "oklch(93.6% 0.037 136.6)",
                        border: "1px solid oklch(78% 0.055 135)",
                        padding: "0.75rem 1rem",
                        marginBottom: "1rem",
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.9rem",
                        color: "oklch(42.3% 0.087 144.3)",
                      }}
                    >
                      <Lock size={14} style={{ display: "inline", marginRight: "0.4rem", color: "oklch(64.3% 0.161 143.4)" }} />
                      You need to{" "}
                      <a href={getLoginUrl()} style={{ color: "oklch(33.1% 0.064 144.7)", fontWeight: 600 }}>
                        sign in
                      </a>{" "}
                      before verifying your code.
                    </div>
                  )}
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                      <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(44% 0.055 144)", display: "block", marginBottom: "0.3rem" }}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid oklch(78% 0.055 135)",
                          background: "oklch(93.6% 0.037 136.6)",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.5rem",
                          letterSpacing: "0.5em",
                          textAlign: "center",
                          color: "oklch(20% 0.03 145)",
                          outline: "none",
                        }}
                      />
                    </div>
                    <button type="submit" disabled={isLoading || !isAuthenticated} className="btn-vintage-filled w-full">
                      {isLoading ? "Verifying..." : "Verify & Get Access"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("request")}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.85rem",
                        color: "oklch(64.3% 0.161 143.4)",
                        cursor: "pointer",
                        textDecoration: "underline",
                        display: "block",
                        margin: "0 auto",
                      }}
                    >
                      Resend code
                    </button>
                  </form>
                </div>
              ) : (
                <div className="card-vintage p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={20} style={{ color: "oklch(33.1% 0.064 144.7)" }} />
                    <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Request Access</h2>
                  </div>
                  <div style={{ width: "40px", height: "2px", background: "oklch(64.3% 0.161 143.4)", marginBottom: "1.25rem" }} />
                  <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(44% 0.055 144)", marginBottom: "1.25rem" }}>
                    Fill in your information below. We'll send a verification code to your email address 
                    to confirm your identity and grant access to the portal.
                  </p>
                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    {[
                      { label: "Full Name *", value: name, setter: setName, type: "text" },
                      { label: "Email Address *", value: email, setter: setEmail, type: "email" },
                      { label: "School / Organization", value: organization, setter: setOrganization, type: "text" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(44% 0.055 144)", display: "block", marginBottom: "0.3rem" }}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(78% 0.055 135)", background: "oklch(93.6% 0.037 136.6)", fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(20% 0.03 145)", outline: "none" }}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(44% 0.055 144)", display: "block", marginBottom: "0.3rem" }}>
                        I am a...
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(78% 0.055 135)", background: "oklch(93.6% 0.037 136.6)", fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(20% 0.03 145)", outline: "none" }}
                      >
                        <option value="teacher">Teacher / Educator</option>
                        <option value="student">Student</option>
                        <option value="researcher">Researcher</option>
                        <option value="homeschool">Homeschool Parent</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(44% 0.055 144)", display: "block", marginBottom: "0.3rem" }}>
                        How will you use these resources? (optional)
                      </label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid oklch(78% 0.055 135)", background: "oklch(93.6% 0.037 136.6)", fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(20% 0.03 145)", outline: "none", resize: "vertical" }}
                      />
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-vintage-filled w-full">
                      {isLoading ? "Sending Code..." : "Send Verification Code"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <div className="space-y-6">
              <div className="card-vintage p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={18} style={{ color: "oklch(33.1% 0.064 144.7)" }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", margin: 0 }}>
                    What's in the Education Portal?
                  </h3>
                </div>
                <div style={{ width: "30px", height: "2px", background: "oklch(64.3% 0.161 143.4)", marginBottom: "1rem" }} />
                <ul style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(42.3% 0.087 144.3)", paddingLeft: "1.25rem", lineHeight: 1.8 }}>
                  <li>Kentucky Standards-aligned lesson plans</li>
                  <li>Primary source documents and transcriptions</li>
                  <li>Historical photographs and maps</li>
                  <li>Curriculum guides for grades K–12</li>
                  <li>Virtual tour resources and activity sheets</li>
                  <li>Research materials and bibliography</li>
                </ul>
              </div>
              <div className="p-5" style={{ background: "oklch(27% 0.045 50)", borderLeft: "4px solid oklch(64.3% 0.161 143.4)" }}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(86.6% 0.079 130.9)", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>
                  "Access to the Education Portal is free for all educators, students, and researchers. 
                  We simply ask that you register so we can better understand how our resources are being used."
                </p>
              </div>
              <img src={IMAGES.farmPhoto1} alt="Dinsmore Homestead" className="img-vintage w-full" style={{ height: "180px", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
