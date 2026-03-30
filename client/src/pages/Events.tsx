import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { IMAGES } from "../../../shared/images";
import { Calendar, Clock, Ticket, Filter } from "lucide-react";
import { format } from "date-fns";

const EVENT_TYPES = [
  { value: "all", label: "All Events" },
  { value: "tour", label: "Tours" },
  { value: "special_event", label: "Special Events" },
  { value: "fundraiser", label: "Fundraisers" },
  { value: "program", label: "Programs" },
];

function PageHero() {
  return (
    <div className="relative overflow-hidden" style={{ height: "280px" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMAGES.outbuildings14})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(20%) contrast(1.05)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "oklch(22% 0.04 50 / 0.7)" }} />
      <div className="container relative h-full flex flex-col justify-end pb-10">
        <span className="section-label" style={{ color: "oklch(64.3% 0.161 143.4)" }}>
          Dinsmore Homestead Museum
        </span>
        <h1 style={{ color: "oklch(96% 0.014 110)", marginBottom: "0.5rem" }}>Events & Programs</h1>
        <p style={{ color: "oklch(86.6% 0.079 130.9)", fontFamily: "'EB Garamond', serif", fontSize: "1.05rem" }}>
          Tours, seasonal celebrations, and special programs throughout the year
        </p>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [filter, setFilter] = useState("all");
  const { data: events, isLoading } = trpc.events.list.useQuery();

  const filtered = events?.filter(
    (e) => filter === "all" || e.eventType === filter
  );

  return (
    <div>
      <PageHero />

      <section className="py-10" style={{ background: "oklch(96% 0.014 110)" }}>
        <div className="container">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <Filter size={16} style={{ color: "oklch(64.3% 0.161 143.4)" }} />
            {EVENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.4rem 1rem",
                  border: "1px solid",
                  borderColor: filter === type.value ? "oklch(33.1% 0.064 144.7)" : "oklch(78% 0.055 135)",
                  background: filter === type.value ? "oklch(33.1% 0.064 144.7)" : "transparent",
                  color: filter === type.value ? "oklch(96% 0.014 110)" : "oklch(44% 0.055 144)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card-vintage overflow-hidden"
                  style={{ height: "320px", background: "oklch(86.6% 0.079 130.9)", animation: "pulse 2s infinite" }}
                />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => {
                const startDate = new Date(event.startDate);
                return (
                  <Link key={event.id} href={`/events/${event.slug}`} className="block group">
                    <div className="card-vintage overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                      <div className="relative overflow-hidden" style={{ height: "200px" }}>
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ filter: "sepia(10%)" }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: "oklch(86.6% 0.079 130.9)" }}
                          >
                            <Calendar size={40} style={{ color: "oklch(64.3% 0.161 143.4)" }} />
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            top: "0.75rem",
                            left: "0.75rem",
                            background: "oklch(33.1% 0.064 144.7)",
                            color: "oklch(96% 0.014 110)",
                            padding: "0.25rem 0.75rem",
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "0.7rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          {format(startDate, "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="section-label" style={{ fontSize: "0.65rem" }}>
                          {event.eventType.replace("_", " ")}
                        </span>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "oklch(20% 0.03 145)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {event.title}
                        </h3>
                        {event.shortDescription && (
                          <p
                            style={{
                              fontFamily: "'EB Garamond', serif",
                              fontSize: "0.9rem",
                              color: "oklch(44% 0.055 144)",
                              marginBottom: "0.75rem",
                              lineHeight: 1.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {event.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "0.9rem",
                              color: "oklch(33.1% 0.064 144.7)",
                              fontWeight: 600,
                            }}
                          >
                            {parseFloat(event.basePrice) === 0 ? "Free" : `From $${event.basePrice}`}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "0.7rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "oklch(33.1% 0.064 144.7)",
                            }}
                          >
                            <Ticket size={12} style={{ display: "inline", marginRight: "0.25rem" }} />
                            Get Tickets
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar size={56} style={{ color: "oklch(78% 0.055 135)", margin: "0 auto 1rem" }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "oklch(44% 0.055 144)" }}>
                No events currently scheduled
              </h3>
              <p style={{ fontFamily: "'EB Garamond', serif", color: "oklch(64.3% 0.161 143.4)" }}>
                Check back soon — new events are added regularly throughout the season.
              </p>
              <Link href="/connect" className="btn-vintage mt-4 inline-block">
                Contact Us for Group Tours
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Group tours CTA */}
      <section
        className="py-12"
        style={{ background: "oklch(27% 0.045 50)", borderTop: "3px solid oklch(64.3% 0.161 143.4)" }}
      >
        <div className="container text-center">
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(96% 0.014 110)",
              marginBottom: "0.75rem",
            }}
          >
            Planning a Group Visit?
          </h3>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "oklch(78% 0.055 135)",
              fontSize: "1rem",
              maxWidth: "500px",
              margin: "0 auto 1.5rem",
            }}
          >
            We offer special rates and custom programming for school groups, organizations, and private parties.
          </p>
          <Link href="/connect" className="btn-vintage-filled">
            Contact Us to Book
          </Link>
        </div>
      </section>
    </div>
  );
}
