import { IMAGES } from "../../../shared/images";

export default function HistoryEnslavedPage() {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "280px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.farmPhoto1})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(20%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.7)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Our History</span>
          <h1 style={{ color: "oklch(96% 0.018 80)" }}>The Enslaved Community</h1>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container max-w-3xl">
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(38% 0.055 54)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            The Dinsmore Homestead Foundation is committed to telling the complete history of the farm — 
            including the stories of the enslaved men, women, and children who lived and worked here. 
            Their labor built the farm and sustained the household, yet their names and stories were 
            largely absent from the historical record.
          </p>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(38% 0.055 54)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Through ongoing research, oral histories, and archival work, we are working to recover and 
            honor these lives. The Dinsmore family records, including account books, letters, and census 
            records, provide partial documentation of the enslaved community that made this farm possible.
          </p>
          <div className="pull-quote">
            "We are committed to telling the whole story of this place — not just the story of the 
            family who owned it, but of all who lived and worked here."
          </div>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "oklch(46% 0.06 56)", lineHeight: 1.8 }}>
            If you have information about individuals who were enslaved at the Dinsmore Homestead or 
            in the surrounding area, we encourage you to contact us. This research is ongoing and 
            community participation is vital to its success.
          </p>
        </div>
      </section>
    </div>
  );
}
