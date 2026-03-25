import { useState } from "react";
import { Link } from "wouter";
import { familyBios, type FamilyBio } from "../../../shared/familyBios";

const PORTRAIT_OVERRIDES: Record<string, string> = {
  "james-dinsmore": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/james-dinsmore_e2d0c7c1.jpg",
  "martha-macomb-dinsmore": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/martha_macomb_f6a5b2d3.jpg",
  "julia-stockton-dinsmore": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Julia-Stockton-Dinsmore_a1b2c3d4.png",
  "susan-bell-dinsmore": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Susan-Bell-Dinsmore_b2c3d4e5.jpg",
  "isabella-dinsmore-flandrau": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Isabella-Dinsmore-Flandrau_c3d4e5f6.jpg",
  "charles-eugene-flandrau": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Charles-Blair-Flandrau_d4e5f6a7.png",
  "isabella-selmes-ferguson-greenway-king": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Isabella-Selmes-Ferguson-Greenway-King_e5f6a7b8.png",
  "grace-hodgson-flandrau": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Grace-Hodgson-Flandrau_f6a7b8c9.png",
  "alexander-macomb": "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/Alexander-Macomb_a7b8c9d0.png",
};

const VIDEO_OVERRIDES: Record<string, string> = {
  "james-dinsmore": "https://www.youtube.com/embed/F6u-WZtoNX8",
  "james-dinsmore-full-bio": "https://www.youtube.com/embed/F6u-WZtoNX8",
  "julia-stockton-dinsmore": "https://www.youtube.com/embed/TSGqLEkEz5E",
  "julia-stockton-dinsmore-full-bio": "https://www.youtube.com/embed/TSGqLEkEz5E",
  "isabella-dinsmore-flandrau": "https://www.youtube.com/embed/TSGqLEkEz5E",
  "isabella-ramsay-dinsmore-flandrau": "https://www.youtube.com/embed/TSGqLEkEz5E",
};

const CORE_SLUGS = [
  "james-dinsmore",
  "martha-macomb-dinsmore",
  "julia-stockton-dinsmore",
  "susan-bell-dinsmore",
  "isabella-dinsmore-flandrau",
  "charles-eugene-flandrau",
  "isabella-selmes-ferguson-greenway-king",
];

const FALLBACK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/homestead_311a9537.jpg";

function getPortrait(bio: FamilyBio) {
  return PORTRAIT_OVERRIDES[bio.slug] || bio.portrait || FALLBACK_IMG;
}

function getVideo(bio: FamilyBio) {
  return VIDEO_OVERRIDES[bio.slug] || bio.videoUrl || "";
}

