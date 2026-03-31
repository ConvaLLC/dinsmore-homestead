import { useState } from "react";
import { Link } from "wouter";
import { IMAGES } from "../../../shared/images";

const SECTIONS = [
  {
    slug: "what-to-see",
    title: "What To See",
    icon: "🏛️",
    img: IMAGES.homestead,
    summary: `Martha wanted you to feel as though "she had just stepped out to visit neighbors." Martha Breasted gave the house and 30 acres to the Dinsmore Homestead Foundation as a museum.`,
    content: `Martha wanted you to feel as though "she had just stepped out to visit neighbors." Martha Breasted gave the house and 30 acres to the Dinsmore Homestead Foundation as a museum. She requested that everything in the house remain as it was when the family lived here.

Come hear about the Dinsmore family's relationship with Theodore and Eleanor Roosevelt; discover their religious and political beliefs as you browse the titles of their unique book collection, and surround yourself with original artifacts and art.

From antique bedsteads and toys to heirloom textiles, there is plenty to see. Observe how modern technology altered the lifestyle of the family and their servants. Compare the pleasures and hardships of the Dinsmore family's daily life with contemporary times.`,
  },
  {
    slug: "downstairs",
    title: "Main House: Downstairs",
    icon: "🪑",
    img: IMAGES.farmPhoto1,
    summary: "The downstairs of the Dinsmore house contains the parlor, dining room, and kitchen — the social and working heart of the 19th-century household.",
    content: `The downstairs of the Dinsmore house contains the parlor, dining room, and kitchen — the social and working heart of the 19th-century household. Original furnishings, china, silverware, and everyday objects remain exactly as the family left them.

The parlor features the family's piano, original portraits, and a remarkable collection of books that reflects the family's wide-ranging intellectual interests. The dining room retains its original table and chairs, set as if for a family meal. The kitchen offers a glimpse into the labor of domestic life in the 1800s.`,
  },
  {
    slug: "upstairs",
    title: "Main House: Upstairs",
    icon: "🛏️",
    img: IMAGES.heritageFinal,
    summary: "The upstairs bedrooms preserve the intimate domestic life of the Dinsmore family, with original furnishings, clothing, and personal effects.",
    content: `The upstairs bedrooms preserve the intimate domestic life of the Dinsmore family, with original furnishings, clothing, and personal effects. Julia Stockton Dinsmore's bedroom remains as she left it, with her writing desk, books, and personal correspondence.

The guest rooms reflect the family's active social life and their connections to prominent figures of the 19th and early 20th centuries, including Theodore Roosevelt and his extended circle.`,
  },
  {
    slug: "outbuildings",
    title: "Outbuildings",
    icon: "🏚️",
    img: IMAGES.outbuildings8,
    summary: "The outbuildings on the Dinsmore farm are all original and give visitors a glimpse into the labor routines of those who ensured that this farm was an economic success.",
    content: `The outbuildings on the Dinsmore farm are all original and give visitors a glimpse into the labor routines of those who ensured that this farm was an economic success — namely, the enslaved African Americans, the day laborers, and the tenants.

You will see nineteenth-century farming and cooking implements and gain an appreciation for the technological advances of today. The machinery and structures supported different industry on the farm that ranged from growing crops and harvesting orchards, to growing willows for basket weaving, to planting and cultivating grapes for wine making, and raising livestock like sheep, goats, and pigs for wool and meat. These artifacts all tell the story of the social, economic, and cultural transitions of American history.`,
  },
  {
    slug: "graveyard",
    title: "The Graveyard",
    icon: "⛪",
    img: IMAGES.farmHDR,
    summary: "In the summer of 1867, James Dinsmore hired local men to begin work on the graveyard wall. For twenty years, the Dinsmores had been burying their family members and African American slaves and freedpeople on the hill beside the house.",
    content: `In the summer of 1867, James Dinsmore hired local men to begin work on the graveyard wall. For twenty years, the Dinsmore's had been burying their family members and African American slaves and freedpeople on the hill beside the house. Now James wanted to have a wall to enclose the graves. His daughter, Isabella Flandrau, had died that June, and perhaps, at seventy-six years old, his aching bones reminded him of his own mortality.

Over the years, as the gravestones and the wall aged, the place became a picturesque retreat for James' surviving daughter, Julia. She planted flowers near the graves and enjoyed watching the sun set from atop the hill. When Julia managed the farm, the hillside was a well-manicured vineyard and you could see the Ohio River and into Indiana from the hilltop.

The graveyard contains the graves of multiple generations of the Dinsmore family, as well as the graves of enslaved people and freedpeople who lived and worked on the farm. It is a powerful reminder of the full history of this place.`,
  },
  {
    slug: "industry",
    title: "Industry on the Farm",
    icon: "🌾",
    img: IMAGES.outbuildings14,
    summary: "James Dinsmore considered himself to be a scientific farmer, meaning that he read the latest information on crops, fertilizer, and machinery to ensure that the best methods and research were applied to the work done on his farm.",
    content: `James Dinsmore considered himself to be a scientific farmer, meaning that he read the latest information on crops, fertilizer, and machinery to ensure that the best methods and research were applied to the work done on his farm. His daughter Julia continued to read up on the latest farming methods. Both James and Julia Dinsmore relied on a workforce of day laborers, sharecroppers, and enslaved people (until 1865).

Behind the horse barn (short walk from the back of the house) pasture is a hill called Cherry Hill. It was here James Dinsmore had workers plant a large orchard filled with a variety of apple, pear, cherry, plum, and peach trees. By 1880, there were over 1,000 apple trees and 100 peach trees.

The farm also produced tobacco, wheat, corn, and other crops. James Dinsmore grew willows for basket weaving and cultivated grapes for wine making. The farm was a complex economic enterprise that required the labor of many people — enslaved and free — to sustain.`,
  },
];

