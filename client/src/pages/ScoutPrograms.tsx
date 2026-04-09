import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Award, Phone, Mail, ArrowLeft, ChevronRight, TreePine } from "lucide-react";

const BOY_SCOUT_BADGES = [
  { badge: "American Cultures", desc: "Explore the diverse cultural heritage of the United States through the lens of the Dinsmore family's interactions with different communities." },
  { badge: "American Heritage", desc: "Discover how the Dinsmore Homestead fits into the broader story of American history from the antebellum era through the early 20th century." },
  { badge: "Art", desc: "Study the artistic artifacts, portraits, and decorative arts preserved in the Homestead's collection." },
  { badge: "Nature", desc: "Explore the farm's natural environment, gardens, and the relationship between 19th-century families and the land." },
  { badge: "Bird Study", desc: "Identify and study bird species on the Homestead's grounds, drawing on the farm's rich natural habitat." },
];

const GIRL_SCOUT_BADGES = [
  { badge: "Outdoor Art Maker", desc: "Create art inspired by the natural beauty of the Homestead's grounds and the artistic traditions of the 19th century." },
  { badge: "Outdoor Art Apprentice", desc: "Develop artistic skills using outdoor settings and natural materials, guided by the Homestead's historic environment." },
  { badge: "Detective", desc: "Use primary source documents and artifacts to solve historical mysteries about the Dinsmore family and their era." },
  { badge: "Playing the Past", desc: "Learn and play games from the 19th century, exploring how children's recreation has changed over generations." },
  { badge: "Painting", desc: "Study and practice painting techniques inspired by the portraits and artwork preserved in the Homestead's collection." },
  { badge: "Inventor", desc: "Explore 19th-century innovations and inventions, comparing the technological changes of the Dinsmore era to today." },
];

export default function ScoutPrograms() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-end pb-16"
        style={{ background: "linear-gradient(160deg, #4a2d1e 0%, #2d1a0e 100%)" }}
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
            ✦ Scout Programs ✦
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Boy Scouts &amp;
            <br />
            <span style={{ color: "#c9a84c" }}>Girl Scouts</span>
          </h1>
          <p
            className="text-lg text-white/80 max-w-2xl leading-relaxed"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Because our site is both indoors and outdoors, we offer a range of activities
            for Boy Scouts and Girl Scouts of all ages. Earn merit badges, complete Eagle
            Scout projects, and explore one of Kentucky's most authentic historic sites.
          </p>
        </div>
      </section>

      {/* Eagle Scout Callout */}
      <section className="py-8 bg-[#c9a84c]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Award className="w-8 h-8 text-[#1a2f4e] flex-shrink-0" />
              <p
                className="text-[#1a2f4e] font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
              >
                Considering an Eagle Scout project? Dinsmore has a proud history of hosting Eagle Scout projects that make a lasting difference.
              </p>
            </div>
            <a href="mailto:ccollopy@dinsmorehomestead.org" className="flex-shrink-0">
              <Button
                style={{ backgroundColor: "#1a2f4e", color: "white", fontFamily: "'Cinzel', serif" }}
              >
                Contact Us <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Boy Scouts */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#1a2f4e" }}
              >
                <Star className="w-7 h-7" style={{ color: "#c9a84c" }} />
              </div>
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                >
                  Merit Badge Activities
                </p>
                <h2
                  className="text-3xl font-bold text-[#1a2f4e]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Boy Scouts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BOY_SCOUT_BADGES.map((item) => (
                <div
                  key={item.badge}
                  className="bg-white rounded-xl p-6 border border-[#1a2f4e]/10 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(26,47,78,0.1)" }}
                    >
                      <Star className="w-4 h-4" style={{ color: "#1a2f4e" }} />
                    </div>
                    <h3
                      className="font-bold text-[#1a2f4e]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.badge}
                    </h3>
                  </div>
                  <p
                    className="text-[#4a3728] text-sm leading-relaxed"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Girl Scouts */}
      <section className="py-20 bg-[#ede5d0]">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#4a2d1e" }}
              >
                <Star className="w-7 h-7" style={{ color: "#c9a84c" }} />
              </div>
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                >
                  Badge Activities
                </p>
                <h2
                  className="text-3xl font-bold text-[#1a2f4e]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Girl Scouts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {GIRL_SCOUT_BADGES.map((item) => (
                <div
                  key={item.badge}
                  className="bg-white rounded-xl p-6 border border-[#4a2d1e]/10 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(74,45,30,0.1)" }}
                    >
                      <Star className="w-4 h-4" style={{ color: "#4a2d1e" }} />
                    </div>
                    <h3
                      className="font-bold text-[#1a2f4e]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.badge}
                    </h3>
                  </div>
                  <p
                    className="text-[#4a3728] text-sm leading-relaxed"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eagle Scout Projects */}
      <section className="py-20 bg-[#1a2f4e]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
            >
              <Award className="w-8 h-8" style={{ color: "#c9a84c" }} />
            </div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              Eagle Scout Projects
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Leave a Lasting Legacy
            </h2>
            <p
              className="text-white/75 leading-relaxed mb-8"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}
            >
              Over the years, Dinsmore has been grateful to have benefited from the Eagle
              Scout Program. Our historic grounds and facilities offer meaningful project
              opportunities that make a real difference in preserving this National Historic
              Landmark for future generations. If you are considering embarking on an Eagle
              Scout project at Dinsmore, please reach out to our education coordinator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:8595866117">
                <Button
                  style={{
                    backgroundColor: "#c9a84c",
                    color: "#1a2f4e",
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (859) 586-6117
                </Button>
              </a>
              <a href="mailto:ccollopy@dinsmorehomestead.org">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  ccollopy@dinsmorehomestead.org
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve CTA */}
      <section className="py-16 bg-[#f5f0e8]">
        <div className="container text-center">
          <h2
            className="text-2xl font-bold text-[#1a2f4e] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Plan Your Troop's Visit?
          </h2>
          <p
            className="text-[#4a3728] mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
          >
            Fill out our group reservation form and our education coordinator will be in
            touch to plan the perfect scouting experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/group-tours#reserve">
              <Button
                className="px-8 py-3 text-base font-bold tracking-widest"
                style={{
                  backgroundColor: "#1a2f4e",
                  color: "#c9a84c",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Submit a Reservation Inquiry
              </Button>
            </Link>
            <Link href="/summer-programs">
              <Button
                variant="outline"
                className="px-8 py-3 text-base border-[#1a2f4e] text-[#1a2f4e] hover:bg-[#1a2f4e] hover:text-white"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <TreePine className="w-4 h-4 mr-2" />
                Summer Daycamp
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
