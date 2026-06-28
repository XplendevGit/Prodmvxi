"use client";

import { useState } from "react";
import { WA_CONTACT_URL } from "@/lib/whatsapp";

interface SocialPlatform {
  name: string;
  handle: string;
  url: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
  followers?: string;
}

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2.1C.7 15.5 1 17.5 1 17.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.7 21.7 12 21.7 12 21.7s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2c0-2.1-.3-4.3-.3-4.3zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.54V6.79a4.85 4.85 0 0 1-1.04-.1z"/>
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

function BeatstarsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIALS: SocialPlatform[] = [
  {
    name: "Instagram",
    handle: "@prodmvxii",
    url: "https://www.instagram.com/prodmvxii",
    color: "#E1306C",
    glowColor: "#C13584",
    icon: <InstagramIcon />,
    followers: "Sígueme",
  },
  {
    name: "YouTube",
    handle: "Prod.Mvxii",
    url: "https://www.youtube.com/@prodmvxii",
    color: "#FF0000",
    glowColor: "#CC0000",
    icon: <YouTubeIcon />,
    followers: "Suscríbete",
  },
  {
    name: "TikTok",
    handle: "@prodmvxii",
    url: "https://www.tiktok.com/@prodmvxii",
    color: "#69C9D0",
    glowColor: "#EE1D52",
    icon: <TikTokIcon />,
    followers: "Sígueme",
  },
  {
    name: "Spotify",
    handle: "Prod. Mvxii",
    url: "https://open.spotify.com/search/prod%20mvxii",
    color: "#1DB954",
    glowColor: "#15A047",
    icon: <SpotifyIcon />,
    followers: "Escuchar",
  },
  {
    name: "BeatStars",
    handle: "prodmvxii",
    url: "https://www.beatstars.com/prodmvxii",
    color: "#A855F7",
    glowColor: "#7C3AED",
    icon: <BeatstarsIcon />,
    followers: "Comprar Beats",
  },
  {
    name: "WhatsApp",
    handle: "+56 9 3290 7119",
    url: WA_CONTACT_URL,
    color: "#25D366",
    glowColor: "#128C7E",
    icon: <WhatsAppIcon />,
    followers: "Escríbeme",
  },
];

function SocialCard({ platform }: { platform: SocialPlatform }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        padding: "28px 20px",
        borderRadius: "16px",
        background: hovered ? `rgba(${hexToRgb(platform.color)}, 0.1)` : "#0D0D1A",
        border: `1px solid ${hovered ? platform.color + "60" : "rgba(139,92,246,0.15)"}`,
        textDecoration: "none",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 0 30px ${platform.glowColor}40, 0 8px 24px rgba(0,0,0,0.4)`
          : "0 4px 16px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: hovered
            ? `linear-gradient(135deg, ${platform.color}30, ${platform.glowColor}20)`
            : "rgba(139,92,246,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered ? platform.color : "rgba(241,245,249,0.6)",
          transition: "all 0.3s",
          border: `1px solid ${hovered ? platform.color + "40" : "rgba(139,92,246,0.2)"}`,
        }}
      >
        {platform.icon}
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: hovered ? platform.color : "#F1F5F9",
            transition: "color 0.3s",
            marginBottom: "4px",
          }}
        >
          {platform.name}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(241,245,249,0.5)",
            letterSpacing: "0.5px",
          }}
        >
          {platform.handle}
        </div>
      </div>

      <span
        style={{
          padding: "6px 16px",
          borderRadius: "50px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "1px",
          background: hovered ? `${platform.color}20` : "rgba(139,92,246,0.1)",
          color: hovered ? platform.color : "rgba(241,245,249,0.5)",
          border: `1px solid ${hovered ? platform.color + "40" : "rgba(139,92,246,0.2)"}`,
          transition: "all 0.3s",
          textTransform: "uppercase",
        }}
      >
        {platform.followers}
      </span>
    </a>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "139, 92, 246";
}

export default function SocialLinks() {
  return (
    <section
      id="contacto"
      style={{
        padding: "100px 24px",
        background: "#050508",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            style={{
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 900,
              letterSpacing: "6px",
              color: "#F1F5F9",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            SÍ
            <span
              style={{
                color: "#A855F7",
                textShadow: "0 0 30px rgba(168,85,247,0.6)",
              }}
            >
              GUEME
            </span>
          </h2>
          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
              margin: "0 auto 20px",
              borderRadius: "3px",
            }}
          />
          <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "15px", letterSpacing: "1px" }}>
            Conéctate con Prod. Mvxii en todas las plataformas
          </p>
        </div>

        {/* Social grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {SOCIALS.map((platform) => (
            <SocialCard key={platform.name} platform={platform} />
          ))}
        </div>

        {/* Beatstars highlight */}
        <div
          style={{
            marginTop: "48px",
            padding: "24px 32px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.05))",
            border: "1px solid rgba(139,92,246,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#F1F5F9", marginBottom: "4px" }}>
              ¿Quieres un beat personalizado?
            </div>
            <div style={{ fontSize: "13px", color: "rgba(241,245,249,0.5)" }}>
              Escríbeme directo por WhatsApp y te respondo al tiro
            </div>
          </div>
          <a
            href={WA_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 28px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              boxShadow: "0 0 20px rgba(37,211,102,0.5)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
}
