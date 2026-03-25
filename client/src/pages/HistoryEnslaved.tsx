import { useState } from "react";
import { Link } from "wouter";

const FALLBACK_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663370724830/BJfSrzjRtuEsJ2dXmaEoHv/homestead_311a9537.jpg";

const KEY_PROFILES = [
  {
    slug: "nancy-mcgruder",
    name: "Nancy McGruder",
    years: "ca. 1810 – unknown",
    bio: `No one really knows when Nancy McGruder was born, but according to James Dinsmore's documents, it must have been about 1810. She was bought as a slave by John Minor from a Kentucky slave trader. A few years before Minor and Dinsmore purchased a plantation in Louisiana in 1828, James bought Nancy and several other slaves from Minor, later moving her to his Bayou Black plantation. Although Nancy mostly worked in the house, James also hired her out to neighbors. In family documents, Nancy was included in a household with an enslaved man, Vincent, who was owned by someone other than Dinsmore. When James Dinsmore moved to Kentucky in 1842, Nancy came with him. She is listed in the 1850 and 1860 censuses as living on the Dinsmore farm. After emancipation in 1865, Nancy continued to live and work at the farm as a free person.`,
  },
  {
    slug: "jilson-eliza-hawkins",
    name: "Jilson and Eliza Hawkins Family",
    years: "Jilson: ca. 1815 – unknown",
    bio: `Jilson Hawkins was one of the enslaved people brought to Dinsmore by James Dinsmore in 1842. He was born in 1815 in Virginia, and his family was sold away from him when he was a child. He was then sold to James Dinsmore. In 1831, James purchased a young girl, Eliza, from a trader from Richmond, Virginia. Eliza was listed as twelve years old at the time. Within the next ten years Jilson married Eliza in an informal ceremony and they were listed as a family unit in James' plantation records, with a female named Ellen, who may have been their daughter. When James Dinsmore moved to Kentucky in 1842, Jilson and Eliza came with him. They are listed in the 1850 and 1860 censuses as living on the Dinsmore farm.`,
  },
  {
    slug: "julia-farley-loving",
    name: "Julia Farley Loving",
    years: "ca. 1840 – unknown",
    bio: `Julia Farley was born into slavery at Dinsmore Farm around 1840. After emancipation, she remained at the farm as a free domestic worker. She later married Colonel Walter H. Loving, a pioneering African American military bandmaster who served in the Philippine Constabulary Band. Their story connects the Dinsmore homestead to the broader history of African American achievement in the post-Civil War era. Julia's life at Dinsmore spans both the era of enslavement and the early decades of freedom, making her story central to understanding the farm's full history.`,
  },
  {
    slug: "coah",
    name: "Coah",
    years: "ca. 1800 – unknown",
    bio: `Coah's story begins before his arrival at Dinsmore. Eventually, Coah was purchased by John or Stephen Minor, who had several plantations in Louisiana and Mississippi. Although marriages between enslaved African Americans had no legal support, slaveholders considered marriage and the creation of families as a positive good because the husband or father was less likely to run away than the single, unattached male. Economically, then, marriage made sense and both enslavers and the enslaved came to accept casual ceremonies, such as having the couple jump over a broomstick, to seal a marriage agreement. When James Dinsmore and John Minor purchased land in Louisiana, Coah came with them, and his story became intertwined with the Dinsmore family's Kentucky homestead.`,
  },
];

