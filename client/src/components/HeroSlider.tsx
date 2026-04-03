import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../../../shared/images";

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

interface HeroSliderProps {
  /** When true, renders as a contained panel (for split hero). When false, renders full-width. */
  contained?: boolean;
}

export default function HeroSlider({ contained = false }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: adminSlides } = trpc.heroSlides.list.useQuery();

  const slides =
    adminSlides && adminSlides.length > 0
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

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const height = contained ? "100%" : "clamp(480px, 78vh, 820px)";

  return (
    <div
      className="relative overflow-hidden"
      style={{ height, minHeight: contained ? "0" : undefined, width: "100%" }}
    >
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
              transform: index === current ? "scale(1.03)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
          />

          {/* Navy gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, oklch(21.8% 0.036 251.3 / 0.25) 0%, oklch(21.8% 0.036 251.3 / 0.6) 55%, oklch(21.8% 0.036 251.3 / 0.85) 100%)",
            }}
          />

          {/* Warm sepia tone */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "oklch(50% 0.04 60 / 0.12)",
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
              padding: contained ? "2rem" : "clamp(2rem, 8vh, 5rem) clamp(1.5rem, 5vw, 5rem)",
            }}
          >
            <div style={{ maxWidth: "600px" }}>
              {/* Gold accent line */}
              <div
                style={{
                  width: "50px",
                  height: "2px",
                  background: "oklch(74.2% 0.118 90.2)",
                  marginBottom: "0.875rem",
                  opacity: index === current ? 1 : 0,
                  transform: index === current ? "scaleX(1)" : "scaleX(0)",
                  transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
                  transformOrigin: "left",
                }}
              />
              <h1
                style={{
                  color: "oklch(97.8% 0.008 89.6)",
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: contained ? "clamp(1.4rem, 2.5vw, 2.2rem)" : "clamp(2rem, 4vw, 3.2rem)",
                  lineHeight: 1.2,
                  marginBottom: "0.625rem",
                  textShadow: "0 2px 12px oklch(0% 0 0 / 0.5)",
                  opacity: index === current ? 1 : 0,
                  transform: index === current ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  color: "oklch(87.6% 0.068 89.7)",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: contained ? "clamp(0.9rem, 1.4vw, 1.05rem)" : "clamp(1rem, 2vw, 1.25rem)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.6,
                  textShadow: "0 1px 6px oklch(0% 0 0 / 0.4)",
                  opacity: index === current ? 1 : 0,
                  transform: index === current ? "translateY(0)" : "translateY(15px)",
                  transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
                  maxWidth: "520px",
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
                    display: "inline-block",
                  }}
                >
                  {slide.linkText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {[
        { dir: "prev", action: prev, icon: <ChevronLeft size={18} />, side: "left" },
        { dir: "next", action: next, icon: <ChevronRight size={18} />, side: "right" },
      ].map(({ dir, action, icon, side }) => (
        <button
          key={dir}
          onClick={action}
          style={{
            position: "absolute",
            [side]: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            background: "oklch(0% 0 0 / 0.35)",
            border: "1px solid oklch(74.2% 0.118 90.2 / 0.4)",
            color: "oklch(94.7% 0.029 89.6)",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s, border-color 0.2s",
            borderRadius: "2px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "oklch(34.6% 0.074 256.1 / 0.8)";
            (e.currentTarget as HTMLElement).style.borderColor = "oklch(74.2% 0.118 90.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "oklch(0% 0 0 / 0.35)";
            (e.currentTarget as HTMLElement).style.borderColor = "oklch(74.2% 0.118 90.2 / 0.4)";
          }}
          aria-label={`${dir === "prev" ? "Previous" : "Next"} slide`}
        >
          {icon}
        </button>
      ))}

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "0.875rem",
          right: "1rem",
          zIndex: 10,
          display: "flex",
          gap: "0.4rem",
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "20px" : "7px",
              height: "7px",
              background: i === current ? "oklch(74.2% 0.118 90.2)" : "oklch(93% 0.025 75 / 0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
              borderRadius: "2px",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
