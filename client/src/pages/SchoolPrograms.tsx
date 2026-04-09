import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, ChevronRight, ArrowLeft } from "lucide-react";

const PROGRAMS = [
  {
    id: "childrens-lives",
    grade: "Grades 1–3",
    title: "Children's Lives 180 Years Ago",
    tagline: "Comparisons between yesterday and today",
    color: "#1a2f4e",
    description:
      "This program focuses on comparisons between yesterday and today with less emphasis on the Dinsmore family and more on what childhood was like in the 19th century. Young learners explore the house through artifacts, try hands-on chores, and play games from the past.",
    activities: [
      "Tour of the house focusing on artifacts and how they were used",
      "Hands-on chores that children would have done in the past",
      "Hands-on games, both indoor and outdoor, from the past",
      "Learn about children's clothing of the past",
      "Optional trip to the graveyard to learn about medicine and accidental deaths",
    ],
    standards: [
      {
        code: "2.19",
        text: "Students will recognize how technology helps people move, settle, and interact in the world",
      },
      {
        code: "2.20",
        text: "Students understand, analyze, and interpret historical events, trends, and issues to develop historical perspective",
      },
    ],
  },
  {
    id: "antebellum-farming",
    grade: "Grades 4–6",
    title: "Antebellum Kentucky Farming",
    tagline: "Agriculture, labor, culture, and gender",
    color: "#2d4a1e",
    description:
      "Students adopt the identity of a historical figure — a Dinsmore family member, an enslaved African American, or a tenant family member — and explore the farm through their character's eyes. This program covers Kentucky history with a focus on agriculture, labor, culture, and gender.",
    activities: [
      "Tour of the house, imagining their character's relationship to the Dinsmore family",
      "Self-guided discovery tour of outbuildings and graveyard",
      "Hands-on parlor and outdoor games played by different groups on the farm",
      "Exploration of how work and play differed across social groups",
    ],
    standards: [
      {
        code: "2.16",
        text: "Students observe, analyze, and interpret human behaviors, social groupings, and institutions to better understand people and relationships",
      },
      {
        code: "2.20",
        text: "Students understand, analyze, and interpret historical events, trends, and issues to develop historical perspective",
      },
    ],
  },
  {
    id: "rewards-of-research",
    grade: "Middle School & High School",
    title: "Rewards of Research Program",
    tagline: "Primary source research and analysis",
    color: "#4a2d1e",
    description:
      "Designed for older students, this program uses the Homestead's extraordinary archive of 90,000+ pages of original source material. Students engage directly with primary sources — letters, journals, financial accounts — to explore major themes in American and Kentucky history.",
    subprograms: [
      {
        title: "Primary Source Discovery",
        desc: "Introduction to primary sources, tour of house and graveyard, group biography presentations",
      },
      {
        title: "Slavery & Reconstruction at Boone",
        desc: "Explore the meanings of slavery through primary source documents from the Dinsmore Family collection and Boone County; tour house and outbuildings",
      },
      {
        title: "Gender Roles & Expectations on the Dinsmore Farm",
        desc: "Explore gender roles and expectations in the 19th century and compare to society today; tour house, outbuildings, and graveyard",
      },
      {
        title: "Death & Dying in the 19th & Early 20th Century",
        desc: "Analyze primary sources about illness and death; tour house and graveyard",
      },
    ],
    standards: [
      {
        code: "SS-HS-5.1.1",
        text: "Students analyze and interpret primary and secondary sources",
      },
      {
        code: "SS-MS-4.1.1",
        text: "Students use a variety of primary and secondary sources to interpret historical events",
      },
    ],
  },
];

