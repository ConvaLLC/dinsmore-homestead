import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Award, Check, Ticket, Heart, ChevronRight } from "lucide-react";
import MembershipWidget from "@/components/MembershipWidget";

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

const MEMBERSHIP_PERKS = [
  {
    title: "Free Admission",
    desc: "Enjoy unlimited free tours of the historic Dinsmore Home throughout the year.",
  },
  {
    title: "Gift Shop Discount",
    desc: "10% discount on all gift shop items (excluding consignment items).",
  },
  {
    title: "Dinsmore Dispatch",
    desc: "Subscription to our newsletter — available online and in print.",
  },
  {
    title: "Guest Passes",
    desc: "2 complimentary guest passes per year to share with friends and family.",
  },
];

export default function Membership() {
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
            ✦ Extended Family & Friends Circle ✦
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
            Become a Member
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
            Join the Dinsmore family and enjoy year-round benefits while supporting the
            preservation of this irreplaceable Kentucky treasure.
          </p>
        </div>
      </section>

      {/* Perks Detail Section */}
      <section className="py-16" style={{ background: C.parchment }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: C.midnight,
                marginBottom: "0.5rem",
              }}
            >
              Member Benefits
            </h2>
            <div style={{ width: "40px", height: "2px", background: C.gold, margin: "0 auto" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {MEMBERSHIP_PERKS.map((perk) => (
              <div
                key={perk.title}
                style={{
                  background: C.warmWhite,
                  border: `1px solid ${C.goldPale}`,
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <Check size={20} style={{ color: C.midnight }} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: C.midnight,
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {perk.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.95rem",
                    color: C.cobalt,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Widget Section */}
      <section className="py-16" style={{ background: C.warmWhite }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl mx-auto">
            {/* Left: Widget */}
            <div
              style={{
                background: C.parchment,
                border: `1px solid ${C.goldPale}`,
                boxShadow: `0 8px 30px ${C.midnight}11`,
              }}
            >
              <MembershipWidget />
            </div>
            {/* Right: FAQ / Info */}
            <div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: C.midnight,
                  marginBottom: "1.5rem",
                }}
              >
                Frequently Asked Questions
              </h3>
              {[
                {
                  q: "When do my membership perks start?",
                  a: "Your membership perks will be available at your next visit to the Dinsmore Homestead.",
                },
                {
                  q: "How long does my membership last?",
                  a: "All memberships are valid for one year from the date of purchase.",
                },
                {
                  q: "Can I upgrade my membership tier?",
                  a: "Yes! Contact us at the homestead and we'll help you upgrade to a higher tier.",
                },
                {
                  q: "Is my membership tax-deductible?",
                  a: "Yes. The Dinsmore Homestead Foundation is a 501(c)(3) non-profit organization. Your membership may be tax-deductible.",
                },
                {
                  q: "What's included in the Dinsmore Dispatch?",
                  a: "Our newsletter features homestead news, upcoming events, historical stories, and behind-the-scenes updates. Available online and in print.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    borderBottom: `1px solid ${C.goldPale}`,
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.08em",
                      color: C.deepNavy,
                      textTransform: "uppercase",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {faq.q}
                  </h4>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.95rem",
                      color: C.cobalt,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cross-sell: Tour + Donate */}
      <section
        className="py-12"
        style={{
          background: `linear-gradient(135deg, ${C.midnight} 0%, ${C.deepNavy} 100%)`,
          borderTop: `3px solid ${C.gold}`,
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div
              style={{
                background: `${C.richNavy}`,
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
                As a member, enjoy free admission to guided tours of the historic Dinsmore Home.
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
            <div
              style={{
                background: `${C.richNavy}`,
                border: `1px solid ${C.cobalt}44`,
                padding: "1.5rem",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Heart size={18} style={{ color: C.gold }} />
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    color: C.gold,
                    textTransform: "uppercase",
                  }}
                >
                  Make a Donation
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
                Go beyond membership — every dollar helps preserve this irreplaceable historic treasure.
              </p>
              <Link
                href="/donate"
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
                Donate Now <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
