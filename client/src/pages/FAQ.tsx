import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, MapPin, Clock, Ticket, Users, GraduationCap, Star, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQItem[] = [
  // ── THE HOMESTEAD ──
  {
    id: "what-is-dinsmore",
    category: "The Homestead",
    question: "What exactly is the Dinsmore Homestead, and why is it so special?",
    answer: (
      <div className="space-y-3">
        <p>
          The Dinsmore Homestead is one of America's most remarkable living history museums — a 180-year-old Kentucky farm where time genuinely stopped. Built in 1842 in Boone County, Kentucky, the main house and all its original outbuildings have been preserved exactly as they were when the Dinsmore family last lived here in 1926. Every piece of furniture, every book on the shelf, every heirloom textile and antique bedstead is <em>original</em> — nothing is a reproduction.
        </p>
        <p>
          When Martha Breasted, the sixth and final generation of the Dinsmore family, donated the house and 30 acres to the Dinsmore Homestead Foundation, she made one request: <strong>"Leave everything as it was."</strong> She wanted visitors to feel as though she had <em>"just stepped out to visit neighbors."</em> That wish has been honored ever since.
        </p>
        <p>
          The result is something you simply cannot find anywhere else — a completely authentic window into American life spanning from the 1840s through the 1920s, all within a single, beautifully preserved farmstead on the banks of the Ohio River valley.
        </p>
      </div>
    ),
  },
  {
    id: "national-register",
    category: "The Homestead",
    question: "Is the Dinsmore Homestead historically recognized?",
    answer: (
      <p>
        Absolutely. The Dinsmore Homestead has been listed on the <strong>U.S. National Register of Historic Places</strong> since March 28, 1979 — a designation that recognizes its outstanding significance to American history, architecture, and culture. The property's boundary was expanded in November 2023, reflecting the growing recognition of the full site's historical importance. It is also a cornerstone of Boone County's cultural heritage and a celebrated landmark in Northern Kentucky.
      </p>
    ),
  },
  {
    id: "frozen-in-time",
    category: "The Homestead",
    question: "What does 'frozen in time' really mean when people describe this place?",
    answer: (
      <div className="space-y-3">
        <p>
          It means exactly what it sounds like — and it will take your breath away. The Dinsmore family were meticulous keepers of everything. The house contains <strong>nearly 90,000 pages of original family letters, journals, and business records</strong>. The furniture was purchased at Cincinnati's finest stores — Shillito's, McAlpin's, Gest & Bruns — and never replaced. The books on the shelves are the same books the family read. The china in the cabinet is the same china they dined from.
        </p>
        <p>
          When Julia Dinsmore died in 1926, the house was closed. Decades later, when the foundation opened it as a museum, it was as if no time had passed. One visitor described it perfectly on TripAdvisor: <em>"This farm house is very unique in that it's been in the family for over 150 years, they were hoarders and pretty much everything in the house is original."</em>
        </p>
        <p>
          Unlike most museums where you view reconstructed rooms behind velvet ropes, here you walk through living history. The history spans not one period but <strong>150 years</strong> — from antebellum Kentucky through two World Wars.
        </p>
      </div>
    ),
  },

  // ── THE DINSMORE FAMILY ──
  {
    id: "who-were-dinsmores",
    category: "The Dinsmore Family",
    question: "Who were the Dinsmores? Why should I care about this family?",
    answer: (
      <div className="space-y-3">
        <p>
          The Dinsmores were not just a Kentucky farm family — they were connected to the very fabric of American history. The story begins with <strong>Silas Dinsmoor</strong>, a U.S. Indian Agent who personally knew George Washington, Andrew Jackson, Henry Clay, and James Bowie. His son <strong>James Dinsmore</strong> moved the family from a Louisiana sugar plantation to Kentucky in 1839, purchasing approximately 700 acres in Boone County. James opposed slavery despite having enslaved people on his property, supported the Union in the Civil War, and ultimately emancipated his enslaved workers.
        </p>
        <p>
          But the most captivating figure is James's daughter, <strong>Julia Dinsmore (1833–1926)</strong> — one of Boone County's most remarkable women. After her father died in 1872, Julia ran the 700-acre farm entirely on her own for more than 40 years. She worked in the fields alongside hired hands, traveled the world, raised two nieces as her own, and wrote poetry that was published during her lifetime. Every single evening, she wrote in her journal — a running account of daily life in the late 19th century that historians treasure to this day.
        </p>
        <p>
          Julia lived to age 93. When she died in 1926, she left behind an extraordinary archive of a life fully and boldly lived.
        </p>
      </div>
    ),
  },
  {
    id: "presidential-connections",
    category: "The Dinsmore Family",
    question: "I heard there are presidential connections — is that true?",
    answer: (
      <div className="space-y-3">
        <p>
          True — and they are remarkable. The Dinsmore family's social circle reads like a who's who of American history. Through the family's extended network, the Homestead's primary sources document connections to:
        </p>
        <ul className="list-none space-y-1 pl-4 border-l-2 border-amber-700/30">
          <li><strong>George Washington</strong> — through Silas Dinsmoor's service as a U.S. Indian Agent</li>
          <li><strong>Andrew Jackson</strong> and <strong>Henry Clay</strong> — political contemporaries of the first generation</li>
          <li><strong>Theodore Roosevelt</strong> — a personal family friend through the Selmes-Ferguson connection</li>
          <li><strong>Eleanor and Franklin D. Roosevelt</strong> — Isabella Selmes, a Dinsmore descendant, was one of Eleanor Roosevelt's closest friends</li>
          <li><strong>Nellie Taft</strong> (wife of President Taft)</li>
        </ul>
        <p>
          Beyond presidents, the family's connections extend to <strong>John Jacob Astor IV</strong> (who perished on the Titanic), sculptor <strong>Gutzon Borglum</strong> (who carved Mount Rushmore), photographer <strong>Mathew Brady</strong>, and <strong>Benjamin F. Goodrich</strong> of B.F. Goodrich fame. Your tour guide will bring these connections to life with original letters and documents.
        </p>
      </div>
    ),
  },
  {
    id: "julia-dinsmore",
    category: "The Dinsmore Family",
    question: "Tell me more about Julia Dinsmore — she sounds fascinating.",
    answer: (
      <div className="space-y-3">
        <p>
          Julia Stockton Dinsmore (1833–1926) is the heart and soul of the Homestead. In an era when women had few rights and fewer opportunities, Julia defied every expectation. After her father's death in 1872, she took over management of the entire farm — overseeing crops, livestock, workers, and finances — and ran it successfully for over four decades. She worked alongside her hired hands in the fields, negotiated business deals, and managed a complex agricultural operation entirely on her own.
        </p>
        <p>
          But Julia was far more than a farmer. She was a world traveler at a time when women rarely traveled alone. She was a published poet. She raised her two nieces, Patty and Isabella, as her own daughters after they were orphaned. And every evening, no matter how exhausting the day, she sat down and wrote in her journal — recording the weather, the work, the visitors, her thoughts on politics and religion, and the texture of daily life in Boone County.
        </p>
        <p>
          Those journals are now part of the Homestead's archive of nearly 90,000 pages of primary source documents. When you tour the house, you are walking through Julia's world — her books, her furniture, her kitchen, her bedroom — preserved exactly as she left it.
        </p>
      </div>
    ),
  },
  {
    id: "slavery-history",
    category: "The Dinsmore Family",
    question: "Does the tour address the history of slavery on the farm?",
    answer: (
      <div className="space-y-3">
        <p>
          Yes — and this is one of the most important and thoughtfully presented aspects of the Dinsmore story. The Homestead does not shy away from this history. The original outbuildings — all still standing — were the workplaces of the enslaved African Americans, day laborers, and tenant farmers who made the farm economically viable. Your guide will take you through these structures and discuss the lives of the people who worked there.
        </p>
        <p>
          The Homestead's mission explicitly includes <strong>African American history</strong> and <strong>the history of slavery and Reconstruction</strong> as significant focal points. James Dinsmore's complex relationship with slavery — he opposed it philosophically, yet brought enslaved people from Louisiana — is explored honestly. He ultimately supported the Union in the Civil War and emancipated his enslaved workers.
        </p>
        <p>
          The Foundation has also preserved records related to the enslaved people who lived and worked on the property, and continues to research and honor their stories.
        </p>
      </div>
    ),
  },

  // ── YOUR VISIT ──
  {
    id: "why-visit",
    category: "Planning Your Visit",
    question: "Why is the Dinsmore Homestead a must-see for my family?",
    answer: (
      <div className="space-y-3">
        <p>
          Because there is simply nowhere else like it. Most history museums show you reconstructed rooms with replica furniture and explanatory placards. The Dinsmore Homestead shows you the <em>real thing</em> — original furniture, original art, original books, original china — in the original rooms where a real family lived, loved, worked, and died over six generations.
        </p>
        <p>
          For children, it is a hands-on encounter with history that no classroom can replicate. They will see how people lived before electricity, before indoor plumbing, before automobiles. They will stand in the same rooms where decisions were made about slavery, about the Civil War, about women's independence. History becomes tangible, personal, and unforgettable.
        </p>
        <p>
          For adults, it is a rare opportunity to slow down and connect with something genuinely old and genuinely real. Visitors consistently describe the experience as calming, moving, and perspective-giving. As one longtime visitor put it: <em>"I've been coming since I was a little girl and it never fails to calm me in this hectic life we all lead."</em>
        </p>
        <p>
          And for history enthusiasts — the presidential connections, the primary source documents, the stories of women's independence and the complexities of slavery — the Homestead offers layers of discovery that reward every visit.
        </p>
      </div>
    ),
  },
  {
    id: "hours-admission",
    category: "Planning Your Visit",
    question: "When is the Homestead open, and what does it cost?",
    answer: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2 font-serif">Tour Hours</h4>
            <p className="text-sm text-amber-800">Tours begin on the hour, last tour at 4:00 PM</p>
            <ul className="text-sm text-amber-800 mt-2 space-y-1">
              <li><strong>Friday:</strong> 1:00 PM – 5:00 PM</li>
              <li><strong>Saturday:</strong> 1:00 PM – 5:00 PM</li>
              <li><strong>Sunday:</strong> 1:00 PM – 5:00 PM</li>
            </ul>
            <p className="text-xs text-amber-700 mt-2 italic">Closed Easter Sunday. Closed December 15 – April 1.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2 font-serif">Admission</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li><strong>Adults:</strong> $10.00</li>
              <li><strong>Children (5–15):</strong> $3.00</li>
              <li><strong>Under 5:</strong> FREE</li>
              <li><strong>Dinsmore Members:</strong> FREE</li>
            </ul>
            <p className="text-xs text-amber-700 mt-2 italic">Cash or credit accepted.</p>
          </div>
        </div>
        <p className="text-sm text-stone-600">
          Reservations are recommended, especially on weekends. <strong>Book your tour online</strong> to guarantee your spot and skip the wait.
        </p>
      </div>
    ),
  },
  {
    id: "what-will-i-see",
    category: "Planning Your Visit",
    question: "What will I actually see on a tour?",
    answer: (
      <div className="space-y-3">
        <p>Your guided tour takes you through four distinct areas of the Homestead, each telling a different chapter of the story:</p>
        <div className="space-y-3">
          <div className="border-l-4 border-amber-600 pl-4">
            <h4 className="font-semibold text-stone-800 font-serif">The Main House — Downstairs</h4>
            <p className="text-sm text-stone-600 mt-1">Explore the parlor, dining room, and library filled with original artifacts and art. Hear about the family's relationship with Theodore and Eleanor Roosevelt. Browse the titles of their remarkable book collection — a window into their religious and political beliefs.</p>
          </div>
          <div className="border-l-4 border-amber-600 pl-4">
            <h4 className="font-semibold text-stone-800 font-serif">The Main House — Upstairs</h4>
            <p className="text-sm text-stone-600 mt-1">Antique bedsteads, children's toys, heirloom textiles, and servants' quarters. See how the arrival of modern technology — electricity, indoor plumbing — gradually changed daily life, and compare the Dinsmore family's world with your own.</p>
          </div>
          <div className="border-l-4 border-amber-600 pl-4">
            <h4 className="font-semibold text-stone-800 font-serif">The Original Outbuildings</h4>
            <p className="text-sm text-stone-600 mt-1">All original structures — smokehouse, springhouse, and more — where the real work of the farm happened. These buildings tell the story of the enslaved African Americans, day laborers, and tenant farmers whose labor sustained the homestead. Nineteenth-century farming and cooking implements throughout.</p>
          </div>
          <div className="border-l-4 border-amber-600 pl-4">
            <h4 className="font-semibold text-stone-800 font-serif">The Family Graveyard</h4>
            <p className="text-sm text-stone-600 mt-1">Up the hill behind the house, enclosed by a rock wall built in 1867. A peaceful, picturesque space where six generations of Dinsmores rest. The last burial was in 1994 — Martha Breasted, who gave the Homestead to the world.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "how-long",
    category: "Planning Your Visit",
    question: "How long does a tour take? What should I wear?",
    answer: (
      <div className="space-y-3">
        <p>
          A standard guided house tour lasts approximately <strong>one hour</strong>, though many visitors spend additional time exploring the grounds, outbuildings, and graveyard at their own pace. Plan for <strong>1.5 to 2 hours</strong> for a full experience.
        </p>
        <p>
          <strong>What to wear:</strong> Comfortable, closed-toe shoes are strongly recommended — you will be walking on historic floors, uneven ground, and gravel paths. The grounds are beautiful for photography, so feel free to bring a camera. Photography is welcome throughout the property.
        </p>
        <p>
          <strong>Arrive 10 minutes early</strong> to check in, browse the gift shop, and get oriented before your tour begins.
        </p>
      </div>
    ),
  },
  {
    id: "photography",
    category: "Planning Your Visit",
    question: "Can I take photos during the tour?",
    answer: (
      <p>
        Yes! Photography is warmly welcomed throughout the Dinsmore Homestead — inside the house, in the outbuildings, and across the grounds. The property is extraordinarily photogenic, from the Greek Revival main house to the original stone outbuildings and the hilltop graveyard with its 1867 rock wall. Many visitors say the Homestead is one of the most beautiful photography locations in Northern Kentucky. Share your photos and tag us — we love seeing the Homestead through visitors' eyes.
      </p>
    ),
  },

  // ── GROUPS & EDUCATION ──
  {
    id: "school-groups",
    category: "Groups & Education",
    question: "Is the Dinsmore Homestead good for school field trips?",
    answer: (
      <div className="space-y-3">
        <p>
          The Dinsmore Homestead is one of the finest field trip destinations in Kentucky — and the new Heritage Center (opening mid-2026) will make it even better. The Foundation's school programs are specifically designed to <strong>complement Kentucky Academic Standards</strong>, making every visit directly relevant to classroom learning.
        </p>
        <p>
          Students can explore topics including women's history, African American history, the history of slavery and Reconstruction, Native American history, agricultural history, and the social and economic transitions of 19th-century America — all through direct engagement with original artifacts and primary source documents.
        </p>
        <p>
          The Heritage Center's goal is to accommodate <strong>over 5,000 students per year</strong>, with expanded facilities for interactive learning, group presentations, and hands-on activities. Group reservations are available for school groups of all sizes. Contact us to discuss a custom program for your class.
        </p>
      </div>
    ),
  },
  {
    id: "group-tours",
    category: "Groups & Education",
    question: "Can you accommodate large groups, corporate outings, or private events?",
    answer: (
      <div className="space-y-3">
        <p>
          Absolutely. Group tours are available for <strong>10 or more people</strong>, and the Homestead's knowledgeable guides are skilled at tailoring the experience to your group's interests — whether you're a history society, a corporate team, a family reunion, or a community organization.
        </p>
        <p>
          And with the <strong>new Heritage Center opening mid-2026</strong>, the possibilities expand dramatically. The 6,000-square-foot multipurpose facility includes a large pavilion ideal for weddings, receptions, corporate events, reunions, and community gatherings. Imagine celebrating your wedding surrounded by 180 years of Kentucky history — with the original 1842 farmhouse as your backdrop.
        </p>
        <p>
          The Heritage Center will <strong>double the Homestead's daily visitor capacity</strong>, making it easier than ever to bring large groups for tours, educational programs, and special events. Contact us to discuss your group's needs.
        </p>
      </div>
    ),
  },
  {
    id: "scout-programs",
    category: "Groups & Education",
    question: "Are there programs for scouts and youth organizations?",
    answer: (
      <p>
        Yes! The Dinsmore Homestead offers dedicated <strong>Scout Programs</strong> designed to engage young people with hands-on history. Scouts can explore topics ranging from 19th-century farming and domestic life to women's history and the complexities of the Civil War era. The programs are designed to be educational, engaging, and age-appropriate. Summer programs are also available for youth groups. Contact the Homestead to learn more about scheduling a scout or youth group visit.
      </p>
    ),
  },

  // ── HERITAGE CENTER ──
  {
    id: "heritage-center",
    category: "The New Heritage Center",
    question: "What is the Heritage Center, and when does it open?",
    answer: (
      <div className="space-y-3">
        <p>
          The Heritage Center is the most exciting development in the Dinsmore Homestead's history since the Foundation opened the museum in 1987. Made possible by a <strong>$1.5 million capital campaign</strong> — "Preserving the Past. Educating the Future." — the Heritage Center is a brand-new <strong>6,000-square-foot multipurpose facility</strong> currently under construction on the Homestead grounds.
        </p>
        <p>
          The Heritage Center is expected to open in <strong>mid-2026</strong> and will transform what the Homestead can offer:
        </p>
        <ul className="list-none space-y-2 pl-4 border-l-2 border-amber-700/30">
          <li><strong>A large pavilion</strong> for weddings, receptions, corporate events, and community gatherings</li>
          <li><strong>Expanded educational facilities</strong> to accommodate 5,000+ students per year</li>
          <li><strong>Doubled daily visitor capacity</strong> for tours and programs</li>
          <li><strong>Research facilities</strong> for historians and genealogists accessing the 90,000-page archive</li>
          <li><strong>Enhanced event programming</strong> including seasonal events, lectures, and special exhibitions</li>
        </ul>
        <p>
          If you'd like to be part of this historic moment, consider making a donation to the capital campaign. Every contribution helps preserve this national treasure for future generations.
        </p>
      </div>
    ),
  },
  {
    id: "weddings",
    category: "The New Heritage Center",
    question: "Can I host my wedding or event at the Dinsmore Homestead?",
    answer: (
      <div className="space-y-3">
        <p>
          Yes — and it will be unlike any venue you've ever seen. The Dinsmore Homestead is already available for weddings and private events, and the new Heritage Center's large pavilion (opening mid-2026) will dramatically expand what's possible.
        </p>
        <p>
          Imagine exchanging vows on the grounds of an 1842 Kentucky farmstead, with the original Greek Revival house as your backdrop, surrounded by 30 acres of historic landscape. The Homestead's setting — peaceful, beautiful, and steeped in authentic history — creates an atmosphere that no modern venue can replicate.
        </p>
        <p>
          The Heritage Center pavilion will be able to accommodate large wedding receptions, corporate retreats, anniversary celebrations, and community events. Contact us to learn more about availability, capacity, and pricing for your special occasion.
        </p>
      </div>
    ),
  },

  // ── MEMBERSHIP & SUPPORT ──
  {
    id: "membership-benefits",
    category: "Membership & Support",
    question: "What are the benefits of becoming a Dinsmore member?",
    answer: (
      <div className="space-y-3">
        <p>
          Dinsmore members are part of the Extended Family & Friends Circle — and the benefits are genuinely worthwhile, especially if you plan to visit more than once or bring guests:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { tier: "Senior", price: "$20/year", perks: "Free admission, 10% gift shop discount, newsletter, 2 guest passes" },
            { tier: "Individual", price: "$35/year", perks: "Free admission, 10% gift shop discount, newsletter, 2 guest passes" },
            { tier: "Family", price: "$60/year", perks: "Free admission for up to 5, 10% gift shop discount, newsletter, 2 guest passes" },
            { tier: "Friends", price: "$100/year", perks: "Free admission, 15% gift shop discount, newsletter, 4 guest passes, donor recognition" },
          ].map((m) => (
            <div key={m.tier} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-amber-900 font-serif">{m.tier}</span>
                <span className="text-amber-700 font-bold">{m.price}</span>
              </div>
              <p className="text-xs text-stone-600">{m.perks}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-stone-600">
          All memberships include a subscription to the <em>Dinsmore Dispatch</em> newsletter (print or digital) and are tax-deductible as contributions to a 501(c)(3) organization. Membership perks are available at your next visit.
        </p>
      </div>
    ),
  },
  {
    id: "how-to-support",
    category: "Membership & Support",
    question: "How can I support the Dinsmore Homestead beyond buying a ticket?",
    answer: (
      <div className="space-y-3">
        <p>
          The Dinsmore Homestead Foundation is a 501(c)(3) nonprofit organization that depends on community support to preserve this national treasure. There are several meaningful ways to contribute:
        </p>
        <ul className="list-none space-y-2 pl-4 border-l-2 border-amber-700/30">
          <li><strong>Become a member</strong> — Your annual membership fee directly supports preservation and education programs.</li>
          <li><strong>Make a donation</strong> — Any amount helps. Contributions to the capital campaign fund the new Heritage Center.</li>
          <li><strong>Volunteer</strong> — The Homestead welcomes volunteers for tours, events, research, and maintenance.</li>
          <li><strong>Spread the word</strong> — Tell your friends, share on social media, bring your family. Every visitor helps sustain the mission.</li>
          <li><strong>Book a private event</strong> — Hosting your wedding, reunion, or corporate event at the Homestead directly supports its operations.</li>
        </ul>
        <p className="text-sm text-stone-600">
          The Dinsmore Homestead Foundation has been preserving this site since 1987. Your support ensures it will be here for the next 180 years.
        </p>
      </div>
    ),
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("what-is-dinsmore");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredFaqs =
    activeCategory === "All" ? faqs : faqs.filter((f) => f.category === activeCategory);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-[#faf6ef]">
      {/* ── HERO ── */}
      <section className="relative bg-[#1a2e1a] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80')" }}
        />
        <div className="relative container py-20 md:py-28 text-center">
          <p className="text-amber-400 tracking-[0.25em] uppercase text-sm font-medium mb-4">
            Est. 1842 · Burlington, Kentucky
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Everything You've Ever Wanted<br />
            <span className="text-amber-300">to Know About Dinsmore</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            A 180-year-old Kentucky farm. Six generations of one family. Presidential connections.
            A woman who ran it all alone for 40 years. And every single artifact — original.
            Your questions, answered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-a-tour">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 text-lg"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Book Your Tour — From $3
              </Button>
            </Link>
            <Link href="/membership">
              <Button
                size="lg"
                variant="outline"
                className="border-amber-400 text-amber-300 hover:bg-amber-900/30 px-8 py-4 text-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ── */}
      <section className="bg-amber-800 text-white py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Clock className="w-6 h-6 mx-auto mb-1 text-amber-300" />, value: "180+", label: "Years of History" },
              { icon: <Users className="w-6 h-6 mx-auto mb-1 text-amber-300" />, value: "6", label: "Generations" },
              { icon: <Star className="w-6 h-6 mx-auto mb-1 text-amber-300" />, value: "90,000+", label: "Pages of Archives" },
              { icon: <GraduationCap className="w-6 h-6 mx-auto mb-1 text-amber-300" />, value: "5,000+", label: "Students/Year (2026)" },
            ].map((s) => (
              <div key={s.label}>
                {s.icon}
                <div className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div className="text-amber-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN FAQ ── */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? "bg-amber-800 text-white border-amber-800"
                    : "bg-white text-stone-700 border-stone-300 hover:border-amber-600 hover:text-amber-800"
                }`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span
                      className="text-lg font-semibold text-stone-800 leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <div className="flex-shrink-0 mt-1 text-amber-700">
                    {openId === faq.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-6 text-stone-700 leading-relaxed border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MID-PAGE CTA ── */}
      <section className="bg-[#1a2e1a] text-white py-16">
        <div className="container text-center max-w-3xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-amber-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Step Back in Time?
          </h2>
          <p className="text-stone-300 text-lg mb-8 leading-relaxed">
            No reproduction. No velvet ropes. No actors in period costume. Just 180 years of real history,
            real artifacts, and real stories — waiting for you every Friday, Saturday, and Sunday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-a-tour">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8">
                <Ticket className="w-5 h-5 mr-2" />
                Book a Tour Now
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-900/30 px-8">
                <ArrowRight className="w-5 h-5 mr-2" />
                See Upcoming Events
              </Button>
            </Link>
          </div>
          <p className="text-stone-400 text-sm mt-6">
            <MapPin className="w-4 h-4 inline mr-1" />
            5656 Burlington Pike, Burlington, KY 41005 · (859) 586-6117
          </p>
        </div>
      </section>

      {/* ── HERITAGE CENTER TEASER ── */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-900 to-amber-800 text-white rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <div className="inline-block bg-amber-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Opening Mid-2026
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The New Heritage Center
            </h2>
            <p className="text-amber-100 text-lg mb-6 leading-relaxed max-w-2xl mx-auto">
              A 6,000-square-foot multipurpose facility with a grand pavilion for weddings and events,
              expanded educational programs for 5,000+ students per year, and research facilities
              for historians. The next chapter of the Dinsmore story begins now.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
              {[
                { value: "$1.5M", label: "Capital Campaign" },
                { value: "6,000 sq ft", label: "New Facility" },
                { value: "2×", label: "Visitor Capacity" },
              ].map((s) => (
                <div key={s.label} className="bg-amber-700/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-amber-200" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                  <div className="text-amber-300 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
            <Link href="/donate">
              <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50 font-semibold px-8">
                <Heart className="w-5 h-5 mr-2" />
                Support the Capital Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-stone-100 py-16">
        <div className="container max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold text-center text-stone-800 mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Visitors Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Jonni L.", quote: "I've been coming since I was a little girl and it never fails to calm me in this hectic life we all lead." },
              { name: "Gary C.", quote: "A hidden gem. Great find — educational and fascinating." },
              { name: "Jill D.", quote: "Just such a great place to spend the day. Something to see, something to learn, lots of beauty to walk, paint and take photos of!!" },
              { name: "Terri T.", quote: "The people who work/volunteer there are awesome...when they're telling the stories of this family, you can tell that they really love this place." },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-stone-700 italic mb-4 leading-relaxed">"{r.quote}"</p>
                <p className="text-stone-500 text-sm font-medium">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Still Have Questions?
          </h2>
          <p className="text-stone-600 mb-8 text-lg">
            Our team is happy to help. Call us at <strong>(859) 586-6117</strong> or visit us any
            Friday, Saturday, or Sunday from 1:00 PM to 5:00 PM. We'd love to see you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-a-tour">
              <Button size="lg" className="bg-amber-800 hover:bg-amber-900 text-white font-semibold px-8">
                <Ticket className="w-5 h-5 mr-2" />
                Book Your Tour Today
              </Button>
            </Link>
            <Link href="/membership">
              <Button size="lg" variant="outline" className="border-amber-700 text-amber-800 hover:bg-amber-50 px-8">
                <Heart className="w-5 h-5 mr-2" />
                Join the Family
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