export default function SchoolPrograms() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero */}
      <section
        className="relative min-h-[50vh] flex items-end pb-16"
        style={{ background: "linear-gradient(160deg, #1a2f4e 0%, #0d1f35 100%)" }}
      >
        <div className="container relative z-10">
          <Link href="/group-tours">
            <button
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Group Reservations
            </button>
          </Link>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
          >
            ✦ Education ✦
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            School <span style={{ color: "#c9a84c" }}>Programs</span>
          </h1>
          <p
            className="text-lg text-white/80 max-w-2xl"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Three curriculum-aligned programs bring history alive through hands-on activities,
            role-play, and primary source research — from artifact exploration for young learners
            to advanced document analysis for high schoolers.
          </p>
        </div>
      </section>

      {/* Archive callout */}
      <section className="py-8 bg-[#c9a84c]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-[#1a2f4e] flex-shrink-0" />
              <p
                className="text-[#1a2f4e] font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem" }}
              >
                90,000+ pages of original source material — we can adapt any program to meet your curriculum needs.
              </p>
            </div>
            <Link href="/group-tours#reserve">
              <Button
                className="flex-shrink-0"
                style={{ backgroundColor: "#1a2f4e", color: "white", fontFamily: "'Cinzel', serif" }}
              >
                Reserve Now <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container">
          <div className="space-y-16 max-w-4xl mx-auto">
            {PROGRAMS.map((prog, idx) => (
              <div key={prog.id} className="rounded-2xl overflow-hidden shadow-lg">
                {/* Header */}
                <div
                  className="p-8 text-white"
                  style={{ backgroundColor: prog.color }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
                    >
                      <GraduationCap className="w-6 h-6" style={{ color: "#c9a84c" }} />
                    </div>
                    <div>
                      <p
                        className="text-xs tracking-[0.2em] uppercase mb-1"
                        style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                      >
                        Program {idx + 1} · {prog.grade}
                      </p>
                      <h2
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {prog.title}
                      </h2>
                      <p className="text-white/70 italic" style={{ fontFamily: "'EB Garamond', serif" }}>
                        {prog.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white p-8">
                  <p
                    className="text-[#4a3728] leading-relaxed mb-8"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}
                  >
                    {prog.description}
                  </p>

                  {prog.activities && (
                    <div className="mb-8">
                      <h3
                        className="text-sm font-bold tracking-widest uppercase mb-4 text-[#1a2f4e]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Activities Include
                      </h3>
                      <div className="space-y-3">
                        {prog.activities.map((act) => (
                          <div key={act} className="flex items-start gap-3">
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                              style={{ backgroundColor: "#c9a84c" }}
                            />
                            <p
                              className="text-[#4a3728]"
                              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem" }}
                            >
                              {act}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {prog.subprograms && (
                    <div className="mb-8">
                      <h3
                        className="text-sm font-bold tracking-widest uppercase mb-4 text-[#1a2f4e]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Choose a Focus Area
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {prog.subprograms.map((sub) => (
                          <div
                            key={sub.title}
                            className="rounded-lg p-4 border border-[#c9a84c]/30 bg-[#f5f0e8]"
                          >
                            <h4
                              className="font-semibold text-[#1a2f4e] mb-2"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {sub.title}
                            </h4>
                            <p
                              className="text-[#4a3728] text-sm leading-relaxed"
                              style={{ fontFamily: "'EB Garamond', serif" }}
                            >
                              {sub.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3
                      className="text-sm font-bold tracking-widest uppercase mb-4 text-[#1a2f4e]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Kentucky Academic Standards
                    </h3>
                    <div className="space-y-2">
                      {prog.standards.map((std) => (
                        <div key={std.code} className="flex items-start gap-3">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded flex-shrink-0"
                            style={{
                              backgroundColor: "#1a2f4e",
                              color: "#c9a84c",
                              fontFamily: "'Cinzel', serif",
                            }}
                          >
                            {std.code}
                          </span>
                          <p
                            className="text-[#4a3728] text-sm leading-relaxed"
                            style={{ fontFamily: "'EB Garamond', serif" }}
                          >
                            {std.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p
              className="text-[#4a3728] mb-6 text-lg"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Ready to bring your class to the Homestead?
            </p>
            <Link href="/group-tours#reserve">
              <Button
                className="px-10 py-4 text-base font-bold tracking-widest"
                style={{
                  backgroundColor: "#1a2f4e",
                  color: "#c9a84c",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Reserve Your Field Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
