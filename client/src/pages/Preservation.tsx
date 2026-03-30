import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";

export default function PreservationPage() {
  return (
    <div>
      <div className="relative overflow-hidden" style={{ height: "280px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.heritageFinal})`, backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(20%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.65)" }} />
        <div className="container relative h-full flex flex-col justify-end pb-10">
          <span className="section-label" style={{ color: "oklch(64.3% 0.161 143.4)" }}>Our Mission</span>
          <h1 style={{ color: "oklch(96% 0.014 110)" }}>Preservation & Foundation</h1>
        </div>
      </div>
      <section className="py-12" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container max-w-3xl">
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", color: "oklch(42.3% 0.087 144.3)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            The Dinsmore Homestead Foundation is a 501(c)(3) non-profit organization dedicated to 
            preserving, protecting, and interpreting the Dinsmore Homestead for present and future generations.
          </p>
          <div className="pull-quote">
            "Preserving the Past, Educating the Future"
          </div>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", color: "oklch(44% 0.055 144)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Since its founding in 1988, the Foundation has worked tirelessly to stabilize and restore 
            the historic structures, catalog and preserve the extensive collection of artifacts and 
            documents, and develop educational programming that brings history to life for visitors of all ages.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: "Volunteer", desc: "Join our dedicated team of volunteers who help maintain the property and assist with events and programs." },
              { title: "Donate", desc: "Your financial support directly funds preservation work, educational programs, and operational costs." },
            ].map((item) => (
              <div key={item.title} className="card-vintage p-5">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.9rem", color: "oklch(44% 0.055 144)", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/donate" className="btn-vintage-filled">Make a Donation</Link>
            <Link href="/connect" className="btn-vintage">Volunteer Inquiry</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