export default function HistoryFamilyPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const selectedBio = selected ? familyBios.find(b => b.slug === selected) : null;

  const coreBios = CORE_SLUGS
    .map(s => familyBios.find(b => b.slug === s))
    .filter(Boolean) as FamilyBio[];

  const filtered = familyBios.filter(b =>
    !CORE_SLUGS.includes(b.slug) &&
    (b.name.toLowerCase().includes(search.toLowerCase()) ||
     b.relation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen" style={{ background: "oklch(96% 0.018 80)" }}>
      {/* Hero Banner */}
      <div
        className="relative py-20 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(44,26,12,0.75), rgba(44,26,12,0.75)), url(${FALLBACK_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <p className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>The Dinsmore Legacy</p>
          <h1 style={{ color: "oklch(97% 0.01 80)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", margin: "0.5rem 0 1rem" }}>
            The Family
          </h1>
          <p style={{ color: "oklch(87% 0.032 72)", fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            Five generations of the Dinsmore family shaped this homestead and left their mark on American history.
          </p>
          <nav style={{ fontSize: "0.85rem", color: "oklch(75% 0.03 72)" }}>
            <Link href="/" style={{ color: "oklch(68% 0.12 75)" }}>Home</Link>
            <span className="mx-2">›</span>
            <span>The Family</span>
          </nav>
        </div>
      </div>

      {/* Bio Modal */}
      {selectedBio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(44,26,12,0.88)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            style={{ background: "oklch(96% 0.018 80)", border: "2px solid oklch(55% 0.11 72)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={getPortrait(selectedBio)}
                  alt={selectedBio.name}
                  className="flex-shrink-0 object-cover"
                  style={{ width: 120, height: 150, border: "3px solid oklch(55% 0.11 72)", filter: "sepia(20%)" }}
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "oklch(22% 0.04 50)", marginBottom: "0.3rem" }}>
                    {selectedBio.name}
                  </h2>
                  {selectedBio.lifespan && (
                    <p style={{ color: "oklch(55% 0.11 72)", fontStyle: "italic", marginBottom: "0.5rem" }}>{selectedBio.lifespan}</p>
                  )}
                  <span style={{ display: "inline-block", padding: "2px 10px", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", background: "oklch(55% 0.11 72 / 0.15)", color: "oklch(55% 0.11 72)", borderRadius: "2px" }}>
                    {selectedBio.relation}
                  </span>
                </div>
              </div>

              {getVideo(selectedBio) && (
                <div className="mb-6">
                  <iframe
                    src={getVideo(selectedBio)}
                    className="w-full"
                    style={{ aspectRatio: "16/9" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video about ${selectedBio.name}`}
                  />
                </div>
              )}

              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", lineHeight: 1.8, color: "oklch(30% 0.04 50)" }}>
                {selectedBio.fullBio
                  ? selectedBio.fullBio.split('\n').filter(p => p.trim().length > 0).map((para, i) => (
                      <p key={i} style={{ marginBottom: "1rem" }}>{para}</p>
                    ))
                  : <p style={{ fontStyle: "italic", opacity: 0.6 }}>Full biography coming soon.</p>
                }
              </div>

              <button
                onClick={() => setSelected(null)}
                className="btn-vintage mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-16">
        {/* Core Family */}
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "oklch(22% 0.04 50)", marginBottom: "0.5rem" }}>
            Core Family Members
          </h2>
          <div className="ornamental-divider" />
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(38% 0.055 54)", maxWidth: "600px", margin: "1rem auto 0", lineHeight: 1.7 }}>
            The Dinsmore family lived at this homestead for five generations, from its construction in 1842 through the 20th century.
            Click any portrait to read their full biography.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {coreBios.map(bio => (
            <button
              key={bio.slug}
              onClick={() => setSelected(bio.slug)}
              className="group text-left"
            >
              <div className="overflow-hidden mb-3" style={{ border: "2px solid oklch(55% 0.11 72)", aspectRatio: "3/4" }}>
                <img
                  src={getPortrait(bio)}
                  alt={bio.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  style={{ filter: "sepia(20%)" }}
                  onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "oklch(22% 0.04 50)", lineHeight: 1.3 }}
                  className="group-hover:text-[oklch(55%_0.11_72)] transition-colors">
                {bio.name}
              </h3>
              {bio.lifespan && (
                <p style={{ fontSize: "0.75rem", color: "oklch(55% 0.11 72)", marginTop: "0.2rem", fontStyle: "italic" }}>{bio.lifespan}</p>
              )}
            </button>
          ))}
        </div>

        {/* All Other Members */}
        <div style={{ borderTop: "1px solid oklch(55% 0.11 72 / 0.3)", paddingTop: "3rem" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "oklch(22% 0.04 50)" }}>
              Extended Family &amp; Associates
            </h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "6px 14px",
                fontFamily: "'EB Garamond', serif",
                fontSize: "0.9rem",
                background: "white",
                border: "1px solid oklch(55% 0.11 72 / 0.5)",
                color: "oklch(22% 0.04 50)",
                outline: "none",
                width: 220,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(bio => (
              <button
                key={bio.slug}
                onClick={() => setSelected(bio.slug)}
                className="group text-left p-4 bg-white hover:bg-[oklch(55%_0.11_72_/_0.05)] transition-colors"
                style={{ border: "1px solid oklch(55% 0.11 72 / 0.25)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 overflow-hidden" style={{ width: 56, height: 72, border: "1px solid oklch(55% 0.11 72 / 0.4)" }}>
                    <img
                      src={getPortrait(bio)}
                      alt={bio.name}
                      className="w-full h-full object-cover"
                      style={{ filter: "sepia(25%)" }}
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "oklch(22% 0.04 50)", lineHeight: 1.3 }}
                        className="group-hover:text-[oklch(55%_0.11_72)] transition-colors">
                      {bio.name}
                    </h3>
                    {bio.lifespan && (
                      <p style={{ fontSize: "0.7rem", color: "oklch(55% 0.11 72)", fontStyle: "italic", marginTop: "0.15rem" }}>{bio.lifespan}</p>
                    )}
                    <p style={{ fontSize: "0.65rem", color: "oklch(50% 0.04 54)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem" }}>
                      {bio.relation}
                    </p>
                    {bio.shortBio && (
                      <p style={{ fontSize: "0.8rem", color: "oklch(38% 0.055 54)", marginTop: "0.4rem", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {bio.shortBio.slice(0, 120)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && search && (
            <p style={{ textAlign: "center", color: "oklch(50% 0.04 54)", fontStyle: "italic", padding: "2rem 0", fontFamily: "'EB Garamond', serif" }}>
              No family members found matching "{search}"
            </p>
          )}
        </div>

        {/* Videos */}
        <div style={{ borderTop: "1px solid oklch(55% 0.11 72 / 0.3)", paddingTop: "3rem", marginTop: "3rem" }}>
          <div className="text-center mb-10">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "oklch(22% 0.04 50)", marginBottom: "0.5rem" }}>
              Family History Videos
            </h2>
            <div className="ornamental-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { slug: "james-dinsmore", src: "https://www.youtube.com/embed/F6u-WZtoNX8", title: "James Dinsmore", subtitle: "Founder of the Dinsmore Homestead" },
              { slug: "julia-stockton-dinsmore", src: "https://www.youtube.com/embed/TSGqLEkEz5E", title: "Julia Stockton Dinsmore", subtitle: "Poet, diarist, and keeper of the homestead" },
            ].map(v => (
              <div key={v.slug}>
                <div style={{ aspectRatio: "16/9", marginBottom: "0.75rem" }}>
                  <iframe src={v.src} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={v.title} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "oklch(22% 0.04 50)", marginBottom: "0.25rem" }}>{v.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "oklch(50% 0.04 54)", fontStyle: "italic" }}>{v.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/history/timeline" className="btn-vintage mr-4">Explore the Timeline</Link>
          <Link href="/history/enslaved" className="btn-vintage-outline">Enslaved People at Dinsmore</Link>
        </div>
      </div>
    </div>
  );
}
