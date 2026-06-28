"use client";

import { useState } from "react";

const YOUTUBE_URL = "https://www.youtube.com/@prodmvxii";
const INSTAGRAM_URL = "https://www.instagram.com/prodmvxii";

function YouTubeIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2.1C.7 15.5 1 17.5 1 17.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.7 21.7 12 21.7 12 21.7s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2c0-2.1-.3-4.3-.3-4.3zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
    </svg>
  );
}

function InstagramIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface CardProps {
  href: string;
  platform: string;
  handle: string;
  cta: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  accent: string;
}

function PlatformCard({ href, platform, handle, cta, icon, gradient, glow, accent }: CardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        flex: "1 1 340px",
        minWidth: "300px",
        borderRadius: "24px",
        padding: "2px",
        textDecoration: "none",
        overflow: "hidden",
        background: gradient,
        boxShadow: hovered ? `0 0 60px ${glow}, 0 24px 60px rgba(0,0,0,0.55)` : `0 12px 40px rgba(0,0,0,0.4)`,
        transform: hovered ? "translateY(-8px) scale(1.015)" : "translateY(0)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "22px",
          background: "rgba(8,8,14,0.86)",
          backdropFilter: "blur(6px)",
          padding: "36px 32px",
          overflow: "hidden",
          minHeight: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Big watermark icon */}
        <div
          style={{
            position: "absolute",
            right: "-24px",
            bottom: "-28px",
            color: accent,
            opacity: hovered ? 0.18 : 0.08,
            transform: hovered ? "rotate(-8deg) scale(1.1)" : "rotate(0) scale(1)",
            transition: "all 0.4s",
          }}
        >
          {/* large icon */}
          <div style={{ transform: "scale(5.5)", transformOrigin: "bottom right" }}>{icon}</div>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "20px",
              boxShadow: `0 0 24px ${glow}`,
            }}
          >
            {icon}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#F1F5F9", letterSpacing: "0.5px" }}>{platform}</div>
          <div style={{ fontSize: "14px", color: accent, fontWeight: 700, marginTop: "2px" }}>{handle}</div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            alignSelf: "flex-start",
            padding: "10px 22px",
            borderRadius: "50px",
            background: hovered ? gradient : "rgba(255,255,255,0.06)",
            color: hovered ? "#fff" : accent,
            border: `1px solid ${accent}55`,
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            transition: "all 0.3s",
          }}
        >
          {cta} →
        </div>
      </div>
    </a>
  );
}

export default function SocialHero() {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px",
        background: "#050508",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "50px",
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#A855F7",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "16px",
            }}
          >
            SÍGUEME EN TODAS PARTES
          </span>
          <h2
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#F1F5F9",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            CONECTA CON{" "}
            <span style={{ color: "#A855F7", textShadow: "0 0 30px rgba(168,85,247,0.6)" }}>PROD. MVXII</span>
          </h2>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
          <PlatformCard
            href={YOUTUBE_URL}
            platform="YouTube"
            handle="@prodmvxii"
            cta="Suscríbete"
            icon={<YouTubeIcon />}
            gradient="linear-gradient(135deg, #FF0000, #CC0000)"
            glow="rgba(255,0,0,0.45)"
            accent="#FF4444"
          />
          <PlatformCard
            href={INSTAGRAM_URL}
            platform="Instagram"
            handle="@prodmvxii"
            cta="Seguir"
            icon={<InstagramIcon />}
            gradient="linear-gradient(135deg, #833AB4, #E1306C, #F77737)"
            glow="rgba(225,48,108,0.45)"
            accent="#E1306C"
          />
        </div>
      </div>
    </section>
  );
}
