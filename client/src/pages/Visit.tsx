import { useRef } from "react";
import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Clock, MapPin, DollarSign, Car, Ticket, Phone, Mail, Accessibility, ParkingCircle, Navigation, ChevronRight } from "lucide-react";
import { MapView } from "@/components/Map";

// Dinsmore Homestead coordinates (verified: 5656 Burlington Pike, Burlington, KY 41005)
const HOMESTEAD_LAT = 39.000614;
const HOMESTEAD_LNG = -84.813219;

const C = {
  midnight: "oklch(21.8% 0.036 251.3)",
  deepNavy: "oklch(30.2% 0.056 255.4)",
  richNavy: "oklch(34.6% 0.074 256.1)",
  cobalt: "oklch(47.2% 0.088 247.4)",
  gold: "oklch(74.2% 0.118 90.2)",
  goldBright: "oklch(76.7% 0.139 91.1)",
  cream: "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
  nearWhite: "oklch(97.4% 0.014 88.7)",
};

function SectionDivider() {
  return (
    <div style={{ width: "40px", height: "2px", background: C.gold, marginBottom: "1.25rem" }} />
  );
}

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
        <span className="section-label" style={{ color: C.gold }}>
          Dinsmore Homestead Museum
        </span>
        <h1 style={{ color: C.nearWhite, marginBottom: "0.5rem" }}>{title}</h1>
        {subtitle && (
          <p style={{ color: C.cream, fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function VisitPage() {
  const mapRef = useRef<google.maps.Map | null>(null);

  function handleMapReady(map: google.maps.Map) {
    mapRef.current = map;
    // Place a marker at the homestead
    new window.google!.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: HOMESTEAD_LAT, lng: HOMESTEAD_LNG },
      title: "Dinsmore Homestead Museum — 5656 Burlington Pike, Burlington, KY",
    });
  }

  return (
    <div>
      <PageHero
        title="Plan Your Visit"
        subtitle="Everything you need to know before you arrive"
        image={IMAGES.farmHDR}
      />

      {/* Quick-jump anchor bar */}
      <div style={{ background: C.midnight, borderBottom: `1px solid ${C.gold}33` }}>
        <div className="container">
          <div className="flex flex-wrap gap-0">
            {[
              { label: "Hours & Admission", href: "#hours" },
              { label: "Directions", href: "#directions" },
              { label: "Parking", href: "#parking" },
              { label: "Map", href: "#map" },
              { label: "Accessibility", href: "#accessibility" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.cream,
                  padding: "0.75rem 1rem",
                  borderRight: `1px solid ${C.gold}22`,
                  transition: "color 0.2s, background 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = C.gold;
                  (e.target as HTMLElement).style.background = `${C.gold}11`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = C.cream;
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-12" style={{ background: C.nearWhite }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: main info ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hours */}
              <div id="hours" className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={20} style={{ color: C.richNavy }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Hours of Operation</h2>
                </div>
                <SectionDivider />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      Regular Season
                    </h4>
                    <table style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt, borderCollapse: "collapse", width: "100%" }}>
                      <tbody>
                        {[
                          ["Wednesday – Saturday", "11:00 AM – 4:00 PM"],
                          ["Sunday", "1:00 PM – 4:00 PM"],
                          ["Monday – Tuesday", "Closed"],
                        ].map(([day, time]) => (
                          <tr key={day}>
                            <td style={{ paddingBottom: "0.35rem", paddingRight: "1rem", fontWeight: 600 }}>{day}</td>
                            <td style={{ paddingBottom: "0.35rem" }}>{time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.88rem", color: C.cobalt, marginTop: "0.75rem" }}>
                      <strong>Season:</strong> April through December
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      Group &amp; Private Tours
                    </h4>
                    <p style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt, margin: 0, fontSize: "0.95rem" }}>
                      Group tours and private events are available by appointment year-round — even during the off-season. Contact us at least two weeks in advance to schedule.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-5 p-3 flex gap-2"
                  style={{
                    background: C.parchment,
                    border: `1px solid ${C.cream}`,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    color: C.cobalt,
                    fontStyle: "italic",
                  }}
                >
                  <Clock size={14} style={{ color: C.gold, flexShrink: 0, marginTop: "2px" }} />
                  Last tour begins 30 minutes before closing. We recommend arriving early to allow time to explore the grounds.
                </div>
              </div>

              {/* Admission */}
              <div className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign size={20} style={{ color: C.richNavy }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Admission</h2>
                </div>
                <SectionDivider />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[
                    { label: "Adults", price: "$8" },
                    { label: "Children (6–12)", price: "$5" },
                    { label: "Under 6", price: "Free" },
                    { label: "Members", price: "Free" },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="text-center p-3"
                      style={{ background: C.parchment, border: `1px solid ${C.cream}` }}
                    >
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: C.richNavy }}>
                        {tier.price}
                      </div>
                      <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt }}>
                        {tier.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt, fontSize: "0.9rem" }}>
                  Group rates available for parties of 10 or more. Educational groups and school field trips receive special pricing — please contact us in advance.
                </p>
                <Link href="/events" className="btn-vintage-filled mt-4 inline-flex items-center gap-2">
                  <Ticket size={14} />
                  Reserve Tour Tickets
                </Link>
              </div>

              {/* Directions */}
              <div id="directions" className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Navigation size={20} style={{ color: C.richNavy }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Directions</h2>
                </div>
                <SectionDivider />
                <address
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontStyle: "normal",
                    fontSize: "1.05rem",
                    color: C.cobalt,
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <MapPin size={18} style={{ color: C.gold, flexShrink: 0, marginTop: "2px" }} />
                  <span>
                    <strong>5656 Burlington Pike</strong><br />
                    Burlington, KY 41005<br />
                    <span style={{ fontSize: "0.9rem", color: C.cobalt, fontStyle: "italic" }}>
                      Approx. 20 minutes south of Cincinnati
                    </span>
                  </span>
                </address>

                <div className="space-y-5">
                  {[
                    {
                      from: "From Cincinnati / I-275 West",
                      steps: [
                        "Take I-275 West toward Indiana.",
                        "Take Exit 77 for KY-18 / Burlington Pike.",
                        "Turn left (south) onto Burlington Pike (KY-18).",
                        "Continue approximately 2.5 miles.",
                        "The Dinsmore Homestead will be on your right at 5656 Burlington Pike.",
                      ],
                    },
                    {
                      from: "From Lexington / I-75 North",
                      steps: [
                        "Take I-75 North toward Cincinnati.",
                        "Merge onto I-275 West (toward Indiana).",
                        "Take Exit 77 for KY-18 / Burlington Pike.",
                        "Turn left (south) onto Burlington Pike (KY-18).",
                        "Continue approximately 2.5 miles to 5656 Burlington Pike on your right.",
                      ],
                    },
                    {
                      from: "From Louisville / I-71 North",
                      steps: [
                        "Take I-71 North toward Cincinnati.",
                        "Merge onto I-275 West near Cincinnati.",
                        "Take Exit 77 for KY-18 / Burlington Pike.",
                        "Turn left (south) onto Burlington Pike (KY-18).",
                        "Continue approximately 2.5 miles to 5656 Burlington Pike on your right.",
                      ],
                    },
                  ].map((route) => (
                    <div key={route.from}>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem",
                          color: C.midnight,
                          marginBottom: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <ChevronRight size={14} style={{ color: C.gold }} />
                        {route.from}
                      </h4>
                      <ol
                        style={{
                          fontFamily: "'EB Garamond', serif",
                          fontSize: "0.93rem",
                          color: C.cobalt,
                          paddingLeft: "1.4rem",
                          margin: 0,
                          lineHeight: 1.7,
                        }}
                      >
                        {route.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                <a
                  href="https://maps.google.com/?q=5656+Burlington+Pike,+Burlington,+KY+41005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-vintage mt-5 inline-flex items-center gap-2"
                >
                  <Car size={14} />
                  Open in Google Maps
                </a>
              </div>

              {/* Parking */}
              <div id="parking" className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ParkingCircle size={20} style={{ color: C.richNavy }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Parking</h2>
                </div>
                <SectionDivider />
                <p style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt, marginBottom: "1.25rem" }}>
                  Free on-site parking is available for all visitors. The gravel lot is located directly off Burlington Pike, just past the main entrance gate. Overflow parking is available along the gravel drive during peak season and special events.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Car size={22} style={{ color: C.gold }} />,
                      title: "Main Lot",
                      desc: "Gravel lot directly off Burlington Pike — approximately 30 spaces. Closest to the main house entrance.",
                    },
                    {
                      icon: <ParkingCircle size={22} style={{ color: C.gold }} />,
                      title: "Overflow Lot",
                      desc: "Additional gravel parking along the drive, used during events and peak weekend hours. Follow signage on arrival.",
                    },
                    {
                      icon: <Accessibility size={22} style={{ color: C.gold }} />,
                      title: "Accessible Parking",
                      desc: "Designated accessible spaces are located nearest the main entrance. Please display a valid placard or plate.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="p-4"
                      style={{ background: C.parchment, border: `1px solid ${C.cream}` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", margin: 0, color: C.midnight }}>
                          {item.title}
                        </h4>
                      </div>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.88rem", color: C.cobalt, margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 p-3 flex gap-2"
                  style={{
                    background: "oklch(94% 0.025 140 / 0.4)",
                    border: "1px solid oklch(65% 0.12 140 / 0.3)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.9rem",
                    color: C.cobalt,
                  }}
                >
                  <ParkingCircle size={14} style={{ color: "oklch(45% 0.1 140)", flexShrink: 0, marginTop: "2px" }} />
                  Parking is always free. No permits or fees required. Large vehicles and buses should contact us in advance so we can direct you to the appropriate area.
                </div>
              </div>

              {/* What to Expect */}
              <div className="card-vintage p-6">
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>What to Expect</h2>
                <SectionDivider />
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
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: C.midnight, marginBottom: "0.4rem" }}>
                        {item.title}
                      </h4>
                      <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt, margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div id="accessibility" className="card-vintage p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Accessibility size={20} style={{ color: C.richNavy }} />
                  <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Accessibility</h2>
                </div>
                <SectionDivider />
                <p style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt }}>
                  The Dinsmore Homestead is committed to making our historic site as accessible as possible. The grounds are accessible via gravel paths. The main house has limited accessibility due to its historic nature — please contact us in advance so we can make appropriate arrangements for your visit.
                </p>
                <p style={{ fontFamily: "'EB Garamond', serif", color: C.cobalt }}>
                  Service animals are welcome. Designated accessible parking spaces are located closest to the main entrance.
                </p>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-6">

              {/* Contact */}
              <div className="card-vintage p-5">
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Contact Us</h3>
                <div style={{ width: "30px", height: "2px", background: C.gold, marginBottom: "1rem" }} />
                <div className="space-y-3">
                  <a
                    href="tel:+18593862631"
                    className="flex items-center gap-2"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt }}
                  >
                    <Phone size={15} style={{ color: C.gold }} />
                    (859) 386-2631
                  </a>
                  <a
                    href="mailto:info@dinsmorefarm.org"
                    className="flex items-center gap-2"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: C.cobalt }}
                  >
                    <Mail size={15} style={{ color: C.gold }} />
                    info@dinsmorefarm.org
                  </a>
                  <div
                    className="flex items-start gap-2 pt-1"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cobalt }}
                  >
                    <MapPin size={15} style={{ color: C.gold, flexShrink: 0, marginTop: "2px" }} />
                    <span>5656 Burlington Pike<br />Burlington, KY 41005</span>
                  </div>
                </div>
              </div>

              {/* Book CTA */}
              <div
                className="p-5 text-center"
                style={{ background: C.richNavy }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.nearWhite, fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                  Ready to Visit?
                </h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: C.cream, marginBottom: "1rem" }}>
                  Reserve your tour tickets online and guarantee your spot.
                </p>
                <Link
                  href="/events"
                  style={{
                    display: "block",
                    background: C.gold,
                    color: C.midnight,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.625rem 1rem",
                    textAlign: "center",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                >
                  Book Tickets Now
                </Link>
              </div>

              {/* Quick facts */}
              <div className="card-vintage p-5">
                <h3 style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>Quick Facts</h3>
                <div style={{ width: "30px", height: "2px", background: C.gold, marginBottom: "1rem" }} />
                <div className="space-y-2">
                  {[
                    ["Established", "1842"],
                    ["Location", "Burlington, KY"],
                    ["From Cincinnati", "~20 min via I-275"],
                    ["From Lexington", "~75 min via I-75 N"],
                    ["From Louisville", "~90 min via I-71 N"],
                    ["Parking", "Free on-site"],
                    ["Pets", "Leashed pets welcome on grounds"],
                    ["Photography", "Permitted on grounds"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-2" style={{ borderBottom: `1px solid ${C.parchment}`, paddingBottom: "0.4rem" }}>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, fontWeight: 600 }}>{label}</span>
                      <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: C.cobalt, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
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

      {/* Full-width map */}
      <section id="map" style={{ background: C.midnight }}>
        <div className="container py-10">
          <div className="flex items-center gap-3 mb-6">
            <MapPin size={22} style={{ color: C.gold }} />
            <div>
              <h2 style={{ color: C.nearWhite, margin: 0, fontSize: "1.6rem" }}>Find Us</h2>
              <p style={{ fontFamily: "'EB Garamond', serif", color: C.cream, margin: 0, fontSize: "0.95rem" }}>
                5656 Burlington Pike · Burlington, KY 41005
              </p>
            </div>
          </div>
          <div style={{ border: `2px solid ${C.gold}44`, overflow: "hidden" }}>
            <MapView
              initialCenter={{ lat: HOMESTEAD_LAT, lng: HOMESTEAD_LNG }}
              initialZoom={15}
              onMapReady={handleMapReady}
              className="w-full h-[480px]"
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-end">
            <a
              href="https://maps.google.com/?q=5656+Burlington+Pike,+Burlington,+KY+41005"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-vintage inline-flex items-center gap-2"
              style={{ borderColor: `${C.gold}66`, color: C.cream }}
            >
              <Car size={14} />
              Google Maps
            </a>
            <a
              href="https://maps.apple.com/?address=5656+Burlington+Pike,Burlington,KY+41005"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-vintage inline-flex items-center gap-2"
              style={{ borderColor: `${C.gold}66`, color: C.cream }}
            >
              <Navigation size={14} />
              Apple Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
