import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Award, Check, Gift, Heart, Loader2, Ticket, ChevronRight, User } from "lucide-react";
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
  rose:      "oklch(68% 0.12 15)",
  rosePale:  "oklch(95% 0.03 15)",
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
  compact?: boolean;
}

// ── Shared input style helper ─────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${C.cream}`,
  background: C.parchment,
  fontFamily: "'EB Garamond', serif",
  fontSize: "0.95rem",
  color: C.midnight,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Cinzel', serif",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  color: C.cobalt,
  textTransform: "uppercase" as const,
  display: "block",
  marginBottom: "0.3rem",
};

export default function MembershipWidget({ compact = false }: MembershipWidgetProps) {
  const [step, setStep] = useState<Step>("tier");
  const [selectedTier, setSelectedTier] = useState<TierKey | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [customDonation, setCustomDonation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gift toggle
  const [isGift, setIsGift] = useState(false);

  // For-myself fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Gift recipient fields
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  // Gifter (purchaser) fields
  const [gifterName, setGifterName] = useState("");
  const [gifterEmail, setGifterEmail] = useState("");

  // Confirmation result
  const [confirmResult, setConfirmResult] = useState<{
    isGift: boolean;
    recipientName: string;
    recipientEmail: string;
    tier: string;
  } | null>(null);

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

  const isFormValid = () => {
    if (!selectedTier) return false;
    if (isGift) {
      return !!(recipientName && recipientEmail && gifterName && gifterEmail);
    }
    return !!(name && email);
  };

  const handlePurchase = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await purchaseMutation.mutateAsync({
        memberName: isGift ? recipientName : name,
        memberEmail: isGift ? recipientEmail : email,
        tier: selectedTier!,
        tierPrice,
        donationAmount,
        origin: window.location.origin,
        isGift,
        giftFromName: isGift ? gifterName : undefined,
        giftFromEmail: isGift ? gifterEmail : undefined,
        giftMessage: isGift && giftMessage ? giftMessage : undefined,
      });
      setConfirmResult({
        isGift,
        recipientName: isGift ? recipientName : name,
        recipientEmail: isGift ? recipientEmail : email,
        tier: selectedTierData?.label ?? "",
      });
      setStep("confirm");
      toast.success(isGift ? "Gift membership sent!" : "Welcome to the Dinsmore family!");
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
    setIsGift(false);
    setName(""); setEmail("");
    setRecipientName(""); setRecipientEmail(""); setGiftMessage("");
    setGifterName(""); setGifterEmail("");
    setConfirmResult(null);
  };

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (step === "confirm" && confirmResult) {
    return (
      <div style={{ textAlign: "center", padding: compact ? "2rem 1rem" : "3rem 2rem" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            background: confirmResult.isGift
              ? `linear-gradient(135deg, ${C.rose}, oklch(75% 0.14 15))`
              : `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          {confirmResult.isGift
            ? <Gift size={30} style={{ color: C.warmWhite }} />
            : <Check size={32} style={{ color: C.midnight }} />
          }
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
          {confirmResult.isGift ? "Gift Sent!" : "Welcome to the Family!"}
        </h3>

        {confirmResult.isGift ? (
          <>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: C.cobalt, marginBottom: "0.5rem" }}>
              Your <strong>{confirmResult.tier}</strong> gift membership has been sent to{" "}
              <strong>{confirmResult.recipientName}</strong>.
            </p>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt, marginBottom: "1.5rem" }}>
              A confirmation has been sent to <strong>{confirmResult.recipientEmail}</strong>.
              Their membership perks will be available at their next visit.
            </p>
          </>
        ) : (
          <>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: C.cobalt, marginBottom: "0.5rem" }}>
              Your <strong>{confirmResult.tier}</strong> membership is now active.
            </p>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt, marginBottom: "1.5rem" }}>
              A confirmation has been sent to <strong>{confirmResult.recipientEmail}</strong>.
              Your membership perks will be available at your next visit.
            </p>
          </>
        )}

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
              {confirmResult.isGift ? "Book a tour for the whole family!" : "Ready to use your free admission?"}
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
          {confirmResult.isGift ? "Give another gift membership" : "Purchase another membership"}
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
          {isGift ? "Give a Gift Membership" : "Complete Your Membership"}
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

        {/* Gift / For Myself toggle */}
        <div
          style={{
            display: "flex",
            background: C.parchment,
            border: `1px solid ${C.cream}`,
            marginBottom: "1.5rem",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setIsGift(false)}
            style={{
              flex: 1,
              padding: "0.6rem 0.5rem",
              border: "none",
              background: !isGift ? `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})` : "transparent",
              color: !isGift ? C.gold : C.cobalt,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
            }}
          >
            <User size={13} /> For Myself
          </button>
          <button
            onClick={() => setIsGift(true)}
            style={{
              flex: 1,
              padding: "0.6rem 0.5rem",
              border: "none",
              background: isGift ? `linear-gradient(135deg, ${C.rose}, oklch(75% 0.14 15))` : "transparent",
              color: isGift ? C.warmWhite : C.cobalt,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.62rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s ease",
            }}
          >
            <Gift size={13} /> Give as a Gift
          </button>
        </div>

        {/* For Myself: single name/email */}
        {!isGift && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
            </div>
          </div>
        )}

        {/* Gift mode: recipient + gifter sections */}
        {isGift && (
          <div style={{ marginBottom: "1.25rem" }}>
            {/* Gift banner */}
            <div
              style={{
                background: C.rosePale,
                border: `1px solid ${C.rose}44`,
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
              }}
            >
              <Gift size={16} style={{ color: C.rose, flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.midnight, margin: 0, lineHeight: 1.5 }}>
                You're gifting a <strong>{selectedTierData?.label}</strong> membership. The recipient will receive
                a confirmation with their membership details and perks.
              </p>
            </div>

            {/* Recipient section */}
            <div
              style={{
                border: `1px solid ${C.goldPale}`,
                padding: "1rem",
                marginBottom: "1rem",
                background: C.warmWhite,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: C.cobalt,
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `1px solid ${C.goldPale}`,
                }}
              >
                ✦ Recipient (the gift is for)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label style={labelStyle}>Recipient's Full Name *</label>
                  <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Their full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Recipient's Email *</label>
                  <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="their@email.com" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Personal Message (Optional)</label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write a personal message to include with the gift..."
                  maxLength={500}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.75rem", color: C.cobalt, textAlign: "right", margin: "0.2rem 0 0" }}>
                  {giftMessage.length}/500
                </p>
              </div>
            </div>

            {/* Gifter (purchaser) section */}
            <div
              style={{
                border: `1px solid ${C.goldPale}`,
                padding: "1rem",
                background: C.warmWhite,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: C.cobalt,
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `1px solid ${C.goldPale}`,
                }}
              >
                ✦ Your Information (the purchaser)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Your Full Name *</label>
                  <input type="text" value={gifterName} onChange={(e) => setGifterName(e.target.value)} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Your Email *</label>
                  <input type="email" value={gifterEmail} onChange={(e) => setGifterEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
                </div>
              </div>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: C.cobalt, fontStyle: "italic", margin: "0.5rem 0 0" }}>
                Your receipt and confirmation will be sent to this address.
              </p>
            </div>
          </div>
        )}

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
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.8rem", color: C.cobalt, fontStyle: "italic", margin: 0 }}>
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
          {isGift && recipientName && (
            <div className="flex justify-between mb-1">
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, fontStyle: "italic" }}>
                Gift for {recipientName}
              </span>
              <Gift size={14} style={{ color: C.rose }} />
            </div>
          )}
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
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt }}>Donation</span>
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
          disabled={isSubmitting || !isFormValid()}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: isSubmitting || !isFormValid()
              ? C.cream
              : isGift
                ? `linear-gradient(135deg, ${C.rose}, oklch(75% 0.14 15))`
                : `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
            color: isSubmitting || !isFormValid() ? C.cobalt : isGift ? C.warmWhite : C.gold,
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            border: `1px solid ${isGift ? C.rose + "66" : C.gold + "44"}`,
            cursor: isSubmitting || !isFormValid() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" /> Processing...</>
          ) : isGift ? (
            <><Gift size={15} /> Send Gift — ${total.toFixed(2)}</>
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
          {isGift
            ? "Recipient will receive confirmation by email. 501(c)(3) tax-deductible."
            : "Membership perks available at your next visit. 501(c)(3) tax-deductible."}
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
