import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Award, Check, Heart, Loader2, Ticket, ChevronRight } from "lucide-react";
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

const MEMBERSHIP_TIERS = [
  { key: "senior",     label: "Senior",     price: 20,  desc: "65 and older" },
  { key: "individual", label: "Individual", price: 35,  desc: "Single membership" },
  { key: "family",     label: "Family",     price: 60,  desc: "Household membership" },
  { key: "friends",    label: "Friends",    price: 100, desc: "Premium supporter" },
] as const;

type TierKey = typeof MEMBERSHIP_TIERS[number]["key"];

const MEMBERSHIP_PERKS = [
  "Free admission for tours of the historic Dinsmore Home",
  "10% discount on all gift shop items (excl. consignments)",
  "Subscription to the Dinsmore Dispatch newsletter",
  "2 Guest passes per year",
];

const DONATION_PRESETS = [5, 10, 25, 50];

type Step = "tier" | "info" | "confirm";

interface MembershipWidgetProps {
  /** If true, shows the widget in compact inline mode (for homepage section) */
  compact?: boolean;
}

export default function MembershipWidget({ compact = false }: MembershipWidgetProps) {
  const [step, setStep] = useState<Step>("tier");
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customDonation, setCustomDonation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const purchaseMutation = trpc.memberships.purchaseStandalone.useMutation();

  const selectedTierData = MEMBERSHIP_TIERS.find(t => t.key === selectedTier);
  const tierPrice = selectedTierData?.price ?? 0;
  const total = tierPrice + donationAmount;

  const handleDonationPreset = (amt: number) => {
    setDonationAmount(amt);
    setCustomDonation("");
  };

  const handleCustomDonation = (val: string) => {
    setCustomDonation(val);
    const parsed = parseFloat(val);
    setDonationAmount(parsed > 0 ? parsed : 0);
  };

  const handlePurchase = async () => {
    if (!selectedTier || !name || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await purchaseMutation.mutateAsync({
        memberName: name,
        memberEmail: email,
        tier: selectedTier,
        tierPrice,
        donationAmount,
        origin: window.location.origin,
      });
      setStep("confirm");
      toast.success("Welcome to the Dinsmore family!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process membership. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("tier");
    setSelectedTier(null);
    setDonationAmount(0);
    setCustomDonation("");
    setName("");
    setEmail("");
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
          <Check size={32} style={{ color: C.midnight }} />
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
          Welcome to the Family!
        </h3>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "1.05rem",
            color: C.cobalt,
            marginBottom: "0.5rem",
          }}
        >
          Your <strong>{selectedTierData?.label}</strong> membership is now active.
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.95rem",
            color: C.cobalt,
            marginBottom: "1.5rem",
          }}
        >
          A confirmation has been sent to <strong>{email}</strong>.
          Your membership perks will be available at your next visit.
        </p>

        {/* Cross-sell: Book a Tour */}
        <div
          style={{
            background: C.parchment,
            border: `1px solid ${C.goldPale}`,
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={18} style={{ color: C.cobalt }} />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: C.cobalt,
                textTransform: "uppercase",
              }}
            >
              Ready to use your free admission?
            </span>
          </div>
          <Link
            href="/#book-a-tour"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
              color: C.gold,
              padding: "0.6rem 1.5rem",
              border: `1px solid ${C.gold}66`,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Book a Tour Now <ChevronRight size={14} />
          </Link>
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
            marginTop: "0.5rem",
          }}
        >
          Purchase another membership
        </button>
      </div>
    );
  }

  // ── Info Step ─────────────────────────────────────────────────────────────
  if (step === "info") {
    return (
      <div style={{ padding: compact ? "1.5rem" : "2rem" }}>
        {/* Back button */}
        <button
          onClick={() => setStep("tier")}
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
          ← Back to Tiers
        </button>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: C.midnight,
            marginBottom: "0.25rem",
          }}
        >
          Complete Your Membership
        </h3>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.95rem",
            color: C.cobalt,
            marginBottom: "1.25rem",
          }}
        >
          {selectedTierData?.label} Membership — ${tierPrice}/year
        </p>

        {/* Contact fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

        {/* Optional donation */}
        <div
          style={{
            background: C.parchment,
            border: `1px solid ${C.goldPale}`,
            padding: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} style={{ color: C.cobalt }} />
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                color: C.cobalt,
                textTransform: "uppercase",
              }}
            >
              Add a Donation (Optional)
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {DONATION_PRESETS.map((amt) => (
              <button
                key={amt}
                onClick={() => handleDonationPreset(amt)}
                style={{
                  padding: "0.35rem 0.85rem",
                  border: `1px solid ${donationAmount === amt && !customDonation ? C.gold : C.cream}`,
                  background: donationAmount === amt && !customDonation
                    ? `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`
                    : C.warmWhite,
                  color: donationAmount === amt && !customDonation ? C.midnight : C.cobalt,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.9rem",
                  fontWeight: donationAmount === amt && !customDonation ? 700 : 400,
                  cursor: "pointer",
                }}
              >
                ${amt}
              </button>
            ))}
            <div className="flex items-center gap-1">
              <span style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt }}>$</span>
              <input
                type="number"
                placeholder="Other"
                value={customDonation}
                onChange={(e) => handleCustomDonation(e.target.value)}
                min="1"
                style={{
                  width: "80px",
                  padding: "0.35rem 0.5rem",
                  border: `1px solid ${C.cream}`,
                  background: C.warmWhite,
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.9rem",
                  color: C.midnight,
                  outline: "none",
                }}
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.8rem",
              color: C.cobalt,
              fontStyle: "italic",
              margin: 0,
            }}
          >
            Your donation helps preserve this irreplaceable historic treasure.
          </p>
        </div>

        {/* Order summary */}
        <div
          style={{
            background: C.warmWhite,
            border: `1px solid ${C.cream}`,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <div className="flex justify-between mb-1">
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt }}>
              {selectedTierData?.label} Membership
            </span>
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.midnight, fontWeight: 600 }}>
              ${tierPrice.toFixed(2)}
            </span>
          </div>
          {donationAmount > 0 && (
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt }}>
                Donation
              </span>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.midnight, fontWeight: 600 }}>
                ${donationAmount.toFixed(2)}
              </span>
            </div>
          )}
          <div
            style={{ borderTop: `1px solid ${C.cream}`, paddingTop: "0.5rem", marginTop: "0.5rem" }}
            className="flex justify-between"
          >
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.1em", color: C.midnight, textTransform: "uppercase" }}>
              Total
            </span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: C.deepNavy }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isSubmitting || !name || !email}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: isSubmitting || !name || !email
              ? C.cream
              : `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
            color: isSubmitting || !name || !email ? C.cobalt : C.gold,
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: `1px solid ${C.gold}44`,
            cursor: isSubmitting || !name || !email ? "not-allowed" : "pointer",
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
            <>Complete Membership — ${total.toFixed(2)}</>
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
          Membership perks available at your next visit. 501(c)(3) tax-deductible.
        </p>
      </div>
    );
  }

  // ── Tier Selection Step ───────────────────────────────────────────────────
  return (
    <div style={{ padding: compact ? "1.5rem" : "2rem" }}>
      {/* Perks banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
          padding: "1.25rem",
          marginBottom: "1.5rem",
          border: `1px solid ${C.gold}33`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Award size={18} style={{ color: C.gold }} />
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: C.gold,
              textTransform: "uppercase",
            }}
          >
            Member Benefits
          </span>
        </div>
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {MEMBERSHIP_PERKS.map((perk) => (
            <li
              key={perk}
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: C.cream,
                marginBottom: "0.2rem",
                lineHeight: 1.4,
              }}
            >
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {MEMBERSHIP_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.key;
          return (
            <button
              key={tier.key}
              onClick={() => setSelectedTier(tier.key)}
              style={{
                padding: "1rem",
                border: `2px solid ${isSelected ? C.gold : C.cream}`,
                background: isSelected
                  ? `linear-gradient(135deg, ${C.parchment}, ${C.warmWhite})`
                  : C.warmWhite,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(to right, ${C.gold}, ${C.goldBright})`,
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: isSelected ? C.deepNavy : C.cobalt,
                  lineHeight: 1,
                }}
              >
                ${tier.price}
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: isSelected ? C.midnight : C.cobalt,
                  textTransform: "uppercase",
                  marginTop: "0.35rem",
                }}
              >
                {tier.label}
              </div>
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.8rem",
                  color: C.cobalt,
                  marginTop: "0.15rem",
                }}
              >
                {tier.desc}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => selectedTier && setStep("info")}
        disabled={!selectedTier}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: selectedTier
            ? `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`
            : C.cream,
          color: selectedTier ? C.gold : C.cobalt,
          fontFamily: "'Cinzel', serif",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          border: `1px solid ${selectedTier ? C.gold + "44" : C.cream}`,
          cursor: selectedTier ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {selectedTier
          ? `Continue — $${tierPrice}/year`
          : "Select a Membership Tier"}
      </button>
    </div>
  );
}
