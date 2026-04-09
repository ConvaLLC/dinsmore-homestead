import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TreePine, Sun, Clock, DollarSign, Phone, Mail, ArrowLeft, ChevronRight, Star } from "lucide-react";

const ADVENTURES = [
  {
    title: "Blaze a Trail with Lewis & Clark",
    desc: "Follow the footsteps of America's greatest explorers through wilderness challenges, navigation activities, and frontier survival skills.",
    icon: "🧭",
  },
  {
    title: "4th of July at a Turn-of-the-Century Fair",
    desc: "Celebrate Independence Day the old-fashioned way with period games, music, and festivities from the early 1900s.",
    icon: "🎆",
  },
  {
    title: "Cool Off at the Local Swimming Hole",
    desc: "Experience summer fun as children did generations ago, with outdoor games and activities tied to the rhythms of farm life.",
    icon: "🏊",
  },
  {
    title: "Pioneer Life & Farm Chores",
    desc: "Try your hand at the daily tasks that kept a 19th-century homestead running — from tending animals to hands-on crafts.",
    icon: "🌾",
  },
];

const SESSIONS = [
  {
    session: "Session 1",
    dates: "June 16–20",
    time: "9:00 AM – 1:00 PM",
    note: "Lunch provided one day; snacks every day",
  },
  {
    session: "Session 2",
    dates: "July 14–18",
    time: "9:00 AM – 1:00 PM",
    note: "Lunch provided one day; snacks every day",
  },
];

export default function SummerPrograms() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-end pb-16"
        style={{ background: "linear-gradient(160deg, #2d4a1e 0%, #1a2f0e 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="container relative z-10">
          <Link href="/group-tours">
            <button
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Group Reservations
            </button>
          </Link>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
          >
            ✦ Summer Programs ✦
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pioneer-to-the-Past
            <br />
            <span style={{ color: "#c9a84c" }}>Daycamp</span>
          </h1>
          <p
            className="text-lg text-white/80 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            An adventurous summer camp exploring great events from American History —
            no technology needed! Join us at the Dinsmore Homestead for a once-in-a-lifetime
            chance to participate in events from days gone by.
          </p>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-6 bg-[#c9a84c]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[#1a2f4e]">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Hours</p>
                <p style={{ fontFamily: "'EB Garamond', serif" }}>9:00 AM – 1:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Cost</p>
                <p style={{ fontFamily: "'EB Garamond', serif" }}>$130 per child</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Sessions</p>
                <p style={{ fontFamily: "'EB Garamond', serif" }}>2 sessions available</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Discounts</p>
                <p style={{ fontFamily: "'EB Garamond', serif" }}>Siblings &amp; members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adventures */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container">
          <div className="text-center mb-14">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              What We Explore
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1a2f4e] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Adventures Await
            </h2>
            <p
              className="text-[#4a3728] max-w-2xl mx-auto"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}
            >
              Each week-long session is packed with immersive activities drawn directly from
              American history — no screens, no shortcuts, just genuine discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ADVENTURES.map((adv) => (
              <div
                key={adv.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#c9a84c]/20 flex items-start gap-4"
              >
                <span className="text-3xl flex-shrink-0">{adv.icon}</span>
                <div>
                  <h3
                    className="font-bold text-[#1a2f4e] mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
                  >
                    {adv.title}
                  </h3>
                  <p
                    className="text-[#4a3728] leading-relaxed text-sm"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem" }}
                  >
                    {adv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sessions */}
      <section className="py-20 bg-[#1a2f4e]">
        <div className="container">
          <div className="text-center mb-12">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              2026 Schedule
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Camp Sessions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {SESSIONS.map((s) => (
              <div
                key={s.session}
                className="rounded-xl p-8 border border-white/10 bg-white/5 text-center"
              >
                <p
                  className="text-xs tracking-widest uppercase mb-3"
                  style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                >
                  {s.session}
                </p>
                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.dates}
                </h3>
                <p className="text-white/70 mb-2" style={{ fontFamily: "'EB Garamond', serif" }}>
                  {s.time}
                </p>
                <p className="text-white/50 text-sm italic" style={{ fontFamily: "'EB Garamond', serif" }}>
                  {s.note}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="max-w-2xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10 text-center">
            <p
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              Pricing
            </p>
            <p
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              $130
              <span className="text-lg text-white/60 font-normal"> / child</span>
            </p>
            <p className="text-white/60 mb-6" style={{ fontFamily: "'EB Garamond', serif" }}>
              Discounts available for siblings and Dinsmore Museum members.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:8595866117">
                <Button
                  className="w-full sm:w-auto"
                  style={{
                    backgroundColor: "#c9a84c",
                    color: "#1a2f4e",
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call to Register
                </Button>
              </a>
              <a href="mailto:ccollopy@dinsmorehomestead.org">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
              </a>
            </div>
            <p className="text-white/40 text-sm mt-4" style={{ fontFamily: "'EB Garamond', serif" }}>
              Call Cathy Collopy at (859) 586-6117 or email ccollopy@dinsmorehomestead.org
            </p>
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="py-16 bg-[#f5f0e8]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              Also Explore
            </p>
            <h2
              className="text-2xl font-bold text-[#1a2f4e] mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              More Ways to Experience Dinsmore
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/school-programs">
                <div className="bg-white rounded-xl p-6 border border-[#c9a84c]/20 hover:shadow-md transition-shadow cursor-pointer">
                  <TreePine className="w-8 h-8 mx-auto mb-3" style={{ color: "#c9a84c" }} />
                  <h3 className="font-bold text-[#1a2f4e] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    School Programs
                  </h3>
                  <p className="text-[#4a3728] text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
                    Grades 1–12 field trip programs
                  </p>
                </div>
              </Link>
              <Link href="/scout-programs">
                <div className="bg-white rounded-xl p-6 border border-[#c9a84c]/20 hover:shadow-md transition-shadow cursor-pointer">
                  <Star className="w-8 h-8 mx-auto mb-3" style={{ color: "#c9a84c" }} />
                  <h3 className="font-bold text-[#1a2f4e] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Scout Programs
                  </h3>
                  <p className="text-[#4a3728] text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
                    Merit badges &amp; Eagle Scout projects
                  </p>
                </div>
              </Link>
              <Link href="/#book-a-tour">
                <div className="bg-[#1a2f4e] rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <ChevronRight className="w-8 h-8 mx-auto mb-3" style={{ color: "#c9a84c" }} />
                  <h3 className="font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Book a Tour
                  </h3>
                  <p className="text-white/70 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
                    Public tours Fri–Sun, 1–4 PM
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
