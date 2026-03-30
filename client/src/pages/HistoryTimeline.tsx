import { useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";

type TimelineEvent = {
  year: string;
  title: string;
  desc: string;
  category: "family" | "farm" | "history" | "foundation";
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  { year: "1797", title: "Martha Keturah Macomb Born", desc: "Martha Keturah Macomb, future wife of James Dinsmore and matriarch of the homestead, is born.", category: "family" },
  { year: "1825", title: "James Acquires Nancy", desc: "James Dinsmore purchases Nancy McGruder, one of the enslaved individuals who would later come to the Kentucky homestead.", category: "history" },
  { year: "1837", title: "James Dinsmore & Martha Macomb Marry", desc: "James Dinsmore and Martha Keturah Macomb are married, beginning the family that would build and inhabit the Dinsmore Homestead.", category: "family" },
  { year: "1842", title: "Family Moves into Dinsmore Farm", desc: "The Dinsmore family moves into the newly constructed Federal-style farmhouse in Boone County, Kentucky, along the Licking River. The farm is established with multiple outbuildings and working agricultural operations.", category: "farm" },
  { year: "1843", title: "Julia Stockton Dinsmore Born", desc: "Julia Stockton Dinsmore, who would become a celebrated poet, diarist, and the last Dinsmore to reside in the house, is born at the homestead.", category: "family" },
  { year: "1845", title: "Susan Bell Dinsmore Born", desc: "Susan Bell Dinsmore, second daughter of James and Martha, is born at the homestead.", category: "family" },
  { year: "1847", title: "Isabella Ramsay Dinsmore Born", desc: "Isabella Ramsay Dinsmore, who would later marry Judge Charles Eugene Flandrau and become the mother of Isabella Selmes, is born.", category: "family" },
  { year: "1849", title: "Isabella Dinsmore & Charles Flandrau Marry", desc: "Isabella Ramsay Dinsmore marries Charles Eugene Flandrau, a prominent Minnesota jurist and author who later served as an Associate Justice of the Minnesota Supreme Court.", category: "family" },
  { year: "1855", title: "Martha Macomb Flandrau (Patty) Born", desc: "Martha Macomb Flandrau, known as 'Patty,' daughter of Isabella and Charles Flandrau, is born.", category: "family" },
  { year: "1857", title: "Sarah Gibson Flandrau (Sally) Born", desc: "Sarah Gibson Flandrau, known as 'Sally,' second daughter of Isabella and Charles Flandrau, is born.", category: "family" },
  { year: "1861–1865", title: "The Civil War Years", desc: "Kentucky's divided loyalties create tension throughout the region. The Dinsmore family navigates the war years while maintaining the farm. Enslaved people at Dinsmore are emancipated at the war's end in 1865.", category: "history" },
  { year: "1874", title: "Patty Flandrau & Tilden R. Selmes Marry", desc: "Martha Macomb Flandrau ('Patty') marries Tilden Russell Selmes, connecting the Dinsmore family to the prominent Selmes family.", category: "family" },
  { year: "1875", title: "Isabella Dinsmore Selmes is Born", desc: "Isabella Dinsmore Selmes, who would become one of the most remarkable women of her generation — congresswoman, businesswoman, and friend of the Roosevelts — is born.", category: "family" },
  { year: "1878", title: "Robert Munro Ferguson (Bobby) Born", desc: "Robert Munro Ferguson, who would later marry Isabella Selmes, is born.", category: "family" },
  { year: "1880", title: "Sally Flandrau & Franklin Cutcheon Marry", desc: "Sarah Gibson Flandrau ('Sally') marries Franklin Cutcheon.", category: "family" },
  { year: "1886", title: "Patty Selmes Dies", desc: "Martha Macomb Flandrau Selmes ('Patty') dies, leaving her young daughter Isabella to be raised with connections to both the Dinsmore homestead and the wider world.", category: "family" },
  { year: "1887", title: "John Selmes Greenway (Jack) Born", desc: "John Selmes Greenway, son of Isabella Selmes and her second husband John Greenway, is born.", category: "family" },
  { year: "1904", title: "Isabella Selmes & Robert Ferguson Marry", desc: "Isabella Dinsmore Selmes marries Robert Munro Ferguson, a Scottish-born soldier and friend of Theodore Roosevelt.", category: "family" },
  { year: "1910", title: "Martha Munro Ferguson Born", desc: "Martha Munro Ferguson, daughter of Isabella and Robert Ferguson, is born.", category: "family" },
  { year: "1917", title: "Isabella Ferguson & John Greenway Marry", desc: "After the death of Robert Ferguson, Isabella marries General John Greenway, a decorated World War I veteran and Arizona copper magnate.", category: "family" },
  { year: "1933", title: "AZ 1st Congresswoman: Isabella Greenway", desc: "Isabella Greenway King becomes Arizona's first congresswoman, serving in the U.S. House of Representatives. She was a close friend of Eleanor Roosevelt and a prominent figure in Democratic politics.", category: "history" },
  { year: "1933", title: "Isabella Ferguson & John Greenway Marry", desc: "After the death of John Greenway, Isabella marries Harry O. King.", category: "family" },
  { year: "1936", title: "Isabella Greenway & Harry O. King Marry", desc: "Isabella Greenway marries Harry O. King, her third husband.", category: "family" },
  { year: "1937", title: "Martha Munro & Charles Breasted Marry", desc: "Martha Munro Ferguson marries Charles Breasted, son of the famous Egyptologist James Henry Breasted.", category: "family" },
  { year: "1953", title: "Isabella Ferguson Greenway King Dies", desc: "Isabella Ferguson Greenway King, one of the most remarkable women connected to the Dinsmore Homestead, dies.", category: "family" },
  { year: "1988", title: "Dinsmore Homestead Foundation Established", desc: "Martha Breasted donates the house and 30 acres to the newly established Dinsmore Homestead Foundation, ensuring the preservation of the property and its contents exactly as the family left them.", category: "foundation" },
  { year: "1997", title: "Fergusons Move to Tyrone, NM", desc: "The Ferguson family's connection to the Dinsmore homestead is documented as part of the Foundation's ongoing historical research.", category: "history" },
];

const CATEGORY_COLORS: Record<string, string> = {
  family: "oklch(64.3% 0.161 143.4)",
  farm: "oklch(45% 0.12 145)",
  history: "oklch(33.1% 0.064 144.7)",
  foundation: "oklch(40% 0.10 260)",
};

const CATEGORY_LABELS: Record<string, string> = {
  family: "Family",
  farm: "The Farm",
  history: "History",
  foundation: "Foundation",
};

export default function HistoryTimelinePage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? TIMELINE_EVENTS : TIMELINE_EVENTS.filter(e => e.category === filter);

  return (
    <div className="min-h-screen" style={{ background: "oklch(96% 0.014 110)" }}>
      {/* Hero */}
      <div className="relative py-20 text-center" style={{ backgroundImage: `linear-gradient(rgba(44,26,12,0.75), rgba(44,26,12,0.75)), url(${IMAGES.farmHDR})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container">
          <p className="section-label" style={{ color: "oklch(64.3% 0.161 143.4)" }}>Five Generations</p>
          <h1 style={{ color: "oklch(97% 0.01 80)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", margin: "0.5rem 0 1rem" }}>Historical Timeline</h1>
          <p style={{ color: "oklch(86.6% 0.079 130.9)", fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            From the founding of the homestead in 1842 through the establishment of the Foundation in 1988 — the story of the Dinsmore family and their remarkable legacy.
          </p>
          <nav style={{ fontSize: "0.85rem", color: "oklch(75% 0.03 72)" }}>
            <Link href="/" style={{ color: "oklch(64.3% 0.161 143.4)" }}>Home</Link><span className="mx-2">›</span>
            <Link href="/history/family" style={{ color: "oklch(64.3% 0.161 143.4)" }}>The Family</Link><span className="mx-2">›</span>
            <span>Timeline</span>
          </nav>
        </div>
      </div>

      <div className="container py-16">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {["all", "family", "farm", "history", "foundation"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "6px 16px",
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                border: `1px solid ${cat === "all" ? "oklch(64.3% 0.161 143.4)" : (CATEGORY_COLORS[cat] || "oklch(64.3% 0.161 143.4)")}`,
                background: filter === cat ? (cat === "all" ? "oklch(64.3% 0.161 143.4)" : (CATEGORY_COLORS[cat] || "oklch(64.3% 0.161 143.4)")) : "transparent",
                color: filter === cat ? "white" : "oklch(42.3% 0.087 144.3)",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {cat === "all" ? "All Events" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div style={{ position: "absolute", left: "90px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(to bottom, oklch(55% 0.11 72 / 0.8), oklch(72% 0.05 62 / 0.3))" }} />

          <div className="space-y-6">
            {filtered.map((event, i) => (
              <div key={`${event.year}-${i}`} className="flex gap-6 relative">
                {/* Year */}
                <div style={{ width: "90px", flexShrink: 0, textAlign: "right", paddingRight: "1.5rem", paddingTop: "0.75rem" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.82rem", fontWeight: 700, color: CATEGORY_COLORS[event.category], lineHeight: 1.2, display: "block" }}>
                    {event.year}
                  </span>
                </div>
                {/* Dot */}
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: CATEGORY_COLORS[event.category], border: "3px solid oklch(96% 0.014 110)", flexShrink: 0, marginTop: "0.85rem", position: "relative", zIndex: 1, boxShadow: "0 0 0 2px " + CATEGORY_COLORS[event.category] + "40" }} />
                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="p-4 bg-white" style={{ border: `1px solid ${CATEGORY_COLORS[event.category]}40` }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: "oklch(20% 0.03 145)", lineHeight: 1.3 }}>{event.title}</h4>
                      <span style={{ flexShrink: 0, fontSize: "0.65rem", padding: "2px 8px", background: CATEGORY_COLORS[event.category] + "20", color: CATEGORY_COLORS[event.category], textTransform: "uppercase", letterSpacing: "0.1em", border: `1px solid ${CATEGORY_COLORS[event.category]}40` }}>
                        {CATEGORY_LABELS[event.category]}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.88rem", color: "oklch(44% 0.055 144)", margin: 0, lineHeight: 1.6 }}>{event.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pt-10" style={{ borderTop: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
          <Link href="/history/family" className="btn-vintage mr-4">Meet the Family</Link>
          <Link href="/history/enslaved" className="btn-vintage-outline">Enslaved People at Dinsmore</Link>
        </div>
      </div>
    </div>
  );
}
