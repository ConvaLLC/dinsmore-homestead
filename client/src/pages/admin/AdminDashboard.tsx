import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Calendar,
  CalendarDays,
  Ticket,
  Heart,
  BookOpen,
  Image,
  Settings,
  Users,
  TrendingUp,
  Lock,
  LayoutDashboard,
} from "lucide-react";

function AdminNav() {
  const [location] = useLocation();
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { href: "/admin/events", label: "Events", icon: <Calendar size={16} /> },
    { href: "/admin/timeslots", label: "Tour Slots", icon: <CalendarDays size={16} /> },
    { href: "/admin/hero-slides", label: "Hero Slider", icon: <Image size={16} /> },
    { href: "/admin/orders", label: "Ticket Orders", icon: <Ticket size={16} /> },
    { href: "/admin/donations", label: "Donations", icon: <Heart size={16} /> },
    { href: "/admin/education", label: "Education", icon: <BookOpen size={16} /> },
  ];

  return (
    <nav
      style={{
        background: "oklch(22% 0.04 50)",
        borderBottom: "1px solid oklch(32% 0.04 50)",
        padding: "0.5rem 0",
      }}
    >
      <div className="container">
        <div className="flex items-center gap-1 flex-wrap">
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "oklch(55% 0.11 72)",
              marginRight: "1rem",
              padding: "0.4rem 0",
            }}
          >
            Admin Panel
          </span>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.75rem",
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: location.startsWith(item.href) && (item.href !== "/admin" || location === "/admin") ? "oklch(68% 0.12 75)" : "oklch(72% 0.05 62)",
                borderBottom: location.startsWith(item.href) && (item.href !== "/admin" || location === "/admin") ? "2px solid oklch(68% 0.12 75)" : "2px solid transparent",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: "oklch(55% 0.11 72)", margin: "0 auto 1rem" }} />
        <h2>Admin Access Required</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", marginBottom: "1.5rem" }}>
          Please sign in with an admin account to access the dashboard.
        </p>
        <a href={getLoginUrl()} className="btn-vintage-filled">Sign In</a>
      </div>
    );
  }

  if ((user as any)?.role !== "admin") {
    return (
      <div className="py-24 text-center container">
        <Lock size={48} style={{ color: "oklch(55% 0.11 72)", margin: "0 auto 1rem" }} />
        <h2>Insufficient Permissions</h2>
        <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)", marginBottom: "1.5rem" }}>
          Your account does not have admin privileges. Contact the site administrator.
        </p>
        <Link href="/" className="btn-vintage">Return to Site</Link>
      </div>
    );
  }

  const { data: events } = trpc.events.adminList.useQuery();
  const { data: orders } = trpc.tickets.adminList.useQuery();
  const { data: donations } = trpc.donations.adminList.useQuery();
  const { data: slides } = trpc.heroSlides.list.useQuery();
  const { data: educationRequests } = trpc.education.adminRequests.useQuery();

  const totalRevenue = orders?.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || "0"), 0) || 0;
  const totalDonations = donations?.reduce((sum: number, d: any) => sum + parseFloat(d.amount || "0"), 0) || 0;
  const pendingRequests = educationRequests?.filter((r: any) => !r.approved).length || 0;

  const stats = [
    { label: "Active Events", value: events?.filter((e: any) => e.active).length || 0, icon: <Calendar size={24} />, href: "/admin/events" },
    { label: "Ticket Orders", value: orders?.length || 0, icon: <Ticket size={24} />, href: "/admin/orders" },
    { label: "Ticket Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <TrendingUp size={24} />, href: "/admin/orders" },
    { label: "Donations", value: `$${totalDonations.toFixed(2)}`, icon: <Heart size={24} />, href: "/admin/donations" },
    { label: "Hero Slides", value: slides?.length || 0, icon: <Image size={24} />, href: "/admin/hero-slides" },
    { label: "Pending Edu Requests", value: pendingRequests, icon: <Users size={24} />, href: "/admin/education" },
  ];

  return (
    <div>
      <AdminNav />
      <div className="py-8" style={{ background: "oklch(96% 0.018 80)", minHeight: "calc(100vh - 120px)" }}>
        <div className="container">
          <div className="mb-8">
            <span className="section-label">Control Panel</span>
            <h2 style={{ fontSize: "1.75rem" }}>Admin Dashboard</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(46% 0.06 56)" }}>
              Welcome back, {user?.name}. Here's an overview of the Dinsmore Homestead website.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href} className="block group">
                <div className="card-vintage p-5 transition-all duration-200 group-hover:shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <span style={{ color: "oklch(55% 0.11 72)" }}>{stat.icon}</span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "oklch(38% 0.12 22)",
                      }}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "oklch(46% 0.06 56)",
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", marginBottom: "1rem" }}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Create New Event", desc: "Add a tour, special event, or fundraiser to the calendar", href: "/admin/events", cta: "Manage Events" },
                { title: "Update Hero Slider", desc: "Add or edit the promotional images on the homepage", href: "/admin/hero-slides", cta: "Edit Slides" },
                { title: "Review Education Requests", desc: `${pendingRequests} pending access request${pendingRequests !== 1 ? "s" : ""} awaiting review`, href: "/admin/education", cta: "Review Requests" },
              ].map((action) => (
                <div key={action.title} className="card-vintage p-5">
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.4rem" }}>
                    {action.title}
                  </h4>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(46% 0.06 56)", marginBottom: "1rem" }}>
                    {action.desc}
                  </p>
                  <Link href={action.href} className="btn-vintage text-xs">
                    {action.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AdminNav };
