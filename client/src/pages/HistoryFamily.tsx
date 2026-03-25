import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";

export default function HistoryFamilyPage() {
  const family = [
    {
      name: "James Dinsmore",
      years: "1790–1864",
      img: IMAGES.jamesDinsmore,
      bio: "James Dinsmore built the homestead in 1842 after purchasing the land along the Licking River. A successful farmer and businessman, he established the foundation of what would become a five-generation family legacy in northern Kentucky.",
    },
    {
      name: "Martha Macomb Dinsmore",
      years: "1795–1874",
      img: IMAGES.marthaMacomb,
      bio: "Martha was the matriarch of the Dinsmore household, managing the domestic sphere of the farm and raising the family's children. Her diaries and letters provide invaluable insight into 19th-century domestic life.",
    },
    {
      name: "Julia Stockton Dinsmore",
      years: "1833–1926",
      img: IMAGES.juliaStockton,
      bio: "Julia was the last Dinsmore to live in the homestead. A poet, diarist, and fierce preservationist, she lived in the house for over 90 years and ensured its contents were preserved exactly as they had always been.",
    },
    {
      name: "Isabella Selmes",
      years: "1875–1953",
      img: IMAGES.isabellaSelmes,
      bio: "Isabella Selmes, granddaughter of James Dinsmore, became one of the most remarkable women of her generation — a pioneering rancher in Montana and a close friend of Eleanor Roosevelt.",
    },
  ];

  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "300px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.heritageFinal})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(20%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.65)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Our History</span>
          <h1 style={{ color: "oklch(96% 0.018 80)" }}>The Dinsmore Family</h1>
          <p style={{ color: "oklch(87% 0.032 72)", fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
            Five generations of history along the Licking River
          </p>
        </div>
      </div>

      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto mb-10">
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(38% 0.055 54)", lineHeight: 1.8 }}>
              The Dinsmore Homestead tells the story of an extraordinary American family. From James Dinsmore's 
              establishment of the farm in 1842 to Julia Stockton Dinsmore's remarkable 93-year residence, 
              the family's story mirrors the broader arc of American history — encompassing the antebellum era, 
              the Civil War, Reconstruction, and the dawn of the 20th century.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {family.map((person) => (
              <div key={person.name} className="card-vintage overflow-hidden flex gap-4 p-4">
                <img
                  src={person.img}
                  alt={person.name}
                  className="img-vintage flex-shrink-0"
                  style={{ width: "120px", height: "150px", objectFit: "cover" }}
                />
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "0.2rem" }}>
                    {person.name}
                  </h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.85rem", color: "oklch(55% 0.11 72)", fontStyle: "italic", marginBottom: "0.75rem" }}>
                    {person.years}
                  </p>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(38% 0.055 54)", lineHeight: 1.6, margin: 0 }}>
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/history/timeline" className="btn-vintage">Explore the Interactive Timeline</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
