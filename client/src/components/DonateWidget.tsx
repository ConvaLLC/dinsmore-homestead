import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Heart, Check, Loader2, Award, Ticket, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  midnight:  "oklch(21.8% 0.036 251.3)",
  deepNavy:  "oklch(30.2% 0.056 255.4)",
  richNavy:  "oklch(34.6% 0.074 256.1)",
  cobalt:    "oklch(47.2% 0.088 247.4)",
  gold:      "oklch(74.2% 0.118 90.2)",
  goldBright:"oklch(76.7% 0.139 91.1)",
  goldPale:  "oklch(85.6% 0.068 89.7)",
  cream:     "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
  warmWhite: "oklch(97.8% 0.008 89.6)",
};

const PRESET_AMOUNTS = [25, 50, 100, 250];

type Step = "amount" | "info" | "confirm";

interface DonateWidgetProps {
  compact?: boolean;
}

export default function DonateWidget({ compact = false }: DonateWidgetProps) {
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const createDonation = trpc.donations.createOrder.useMutation();

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleDonate = async () => {
    if (!donorName || !donorEmail) {
      toast.error("Please enter your name and email address");
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      toast.error("Please enter a valid donation amount");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createDonation.mutateAsync({
        amount: String(finalAmount),
        donorName: isAnonymous ? "Anonymous" : donorName,
        donorEmail,
        message,
        anonymous: isAnonymous,
        origin: window.location.origin,
      });
      setPaymentId(result.paymentId || "");
      setStep("confirm");
      toast.success("Thank you for your generous donation!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("amount");
    setAmount(50);
    setCustomAmount("");
    setDonorName("");
    setDonorEmail("");
    setMessage("");
    setIsAnonymous(false);
  };

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div style={{ textAlign: "center", padding: compact ? "2rem 1rem" : "3rem 2rem" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Heart size={28} style={{ color: C.midnight }} />
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: C.midnight,
            marginBottom: "0.5rem",
          }}
        >
          Thank You!
        </h3>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "1.05rem",
            color: C.cobalt,
            marginBottom: "0.5rem",
          }}
        >
          Your donation of <strong>${(finalAmount || 0).toFixed(2)}</strong> helps preserve Kentucky history.
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.9rem",
            color: C.cobalt,
            marginBottom: "1.5rem",
          }}
        >
          Confirmation sent to <strong>{donorEmail}</strong>.
        </p>

        {/* Cross-sells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div
            style={{
              background: C.parchment,
              border: `1px solid ${C.goldPale}`,
              padding: "1rem",
              textAlign: "left",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} style={{ color: C.cobalt }} />
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: C.cobalt,
                  textTransform: "uppercase",
                }}
              >
                Become a Member
              </span>
            </div>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, margin: "0 0 0.75rem" }}>
              Enjoy free tours, gift shop discounts, and more — starting at $20/year.
            </p>
            <Link
              href="/membership"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: C.deepNavy,
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: `1px solid ${C.deepNavy}`,
                paddingBottom: "1px",
              }}
            >
              Join Now →
            </Link>
          </div>
          <div
            style={{
              background: C.parchment,
              border: `1px solid ${C.goldPale}`,
              padding: "1rem",
              textAlign: "left",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Ticket size={16} style={{ color: C.cobalt }} />
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: C.cobalt,
                  textTransform: "uppercase",
                }}
              >
                Book a Tour
              </span>
            </div>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, margin: "0 0 0.75rem" }}>
              Experience the authentic 1842 homestead with an expert-guided tour.
            </p>
            <Link
              href="/#book-a-tour"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: C.deepNavy,
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: `1px solid ${C.deepNavy}`,
                paddingBottom: "1px",
              }}
            >
              Book Now →
            </Link>
          </div>
        </div>

        <button
          onClick={resetForm}
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.9rem",
            color: C.cobalt,
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Make another donation
        </button>
      </div>
    );
  }

  // ── Info Step ─────────────────────────────────────────────────────────────
  if (step === "info") {
    return (
      <div style={{ padding: compact ? "1.5rem" : "2rem" }}>
        <button
          onClick={() => setStep("amount")}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            color: C.cobalt,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          ← Back
        </button>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: C.midnight,
            marginBottom: "1rem",
          }}
        >
          Complete Your Donation — ${(finalAmount || 0).toFixed(2)}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: C.cobalt,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.3rem",
              }}
            >
              Full Name *
            </label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Your full name"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: `1px solid ${C.cream}`,
                background: C.parchment,
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.95rem",
                color: C.midnight,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: C.cobalt,
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.3rem",
              }}
            >
              Email Address *
            </label>
            <input
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                border: `1px solid ${C.cream}`,
                background: C.parchment,
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.95rem",
                color: C.midnight,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              color: C.cobalt,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "0.3rem",
            }}
          >
            Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Leave a message with your donation..."
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: `1px solid ${C.cream}`,
              background: C.parchment,
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.95rem",
              color: C.midnight,
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            style={{ accentColor: C.deepNavy }}
          />
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt }}>
            Make this donation anonymous
          </span>
        </label>

        <button
          onClick={handleDonate}
          disabled={isSubmitting || !donorName || !donorEmail}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: isSubmitting || !donorName || !donorEmail
              ? C.cream
              : `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
            color: isSubmitting || !donorName || !donorEmail ? C.cobalt : C.gold,
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: `1px solid ${C.gold}44`,
            cursor: isSubmitting || !donorName || !donorEmail ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Heart size={15} /> Donate ${(finalAmount || 0).toFixed(2)}
            </>
          )}
        </button>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.75rem",
            color: C.cobalt,
            textAlign: "center",
            marginTop: "0.5rem",
            fontStyle: "italic",
          }}
        >
          501(c)(3) non-profit — your donation may be tax-deductible.
        </p>
      </div>
    );
  }

  // ── Amount Selection Step ─────────────────────────────────────────────────
  return (
    <div style={{ padding: compact ? "1.5rem" : "2rem" }}>
      <div className="flex items-center gap-2 mb-3">
        <Heart size={20} style={{ color: C.cobalt }} />
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: C.midnight,
            margin: 0,
          }}
        >
          Make a Donation
        </h3>
      </div>
      <div style={{ width: "40px", height: "2px", background: C.gold, marginBottom: "1rem" }} />
      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "0.95rem",
          color: C.cobalt,
          marginBottom: "1.25rem",
          lineHeight: 1.6,
        }}
      >
        Your generosity keeps this irreplaceable historic treasure alive for future generations.
        The Dinsmore Homestead Foundation is a 501(c)(3) non-profit.
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => { setAmount(preset); setCustomAmount(""); }}
            style={{
              padding: "0.5rem 1.25rem",
              border: `2px solid ${amount === preset && !customAmount ? C.gold : C.cream}`,
              background: amount === preset && !customAmount
                ? `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`
                : C.warmWhite,
              color: amount === preset && !customAmount ? C.midnight : C.cobalt,
              fontFamily: "'Playfair Display', serif",
              fontSize: "1rem",
              fontWeight: amount === preset && !customAmount ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            ${preset}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.cobalt }}>$</span>
        <input
          type="number"
          placeholder="Other amount"
          value={customAmount}
          onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
          min="1"
          style={{
            padding: "0.5rem 0.75rem",
            border: `1px solid ${C.cream}`,
            background: C.parchment,
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.95rem",
            color: C.midnight,
            outline: "none",
            width: "150px",
          }}
        />
      </div>

      <button
        onClick={() => finalAmount && finalAmount >= 1 && setStep("info")}
        disabled={!finalAmount || finalAmount < 1}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: finalAmount && finalAmount >= 1
            ? `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`
            : C.cream,
          color: finalAmount && finalAmount >= 1 ? C.gold : C.cobalt,
          fontFamily: "'Cinzel', serif",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          border: `1px solid ${finalAmount && finalAmount >= 1 ? C.gold + "44" : C.cream}`,
          cursor: finalAmount && finalAmount >= 1 ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <Heart size={15} />
        {finalAmount && finalAmount >= 1
          ? `Continue — $${finalAmount.toFixed(2)}`
          : "Select an Amount"}
      </button>
    </div>
  );
}
