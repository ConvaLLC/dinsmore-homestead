import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Users,
  BookOpen,
  TreePine,
  Star,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

const PROGRAMS = [
  {
    id: "school-programs",
    icon: GraduationCap,
    title: "School Programs",
    subtitle: "Grades 1–12",
    description:
      "Three curriculum-aligned programs bring history alive through hands-on activities, role-play, and primary source research. From artifact exploration for young learners to advanced primary source analysis for high schoolers.",
    href: "/school-programs",
    color: "bg-[#1a2f4e]",
    accent: "#c9a84c",
  },
  {
    id: "summer-programs",
    icon: TreePine,
    title: "Summer Programs",
    subtitle: "Pioneer-to-the-Past Daycamp",
    description:
      "An adventurous summer camp exploring great events from American History — no technology needed! Lewis & Clark, 4th of July fairs, and hands-on pioneer life. Two sessions available each summer.",
    href: "/summer-programs",
    color: "bg-[#2d4a1e]",
    accent: "#c9a84c",
  },
  {
    id: "scout-programs",
    icon: Star,
    title: "Scout Programs",
    subtitle: "Boy Scouts & Girl Scouts",
    description:
      "Earn merit badges and complete Eagle Scout projects at one of Kentucky's most authentic historic sites. Indoor and outdoor activities for all ages and ranks.",
    href: "/scout-programs",
    color: "bg-[#4a2d1e]",
    accent: "#c9a84c",
  },
  {
    id: "group-tours",
    icon: Users,
    title: "Private Group Tours",
    subtitle: "Custom Experiences",
    description:
      "We can tailor any existing program to fit your curriculum, or bring our educators directly to your classroom. Tours last roughly 90 minutes in the home and immediate grounds.",
    href: "#reserve",
    color: "bg-[#2d1e4a]",
    accent: "#c9a84c",
  },
];

const TOPICS = [
  "Interactions with Native Americans",
  "Economic and social aspects of enslavement",
  "Life on a 19th-century sugar plantation",
  "The California Gold Rush",
  "Farming in antebellum Kentucky",
  "Nineteenth-century female education",
  "Scientific and technological changes",
  "Kentucky during the Civil War",
  "Northern Kentucky during Reconstruction",
  "Ranching in the Far West",
  "Death and mourning in the 19th century",
  "Women and politics",
];

const PROGRAM_OPTIONS = [
  "Children's Lives 180 Years Ago (Grades 1–3)",
  "Antebellum Kentucky Farming (Grades 4–6)",
  "Rewards of Research Program (Middle/High School)",
  "Pioneer-to-the-Past Summer Daycamp",
  "Boy Scout Program",
  "Girl Scout Program",
  "Eagle Scout Project",
  "Private Group Tour",
  "Custom / Not Sure Yet",
];

