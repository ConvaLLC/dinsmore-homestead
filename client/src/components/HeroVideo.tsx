import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";

const VIDEO_URL =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/YrtmsrolQVDnycBt.mp4";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.playsInline = true;
    const play = () => {
      vid.play().catch(() => {
        // autoplay blocked — video stays paused, poster shows
      });
    };
    if (vid.readyState >= 3) {
      play();
    } else {
      vid.addEventListener("canplay", play, { once: true });
    }
    return () => vid.removeEventListener("canplay", play);
  }, []);

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
        loop={false}
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoReady ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* ── Fallback poster (shows while video loads) ── */}
      {!videoReady && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663457620847/YrtmsrolQVDnycBt.mp4)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: "oklch(21.8% 0.036 251.3)",
          }}
        />
      )}

      {/* ── Navy gradient overlay (matches existing HeroSlider style) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, oklch(21.8% 0.036 251.3 / 0.18) 0%, oklch(21.8% 0.036 251.3 / 0.45) 55%, oklch(21.8% 0.036 251.3 / 0.78) 100%)",
          zIndex: 1,
        }}
      />

      {/* ── Warm sepia tint (matches existing HeroSlider style) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "oklch(50% 0.04 60 / 0.10)",
          mixBlendMode: "multiply",
          zIndex: 2,
        }}
      />

      {/* ── Hero text overlay ── */}
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
            }}
          />

          <h1
            style={{
              color: "oklch(97.8% 0.008 89.6)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.2,
              marginBottom: "0.625rem",
              textShadow: "0 2px 12px oklch(0% 0 0 / 0.55)",
            }}
          >
            Experience History Coming Alive
          </h1>

          <p
            style={{
              color: "oklch(87.6% 0.068 89.7)",
              fontFamily: "'EB Garamond', serif",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
              textShadow: "0 1px 6px oklch(0% 0 0 / 0.45)",
              maxWidth: "520px",
            }}
          >
            Step inside the 1842 Dinsmore Homestead — one of Kentucky's most
            authentic 19th-century historic sites
          </p>

          <Link
            href="/visit"
            className="btn-vintage-filled"
            style={{ display: "inline-block" }}
          >
            Plan Your Visit
          </Link>
        </div>
      </div>

      {/* ── Muted badge ── */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
          background: "oklch(0% 0 0 / 0.45)",
          border: "1px solid oklch(74.2% 0.118 90.2 / 0.35)",
          color: "oklch(87.6% 0.068 89.7)",
          padding: "0.25rem 0.6rem",
          fontSize: "0.65rem",
          fontFamily: "'Cinzel', serif",
          letterSpacing: "0.12em",
          borderRadius: "2px",
        }}
        className="uppercase"
      >
        ▶ Heritage Reel
      </div>
    </div>
  );
}
