import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../../../shared/images";

// Default slides used when no admin slides are configured
const DEFAULT_SLIDES = [
  {
    id: 0,
    title: "Experience History Coming Alive",
    subtitle: "Step inside the 1842 Dinsmore Homestead — one of Kentucky's most authentic 19th-century historic sites",
    imageUrl: IMAGES.farmHDR,
    linkUrl: "/visit",
    linkText: "Plan Your Visit",
  },
  {
    id: 1,
    title: "Upcoming Events & Tours",
    subtitle: "Join us for guided tours, seasonal celebrations, and special programs throughout the year",
    imageUrl: IMAGES.outbuildings14,
    linkUrl: "/events",
    linkText: "View All Events",
  },
  {
    id: 2,
    title: "Preserving the Past",
    subtitle: "The Dinsmore Homestead Foundation is dedicated to preserving this irreplaceable piece of American history",
    imageUrl: IMAGES.farmPhoto1,
    linkUrl: "/preservation",
    linkText: "Support Our Mission",
  },
  {
    id: 3,
    title: "A Living Legacy",
    subtitle: "Explore the stories of the Dinsmore family, the enslaved community, and all who shaped this remarkable place",
    imageUrl: IMAGES.heritageFinal,
    linkUrl: "/history/family",
    linkText: "Discover the History",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: adminSlides } = trpc.heroSlides.list.useQuery();

  const slides = adminSlides && adminSlides.length > 0
    ? adminSlides.map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle || "",
        imageUrl: s.imageUrl,
        linkUrl: s.linkUrl || "/events",
        linkText: s.linkText || "Learn More",
      }))
    : DEFAULT_SLIDES;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "clamp(400px, 70vh, 700px)" }}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: index === current ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: index === current ? 1 : 0,
          }}
        >
          {/* Background image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: index === current ? "scale(1.02)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
          />

          {/* Sepia overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, oklch(0% 0 0 / 0.2) 0%, oklch(0% 0 0 / 0.55) 60%, oklch(0% 0 0 / 0.75) 100%)",
            }}
          />

          {/* Warm sepia color grade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "oklch(50% 0.04 60 / 0.2)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-end",
              paddingBottom: "clamp(2rem, 8vh, 5rem)",
            }}
          >
            <div className="container">
              <div style={{ maxWidth: "700px" }}>
                {/* Ornamental line */}
                <div
                  style={{
                    width: "60px",
                    height: "2px",
                    background: "oklch(68% 0.12 75)",
                    marginBottom: "1rem",
                    opacity: index === current ? 1 : 0,
                    transform: index === current ? "scaleX(1)" : "scaleX(0)",
                    transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
                    transformOrigin: "left",
                  }}
                />
                <h1
                  className="text-shadow-vintage"
                  style={{
                    color: "oklch(96% 0.018 80)",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    opacity: index === current ? 1 : 0,
                    transform: index === current ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  className="text-shadow-vintage"
                  style={{
                    color: "oklch(87% 0.032 72)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    marginBottom: "1.5rem",
                    opacity: index === current ? 1 : 0,
                    transform: index === current ? "translateY(0)" : "translateY(15px)",
                    transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
                    maxWidth: "600px",
                  }}
                >
                  {slide.subtitle}
                </p>
                {slide.linkUrl && (
                  <Link
                    href={slide.linkUrl}
                    className="btn-vintage-filled"
                    style={{
                      opacity: index === current ? 1 : 0,
                      transform: index === current ? "translateY(0)" : "translateY(10px)",
                      transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
                    }}
                  >
                    {slide.linkText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          left: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "oklch(0% 0 0 / 0.4)",
          border: "1px solid oklch(72% 0.05 62 / 0.5)",
          color: "oklch(93% 0.025 75)",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(38% 0.12 22 / 0.8)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0% 0 0 / 0.4)")}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          right: "1rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "oklch(0% 0 0 / 0.4)",
          border: "1px solid oklch(72% 0.05 62 / 0.5)",
          color: "oklch(93% 0.025 75)",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(38% 0.12 22 / 0.8)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0% 0 0 / 0.4)")}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          right: "1.5rem",
          zIndex: 10,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "oklch(68% 0.12 75)" : "oklch(93% 0.025 75 / 0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
