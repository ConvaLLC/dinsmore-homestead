import { useState } from "react";
import { Check, Minus, Star, ChevronDown, ChevronUp } from "lucide-react";

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
  green:     "oklch(55% 0.15 145)",
  greenPale: "oklch(92% 0.04 145)",
};

// ── Tier definitions ─────────────────────────────────────────────────────────
const TIERS = [
  { key: "senior",     label: "Senior",     price: 20,  tagline: "Ages 65+",          featured: false },
  { key: "individual", label: "Individual", price: 35,  tagline: "Single adult",      featured: false },
  { key: "family",     label: "Family",     price: 60,  tagline: "Household",         featured: false },
  { key: "friends",    label: "Friends",    price: 100, tagline: "Premium supporter", featured: true },
] as const;

// ── Benefit categories & rows ────────────────────────────────────────────────
// "yes" = included, "no" = not included, string = custom value
type BenefitValue = "yes" | "no" | string;

interface BenefitRow {
  label: string;
  tooltip?: string;
  values: Record<string, BenefitValue>;
}

interface BenefitCategory {
  category: string;
  rows: BenefitRow[];
}

const BENEFITS: BenefitCategory[] = [
  {
    category: "Admission & Tours",
    rows: [
      {
        label: "Free guided house tours",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
      {
        label: "Members covered per visit",
        values: { senior: "1", individual: "1", family: "Up to 5", friends: "Up to 5" },
      },
      {
        label: "Complimentary guest passes",
        values: { senior: "2/year", individual: "2/year", family: "2/year", friends: "4/year" },
      },
      {
        label: "Priority booking for special tours",
        values: { senior: "no", individual: "no", family: "yes", friends: "yes" },
      },
    ],
  },
  {
    category: "Gift Shop & Discounts",
    rows: [
      {
        label: "Gift shop discount",
        tooltip: "Excludes consignment items",
        values: { senior: "10%", individual: "10%", family: "10%", friends: "15%" },
      },
      {
        label: "Early access to new merchandise",
        values: { senior: "no", individual: "no", family: "no", friends: "yes" },
      },
    ],
  },
  {
    category: "Communications",
    rows: [
      {
        label: "Dinsmore Dispatch newsletter (online)",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
      {
        label: "Dinsmore Dispatch newsletter (print)",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
      {
        label: "Advance notice of events & programs",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
    ],
  },
  {
    category: "Events & Recognition",
    rows: [
      {
        label: "Invitation to members-only events",
        values: { senior: "no", individual: "no", family: "yes", friends: "yes" },
      },
      {
        label: "Name listed on donor wall",
        values: { senior: "no", individual: "no", family: "no", friends: "yes" },
      },
      {
        label: "Annual recognition in Dispatch",
        values: { senior: "no", individual: "no", family: "no", friends: "yes" },
      },
    ],
  },
  {
    category: "Tax & Giving",
    rows: [
      {
        label: "Tax-deductible (501(c)(3))",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
      {
        label: "Supports preservation & education",
        values: { senior: "yes", individual: "yes", family: "yes", friends: "yes" },
      },
    ],
  },
];

// ── Render helpers ───────────────────────────────────────────────────────────
function BenefitCell({ value }: { value: BenefitValue }) {
  if (value === "yes") {
    return (
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: C.greenPale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <Check size={14} style={{ color: C.green }} strokeWidth={3} />
      </div>
    );
  }
  if (value === "no") {
    return (
      <Minus size={16} style={{ color: `${C.cobalt}44`, margin: "0 auto", display: "block" }} />
    );
  }
  // Custom string value
  return (
    <span
      style={{
        fontFamily: "'EB Garamond', serif",
        fontSize: "0.9rem",
        fontWeight: 600,
        color: C.deepNavy,
        display: "block",
        textAlign: "center",
      }}
    >
      {value}
    </span>
  );
}

// ── Mobile card view ─────────────────────────────────────────────────────────
function MobileComparisonCards() {
  const [expandedTier, setExpandedTier] = useState<string | null>("friends");

  return (
    <div className="flex flex-col gap-4">
      {TIERS.map((tier) => {
        const isExpanded = expandedTier === tier.key;
        return (
          <div
            key={tier.key}
            style={{
              background: tier.featured ? C.warmWhite : C.warmWhite,
              border: `1px solid ${tier.featured ? C.gold : C.goldPale}`,
              overflow: "hidden",
              ...(tier.featured
                ? { boxShadow: `0 4px 20px ${C.gold}33` }
                : {}),
            }}
          >
            {/* Header — always visible */}
            <button
              onClick={() => setExpandedTier(isExpanded ? null : tier.key)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                background: tier.featured
                  ? `linear-gradient(135deg, ${C.midnight}, ${C.deepNavy})`
                  : C.parchment,
                border: "none",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                {tier.featured && <Star size={16} style={{ color: C.gold }} fill={C.gold} />}
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      color: tier.featured ? C.gold : C.midnight,
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {tier.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.85rem",
                      color: tier.featured ? C.cream : C.cobalt,
                    }}
                  >
                    {tier.tagline}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: tier.featured ? C.gold : C.midnight,
                  }}
                >
                  ${tier.price}
                </span>
                {isExpanded ? (
                  <ChevronUp size={18} style={{ color: tier.featured ? C.cream : C.cobalt }} />
                ) : (
                  <ChevronDown size={18} style={{ color: tier.featured ? C.cream : C.cobalt }} />
                )}
              </div>
            </button>

            {/* Expanded benefits */}
            {isExpanded && (
              <div style={{ padding: "1rem 1.25rem" }}>
                {BENEFITS.map((cat) => (
                  <div key={cat.category} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.15em",
                        color: C.cobalt,
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                        paddingBottom: "0.3rem",
                        borderBottom: `1px solid ${C.goldPale}`,
                      }}
                    >
                      {cat.category}
                    </div>
                    {cat.rows.map((row) => {
                      const val = row.values[tier.key];
                      return (
                        <div
                          key={row.label}
                          className="flex items-center justify-between"
                          style={{
                            padding: "0.4rem 0",
                            borderBottom: `1px solid ${C.parchment}`,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'EB Garamond', serif",
                              fontSize: "0.9rem",
                              color: val === "no" ? `${C.cobalt}88` : C.midnight,
                              flex: 1,
                            }}
                          >
                            {row.label}
                          </span>
                          <div style={{ width: "80px", textAlign: "center", flexShrink: 0 }}>
                            <BenefitCell value={val} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Desktop table view ───────────────────────────────────────────────────────
function DesktopComparisonTable() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'EB Garamond', serif",
        }}
      >
        {/* Tier header row */}
        <thead>
          <tr>
            <th
              style={{
                width: "35%",
                padding: "1.5rem 1rem 1rem",
                textAlign: "left",
                verticalAlign: "bottom",
                borderBottom: `2px solid ${C.gold}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: C.cobalt,
                  textTransform: "uppercase",
                }}
              >
                Compare Benefits
              </span>
            </th>
            {TIERS.map((tier) => (
              <th
                key={tier.key}
                style={{
                  width: "16.25%",
                  padding: "1rem 0.5rem",
                  textAlign: "center",
                  verticalAlign: "bottom",
                  borderBottom: `2px solid ${tier.featured ? C.gold : C.goldPale}`,
                  position: "relative",
                  background: tier.featured ? `${C.midnight}08` : "transparent",
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.5rem",
                      letterSpacing: "0.15em",
                      color: C.warmWhite,
                      background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
                      padding: "0.15rem 0.6rem",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    color: C.midnight,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "0.15rem",
                  }}
                >
                  {tier.label}
                </div>
                <div
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.8rem",
                    color: C.cobalt,
                    marginBottom: "0.35rem",
                  }}
                >
                  {tier.tagline}
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: C.midnight,
                    lineHeight: 1,
                  }}
                >
                  ${tier.price}
                </div>
                <div
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.8rem",
                    color: C.cobalt,
                  }}
                >
                  /year
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {BENEFITS.map((cat, catIdx) => (
            <>
              {/* Category header */}
              <tr key={`cat-${catIdx}`}>
                <td
                  colSpan={5}
                  style={{
                    padding: "1rem 1rem 0.5rem",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: C.cobalt,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    borderTop: catIdx > 0 ? `1px solid ${C.goldPale}` : "none",
                  }}
                >
                  {cat.category}
                </td>
              </tr>

              {/* Benefit rows */}
              {cat.rows.map((row, rowIdx) => (
                <tr
                  key={`${catIdx}-${rowIdx}`}
                  style={{
                    background: rowIdx % 2 === 0 ? "transparent" : `${C.parchment}66`,
                  }}
                >
                  <td
                    style={{
                      padding: "0.65rem 1rem",
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.95rem",
                      color: C.midnight,
                      lineHeight: 1.4,
                    }}
                  >
                    {row.label}
                    {row.tooltip && (
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          color: C.cobalt,
                          fontStyle: "italic",
                        }}
                      >
                        {row.tooltip}
                      </span>
                    )}
                  </td>
                  {TIERS.map((tier) => (
                    <td
                      key={tier.key}
                      style={{
                        padding: "0.65rem 0.5rem",
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: tier.featured ? `${C.midnight}05` : "transparent",
                      }}
                    >
                      <BenefitCell value={row.values[tier.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function TierComparison() {
  return (
    <section className="py-16" style={{ background: C.warmWhite }}>
      <div className="container">
        <div className="text-center mb-10">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            ✦ Find Your Perfect Fit ✦
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              fontWeight: 700,
              color: C.midnight,
              marginBottom: "0.5rem",
            }}
          >
            Compare Membership Tiers
          </h2>
          <div style={{ width: "40px", height: "2px", background: C.gold, margin: "0 auto 1rem" }} />
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.05rem",
              color: C.cobalt,
              maxWidth: "550px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Every tier supports the Dinsmore Homestead's preservation mission.
            Choose the level that's right for you.
          </p>
        </div>

        {/* Desktop: full table (hidden on mobile) */}
        <div
          className="hidden md:block"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: C.warmWhite,
            border: `1px solid ${C.goldPale}`,
            boxShadow: `0 4px 24px ${C.midnight}08`,
          }}
        >
          <DesktopComparisonTable />
        </div>

        {/* Mobile: expandable cards (hidden on desktop) */}
        <div className="block md:hidden">
          <MobileComparisonCards />
        </div>

        {/* CTA below table */}
        <div className="text-center mt-8">
          <a
            href="#purchase-membership"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("purchase-membership")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
              color: C.gold,
              padding: "0.75rem 2rem",
              border: `1px solid ${C.gold}66`,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Choose Your Membership
          </a>
        </div>
      </div>
    </section>
  );
}
