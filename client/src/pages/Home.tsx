import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import HeroSlider from "@/components/HeroSlider";
import { IMAGES } from "../../../shared/images";
import { Calendar, Clock, MapPin, Ticket, Heart, BookOpen, ChevronRight } from "lucide-react";
import { format } from "date-fns";

function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, oklch(78% 0.055 135))" }} />
      {label && (
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "oklch(64.3% 0.161 143.4)",
            whiteSpace: "nowrap",
          }}
        >
          ✦ {label} ✦
        </span>
      )}
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, oklch(78% 0.055 135))" }} />
    </div>
  );
}

function EventCard({ event }: { event: any }) {
  const startDate = new Date(event.startDate);
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div
        className="card-vintage overflow-hidden transition-all duration-300 group-hover:shadow-lg"
        style={{ border: "1px solid oklch(86.6% 0.079 130.9)" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: "200px" }}>
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: "sepia(10%) contrast(1.05)" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "oklch(86.6% 0.079 130.9)" }}
            >
              <Calendar size={40} style={{ color: "oklch(64.3% 0.161 143.4)" }} />
            </div>
          )}
          {/* Date badge */}
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              background: "oklch(33.1% 0.064 144.7)",
              color: "oklch(96% 0.014 110)",
              padding: "0.25rem 0.75rem",
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {format(startDate, "MMM d, yyyy")}
          </div>
        </div>
        <div className="p-4">
          <span className="section-label" style={{ fontSize: "0.65rem" }}>
            {event.eventType.replace("_", " ")}
          </span>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "oklch(20% 0.03 145)",
              marginBottom: "0.5rem",
            }}
          >
            {event.title}
          </h3>
          {event.shortDescription && (
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: "oklch(44% 0.055 144)",
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
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.8rem",
                color: "oklch(33.1% 0.064 144.7)",
                fontWeight: 600,
              }}
            >
              {parseFloat(event.basePrice) === 0 ? "Free" : `$${event.basePrice}`}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(33.1% 0.064 144.7)",
              }}
              className="group-hover:underline"
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

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Quick Info Bar */}
      <div
        style={{
          background: "oklch(27% 0.045 50)",
          borderBottom: "1px solid oklch(42.3% 0.087 144.3)",
        }}
      >
        <div className="container py-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: <Clock size={16} />,
                label: "Hours",
                value: "Wed–Sun · April–December",
              },
              {
                icon: <MapPin size={16} />,
                label: "Location",
                value: "5656 Burlington Pike, Burlington, KY",
              },
              {
                icon: <Ticket size={16} />,
                label: "Admission",
                value: "Adults $8 · Children $5 · Members Free",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-2"
                style={{ color: "oklch(86.6% 0.079 130.9)" }}
              >
                <span style={{ color: "oklch(64.3% 0.161 143.4)" }}>{item.icon}</span>
                <span
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.85rem",
                  }}
                >
                  <strong
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "oklch(64.3% 0.161 143.4)",
                      marginRight: "0.4rem",
                    }}
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

      {/* Welcome Section */}
      <section className="py-16" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Welcome to the Dinsmore Homestead</span>
              <h2 style={{ marginBottom: "1rem" }}>
                Where 19th-Century Kentucky Life Comes Alive
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "3px",
                  background: "oklch(64.3% 0.161 143.4)",
                  marginBottom: "1.5rem",
                }}
              />
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.1rem",
                  color: "oklch(42.3% 0.087 144.3)",
                  marginBottom: "1rem",
                }}
              >
                Nestled along the Licking River in Burlington, Kentucky, the Dinsmore Homestead is one of the most
                authentically preserved 19th-century farmsteads in the region. Built in 1842, the house and its
                surrounding grounds tell the story of five generations of the Dinsmore family — and of all who
                lived and worked alongside them.
              </p>
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "1.05rem",
                  color: "oklch(44% 0.055 144)",
                  marginBottom: "1.5rem",
                }}
              >
                Unlike many historic sites, the Dinsmore Homestead was never abandoned or significantly altered.
                Original furnishings, family portraits, and personal letters remain exactly where the family left
                them — creating an unparalleled window into antebellum Kentucky life.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/visit" className="btn-vintage-filled">
                  Plan Your Visit
                </Link>
                <Link href="/history/family" className="btn-vintage">
                  Discover the History
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={IMAGES.homestead}
                alt="The Dinsmore Homestead"
                className="img-vintage w-full"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-1rem",
                  right: "-1rem",
                  background: "oklch(33.1% 0.064 144.7)",
                  color: "oklch(96% 0.014 110)",
                  padding: "1rem 1.5rem",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.8rem",
                  letterSpacing: "0.05em",
                  maxWidth: "200px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>1842</div>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Established
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16" style={{ background: "oklch(93.6% 0.037 136.6)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <span className="section-label">Mark Your Calendar</span>
            <h2>Upcoming Events & Programs</h2>
            <SectionDivider />
          </div>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} style={{ color: "oklch(78% 0.055 135)", margin: "0 auto 1rem" }} />
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(44% 0.055 144)", fontSize: "1.1rem" }}>
                New events are being scheduled. Check back soon!
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/events" className="btn-vintage">
              View Full Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* The Farm Feature */}
      <section className="py-0 relative overflow-hidden" style={{ minHeight: "400px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGES.outbuildings8})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(20%) contrast(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, oklch(22% 0.04 50 / 0.85) 0%, oklch(22% 0.04 50 / 0.4) 60%, transparent 100%)",
          }}
        />
        <div className="container relative py-20">
          <div style={{ maxWidth: "500px" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "oklch(64.3% 0.161 143.4)",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              Explore the Grounds
            </span>
            <h2
              style={{
                color: "oklch(96% 0.014 110)",
                fontFamily: "'Playfair Display', serif",
                marginBottom: "1rem",
              }}
            >
              The Farm & Historic Outbuildings
            </h2>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "1.05rem",
                color: "oklch(86.6% 0.079 130.9)",
                marginBottom: "1.5rem",
                lineHeight: 1.7,
              }}
            >
              Beyond the main house, the Dinsmore property features a remarkable collection of original outbuildings
              — a log cabin, smokehouse, stone springhouse, and more — each telling a unique story of 19th-century
              farm life in northern Kentucky.
            </p>
            <Link href="/the-farm" className="btn-vintage-filled">
              Explore the Grounds
            </Link>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-16" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Ticket size={32} />,
                title: "Book a Tour",
                description:
                  "Reserve your spot for a guided tour of the house and grounds. Tours run Wednesday through Sunday during our season.",
                link: "/events",
                linkText: "Reserve Tickets",
              },
              {
                icon: <Heart size={32} />,
                title: "Support the Mission",
                description:
                  "Your donation helps preserve this irreplaceable piece of Kentucky history for generations to come.",
                link: "/donate",
                linkText: "Make a Donation",
              },
              {
                icon: <BookOpen size={32} />,
                title: "Educator Resources",
                description:
                  "Access lesson plans, primary sources, and curriculum materials aligned to Kentucky academic standards.",
                link: "/education/register",
                linkText: "Access Portal",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="card-vintage p-6 text-center flex flex-col items-center gap-4"
              >
                <div
                  style={{
                    color: "oklch(33.1% 0.064 144.7)",
                    padding: "1rem",
                    background: "oklch(86.6% 0.079 130.9)",
                    borderRadius: "50%",
                  }}
                >
                  {pillar.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "oklch(20% 0.03 145)",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.95rem",
                    color: "oklch(44% 0.055 144)",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {pillar.description}
                </p>
                <Link href={pillar.link} className="btn-vintage text-xs">
                  {pillar.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Teaser */}
      <section className="py-16" style={{ background: "oklch(93.6% 0.037 136.6)" }}>
        <div className="container">
          <div className="text-center mb-10">
            <span className="section-label">The Story of Dinsmore</span>
            <h2>Five Generations of History</h2>
            <SectionDivider />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "James Dinsmore", years: "1790–1864", img: IMAGES.jamesDinsmore, href: "/history/family" },
              { name: "Julia Stockton Dinsmore", years: "1833–1926", img: IMAGES.juliaStockton, href: "/history/family" },
              { name: "Martha Macomb Dinsmore", years: "1795–1874", img: IMAGES.marthaMacomb, href: "/history/family" },
              { name: "Isabella Selmes", years: "1875–1953", img: IMAGES.isabellaSelmes, href: "/history/family" },
            ].map((person) => (
              <Link key={person.name} href={person.href} className="group block">
                <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
                  <img
                    src={person.img}
                    alt={person.name}
                    className="absolute inset-0 w-full h-full object-cover img-vintage transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "oklch(20% 0.03 145)",
                      marginBottom: "0.1rem",
                    }}
                  >
                    {person.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.75rem",
                      color: "oklch(64.3% 0.161 143.4)",
                      fontStyle: "italic",
                    }}
                  >
                    {person.years}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/history/family" className="btn-vintage">
              Meet the Full Family
            </Link>
          </div>
        </div>
      </section>

      {/* Donate Banner */}
      <section
        className="py-16 text-center"
        style={{
          background: "oklch(33.1% 0.064 144.7)",
          backgroundImage: `url(${IMAGES.heritageFinal})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "oklch(38% 0.12 22 / 0.85)",
          }}
        />
        <div className="container relative">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "oklch(64.3% 0.161 143.4)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Preserving the Past · Educating the Future
          </span>
          <h2
            style={{
              color: "oklch(96% 0.014 110)",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "1rem",
            }}
          >
            Help Us Keep History Alive
          </h2>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "1.1rem",
              color: "oklch(86.6% 0.079 130.9)",
              maxWidth: "600px",
              margin: "0 auto 2rem",
            }}
          >
            The Dinsmore Homestead Foundation relies on the generosity of visitors, members, and donors
            to maintain and preserve this irreplaceable historic treasure.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/donate"
              style={{
                background: "oklch(64.3% 0.161 143.4)",
                color: "oklch(20% 0.03 145)",
                border: "2px solid oklch(64.3% 0.161 143.4)",
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.75rem 2rem",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Donate Now
            </Link>
            <Link
              href="/donate#membership"
              style={{
                background: "transparent",
                color: "oklch(93.6% 0.037 136.6)",
                border: "2px solid oklch(87% 0.032 72 / 0.6)",
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.75rem 2rem",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
