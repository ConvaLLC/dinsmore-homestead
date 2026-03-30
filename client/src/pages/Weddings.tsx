import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";

export default function WeddingsPage() {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "300px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.homestead})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(15%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.6)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(64.3% 0.161 143.4)" }}>Private Events</span>
          <h1 style={{ color: "oklch(96% 0.014 110)" }}>Weddings & Private Events</h1>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container max-w-3xl">
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(42.3% 0.087 144.3)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Imagine celebrating your special occasion surrounded by the timeless beauty of a 19th-century 
            Kentucky homestead. The Dinsmore Homestead offers a unique and unforgettable setting for 
            weddings, receptions, corporate events, and private gatherings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {["Intimate Ceremonies", "Garden Receptions", "Corporate Retreats"].map((type) => (
              <div key={type} className="card-vintage p-4 text-center">
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "oklch(20% 0.03 145)", margin: 0 }}>{type}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "oklch(44% 0.055 144)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Our historic grounds accommodate intimate gatherings and larger celebrations alike. 
            All events are subject to availability and must be coordinated with our events staff.
          </p>
          <Link href="/connect" className="btn-vintage-filled inline-block">Inquire About Private Events</Link>
        </div>
      </section>
    </div>
  );
}
