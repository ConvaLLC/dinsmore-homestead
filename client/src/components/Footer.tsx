import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Facebook, Youtube, Mail, MapPin, Phone, Clock, Heart } from "lucide-react";

const C = {
  midnight: "oklch(21.8% 0.036 251.3)",
  deepNavy: "oklch(30.2% 0.056 255.4)",
  richNavy: "oklch(34.6% 0.074 256.1)",
  cobalt: "oklch(47.2% 0.088 247.4)",
  gold: "oklch(74.2% 0.118 90.2)",
  goldBright: "oklch(76.7% 0.139 91.1)",
  cream: "oklch(87.6% 0.068 89.7)",
  parchment: "oklch(94.7% 0.029 89.6)",
};

export default function Footer() {
  return (
    <footer style={{ background: C.midnight, borderTop: `3px solid ${C.gold}` }}>
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Logo & About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src={IMAGES.logo}
                alt="Dinsmore Homestead Museum"
                className="h-16 w-auto object-contain"
                style={{ filter: "brightness(1.1)" }}
              />
            </Link>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.gold,
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                marginBottom: "0.75rem",
              }}
              className="uppercase"
            >
              ✦ Est. 1842 · Burlington, Kentucky ✦
            </div>
            <p style={{ color: C.cream, fontSize: "0.875rem", lineHeight: 1.7, fontFamily: "'EB Garamond', serif" }}>
              A living window into 19th-century Kentucky life — preserving the stories of
              the Dinsmore family, their farm, and all who lived and worked here.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/DinsmoreHomestead"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: C.parchment,
                  border: `1px solid ${C.richNavy}`,
                  padding: "0.4rem",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.richNavy;
                  (e.currentTarget as HTMLElement).style.color = C.parchment;
                }}
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.youtube.com/@DinsmoreHomestead"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: C.parchment,
                  border: `1px solid ${C.richNavy}`,
                  padding: "0.4rem",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.richNavy;
                  (e.currentTarget as HTMLElement).style.color = C.parchment;
                }}
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="mailto:info@dinsmorefarm.org"
                style={{
                  color: C.parchment,
                  border: `1px solid ${C.richNavy}`,
                  padding: "0.4rem",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.gold;
                  (e.currentTarget as HTMLElement).style.color = C.gold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = C.richNavy;
                  (e.currentTarget as HTMLElement).style.color = C.parchment;
                }}
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 — Visit */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.gold,
                fontSize: "0.68rem",
                letterSpacing: "0.25em",
                marginBottom: "1.25rem",
                borderBottom: `1px solid ${C.richNavy}`,
                paddingBottom: "0.75rem",
              }}
              className="uppercase"
            >
              Visit
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Plan Your Visit", href: "/visit" },
                { label: "Events & Tickets", href: "/events" },
                { label: "Weddings & Private Events", href: "/weddings" },
                { label: "Group Tours", href: "/visit#groups" },
                { label: "Accessibility", href: "/visit#accessibility" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: C.cream,
                      fontSize: "0.875rem",
                      fontFamily: "'EB Garamond', serif",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.cream)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Explore */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.gold,
                fontSize: "0.68rem",
                letterSpacing: "0.25em",
                marginBottom: "1.25rem",
                borderBottom: `1px solid ${C.richNavy}`,
                paddingBottom: "0.75rem",
              }}
              className="uppercase"
            >
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "The Dinsmore Family", href: "/history/family" },
                { label: "The Farm & Grounds", href: "/the-farm" },
                { label: "The Enslaved Community", href: "/history/enslaved" },
                { label: "Historical Timeline", href: "/history/timeline" },
                { label: "Preservation", href: "/preservation" },
                { label: "Education Portal", href: "/education" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: C.cream,
                      fontSize: "0.875rem",
                      fontFamily: "'EB Garamond', serif",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.cream)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact & Hours */}
          <div>
            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.gold,
                fontSize: "0.68rem",
                letterSpacing: "0.25em",
                marginBottom: "1.25rem",
                borderBottom: `1px solid ${C.richNavy}`,
                paddingBottom: "0.75rem",
              }}
              className="uppercase"
            >
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} style={{ color: C.gold, marginTop: "3px", flexShrink: 0 }} />
                <span style={{ color: C.cream, fontSize: "0.875rem", lineHeight: 1.5, fontFamily: "'EB Garamond', serif" }}>
                  5656 Burlington Pike<br />Burlington, KY 41005
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: C.gold, flexShrink: 0 }} />
                <a
                  href="tel:+18593862631"
                  style={{ color: C.cream, fontSize: "0.875rem", fontFamily: "'EB Garamond', serif", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.cream)}
                >
                  (859) 386-2631
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: C.gold, flexShrink: 0 }} />
                <a
                  href="mailto:info@dinsmorefarm.org"
                  style={{ color: C.cream, fontSize: "0.875rem", fontFamily: "'EB Garamond', serif", transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.cream)}
                >
                  info@dinsmorefarm.org
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={14} style={{ color: C.gold, marginTop: "3px", flexShrink: 0 }} />
                <div style={{ color: C.cream, fontSize: "0.875rem", lineHeight: 1.6, fontFamily: "'EB Garamond', serif" }}>
                  <div>Wed–Sat: 11 AM – 4 PM</div>
                  <div>Sunday: 1 PM – 4 PM</div>
                  <div style={{ color: C.gold, fontSize: "0.78rem", marginTop: "0.25rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                    April – December
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Donate CTA strip */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem 2rem",
            background: C.deepNavy,
            border: `1px solid ${C.richNavy}`,
            borderLeft: `4px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.gold,
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                marginBottom: "0.25rem",
              }}
              className="uppercase"
            >
              Support Our Mission
            </div>
            <p style={{ color: C.cream, fontSize: "0.9rem", fontFamily: "'EB Garamond', serif", fontStyle: "italic" }}>
              "Preserving the Past, Educating the Future"
            </p>
          </div>
          <Link
            href="/donate"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              background: `linear-gradient(135deg, ${C.goldBright}, ${C.gold})`,
              color: C.midnight,
              padding: "0.625rem 1.5rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.25s ease",
              boxShadow: `0 2px 12px ${C.gold}44`,
              flexShrink: 0,
            }}
            className="uppercase hover:opacity-90"
          >
            <Heart size={13} />
            Donate Now
          </Link>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${C.richNavy}`,
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              color: C.cobalt,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Dinsmore Homestead Foundation, Inc. · A 501(c)(3) Non-Profit Organization
          </p>
          <div className="flex gap-5 flex-wrap justify-center mt-1">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Contact", href: "/connect" },
              { label: "Site Map", href: "/sitemap" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  color: C.cobalt,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = C.gold)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = C.cobalt)}
                className="uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
