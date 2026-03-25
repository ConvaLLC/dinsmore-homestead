import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { IMAGES } from "../../../shared/images";
import { Menu, X, ChevronDown, GraduationCap } from "lucide-react";

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
      { label: "Accessibility", href: "/visit#accessibility" },
    ],
  },
  {
    label: "Events",
    href: "/events",
  },
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
  {
    label: "Connect",
    href: "/connect",
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

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
      {/* Top bar */}
      <div
        style={{
          background: "oklch(22% 0.04 50)",
          borderBottom: "1px solid oklch(38% 0.055 54)",
        }}
        className="hidden md:block"
      >
        <div className="container flex justify-between items-center py-1.5">
          <p
            className="text-xs"
            style={{
              color: "oklch(72% 0.05 62)",
              fontFamily: "'EB Garamond', serif",
              letterSpacing: "0.05em",
            }}
          >
            Established 1842 · Burlington, Kentucky
          </p>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.educationVerified && (
                  <Link
                    href="/education"
                    className="nav-link-vintage text-xs flex items-center gap-1"
                    style={{ color: "oklch(68% 0.12 75)" }}
                  >
                    <GraduationCap size={12} />
                    Education Portal
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="nav-link-vintage text-xs"
                    style={{ color: "oklch(68% 0.12 75)" }}
                  >
                    Admin
                  </Link>
                )}
                {!user?.educationVerified && (
                  <Link
                    href="/education/register"
                    className="nav-link-vintage text-xs"
                    style={{ color: "oklch(72% 0.05 62)" }}
                  >
                    Educator Access
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/education/register"
                  className="nav-link-vintage text-xs flex items-center gap-1"
                  style={{ color: "oklch(72% 0.05 62)" }}
                >
                  <GraduationCap size={12} />
                  Educator Access
                </Link>
                <a
                  href={getLoginUrl()}
                  className="nav-link-vintage text-xs"
                  style={{ color: "oklch(72% 0.05 62)" }}
                >
                  Sign In
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        style={{
          background: "oklch(27% 0.045 50)",
          borderBottom: "3px solid oklch(55% 0.11 72)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: scrolled ? "0 4px 20px oklch(0% 0 0 / 0.3)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={IMAGES.logo}
              alt="Dinsmore Homestead Museum"
              className="h-12 w-auto"
              style={{ filter: "brightness(1.1)" }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
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
                    className={`nav-link-vintage px-3 py-2 flex items-center gap-1 ${
                      isActive(item.href) ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={`nav-link-vintage px-3 py-2 flex items-center gap-1 bg-transparent border-none ${
                      item.children?.some((c) => isActive(c.href)) ? "active" : ""
                    }`}
                    style={{ color: "oklch(93% 0.025 75)" }}
                  >
                    {item.label}
                    <ChevronDown
                      size={12}
                      style={{
                        transition: "transform 0.2s",
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      minWidth: "200px",
                      background: "oklch(96% 0.018 80)",
                      border: "1px solid oklch(72% 0.05 62)",
                      borderTop: "3px solid oklch(55% 0.11 72)",
                      boxShadow: "0 8px 24px oklch(0% 0 0 / 0.15)",
                      zIndex: 100,
                    }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        style={{
                          display: "block",
                          padding: "0.625rem 1rem",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "0.8rem",
                          letterSpacing: "0.05em",
                          color: "oklch(30% 0.05 52)",
                          borderBottom: "1px solid oklch(87% 0.032 72)",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = "oklch(87% 0.032 72)";
                          (e.target as HTMLElement).style.color = "oklch(38% 0.12 22)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = "transparent";
                          (e.target as HTMLElement).style.color = "oklch(30% 0.05 52)";
                        }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Donate CTA */}
            <Link href="/donate" className="btn-vintage-filled ml-4 text-xs">
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            style={{ color: "oklch(93% 0.025 75)", background: "transparent", border: "none" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: "oklch(22% 0.04 50)",
              borderTop: "1px solid oklch(38% 0.055 54)",
            }}
          >
            <div className="container py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="nav-link-vintage block py-2 px-3"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        className="nav-link-vintage block py-2 px-3 w-full text-left bg-transparent border-none flex items-center justify-between"
                        style={{ color: "oklch(72% 0.05 62)" }}
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.label ? null : item.label)
                        }
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          style={{
                            transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0)",
                          }}
                        />
                      </button>
                      {openDropdown === item.label && item.children && (
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="nav-link-vintage block py-1.5 px-3 text-xs"
                              style={{ color: "oklch(72% 0.05 62)" }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              <hr style={{ borderColor: "oklch(38% 0.055 54)", margin: "0.5rem 0" }} />
              <Link href="/donate" className="btn-vintage-filled text-center text-xs py-2">
                Donate to Dinsmore
              </Link>
              {isAuthenticated ? (
                <>
                  {user?.educationVerified && (
                    <Link href="/education" className="nav-link-vintage block py-2 px-3 text-xs">
                      Education Portal
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link href="/admin" className="nav-link-vintage block py-2 px-3 text-xs">
                      Admin Dashboard
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/education/register" className="nav-link-vintage block py-2 px-3 text-xs">
                  Educator Access
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