export default function HistoryEnslavedPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProfile = selected ? KEY_PROFILES.find(p => p.slug === selected) || null : null;

  return (
    <div className="min-h-screen" style={{ background: "oklch(96% 0.018 80)" }}>
      <div className="relative py-20 text-center" style={{ backgroundImage: `linear-gradient(rgba(44,26,12,0.8), rgba(44,26,12,0.8)), url(${FALLBACK_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container">
          <p className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Honoring Their Memory</p>
          <h1 style={{ color: "oklch(97% 0.01 80)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", margin: "0.5rem 0 1rem" }}>Enslaved People at Dinsmore</h1>
          <p style={{ color: "oklch(87% 0.032 72)", fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", maxWidth: "640px", margin: "0 auto 1.5rem" }}>
            The Dinsmore Homestead is committed to telling the complete history of all who lived and worked here, including the enslaved African Americans whose labor built and sustained this farm.
          </p>
          <nav style={{ fontSize: "0.85rem", color: "oklch(75% 0.03 72)" }}>
            <Link href="/" style={{ color: "oklch(68% 0.12 75)" }}>Home</Link><span className="mx-2">›</span>
            <Link href="/history/family" style={{ color: "oklch(68% 0.12 75)" }}>The Family</Link><span className="mx-2">›</span>
            <span>Enslaved People</span>
          </nav>
        </div>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(44,26,12,0.88)" }} onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-sm shadow-2xl" style={{ background: "oklch(96% 0.018 80)", border: "2px solid oklch(55% 0.11 72)" }} onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "oklch(22% 0.04 50)", marginBottom: "0.25rem" }}>{selectedProfile.name}</h2>
              <p style={{ color: "oklch(55% 0.11 72)", fontStyle: "italic", marginBottom: "1.5rem", fontSize: "0.9rem" }}>{selectedProfile.years}</p>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", lineHeight: 1.8, color: "oklch(30% 0.04 50)" }}>
                {selectedProfile.bio.split('\n').filter(p => p.trim()).map((para, i) => <p key={i} style={{ marginBottom: "1rem" }}>{para}</p>)}
              </div>
              <button onClick={() => setSelected(null)} className="btn-vintage mt-4">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-16">
        <div className="max-w-3xl mx-auto mb-14">
          <div className="text-center mb-8">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "oklch(22% 0.04 50)", marginBottom: "0.5rem" }}>A Complete History</h2>
            <div className="ornamental-divider" />
          </div>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", lineHeight: 1.85, color: "oklch(30% 0.04 50)", marginBottom: "1.5rem" }}>
            The Dinsmore family owned enslaved people from the time they moved to Kentucky in 1842 until the end of the Civil War. The number of enslaved people varied over time, but the 1850 census shows 16 enslaved people and the 1860 census shows 12. The Dinsmore family kept detailed records, including some about the enslaved people, which provide a glimpse into their lives.
          </p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", lineHeight: 1.85, color: "oklch(30% 0.04 50)" }}>
            The Dinsmore Homestead Foundation is committed to telling the complete story of all who lived and worked here. The following profiles represent some of the enslaved individuals whose lives are documented in the Dinsmore family records. Their stories are an essential part of the homestead's history and of the broader American story.
          </p>
        </div>

        <div className="mb-14">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "oklch(22% 0.04 50)", marginBottom: "1.5rem", textAlign: "center" }}>Documented Individuals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {KEY_PROFILES.map(profile => (
              <button key={profile.slug} onClick={() => setSelected(profile.slug)} className="group text-left p-6 bg-white hover:bg-[oklch(55%_0.11_72_/_0.05)] transition-colors" style={{ border: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "oklch(22% 0.04 50)", marginBottom: "0.25rem" }} className="group-hover:text-[oklch(55%_0.11_72)] transition-colors">{profile.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "oklch(55% 0.11 72)", fontStyle: "italic", marginBottom: "0.75rem" }}>{profile.years}</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(38% 0.055 54)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{profile.bio.slice(0, 200)}…</p>
                <span style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.75rem", color: "oklch(55% 0.11 72)", textDecoration: "underline" }}>Read full profile →</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-14 p-8 bg-white" style={{ border: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "oklch(22% 0.04 50)", marginBottom: "1rem" }}>Census Records</h3>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", lineHeight: 1.75, color: "oklch(30% 0.04 50)", marginBottom: "1rem" }}>Federal census records provide a statistical picture of the enslaved population at Dinsmore Farm, though they recorded enslaved people only by age and sex — not by name — in the slave schedules.</p>
          <div className="grid grid-cols-2 gap-4">
            {[{ year: "1850 Census", count: "16 enslaved people", note: "Listed in slave schedule" }, { year: "1860 Census", count: "12 enslaved people", note: "Listed in slave schedule" }, { year: "1865", count: "Emancipation", note: "Kentucky ratifies 13th Amendment" }, { year: "Post-1865", count: "Several remained", note: "As free domestic workers" }].map(row => (
              <div key={row.year} className="p-4" style={{ background: "oklch(96% 0.018 80)", border: "1px solid oklch(55% 0.11 72 / 0.2)" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "oklch(22% 0.04 50)", fontWeight: 600 }}>{row.year}</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "oklch(38% 0.055 54)", marginTop: "0.25rem" }}>{row.count}</p>
                <p style={{ fontSize: "0.75rem", color: "oklch(50% 0.04 54)", marginTop: "0.2rem", fontStyle: "italic" }}>{row.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 pt-10" style={{ borderTop: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
          <Link href="/visit" className="btn-vintage mr-4">Plan Your Visit</Link>
          <Link href="/history/family" className="btn-vintage-outline">The Dinsmore Family</Link>
        </div>
      </div>
    </div>
  );
}