export default function GroupTours() {
  const [form, setForm] = useState({
    orgName: "",
    desiredDate: "",
    guestCount: "",
    contactName: "",
    contactEmail: "",
    groupLeader: "",
    phone: "",
    programInterest: "",
    accommodations: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitInquiry = trpc.groups.submitInquiry.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-end pb-16"
        style={{
          background:
            "linear-gradient(160deg, #1a2f4e 0%, #0d1f35 60%, #0a1628 100%)",
        }}
      >
        {/* Decorative grain */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              ✦ Education &amp; Groups ✦
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              School &amp; Group
              <br />
              <span style={{ color: "#c9a84c" }}>Reservations</span>
            </h1>
            <p
              className="text-lg text-white/80 max-w-2xl leading-relaxed mb-8"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Bring history to life at the Dinsmore Homestead. Our indoor/outdoor museum
              allows students to experience how men, women, and children lived in the 19th
              and early 20th centuries — encapsulating local, regional, and national history
              from the antebellum era to the early twentieth century.
            </p>
            <div className="flex flex-wrap gap-6 text-white/70 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: "#c9a84c" }} />
                Tours last ~90 minutes
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: "#c9a84c" }} />
                Groups of any size welcome
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: "#c9a84c" }} />
                Burlington, Kentucky
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-8 bg-[#1a2f4e]">
        <div className="container text-center">
          <blockquote
            className="text-xl md:text-2xl text-white/90 italic"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            "To know where you are going, you must know where you came from."
          </blockquote>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="container">
          <div className="text-center mb-14">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
            >
              Our Programs
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1a2f4e] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Choose Your Experience
            </h2>
            <p
              className="text-[#4a3728] max-w-2xl mx-auto"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}
            >
              We have several programs to choose from depending on the age of your students.
              However, you should not feel limited — we can alter any program to fit your
              curriculum, or we can visit your classroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMS.map((prog) => {
              const Icon = prog.icon;
              return (
                <Link key={prog.id} href={prog.href}>
                  <div
                    className={`${prog.color} rounded-xl p-8 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: "#c9a84c" }} />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-xs tracking-widest uppercase mb-1"
                          style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                        >
                          {prog.subtitle}
                        </p>
                        <h3
                          className="text-xl font-bold text-white mb-3"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {prog.title}
                        </h3>
                        <p
                          className="text-white/75 leading-relaxed text-sm"
                          style={{ fontFamily: "'EB Garamond', serif" }}
                        >
                          {prog.description}
                        </p>
                        <div
                          className="flex items-center gap-1 mt-4 text-sm font-medium group-hover:gap-2 transition-all"
                          style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
                        >
                          Learn More <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topics We Cover */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(180deg, #f5f0e8 0%, #ede5d0 100%)",
        }}
      >
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
              >
                Curriculum Connections
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1a2f4e] mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Topics We Cover
              </h2>
              <p
                className="text-[#4a3728] max-w-2xl mx-auto"
                style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.1rem" }}
              >
                Because we have access to the letters, journals, and financial accounts of
                the Dinsmore family and their relatives, we have first-hand information on
                these topics in United States and Kentucky history.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <div
                  key={topic}
                  className="flex items-start gap-3 bg-white/70 rounded-lg p-4 border border-[#c9a84c]/20"
                >
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "#c9a84c" }}
                  />
                  <span
                    className="text-[#1a2f4e] text-sm leading-snug"
                    style={{ fontFamily: "'EB Garamond', serif", fontSize: "1rem" }}
                  >
                    {topic}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-10 p-6 rounded-xl border-l-4 bg-white/60"
              style={{ borderColor: "#c9a84c" }}
            >
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "#c9a84c" }} />
                <p
                  className="text-[#1a2f4e] leading-relaxed"
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
                >
                  <strong>90,000+ pages of original source material</strong> and thousands
                  of artifacts allow us to readily adapt our programs to meet the needs and
                  requirements of our teachers. We can also visit your classroom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section id="reserve" className="py-20 bg-[#1a2f4e]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-xs tracking-[0.3em] uppercase mb-3"
                style={{ color: "#c9a84c", fontFamily: "'Cinzel', serif" }}
              >
                Make a Reservation
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Reserve Your Group Visit
              </h2>
              <p
                className="text-white/70 max-w-xl mx-auto"
                style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
              >
                To schedule your tour or make additional inquiries, complete the form below
                or contact us directly at{" "}
                <a
                  href="tel:8595866117"
                  className="underline"
                  style={{ color: "#c9a84c" }}
                >
                  (859) 586-6117
                </a>{" "}
                or{" "}
                <a
                  href="mailto:ccollopy@dinsmorehomestead.org"
                  className="underline"
                  style={{ color: "#c9a84c" }}
                >
                  ccollopy@dinsmorehomestead.org
                </a>
                .
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
                >
                  <CheckCircle className="w-10 h-10" style={{ color: "#c9a84c" }} />
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Inquiry Received!
                </h3>
                <p
                  className="text-white/70 mb-8"
                  style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
                >
                  Thank you for your interest in visiting the Dinsmore Homestead. Our
                  education coordinator will be in touch within 2 business days to confirm
                  your reservation.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Submit Another Inquiry
                  </Button>
                  <Link href="/">
                    <Button
                      style={{
                        backgroundColor: "#c9a84c",
                        color: "#1a2f4e",
                        fontFamily: "'Cinzel', serif",
                      }}
                    >
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Name of School / Organization *
                    </Label>
                    <Input
                      required
                      value={form.orgName}
                      onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                      placeholder="Boone County Middle School"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Desired Date &amp; Time *
                    </Label>
                    <Input
                      required
                      value={form.desiredDate}
                      onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                      placeholder="e.g. May 15, 2026 at 10:00 AM"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Number of Guests *
                    </Label>
                    <Input
                      required
                      value={form.guestCount}
                      onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                      placeholder="e.g. 35 students + 5 chaperones"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Your Name *
                    </Label>
                    <Input
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      placeholder="Jane Smith"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Contact Email *
                    </Label>
                    <Input
                      required
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      placeholder="jsmith@school.edu"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Group Leader (if different)
                    </Label>
                    <Input
                      value={form.groupLeader}
                      onChange={(e) => setForm({ ...form, groupLeader: e.target.value })}
                      placeholder="Optional"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(859) 555-0100"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Program or Topic of Interest
                    </Label>
                    <select
                      value={form.programInterest}
                      onChange={(e) => setForm({ ...form, programInterest: e.target.value })}
                      className="w-full rounded-md border border-white/20 bg-white/10 text-white px-3 py-2 text-sm focus:border-[#c9a84c] focus:outline-none"
                      style={{ fontFamily: "'EB Garamond', serif" }}
                    >
                      <option value="" className="bg-[#1a2f4e]">Select a program…</option>
                      {PROGRAM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#1a2f4e]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-white/80 mb-2 block" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                      Special Accommodations
                    </Label>
                    <Textarea
                      value={form.accommodations}
                      onChange={(e) => setForm({ ...form, accommodations: e.target.value })}
                      placeholder="Any accessibility needs, dietary requirements, or other accommodations we should know about…"
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-[#c9a84c] resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitInquiry.isPending}
                  className="w-full py-4 text-base font-bold tracking-widest"
                  style={{
                    backgroundColor: "#c9a84c",
                    color: "#1a2f4e",
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  {submitInquiry.isPending ? "Sending…" : "Submit Reservation Inquiry"}
                </Button>

                <p
                  className="text-center text-white/50 text-xs"
                  style={{ fontFamily: "'EB Garamond', serif" }}
                >
                  We'll respond within 2 business days to confirm your reservation.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-10 bg-[#0d1f35]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/70">
            <a
              href="tel:8595866117"
              className="flex items-center gap-3 hover:text-white transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
            >
              <Phone className="w-5 h-5" style={{ color: "#c9a84c" }} />
              (859) 586-6117
            </a>
            <span className="hidden md:block text-white/20">|</span>
            <a
              href="mailto:ccollopy@dinsmorehomestead.org"
              className="flex items-center gap-3 hover:text-white transition-colors"
              style={{ fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}
            >
              <Mail className="w-5 h-5" style={{ color: "#c9a84c" }} />
              ccollopy@dinsmorehomestead.org
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
