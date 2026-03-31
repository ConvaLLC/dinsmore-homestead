import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Menu, X, ChevronDown, Settings, BookOpen, Heart } from "lucide-react";
import { IMAGES } from "../../../shared/images";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Plan Your Visit",
    children: [
      { label: "Admissions & Hours", href: "/visit" },
      { label: "Directions", href: "/visit#directions" },
      { label: "What to See", href: "/the-farm" },
      { label: "Weddings & Private Events", href: "/weddings" },
    ],
  },
  { label: "Events", href: "/events" },
  {
    label: "History",
    children: [
      { label: "The Dinsmore Family", href: "/history/family" },
      { label: "The Farm & Grounds", href: "/the-farm" },
      { label: "The Enslaved Community", href: "/history/enslaved" },
      { label: "Interactive Timeline", href: "/history/timeline" },
    ],
  },
  {
    label: "Preservation",
    children: [
      { label: "The Foundation", href: "/preservation" },
      { label: "Volunteers", href: "/preservation/volunteers" },
      { label: "Donate", href: "/donate" },
      { label: "Membership", href: "/donate#membership" },
    ],
  },
  { label: "Connect", href: "/connect" },
];

// Navy/gold palette constants
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

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const isActive = (href: string) => location === href || location.startsWith(href + "/");

  return (
    <>
      {/* ── Top announcement bar ── */}
      <div
        style={{ background: C.midnight, borderBottom: `1px solid ${C.richNavy}` }}
        className="hidden md:block"
      >
        <div className="container flex items-center justify-between py-1.5">
          <p
            style={{
              color: C.gold,
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
            }}
            className="uppercase"
          >
            ✦ &nbsp; Historic Site Est. 1842 &nbsp;·&nbsp; Burlington, Kentucky &nbsp; ✦
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/education/register"
              style={{ color: C.cream, fontSize: "0.68rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
              className="uppercase flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <BookOpen size={11} />
              Educator Access
            </Link>
            {isAuthenticated ? (
              <>
                <span style={{ color: C.cream, fontSize: "0.68rem" }}>
                  {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => logout()}
                  style={{ color: C.cream, fontSize: "0.68rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
                  className="uppercase hover:opacity-80 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href={getLoginUrl()}
                style={{ color: C.cream, fontSize: "0.68rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
                className="uppercase hover:opacity-80 transition-opacity"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Main navigation bar ── */}
      <header
        style={{
          background: scrolled ? C.midnight : C.deepNavy,
          borderBottom: `3px solid ${C.gold}`,
          boxShadow: scrolled
            ? `0 4px 32px ${C.midnight}cc`
            : `0 2px 16px ${C.midnight}66`,
          transition: "all 0.35s ease",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container flex items-center justify-between py-3">
          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src={IMAGES.logo}
              alt="Dinsmore Homestead"
              className="h-12 w-auto object-contain"
              style={{ filter: "brightness(1.1) drop-shadow(0 1px 4px rgba(0,0,0,0.4))" }}
            />
            <div className="hidden sm:block leading-tight">
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: C.parchment,
                  letterSpacing: "0.12em",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
                className="uppercase"
              >
                Dinsmore
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: C.gold,
                  letterSpacing: "0.3em",
                  fontSize: "0.55rem",
                }}
                className="uppercase"
              >
                Homestead
              </div>
            </div>
          </Link>

          {/* ── Desktop nav items ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      color: isActive(item.href) ? C.gold : C.parchment,
                      borderBottom: `2px solid ${isActive(item.href) ? C.gold : "transparent"}`,
                      paddingBottom: "2px",
                      transition: "all 0.2s ease",
                    }}
                    className="px-3 py-2 uppercase block hover:opacity-80"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      color: item.children?.some((c) => isActive(c.href)) ? C.gold : C.parchment,
                      borderBottom: `2px solid ${item.children?.some((c) => isActive(c.href)) ? C.gold : "transparent"}`,
                      paddingBottom: "2px",
                      background: "transparent",
                      border: "none",
                      transition: "all 0.2s ease",
                    }}
                    className="px-3 py-2 uppercase flex items-center gap-1 hover:opacity-80"
                  >
                    {item.label}
                    <ChevronDown
                      size={11}
                      style={{
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </button>
                )}

                {/* Dropdown panel */}
                {item.children && openDropdown === item.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 3px)",
                      left: 0,
                      minWidth: "210px",
                      background: C.midnight,
                      border: `1px solid ${C.richNavy}`,
                      borderTop: `3px solid ${C.gold}`,
                      boxShadow: `0 12px 40px ${C.midnight}cc`,
                      zIndex: 100,
                    }}
                  >
                    {item.children.map((child, i) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: "block",
                          padding: "0.625rem 1.25rem",
                          fontFamily: "'Cinzel', serif",
                          fontSize: "0.66rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: isActive(child.href) ? C.gold : C.cream,
                          borderBottom: i < item.children!.length - 1
                            ? `1px solid ${C.richNavy}66`
                            : "none",
                          transition: "all 0.15s ease",
                          background: isActive(child.href) ? `${C.richNavy}` : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = C.richNavy;
                          (e.currentTarget as HTMLElement).style.color = C.gold;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = isActive(child.href) ? C.richNavy : "transparent";
                          (e.currentTarget as HTMLElement).style.color = isActive(child.href) ? C.gold : C.cream;
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Education */}
            <Link
              href="/education"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: isActive("/education") ? C.gold : C.parchment,
                borderBottom: `2px solid ${isActive("/education") ? C.gold : "transparent"}`,
                paddingBottom: "2px",
              }}
              className="px-3 py-2 uppercase flex items-center gap-1 hover:opacity-80"
            >
              <BookOpen size={11} />
              Education
            </Link>
          </nav>

          {/* ── Right-side CTAs ── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Donate */}
            <Link
              href="/donate"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.66rem",
                letterSpacing: "0.12em",
                color: C.gold,
                border: `1px solid ${C.gold}66`,
                padding: "0.4rem 0.875rem",
                transition: "all 0.2s ease",
              }}
              className="uppercase flex items-center gap-1.5 hover:bg-white/5"
            >
              <Heart size={11} />
              Donate
            </Link>

            {/* Book a Tour — gold CTA */}
            <Link
              href="/events"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.66rem",
                letterSpacing: "0.12em",
                background: `linear-gradient(135deg, ${C.goldBright}, ${C.gold})`,
                color: C.midnight,
                padding: "0.5rem 1.25rem",
                fontWeight: 700,
                transition: "all 0.25s ease",
                boxShadow: `0 2px 12px ${C.gold}55`,
              }}
              className="uppercase hover:opacity-90 hover:-translate-y-px transition-all"
            >
              Book a Tour
            </Link>

            {/* Admin — only for admin users */}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                href="/admin"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.12em",
                  color: C.parchment,
                  border: `1px solid ${C.cobalt}88`,
                  padding: "0.4rem 0.875rem",
                  background: `${C.cobalt}22`,
                  transition: "all 0.2s ease",
                }}
                className="uppercase flex items-center gap-1.5 hover:bg-blue-400/20"
              >
                <Settings size={11} />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: C.parchment, background: "transparent", border: "none" }}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ── */}
      {mobileOpen && (
        <div
          style={{
            background: C.midnight,
            borderBottom: `2px solid ${C.gold}`,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 49,
            overflowY: "auto",
            paddingTop: "5rem",
          }}
        >
          <div className="container py-6 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: isActive(item.href) ? C.gold : C.parchment,
                      fontSize: "0.85rem",
                      letterSpacing: "0.15em",
                      borderBottom: `1px solid ${C.richNavy}`,
                      padding: "0.875rem 0",
                      display: "block",
                    }}
                    className="uppercase"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: C.parchment,
                        fontSize: "0.85rem",
                        letterSpacing: "0.15em",
                        borderBottom: `1px solid ${C.richNavy}`,
                        padding: "0.875rem 0",
                      }}
                      className="uppercase"
                    >
                      {item.label}
                    </div>
                    {item.children && (
                      <div style={{ paddingLeft: "1rem", borderBottom: `1px solid ${C.richNavy}` }}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            style={{
                              fontFamily: "'Cinzel', serif",
                              color: C.gold,
                              fontSize: "0.72rem",
                              letterSpacing: "0.12em",
                              padding: "0.5rem 0",
                              display: "block",
                              borderBottom: `1px solid ${C.richNavy}44`,
                            }}
                            className="uppercase"
                          >
                            — {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <Link
              href="/education"
              style={{
                fontFamily: "'Cinzel', serif",
                color: C.parchment,
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                borderBottom: `1px solid ${C.richNavy}`,
                padding: "0.875rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              className="uppercase"
            >
              <BookOpen size={14} />
              Education Portal
            </Link>

            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/events"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  background: `linear-gradient(135deg, ${C.goldBright}, ${C.gold})`,
                  color: C.midnight,
                  padding: "0.75rem",
                  fontWeight: 700,
                  textAlign: "center",
                  display: "block",
                }}
                className="uppercase"
              >
                Book a Tour
              </Link>
              <Link
                href="/donate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  border: `2px solid ${C.gold}`,
                  color: C.gold,
                  padding: "0.75rem",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                className="uppercase"
              >
                <Heart size={14} />
                Donate
              </Link>
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.12em",
                    color: C.parchment,
                    border: `1px solid ${C.cobalt}`,
                    padding: "0.625rem",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: `${C.cobalt}22`,
                  }}
                  className="uppercase"
                >
                  <Settings size={14} />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div
              style={{ borderTop: `1px solid ${C.richNavy}`, marginTop: "1.5rem", paddingTop: "1rem" }}
            >
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <span style={{ color: C.cream, fontSize: "0.85rem" }}>{user?.name}</span>
                  <button
                    onClick={() => logout()}
                    style={{ color: C.gold, fontSize: "0.75rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
                    className="uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <a
                  href={getLoginUrl()}
                  style={{ color: C.gold, fontSize: "0.85rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
                  className="uppercase"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
