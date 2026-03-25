import { IMAGES } from "../../../shared/images";

const TIMELINE_EVENTS = [
  { year: "1842", title: "The Homestead is Built", desc: "James Dinsmore constructs the main farmhouse on land along the Licking River in Boone County, Kentucky." },
  { year: "1850s", title: "Farm Expansion", desc: "The farm grows to include multiple outbuildings, a working mill, and extensive agricultural operations." },
  { year: "1861–1865", title: "The Civil War Years", desc: "Kentucky's divided loyalties create tension. The Dinsmore family navigates the war years while maintaining the farm." },
  { year: "1875", title: "Isabella Selmes Born", desc: "Isabella Selmes, who would become one of the most remarkable women of her generation, is born at the homestead." },
  { year: "1926", title: "Julia Stockton Dinsmore Passes", desc: "Julia, the last Dinsmore to reside in the house, passes away at age 93, having lived in the homestead her entire life." },
  { year: "1988", title: "Foundation Established", desc: "The Dinsmore Homestead Foundation is established to preserve and interpret the property for future generations." },
  { year: "2000s", title: "Restoration Work Begins", desc: "Major restoration and preservation efforts begin, stabilizing the historic structures and cataloging the extensive collection." },
];

export default function HistoryTimelinePage() {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "280px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.farmHDR})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(20%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.7)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Our History</span>
          <h1 style={{ color: "oklch(96% 0.018 80)" }}>Historical Timeline</h1>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container max-w-3xl">
          <div className="relative">
            <div style={{ position: "absolute", left: "80px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(to bottom, oklch(55% 0.11 72), oklch(72% 0.05 62))" }} />
            <div className="space-y-8">
              {TIMELINE_EVENTS.map((event) => (
                <div key={event.year} className="flex gap-6 relative">
                  <div style={{ width: "80px", flexShrink: 0, textAlign: "right", paddingRight: "1.5rem" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", fontWeight: 700, color: "oklch(38% 0.12 22)" }}>
                      {event.year}
                    </span>
                  </div>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "oklch(55% 0.11 72)", border: "2px solid oklch(96% 0.018 80)", flexShrink: 0, marginTop: "0.35rem", position: "relative", zIndex: 1 }} />
                  <div className="card-vintage p-4 flex-1">
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", marginBottom: "0.4rem" }}>{event.title}</h4>
                    <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(46% 0.06 56)", margin: 0 }}>{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
