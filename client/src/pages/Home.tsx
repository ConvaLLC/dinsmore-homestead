import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import HeroSlider from "@/components/HeroSlider";
import { IMAGES } from "../../../shared/images";
import { Calendar, Clock, MapPin, Ticket, Heart, BookOpen, ChevronRight, Star, Users, Award, GraduationCap, House } from "lucide-react";
import { format } from "date-fns";
import TourBookingWidget from "@/components/TourBookingWidget";
import MembershipWidget from "@/components/MembershipWidget";
import DonateWidget from "@/components/DonateWidget";

const C = {
  midnight: "oklch(21.8% 0.036 251.3)",
  deepNavy: "oklch(30.2% 0.056 255.4)",
  richNavy: "oklch(34.6% 0.074 256.1)",
  cobalt: "oklch(47.2% 0.088 247.4)",
  steelBlue: "oklch(56.3% 0.092 243.6)",
  skyBlue: "oklch(66.1% 0.086 238.4)",
  gold: "oklch(74.2% 0.118 90.2)",
  goldBright: "oklch(76.7% 0.139 91.1)",
  goldPale: "oklch(88.4% 0.072 91.8)",
  cream: "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
  warmWhite: "oklch(97.8% 0.008 89.6)",
};

function OrnamentalDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, ${C.gold}66)` }} />
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.6rem",
          letterSpacing: "0.35em",
          color: C.gold,
          whiteSpace: "nowrap",
        }}
        className="uppercase"
      >
        ✦ {label || "✦"} ✦
      </span>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, ${C.gold}66)` }} />
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const startDate = new Date(event.startDate);
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div
        style={{
          background: C.deepNavy,
          border: `1px solid ${C.richNavy}`,
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: `0 4px 20px ${C.midnight}88`,
        }}
        className="group-hover:shadow-xl"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = C.gold;
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = C.richNavy;
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: C.richNavy }}>
              <Calendar size={40} style={{ color: C.gold }} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              background: C.midnight,
              color: C.gold,
              padding: "0.25rem 0.75rem",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              border: `1px solid ${C.gold}66`,
            }}
            className="uppercase"
          >
            {format(startDate, "MMM d, yyyy")}
          </div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.midnight}cc, transparent 50%)` }} />
        </div>
        <div className="p-5">
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: C.steelBlue,
              display: "block",
              marginBottom: "0.5rem",
            }}
            className="uppercase"
          >
            {event.eventType.replace("_", " ")}
          </span>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: C.parchment,
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            {event.title}
          </h3>
          {event.shortDescription && (
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: C.cream,
                marginBottom: "0.75rem",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.shortDescription}
            </p>
          )}
          <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${C.richNavy}`, paddingTop: "0.75rem", marginTop: "0.5rem" }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", color: C.gold, fontWeight: 700 }}>
              {parseFloat(event.basePrice) === 0 ? "Free" : `$${event.basePrice}`}
            </span>
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: C.skyBlue,
                transition: "color 0.2s ease",
              }}
              className="uppercase group-hover:text-amber-400"
            >
              Get Tickets →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: events } = trpc.events.featured.useQuery();

  // 4 focused hero tiles — parchment style, smooth-scroll to sections
  const quickLinks = [
    {
      label: "Book a Tour",
      sublabel: "Reserve your guided tour",
      href: "#book-a-tour",
      icon: <Ticket size={24} />,
      accent: C.deepNavy,
    },
    {
      label: "Become a Member",
      sublabel: "Join the Dinsmore family",
      href: "#membership",
      icon: <Award size={24} />,
      accent: C.cobalt,
    },
    {
      label: "Events",
      sublabel: "See what's happening",
      href: "/events",
      icon: <Calendar size={24} />,
      accent: C.richNavy,
    },
    {
      label: "Donate",
      sublabel: "Support preservation",
      href: "#donate",
      icon: <Heart size={24} />,
      accent: C.cobalt,
    },
  ];

  return (
    <div style={{ background: C.warmWhite }}>
      {/* ── FULL-WIDTH HERO ── */}
      <div className="hero-wrapper" style={{ position: "relative", background: C.midnight }}>
        {/* Full-width image slider */}
        <HeroSlider />

        {/* ── Quick-Access Tile Strip (4 parchment tiles) ── */}
        <div className="hero-tile-strip">
          {quickLinks.map((tile) => {
            const isAnchor = tile.href.startsWith("#");
            const Wrapper = isAnchor ? "a" : Link;
            const wrapperProps = isAnchor
              ? { href: tile.href, onClick: (e: React.MouseEvent) => { e.preventDefault(); document.querySelector(tile.href)?.scrollIntoView({ behavior: "smooth" }); } }
              : { href: tile.href };
            return (
            <Wrapper
              key={tile.label}
              {...(wrapperProps as any)}
              style={{ position: "relative", overflow: "hidden", display: "block" }}
              className="quick-tile"
            >
              {/* Bottom accent on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(to right, ${C.gold}, ${C.goldBright})`,
                  transform: "scaleX(0)",
                  transformOrigin: "center",
                  transition: "transform 0.3s ease",
                }}
                className="quick-tile-accent"
              />
              {/* Divider between tiles */}
              <div
                style={{
                  position: "absolute",
                  top: "15%",
                  right: 0,
                  width: "1px",
                  height: "70%",
                  background: `linear-gradient(to bottom, transparent, ${C.cream}, transparent)`,
                  pointerEvents: "none",
                }}
              />
              {/* Content */}
              <div
                className="quick-tile-content"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.25rem 0.75rem",
                  textAlign: "center",
                  gap: "0.35rem",
                }}
              >
                <span
                  className="tile-icon"
                  style={{
                    color: tile.accent,
                  }}
                >
                  {tile.icon}
                </span>
                <span
                  className="tile-label"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: C.midnight,
                    lineHeight: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  {tile.label}
                </span>
                <span
                  className="tile-sublabel"
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.85rem",
                    color: C.cobalt,
                    lineHeight: 1.2,
                  }}
                >
                  {tile.sublabel}
                </span>
              </div>
            </Wrapper>
          );
          })}
        </div>
      </div>

      {/* Quick Info Bar */}
      <div style={{ background: C.midnight, borderBottom: `2px solid ${C.gold}44` }}>
        <div className="container py-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: <Clock size={15} />, label: "Hours", value: "Wed–Sun · April–December" },
              { icon: <MapPin size={15} />, label: "Location", value: "5656 Burlington Pike, Burlington, KY" },
              { icon: <Ticket size={15} />, label: "Admission", value: "Adults $8 · Children $5 · Members Free" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2">
                <span style={{ color: C.gold }}>{item.icon}</span>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.875rem", color: C.cream }}>
                  <strong
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      color: C.gold,
                      marginRight: "0.4rem",
                    }}
                    className="uppercase"
                  >
                    {item.label}:
                  </strong>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REMOVED: What's On events strip — will be redesigned later */}

      {/* Tour Booking Widget */}
      <section id="book-a-tour" style={{ borderTop: `3px solid ${C.gold}` }}>
        <TourBookingWidget />
      </section>

      {/* ── Membership Section ── */}
      <section
        id="membership"
        className="py-16"
        style={{
          background: C.warmWhite,
          borderTop: `1px solid ${C.goldPale}`,
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Intro text */}
            <div style={{ paddingTop: "1rem" }}>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: C.cobalt,
                  marginBottom: "0.75rem",
                }}
                className="uppercase"
              >
                <div className="flex items-center gap-3">
                  <div style={{ width: "30px", height: "1px", background: C.cobalt }} />
                  Extended Family & Friends Circle
                </div>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  color: C.midnight,
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                }}
              >
                Become a{" "}
                <span style={{ color: C.cobalt }}>Member</span>
              </h2>
              <div
                style={{
                  width: "50px",
                  height: "3px",
                  background: `linear-gradient(to right, ${C.gold}, ${C.goldBright})`,
                  marginBottom: "1.25rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.1rem",
                  color: C.richNavy,
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                Join the Dinsmore Homestead's Extended Family & Friends Circle and enjoy
                year-round benefits including free tours, gift shop discounts, our Dinsmore
                Dispatch newsletter, and guest passes.
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1rem",
                  color: C.cobalt,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Your membership directly supports the preservation and education mission
                of the Dinsmore Homestead Foundation.
              </p>
              <Link
                href="/membership"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  color: C.deepNavy,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderBottom: `2px solid ${C.deepNavy}`,
                  paddingBottom: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                View Full Membership Details <ChevronRight size={14} />
              </Link>
            </div>
            {/* Right: Membership widget */}
            <div
              style={{
                background: C.parchment,
                border: `1px solid ${C.goldPale}`,
                boxShadow: `0 8px 30px ${C.midnight}11`,
              }}
            >
              <MembershipWidget compact />
            </div>
          </div>
        </div>
      </section>

      {/* ── Donate Section ── */}
      <section
        id="donate"
        className="py-16"
        style={{
          background: C.parchment,
          borderTop: `1px solid ${C.goldPale}`,
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Donate widget */}
            <div
              style={{
                background: C.warmWhite,
                border: `1px solid ${C.goldPale}`,
                boxShadow: `0 8px 30px ${C.midnight}11`,
              }}
            >
              <DonateWidget compact />
            </div>
            {/* Right: Intro text */}
            <div style={{ paddingTop: "1rem" }}>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: C.cobalt,
                  marginBottom: "0.75rem",
                }}
                className="uppercase"
              >
                <div className="flex items-center gap-3">
                  <div style={{ width: "30px", height: "1px", background: C.cobalt }} />
                  Preserving the Past
                </div>
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  color: C.midnight,
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                }}
              >
                Help Us Keep{" "}
                <span style={{ color: C.cobalt }}>History Alive</span>
              </h2>
              <div
                style={{
                  width: "50px",
                  height: "3px",
                  background: `linear-gradient(to right, ${C.gold}, ${C.goldBright})`,
                  marginBottom: "1.25rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.1rem",
                  color: C.richNavy,
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                The Dinsmore Homestead Foundation relies on the generosity of visitors,
                members, and donors to maintain and preserve this irreplaceable historic
                treasure for future generations.
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1rem",
                  color: C.cobalt,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Every dollar goes directly toward preservation, education programs,
                and keeping the doors open for thousands of visitors each year.
              </p>
              <Link
                href="/donate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  color: C.deepNavy,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderBottom: `2px solid ${C.deepNavy}`,
                  paddingBottom: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                View Donation Page <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20" style={{ background: C.parchment }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: C.cobalt,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
                className="uppercase"
              >
                <div style={{ width: "30px", height: "1px", background: C.cobalt }} />
                Welcome to the Dinsmore Homestead
                <div style={{ width: "30px", height: "1px", background: C.cobalt }} />
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 700,
                  color: C.midnight,
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                }}
              >
                Where 19th-Century<br />
                <span style={{ color: C.cobalt }}>Kentucky Life</span> Comes Alive
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "3px",
                  background: `linear-gradient(to right, ${C.gold}, ${C.goldBright})`,
                  marginBottom: "1.5rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.15rem",
                  color: C.richNavy,
                  marginBottom: "1rem",
                  lineHeight: 1.75,
                }}
              >
                Nestled along the Licking River in Burlington, Kentucky, the Dinsmore Homestead is one of the most
                authentically preserved 19th-century farmsteads in the region. Built in 1842, the house and its
                surrounding grounds tell the story of five generations of the Dinsmore family.
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.05rem",
                  color: C.cobalt,
                  marginBottom: "2rem",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                }}
              >
                Unlike many historic sites, the Dinsmore Homestead was never abandoned or significantly altered.
                Original furnishings, family portraits, and personal letters remain exactly where the family left them.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/visit"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
                    color: C.gold,
                    padding: "0.75rem 1.75rem",
                    border: `1px solid ${C.gold}66`,
                    transition: "all 0.25s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className="uppercase hover:opacity-90"
                >
                  Plan Your Visit <ChevronRight size={14} />
                </Link>
                <Link
                  href="/history/family"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    background: "transparent",
                    color: C.deepNavy,
                    padding: "0.75rem 1.75rem",
                    border: `2px solid ${C.deepNavy}`,
                    transition: "all 0.25s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className="uppercase hover:bg-[oklch(30.2%_0.056_255.4)] hover:text-[oklch(74.2%_0.118_90.2)]"
                >
                  Discover the History
                </Link>
              </div>
            </div>

            {/* Image with decorative frame */}
            <div className="relative">
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "-12px",
                  right: "12px",
                  bottom: "12px",
                  border: `2px solid ${C.gold}55`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <img
                src={IMAGES.homestead}
                alt="The Dinsmore Homestead"
                className="w-full relative"
                style={{
                  maxHeight: "420px",
                  objectFit: "cover",
                  zIndex: 1,
                  boxShadow: `0 20px 60px ${C.midnight}44`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-1.5rem",
                  right: "-1.5rem",
                  background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
                  color: C.gold,
                  padding: "1.25rem 1.75rem",
                  fontFamily: "'Cinzel', serif",
                  textAlign: "center",
                  border: `1px solid ${C.gold}66`,
                  zIndex: 2,
                  boxShadow: `0 8px 30px ${C.midnight}88`,
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1 }}>1842</div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", marginTop: "0.25rem", color: C.cream }}>
                  ESTABLISHED
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div style={{ background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`, borderTop: `1px solid ${C.gold}33`, borderBottom: `1px solid ${C.gold}33` }}>
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Award size={22} />, value: "180+", label: "Years of History" },
              { icon: <Users size={22} />, value: "5,000+", label: "Annual Visitors" },
              { icon: <Star size={22} />, value: "5", label: "Generations" },
              { icon: <BookOpen size={22} />, value: "1,000+", label: "Archival Items" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <span style={{ color: C.gold }}>{stat.icon}</span>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "1.75rem", fontWeight: 700, color: C.parchment, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.steelBlue, letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="py-20" style={{ background: C.warmWhite }}>
        <div className="container">
          <div className="text-center mb-12">
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                color: C.cobalt,
                marginBottom: "0.75rem",
              }}
              className="uppercase"
            >
              ✦ Mark Your Calendar ✦
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: C.midnight,
                marginBottom: "0.5rem",
              }}
            >
              Upcoming Events & Tours
            </h2>
            <div style={{ width: "50px", height: "2px", background: C.gold, margin: "0 auto 1rem" }} />
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", color: C.cobalt, maxWidth: "500px", margin: "0 auto" }}>
              Step back in time with guided tours, seasonal celebrations, and living history programs.
            </p>
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: C.parchment,
                border: `1px solid ${C.goldPale}`,
              }}
            >
              <Calendar size={40} style={{ color: C.cobalt, margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: C.cobalt, fontStyle: "italic" }}>
                Upcoming events will be posted here soon. Check back for seasonal tours and special programs.
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/events"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
                color: C.gold,
                padding: "0.75rem 2rem",
                border: `1px solid ${C.gold}66`,
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              className="uppercase hover:opacity-90"
            >
              View All Events <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience Sections */}
      <section style={{ background: C.parchment }}>
        <div className="container py-20">
          <OrnamentalDivider label="Experience the Homestead" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                img: IMAGES.frontHall,
                title: "Guided House Tours",
                desc: "Walk through rooms unchanged since the 1800s. Our expert guides bring the Dinsmore family's story to life with vivid detail.",
                href: "/visit",
                cta: "Book a Tour",
              },
              {
                img: IMAGES.farmHDR,
                title: "The Farm & Grounds",
                desc: "Explore the historic outbuildings, gardens, and working farm that sustained five generations of the Dinsmore family.",
                href: "/the-farm",
                cta: "Explore the Farm",
              },
              {
                img: IMAGES.derbyDay,
                title: "Living History Events",
                desc: "From candlelight tours to harvest festivals, our seasonal events make history an unforgettable experience.",
                href: "/events",
                cta: "See Events",
              },
            ].map((item) => (
              <Link href={item.href} key={item.title} className="block group">
                <div
                  style={{
                    overflow: "hidden",
                    border: `1px solid ${C.goldPale}`,
                    transition: "all 0.3s ease",
                    boxShadow: `0 4px 20px ${C.midnight}11`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${C.midnight}22`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = C.goldPale;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${C.midnight}11`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="overflow-hidden" style={{ height: "220px" }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div
                    style={{
                      padding: "1.5rem",
                      background: C.warmWhite,
                      borderTop: `3px solid ${C.deepNavy}`,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: C.midnight,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.95rem",
                        color: C.cobalt,
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                      }}
                    >
                      {item.desc}
                    </p>
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        color: C.deepNavy,
                        borderBottom: `1px solid ${C.deepNavy}`,
                        paddingBottom: "1px",
                        transition: "color 0.2s ease",
                      }}
                      className="uppercase group-hover:text-amber-600"
                    >
                      {item.cta} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* History Teaser */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.midnight} 0%, ${C.deepNavy} 60%, ${C.richNavy} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
        className="py-20"
      >
        {/* Decorative background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${C.cobalt}22 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${C.gold}11 0%, transparent 40%)`,
            pointerEvents: "none",
          }}
        />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: C.gold,
                  marginBottom: "1rem",
                }}
                className="uppercase"
              >
                ✦ A Family Legacy ✦
              </div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  fontWeight: 700,
                  color: C.parchment,
                  lineHeight: 1.25,
                  marginBottom: "0.75rem",
                }}
              >
                Five Generations of<br />
                <span style={{ color: C.gold }}>Remarkable History</span>
              </h2>
              <div style={{ width: "50px", height: "2px", background: C.gold, marginBottom: "1.5rem" }} />
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.1rem",
                  color: C.cream,
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}
              >
                From James Dinsmore's arrival in Kentucky in the early 1800s to Julia Stockton Dinsmore's
                remarkable literary legacy, the Dinsmore family left an indelible mark on American history.
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1rem",
                  color: C.skyBlue,
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  marginBottom: "2rem",
                }}
              >
                Their letters, journals, and poetry offer an intimate portrait of life on a Kentucky farm —
                the joys, the struggles, and the enduring bonds of family.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/history/family"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    background: `linear-gradient(135deg, ${C.goldBright}, ${C.gold})`,
                    color: C.midnight,
                    padding: "0.75rem 1.75rem",
                    fontWeight: 700,
                    transition: "all 0.25s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className="uppercase hover:opacity-90"
                >
                  Meet the Family <ChevronRight size={14} />
                </Link>
                <Link
                  href="/history/timeline"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    background: "transparent",
                    color: C.parchment,
                    padding: "0.75rem 1.75rem",
                    border: `1px solid ${C.parchment}66`,
                    transition: "all 0.25s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  className="uppercase hover:border-amber-400 hover:text-amber-400"
                >
                  View Timeline
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  style={{
                    overflow: "hidden",
                    border: `2px solid ${C.gold}44`,
                    marginTop: "2rem",
                  }}
                >
                  <img src={IMAGES.jamesDinsmore} alt="James Dinsmore" className="w-full h-48 object-cover" />
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    border: `2px solid ${C.gold}44`,
                  }}
                >
                  <img src={IMAGES.farmHDR} alt="The Farm" className="w-full h-32 object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div
                  style={{
                    overflow: "hidden",
                    border: `2px solid ${C.gold}44`,
                  }}
                >
                  <img src={IMAGES.juliaStockton} alt="Julia Dinsmore" className="w-full h-32 object-cover" />
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    border: `2px solid ${C.gold}44`,
                  }}
                >
                  <img src={IMAGES.frontHall} alt="Interior" className="w-full h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Portal Teaser */}
      <section className="py-16" style={{ background: C.parchment, borderTop: `1px solid ${C.goldPale}` }}>
        <div className="container">
          <div
            style={{
              background: C.warmWhite,
              border: `1px solid ${C.goldPale}`,
              borderLeft: `5px solid ${C.cobalt}`,
              padding: "2.5rem 3rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            className="md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
                  padding: "0.875rem",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={24} style={{ color: C.gold }} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    color: C.cobalt,
                    marginBottom: "0.35rem",
                  }}
                  className="uppercase"
                >
                  For Educators
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: C.midnight,
                    marginBottom: "0.35rem",
                  }}
                >
                  Education Portal
                </h3>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.95rem",
                    color: C.cobalt,
                    maxWidth: "500px",
                  }}
                >
                  Access lesson plans, primary source documents, and curriculum resources aligned to Kentucky
                  academic standards. Free registration required.
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <Link
                href="/education/register"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  background: `linear-gradient(135deg, ${C.deepNavy}, ${C.midnight})`,
                  color: C.gold,
                  padding: "0.625rem 1.5rem",
                  border: `1px solid ${C.gold}66`,
                  transition: "all 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                }}
                className="uppercase hover:opacity-90"
              >
                Register Now
              </Link>
              <Link
                href="/education"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  background: "transparent",
                  color: C.deepNavy,
                  padding: "0.625rem 1.5rem",
                  border: `2px solid ${C.deepNavy}`,
                  transition: "all 0.25s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  whiteSpace: "nowrap",
                }}
                className="uppercase hover:bg-[oklch(30.2%_0.056_255.4)] hover:text-[oklch(74.2%_0.118_90.2)]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Support Banner */}
      <section
        className="py-16 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.midnight} 0%, ${C.deepNavy} 100%)` }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGES.heritageFinal})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
          }}
        />
        <div className="container relative">
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
            ✦ Preserving the Past · Educating the Future ✦
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 700,
              color: C.parchment,
              marginBottom: "1rem",
            }}
          >
            Support the Dinsmore Homestead
          </h2>
          <div style={{ width: "50px", height: "2px", background: C.gold, margin: "0 auto 1.5rem" }} />
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#membership"
              onClick={(e) => { e.preventDefault(); document.querySelector("#membership")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                background: `linear-gradient(135deg, ${C.goldBright}, ${C.gold})`,
                color: C.midnight,
                padding: "0.75rem 2rem",
                fontWeight: 700,
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: `0 4px 20px ${C.gold}44`,
                cursor: "pointer",
              }}
              className="uppercase hover:opacity-90"
            >
              <Award size={15} />
              Become a Member
            </a>
            <a
              href="#donate"
              onClick={(e) => { e.preventDefault(); document.querySelector("#donate")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                background: "transparent",
                color: C.parchment,
                padding: "0.75rem 2rem",
                border: `2px solid ${C.parchment}66`,
                transition: "all 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
              className="uppercase hover:border-amber-400 hover:text-amber-400"
            >
              <Heart size={15} />
              Donate Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
