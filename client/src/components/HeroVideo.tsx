import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "wouter";

// ── CDN URL for the v4 reel (no baked-in text, heritage color grade) ──────
const VIDEO_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/UnmfNodCjcmjGbFI.mp4";

// ── Slide definitions synced to video timecodes ────────────────────────────
// Clip timing (from build script output):
//   Clip 1: 0.0s – 5.5s   Exterior — white picket fence, homestead
//   Clip 2: 5.5s – 10.5s  Women's Study — upstairs room pan
//   Clip 3: 10.5s – 16.0s Parlor — green velvet sofa, fireplace, portrait
//   Clip 4: 16.0s – 20.5s TR Rough Riders archival photo
//   Clip 5: 20.5s – 25.0s Bookshelf close-up
//   Clip 6: 25.0s – 31.5s Aerial drone — homestead and grounds
const SLIDES = [
  {
    start: 0.0,
    end: 5.5,
    title: "Experience History Coming Alive",
    subtitle:
      "Step inside the 1842 Dinsmore Homestead — one of Kentucky's most authentic 19th-century historic sites",
    linkUrl: "/visit",
    linkText: "Plan Your Visit",
  },
  {
    start: 5.5,
    end: 10.5,
    title: "Where History Was Never Put Away",
    subtitle:
      "Original furnishings, family letters, and personal heirlooms remain exactly where the Dinsmores left them",
    linkUrl: "/history/family",
    linkText: "Discover the History",
  },
  {
    start: 10.5,
    end: 16.0,
    title: "Six Generations of One Kentucky Family",
    subtitle:
      "From 1842 to 1988, the Dinsmore family called this home — and their story is still very much alive",
    linkUrl: "/history/family",
    linkText: "Meet the Family",
  },
  {
    start: 16.0,
    end: 20.5,
    title: "Presidential Connections",
    subtitle:
      "The Dinsmore family's social circle reached all the way to the White House — come hear the full story",
    linkUrl: "/history/family",
    linkText: "Explore the History",
  },
  {
    start: 20.5,
    end: 25.0,
    title: "A Living Library of American Life",
    subtitle:
      "Thousands of original books, letters, and artifacts — untouched, unrestored, and waiting to be discovered",
    linkUrl: "/visit",
    linkText: "Plan Your Visit",
  },
  {
    start: 25.0,
    end: 31.5,
    title: "Come Experience It All",
    subtitle:
      "The Dinsmore Homestead · Burlington, Kentucky · Open for guided tours",
    linkUrl: "/visit",
    linkText: "Book a Tour",
  },
];

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  // ── Play video on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    const play = () => {
      vid.play().catch(() => {
        // autoplay blocked — poster shows
      });
    };
    if (vid.readyState >= 3) {
      play();
    } else {
      vid.addEventListener("canplay", play, { once: true });
    }
    return () => vid.removeEventListener("canplay", play);
  }, []);

  // ── Track video time and update active slide ─────────────────────────────
  const handleTimeUpdate = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const t = vid.currentTime;
    setCurrentTime(t);

    const idx = SLIDES.findIndex((s) => t >= s.start && t < s.end);
    if (idx !== -1 && idx !== activeSlide) {
      // Briefly hide text to trigger re-animation on slide change
      setTextVisible(false);
      setTimeout(() => {
        setActiveSlide(idx);
        setTextVisible(true);
      }, 80);
    }
  }, [activeSlide]);

  // ── Show text once video starts playing ─────────────────────────────────
  const handlePlay = useCallback(() => {
    setTimeout(() => setTextVisible(true), 400);
  }, []);

  const slide = SLIDES[activeSlide];

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "clamp(480px, 78vh, 820px)", width: "100%", background: "#0d1117" }}
    >
      {/* ── Video background ── */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoReady ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* ── Navy gradient overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, oklch(21.8% 0.036 251.3 / 0.18) 0%, oklch(21.8% 0.036 251.3 / 0.45) 55%, oklch(21.8% 0.036 251.3 / 0.82) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Warm sepia tint ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(50% 0.04 60 / 0.10)",
          mixBlendMode: "multiply",
          zIndex: 2,
        }}
      />

      {/* ── Hero text overlay (HeroSlider-style) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          padding: "clamp(2rem, 8vh, 5rem) clamp(1.5rem, 5vw, 5rem)",
          zIndex: 3,
        }}
      >
        <div style={{ maxWidth: "640px" }}>
          {/* Gold accent line */}
          <div
            style={{
              width: "50px",
              height: "2px",
              background: "oklch(74.2% 0.118 90.2)",
              marginBottom: "0.875rem",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "scaleX(1)" : "scaleX(0)",
              transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
              transformOrigin: "left",
            }}
          />

          {/* Title — Playfair Display, matches HeroSlider exactly */}
          <h1
            style={{
              color: "oklch(97.8% 0.008 89.6)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.2,
              marginBottom: "0.625rem",
              textShadow: "0 2px 12px oklch(0% 0 0 / 0.55)",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            {slide.title}
          </h1>

          {/* Subtitle — EB Garamond, matches HeroSlider exactly */}
          <p
            style={{
              color: "oklch(87.6% 0.068 89.7)",
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
              textShadow: "0 1px 6px oklch(0% 0 0 / 0.45)",
              maxWidth: "520px",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(15px)",
              transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTA button — btn-vintage-filled, matches HeroSlider exactly */}
          <Link
            href={slide.linkUrl}
            className="btn-vintage-filled"
            style={{
              display: "inline-block",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
            }}
          >
            {slide.linkText}
          </Link>
        </div>
      </div>

      {/* ── Slide progress dots ── */}
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
        {SLIDES.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeSlide ? "20px" : "7px",
              height: "7px",
              background:
                i === activeSlide
                  ? "oklch(74.2% 0.118 90.2)"
                  : "oklch(93% 0.025 75 / 0.5)",
              transition: "all 0.3s ease",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
