import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Clock, MapPin, DollarSign, Car, Ticket, Phone, Mail, Accessibility } from "lucide-react";

function PageHero({ title, subtitle, image }: { title: string; subtitle?: string; image: string }) {
  return (
    <div className="relative overflow-hidden" style={{ height: "300px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(20%) contrast(1.05)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.65)" }} />
      <div className="container relative h-full flex flex-col justify-end pb-10">
        <span className="section-label" style={{ color: "oklch(74.2% 0.118 90.2)" }}>
          Dinsmore Homestead Museum
        </span>
        <h1 style={{ color: "oklch(97.8% 0.008 89.6)", marginBottom: "0.5rem" }}>{title}</h1>
        {subtitle && (
          <p style={{ color: "oklch(87.6% 0.068 89.7)", fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function VisitPage() {
  return (
    <div>
      <PageHero
        title="Plan Your Visit"
        subtitle="Everything you need to know before you arrive"
        image={IMAGES.farmHDR}
      />

      {/* Main content */}
      <section className="py-12" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: main info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hours */}
              <div className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} style={{ color: "oklch(34.6% 0.074 256.1)" }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Hours of Operation</h2>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "oklch(74.2% 0.118 90.2)",
                    marginBottom: "1.25rem",
                  }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      Regular Season
                    </h4>
                    <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", margin: 0 }}>
                      <strong>Wednesday – Saturday:</strong> 11:00 AM – 4:00 PM<br />
                      <strong>Sunday:</strong> 1:00 PM – 4:00 PM<br />
                      <strong>Season:</strong> April through December
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      Special Tours
                    </h4>
                    <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", margin: 0 }}>
                      Group tours and private events available by appointment year-round. Contact us to schedule.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-4 p-3"
                  style={{
                    background: "oklch(94.7% 0.029 89.6)",
                    border: "1px solid oklch(87.6% 0.068 89.7)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    color: "oklch(47.2% 0.088 247.4)",
                    fontStyle: "italic",
                  }}
                >
                  Last tour begins 30 minutes before closing. We recommend arriving early to allow time to explore the grounds.
                </div>
              </div>

              {/* Admission */}
              <div className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign size={20} style={{ color: "oklch(34.6% 0.074 256.1)" }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Admission</h2>
                </div>
                <div style={{ width: "40px", height: "2px", background: "oklch(74.2% 0.118 90.2)", marginBottom: "1.25rem" }} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Adults", price: "$8" },
                    { label: "Children (6–12)", price: "$5" },
                    { label: "Children (under 6)", price: "Free" },
                    { label: "Members", price: "Free" },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="text-center p-3"
                      style={{ background: "oklch(94.7% 0.029 89.6)", border: "1px solid oklch(87.6% 0.068 89.7)" }}
                    >
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "oklch(34.6% 0.074 256.1)",
                        }}
                      >
                        {tier.price}
                      </div>
                      <div
                        style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "0.85rem",
                          color: "oklch(47.2% 0.088 247.4)",
                        }}
                      >
                        {tier.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", fontSize: "0.9rem" }}>
                  Group rates available for parties of 10 or more. Educational groups and school field trips receive
                  special pricing — please contact us in advance.
                </p>
                <Link href="/events" className="btn-vintage-filled mt-4 inline-block">
                  <Ticket size={14} style={{ display: "inline", marginRight: "0.4rem" }} />
                  Reserve Tour Tickets
                </Link>
              </div>

              {/* What to Expect */}
              <div className="card-vintage p-6">
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>What to Expect</h2>
                <div style={{ width: "40px", height: "2px", background: "oklch(74.2% 0.118 90.2)", marginBottom: "1.25rem" }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Guided House Tours",
                      desc: "Knowledgeable docents lead you through the original 1842 farmhouse, sharing stories of the Dinsmore family and their world.",
                    },
                    {
                      title: "Historic Outbuildings",
                      desc: "Explore the original log cabin, smokehouse, stone springhouse, and other outbuildings that remain on the property.",
                    },
                    {
                      title: "Family Portraits & Artifacts",
                      desc: "View original family portraits, personal letters, period furnishings, and artifacts that have never left the property.",
                    },
                    {
                      title: "Scenic Grounds",
                      desc: "Stroll the beautiful grounds along the Licking River, including the historic family cemetery and working farm areas.",
                    },
                  ].map((item) => (
                    <div key={item.title}>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem",
                          color: "oklch(21.8% 0.036 251.3)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)", margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div id="accessibility" className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Accessibility size={20} style={{ color: "oklch(34.6% 0.074 256.1)" }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Accessibility</h2>
                </div>
                <div style={{ width: "40px", height: "2px", background: "oklch(74.2% 0.118 90.2)", marginBottom: "1.25rem" }} />
                <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)" }}>
                  The Dinsmore Homestead is committed to making our historic site as accessible as possible.
                  The grounds are accessible via gravel paths. The main house has limited accessibility due to
                  its historic nature. Please contact us in advance so we can make appropriate arrangements for
                  your visit.
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)" }}>
                  Service animals are welcome. Parking is available close to the main entrance.
                </p>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Location */}
              <div
                id="directions"
                className="card-vintage p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} style={{ color: "oklch(34.6% 0.074 256.1)" }} />
                  <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Location & Directions</h3>
                </div>
                <div style={{ width: "30px", height: "2px", background: "oklch(74.2% 0.118 90.2)", marginBottom: "1rem" }} />
                <address
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontStyle: "normal",
                    color: "oklch(47.2% 0.088 247.4)",
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                  }}
                >
                  5656 Burlington Pike<br />
                  Burlington, KY 41005
                </address>
                <a
                  href="https://maps.google.com/?q=5656+Burlington+Pike,+Burlington,+KY+41005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-vintage text-xs block text-center mb-4"
                >
                  <Car size={12} style={{ display: "inline", marginRight: "0.3rem" }} />
                  Get Directions
                </a>
                <div
                  style={{
                    background: "oklch(94.7% 0.029 89.6)",
                    padding: "0.75rem",
                    border: "1px solid oklch(87.6% 0.068 89.7)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.85rem",
                      color: "oklch(47.2% 0.088 247.4)",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    Located approximately 20 minutes south of Cincinnati, just off I-275 in Burlington, Kentucky.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="card-vintage p-5">
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Contact Us</h3>
                <div style={{ width: "30px", height: "2px", background: "oklch(74.2% 0.118 90.2)", marginBottom: "1rem" }} />
                <div className="space-y-2">
                  <a
                    href="tel:+18593862631"
                    className="flex items-center gap-2"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)" }}
                  >
                    <Phone size={14} style={{ color: "oklch(74.2% 0.118 90.2)" }} />
                    (859) 386-2631
                  </a>
                  <a
                    href="mailto:info@dinsmorefarm.org"
                    className="flex items-center gap-2"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(47.2% 0.088 247.4)" }}
                  >
                    <Mail size={14} style={{ color: "oklch(74.2% 0.118 90.2)" }} />
                    info@dinsmorefarm.org
                  </a>
                </div>
              </div>

              {/* Book CTA */}
              <div
                className="p-5 text-center"
                style={{
                  background: "oklch(34.6% 0.074 256.1)",
                  color: "oklch(97.8% 0.008 89.6)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "oklch(97.8% 0.008 89.6)",
                    fontSize: "1.1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  Ready to Visit?
                </h3>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    color: "oklch(87.6% 0.068 89.7)",
                    marginBottom: "1rem",
                  }}
                >
                  Reserve your tour tickets online and guarantee your spot.
                </p>
                <Link
                  href="/events"
                  style={{
                    display: "block",
                    background: "oklch(74.2% 0.118 90.2)",
                    color: "oklch(21.8% 0.036 251.3)",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.625rem 1rem",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                >
                  Book Tickets Now
                </Link>
              </div>

              {/* Photo */}
              <img
                src={IMAGES.farmPhoto1}
                alt="Dinsmore Homestead exterior"
                className="img-vintage w-full"
                style={{ objectFit: "cover", height: "200px" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
