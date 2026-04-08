import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Heart, Shield, Users, BookOpen, Hammer, Award, Ticket, ChevronRight } from "lucide-react";
import DonateWidget from "@/components/DonateWidget";

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

const IMPACT = [
  { icon: <Hammer size={20} />, amount: "$25", desc: "Helps maintain and repair historic outbuildings" },
  { icon: <BookOpen size={20} />, amount: "$50", desc: "Funds one school group visit and educational program" },
  { icon: <Shield size={20} />, amount: "$100", desc: "Supports conservation of a historic artifact or document" },
  { icon: <Users size={20} />, amount: "$250", desc: "Sponsors a major preservation project or restoration effort" },
];

export default function DonatePage() {
  return (
    <div style={{ background: C.warmWhite }}>
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${C.midnight} 0%, ${C.deepNavy} 100%)`,
          paddingTop: "5rem",
          paddingBottom: "4rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGES.heritageFinal})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          }}
        />
        <div className="container relative text-center">
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: C.gold,
              marginBottom: "0.75rem",
            }}
            className="uppercase"
          >
            ✦ Support Preservation ✦
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: C.parchment,
              marginBottom: "0.75rem",
            }}
          >
            Help Preserve Kentucky History
          </h1>
          <div style={{ width: "50px", height: "2px", background: C.gold, margin: "0 auto 1.5rem" }} />
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.15rem",
              color: C.cream,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Your generosity keeps this irreplaceable historic treasure alive for future generations.
            The Dinsmore Homestead Foundation is a 501(c)(3) non-profit.
          </p>
        </div>
      </section>

      {/* Donation Widget + Impact Sidebar */}
      <section className="py-16" style={{ background: C.warmWhite }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Widget */}
            <div className="lg:col-span-2">
              <div
                style={{
                  background: C.parchment,
                  border: `1px solid ${C.goldPale}`,
                  boxShadow: `0 8px 30px ${C.midnight}11`,
                }}
              >
                <DonateWidget />
              </div>
            </div>

            {/* Sidebar: Impact + Photo */}
            <div className="space-y-6">
              <div
                style={{
                  background: C.parchment,
                  border: `1px solid ${C.goldPale}`,
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: C.midnight,
                    marginBottom: "0.5rem",
                  }}
                >
                  Your Impact
                </h3>
                <div style={{ width: "30px", height: "2px", background: C.gold, marginBottom: "1rem" }} />
                <div className="space-y-3">
                  {IMPACT.map((item) => (
                    <div key={item.amount} className="flex items-start gap-3">
                      <span
                        style={{
                          color: C.deepNavy,
                          background: C.cream,
                          padding: "0.4rem",
                          borderRadius: "4px",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <span
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: C.deepNavy,
                          }}
                        >
                          {item.amount}
                        </span>
                        <p
                          style={{
                            fontFamily: "'EB Garamond', serif",
                            fontSize: "0.85rem",
                            color: C.cobalt,
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <img
                src={IMAGES.homestead}
                alt="Dinsmore Homestead"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  border: `1px solid ${C.goldPale}`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sell: Membership + Tour */}
      <section
        className="py-12"
        style={{
          background: `linear-gradient(135deg, ${C.midnight} 0%, ${C.deepNavy} 100%)`,
          borderTop: `3px solid ${C.gold}`,
        }}
      >
        <div className="container">
          <div className="text-center mb-8">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                fontWeight: 700,
                color: C.parchment,
                marginBottom: "0.5rem",
              }}
            >
              More Ways to Support
            </h2>
            <div style={{ width: "40px", height: "2px", background: C.gold, margin: "0 auto" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div
              style={{
                background: C.richNavy,
                border: `1px solid ${C.cobalt}44`,
                padding: "1.5rem",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} style={{ color: C.gold }} />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    color: C.gold,
                    textTransform: "uppercase",
                  }}
                >
                  Become a Member
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.95rem",
                  color: C.cream,
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                Enjoy free tours, gift shop discounts, our newsletter, and guest passes — starting at just $20/year.
              </p>
              <Link
                href="/membership"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: C.gold,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                Join Now <ChevronRight size={14} />
              </Link>
            </div>
            <div
              style={{
                background: C.richNavy,
                border: `1px solid ${C.cobalt}44`,
                padding: "1.5rem",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Ticket size={18} style={{ color: C.gold }} />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    color: C.gold,
                    textTransform: "uppercase",
                  }}
                >
                  Book a Tour
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.95rem",
                  color: C.cream,
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                Experience the authentic 1842 homestead with an expert-guided tour. Adults $10, children $3.
              </p>
              <Link
                href="/#book-a-tour"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  color: C.gold,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                Book Now <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
