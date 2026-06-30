"use client";

import Image from "next/image";

// Reduced from 20→8 bars and 25→8 particles: fewer animated DOM nodes during LCP
const EQUALIZER_BARS = Array.from({ length: 8 }, (_, i) => i);
const PARTICLE_COUNT = 8;

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: (i / PARTICLE_COUNT) * 100,
  delay: (i * 0.9) % 6,
  duration: 7 + (i % 4),
  size: 2 + (i % 4),
  color: i % 3 === 0 ? "#8B5CF6" : i % 3 === 1 ? "#06B6D4" : "#EC4899",
}));

const EQ_DELAYS = [0, 120, 240, 60, 300, 180, 80, 200];
const EQ_ANIMS  = ["equalizer", "equalizerB", "equalizerC", "equalizer", "equalizerB", "equalizerC", "equalizer", "equalizerB"];

export default function Hero() {
  const scrollToBeats = () => {
    document.getElementById("beats")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 50%, #2D1B69 0%, #1a0e3a 30%, #050508 70%)",
      }}
    >
      {/* Soft radial glow accents (replaces the old notebook-grid background) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(139,92,246,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.10), transparent 45%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-10px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
            zIndex: 1,
          }}
        />
      ))}

      {/* Scanline effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.03) 50%)",
          backgroundSize: "100% 4px",
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.4,
        }}
      />

      {/* 3D Perspective Container */}
      <div
        style={{
          perspective: "1200px",
          width: "100%",
          zIndex: 3,
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "100px 24px 80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
              animation: "fadeInUp 0.8s ease both",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "50%",
                background: "conic-gradient(from 0deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)",
                animation: "spin-slow 4s linear infinite",
                zIndex: -1,
              }}
            />
            <Image
              src="/Logo_Maxi.jpeg"
              alt="Prod. Mvxii"
              width={130}
              height={130}
              priority
              fetchPriority="high"
              style={{
                borderRadius: "50%",
                border: "4px solid #050508",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 0 30px rgba(139,92,246,0.9))",
              }}
            />
          </div>

          {/* Glitch title */}
          <div style={{ animation: "fadeInUp 0.8s 0.2s ease both", opacity: 0 }}>
            <h1
              className="glitch-text"
              data-text="PROD. MVXII"
              style={{
                fontSize: "clamp(52px, 10vw, 100px)",
                fontWeight: 900,
                letterSpacing: "6px",
                color: "#F1F5F9",
                margin: 0,
                lineHeight: 1,
                textShadow: "0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(139,92,246,0.4)",
              }}
            >
              PROD. MVXII
            </h1>
          </div>

          {/* Subtitle — keyword-rich (genres) rendered in the DOM for SEO */}
          <div style={{ animation: "fadeInUp 0.8s 0.4s ease both", opacity: 0 }}>
            <p
              style={{
                fontSize: "clamp(12px, 2.4vw, 17px)",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#A855F7",
                margin: 0,
                fontWeight: 600,
              }}
            >
              TRAP{" "}<span style={{ color: "rgba(241,245,249,0.3)" }}>·</span>{" "}REGGAETÓN{" "}
              <span style={{ color: "rgba(241,245,249,0.3)" }}>·</span>{" "}DRILL{" "}
              <span style={{ color: "rgba(241,245,249,0.3)" }}>·</span>{" "}AFROBEAT
            </p>
            <p
              style={{
                fontSize: "clamp(14px, 2.2vw, 17px)",
                color: "rgba(241,245,249,0.62)",
                margin: "14px auto 0",
                maxWidth: "620px",
                lineHeight: 1.6,
              }}
            >
              Comprar beats e instrumentales online. Type beats y bases urbanas
              listas para grabar, por Prod. Mvxii, productor de Chile.
            </p>
          </div>

          {/* Equalizer visualization */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
              height: "80px",
              padding: "0 16px",
              animation: "fadeInUp 0.8s 0.6s ease both",
              opacity: 0,
            }}
          >
            {EQUALIZER_BARS.map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    borderRadius: "4px 4px 0 0",
                    background: `linear-gradient(to top, #8B5CF6, ${i % 2 === 0 ? "#06B6D4" : "#EC4899"})`,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "#8B5CF6" : "#A855F7"}`,
                    animation: `${EQ_ANIMS[i]} 0.8s ${EQ_DELAYS[i]}ms ease-in-out infinite`,
                    transformOrigin: "bottom",
                  }}
                />
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
              animation: "fadeInUp 0.8s 0.8s ease both",
              opacity: 0,
            }}
          >
            <button
              onClick={scrollToBeats}
              style={{
                padding: "16px 40px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(139,92,246,0.6)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(168,85,247,0.9)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05) translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(139,92,246,0.6)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1) translateY(0)";
              }}
            >
              VER BEATS
            </button>

            <a
              href="https://www.beatstars.com/prodmvxii"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "16px 40px",
                borderRadius: "50px",
                background: "transparent",
                color: "#A855F7",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                border: "2px solid #8B5CF6",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139,92,246,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(139,92,246,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05) translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1) translateY(0)";
              }}
            >
              ESCUCHAR AHORA
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              animation: "fadeInUp 0.8s 1s ease both",
              opacity: 0,
            }}
          >
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "rgba(241,245,249,0.4)", textTransform: "uppercase" }}>Scroll</span>
            <div
              style={{
                width: "1px",
                height: "40px",
                background: "linear-gradient(to bottom, rgba(139,92,246,0.8), transparent)",
                animation: "glow 2s infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to bottom, transparent, #050508)",
          zIndex: 4,
        }}
      />
    </section>
  );
}