export default function TheFarmPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSection = selected ? SECTIONS.find(s => s.slug === selected) : null;

  return (
    <div className="min-h-screen" style={{ background: "oklch(97.8% 0.008 89.6)" }}>
      {/* Hero */}
      <div className="relative py-20 text-center" style={{ backgroundImage: `linear-gradient(rgba(44,26,12,0.72), rgba(44,26,12,0.72)), url(${IMAGES.farmHDR})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="container">
          <p className="section-label" style={{ color: "oklch(74.2% 0.118 90.2)" }}>Explore the Grounds</p>
          <h1 style={{ color: "oklch(97% 0.01 80)", fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3.5rem)", margin: "0.5rem 0 1rem" }}>The Farm &amp; Historic Grounds</h1>
          <p style={{ color: "oklch(87.6% 0.068 89.7)", fontFamily: "'EB Garamond', serif", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            The Dinsmore Homestead preserves 30 acres of historic farmland, the original 1842 house, and all original outbuildings — exactly as the family left them.
          </p>
          <nav style={{ fontSize: "0.85rem", color: "oklch(75% 0.03 72)" }}>
            <Link href="/" style={{ color: "oklch(74.2% 0.118 90.2)" }}>Home</Link><span className="mx-2">›</span><span>The Farm</span>
          </nav>
        </div>
      </div>

      {/* Section Modal */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(44,26,12,0.88)" }} onClick={() => setSelected(null)}>
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-sm shadow-2xl" style={{ background: "oklch(97.8% 0.008 89.6)", border: "2px solid oklch(74.2% 0.118 90.2)" }} onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: "2rem" }}>{selectedSection.icon}</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "oklch(21.8% 0.036 251.3)" }}>{selectedSection.title}</h2>
              </div>
              {selectedSection.img && (
                <img src={selectedSection.img} alt={selectedSection.title} className="w-full mb-6 object-cover" style={{ height: 200, filter: "sepia(15%)", border: "2px solid oklch(55% 0.11 72 / 0.4)" }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem", lineHeight: 1.8, color: "oklch(30% 0.04 50)" }}>
                {selectedSection.content.split('\n\n').filter(p => p.trim()).map((para, i) => <p key={i} style={{ marginBottom: "1rem" }}>{para}</p>)}
              </div>
              <button onClick={() => setSelected(null)} className="btn-vintage mt-4">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-16">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "oklch(21.8% 0.036 251.3)", marginBottom: "0.5rem" }}>Explore the Homestead</h2>
          <div className="ornamental-divider" />
          <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(47.2% 0.088 247.4)", maxWidth: "600px", margin: "1rem auto 0", lineHeight: 1.7 }}>
            The Dinsmore Homestead has been preserved exactly as the family left it. Every room, every outbuilding, every artifact tells a story. Click any section below to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SECTIONS.map(section => (
            <button key={section.slug} onClick={() => setSelected(section.slug)} className="group text-left overflow-hidden bg-white hover:bg-[oklch(55%_0.11_72_/_0.05)] transition-colors" style={{ border: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
              <div style={{ height: 160, overflow: "hidden" }}>
                <img src={section.img} alt={section.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: "sepia(15%)" }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div className="p-5">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: "oklch(21.8% 0.036 251.3)", marginBottom: "0.4rem" }} className="group-hover:text-[oklch(55%_0.11_72)] transition-colors">{section.title}</h3>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "0.88rem", color: "oklch(47.2% 0.088 247.4)", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{section.summary}</p>
                <span style={{ display: "inline-block", marginTop: "0.6rem", fontSize: "0.75rem", color: "oklch(74.2% 0.118 90.2)", textDecoration: "underline" }}>Learn more →</span>
              </div>
            </button>
          ))}
        </div>

        {/* Living Museum callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "oklch(21.8% 0.036 251.3)", marginBottom: "1rem" }}>A Living Museum</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", lineHeight: 1.8, color: "oklch(30% 0.04 50)", marginBottom: "1rem" }}>
              Unlike many historic sites, the Dinsmore Homestead was never renovated or modernized. When Martha Breasted donated the house to the Foundation, she stipulated that everything remain exactly as it was — and it has. The result is one of the most authentically preserved 19th-century farmhouses in America.
            </p>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem", lineHeight: 1.8, color: "oklch(30% 0.04 50)" }}>
              Visitors often remark that walking through the Dinsmore house feels like stepping back in time. The original wallpaper, furniture, books, clothing, and personal effects of five generations of the Dinsmore family remain in place, creating an unparalleled window into 19th-century American life.
            </p>
          </div>
          <div>
            <img src={IMAGES.homestead} alt="Dinsmore Homestead" className="w-full" style={{ filter: "sepia(15%)", border: "3px solid oklch(55% 0.11 72 / 0.5)" }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        </div>

        <div className="text-center pt-8" style={{ borderTop: "1px solid oklch(55% 0.11 72 / 0.3)" }}>
          <Link href="/visit" className="btn-vintage mr-4">Plan Your Visit</Link>
          <Link href="/events" className="btn-vintage-outline">Upcoming Events</Link>
        </div>
      </div>
    </div>
  );
}
