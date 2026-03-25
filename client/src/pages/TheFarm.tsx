import { IMAGES } from "../../../shared/images";

const BUILDINGS = [
  { name: "The Main House (1842)", img: IMAGES.homestead, desc: "The centerpiece of the property, the Federal-style farmhouse contains original furnishings, family portraits, and personal artifacts spanning five generations." },
  { name: "The Log Cabin", img: IMAGES.outbuildings8, desc: "One of the oldest structures on the property, this hand-hewn log cabin predates the main house and served as the original dwelling." },
  { name: "The Smokehouse", img: IMAGES.outbuildings14, desc: "The original smokehouse where meats were preserved using traditional 19th-century methods. The structure retains its original construction." },
  { name: "The Stone Springhouse", img: IMAGES.farmPhoto1, desc: "Built over a natural spring, this stone structure served as the farm's refrigeration system, keeping dairy products and other perishables cool." },
  { name: "The Farm Grounds", img: IMAGES.farmHDR, desc: "The sweeping grounds along the Licking River include the historic family cemetery, working farm areas, and scenic walking paths." },
];

export default function TheFarmPage() {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "300px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.farmHDR})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(15%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.6)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(68% 0.12 75)" }}>Explore</span>
          <h1 style={{ color: "oklch(96% 0.018 80)" }}>The Farm & Historic Grounds</h1>
          <p style={{ color: "oklch(87% 0.032 72)", fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
            Original structures spanning nearly two centuries of Kentucky farm life
          </p>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.018 80)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto mb-10">
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(38% 0.055 54)", lineHeight: 1.8 }}>
              Unlike many historic sites, the Dinsmore Homestead was never abandoned or significantly altered. 
              The farm's collection of original outbuildings offers a rare and authentic glimpse into 
              19th-century agricultural life in northern Kentucky.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUILDINGS.map((building) => (
              <div key={building.name} className="card-vintage overflow-hidden">
                <img src={building.img} alt={building.name} className="w-full object-cover" style={{ height: "200px", filter: "sepia(10%) contrast(1.05)" }} />
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{building.name}</h3>
                  <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.95rem", color: "oklch(46% 0.06 56)", margin: 0, lineHeight: 1.6 }}>{building.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
