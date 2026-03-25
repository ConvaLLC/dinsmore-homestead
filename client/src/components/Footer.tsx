import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "oklch(22% 0.04 50)",
        color: "oklch(87% 0.032 72)",
        borderTop: "3px solid oklch(55% 0.11 72)",
      }}
    >
      {/* Ornamental top border */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(to right, oklch(22% 0.04 50), oklch(55% 0.11 72), oklch(68% 0.12 75), oklch(55% 0.11 72), oklch(22% 0.04 50))",
        }}
      />

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={IMAGES.logo}
              alt="Dinsmore Homestead Museum"
              className="h-16 w-auto mb-4"
            />
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.05 62)",
                lineHeight: 1.6,
              }}
            >
              Preserving the legacy of the Dinsmore family and the history of 19th-century Kentucky life since 1988.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/DinsmoreHomestead"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(72% 0.05 62)" }}
                className="hover:text-[oklch(68%_0.12_75)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/dinsmorehomestead"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(72% 0.05 62)" }}
                className="hover:text-[oklch(68%_0.12_75)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:info@dinsmorefarm.org"
                style={{ color: "oklch(72% 0.05 62)" }}
                className="hover:text-[oklch(68%_0.12_75)] transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Visit */}
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(68% 0.12 75)",
                marginBottom: "1rem",
              }}
            >
              Visit Us
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} style={{ color: "oklch(55% 0.11 72)", marginTop: "0.2rem", flexShrink: 0 }} />
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(72% 0.05 62)", margin: 0 }}>
                  5656 Burlington Pike<br />
                  Burlington, KY 41005
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={14} style={{ color: "oklch(55% 0.11 72)", marginTop: "0.2rem", flexShrink: 0 }} />
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(72% 0.05 62)" }}>
                  <p style={{ margin: 0 }}>Wed–Sat: 11am–4pm</p>
                  <p style={{ margin: 0 }}>Sunday: 1pm–4pm</p>
                  <p style={{ margin: 0 }}>April–December</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} style={{ color: "oklch(55% 0.11 72)", flexShrink: 0 }} />
                <a
                  href="tel:+18593862631"
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(72% 0.05 62)" }}
                >
                  (859) 386-2631
                </a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(68% 0.12 75)",
                marginBottom: "1rem",
              }}
            >
              Explore
            </h4>
            <ul className="space-y-1.5">
              {[
                { label: "Plan Your Visit", href: "/visit" },
                { label: "Upcoming Events", href: "/events" },
                { label: "The Dinsmore Family", href: "/history/family" },
                { label: "The Farm & Grounds", href: "/the-farm" },
                { label: "Weddings & Private Events", href: "/weddings" },
                { label: "Volunteer", href: "/preservation/volunteers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "oklch(72% 0.05 62)",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "oklch(68% 0.12 75)")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "oklch(72% 0.05 62)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(68% 0.12 75)",
                marginBottom: "1rem",
              }}
            >
              Support Our Mission
            </h4>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                color: "oklch(72% 0.05 62)",
                marginBottom: "1rem",
                fontStyle: "italic",
              }}
            >
              "Preserving the Past, Educating the Future"
            </p>
            <Link
              href="/donate"
              className="btn-vintage-filled text-xs block text-center mb-3"
            >
              Make a Donation
            </Link>
            <Link
              href="/donate#membership"
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "oklch(68% 0.12 75)",
                border: "1px solid oklch(55% 0.11 72)",
                padding: "0.5rem 1rem",
                transition: "all 0.2s",
              }}
            >
              Become a Member
            </Link>
            <div className="mt-4">
              <Link
                href="/education/register"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.85rem",
                  color: "oklch(55% 0.11 72)",
                  transition: "color 0.2s",
                }}
              >
                Educator Portal Access →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid oklch(38% 0.055 54)",
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
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.8rem",
              color: "oklch(46% 0.06 56)",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Dinsmore Homestead Foundation, Inc. · A 501(c)(3) Non-Profit Organization
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Contact", href: "/connect" },
              { label: "Site Map", href: "/sitemap" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.75rem",
                  color: "oklch(46% 0.06 56)",
                  transition: "color 0.2s",
                }}
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
