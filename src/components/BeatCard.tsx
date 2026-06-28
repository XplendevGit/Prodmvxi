"use client";

import { useState } from "react";
import { Play, Pause, Music, Tag, ShoppingCart } from "lucide-react";

interface Beat {
  id: string;
  name: string;
  bpm: string;
  genre: string;
  price: string;
  previewUrl: string | null;
  artwork?: string | null;
  beatstarsUrl?: string;
  isDemoMode?: boolean;
}

const BEATSTARS_FALLBACK = "https://www.beatstars.com/prodmvxii";

interface BeatCardProps {
  beat: Beat;
  index: number;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: (beat: Beat) => void;
}

const WAVE_HEIGHTS = [40, 70, 55, 90, 35, 80, 60, 45, 85, 50];

export default function BeatCard({ beat, index, isPlaying, isActive, onPlay }: BeatCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#0D0D1A",
        borderRadius: "16px",
        padding: "1.5px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered || isActive
          ? "0 0 30px rgba(139,92,246,0.4), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        // Stagger within each 12-item section so deep pages don't get huge delays
        animation: `fadeInUp 0.5s ${(index % 12) * 0.06}s ease both`,
        opacity: 0,
      }}
    >
      {/* Gradient border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          background: isActive
            ? "linear-gradient(135deg, #A855F7, #06B6D4, #EC4899)"
            : hovered
            ? "linear-gradient(135deg, #8B5CF6, #06B6D4, #EC4899)"
            : "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.1))",
          transition: "all 0.3s",
        }}
      />

      {/* Inner card */}
      <div
        style={{
          position: "relative",
          background: "#0D0D1A",
          borderRadius: "15px",
          padding: "20px",
          zIndex: 1,
        }}
      >
        {/* Artwork cover with overlays — click opens the BeatStars product page */}
        <div
          onClick={() => window.open(beat.beatstarsUrl || BEATSTARS_FALLBACK, "_blank", "noopener,noreferrer")}
          title="Comprar en BeatStars"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "14px",
            background: "linear-gradient(135deg, #2D1B69, #4C1D95)",
            cursor: "pointer",
          }}
        >
          {beat.artwork ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={beat.artwork}
              alt={beat.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
                transform: hovered || isActive ? "scale(1.07)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <Music size={48} />
            </div>
          )}

          {/* Dark gradient for legibility */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,5,8,0.45) 0%, transparent 35%, transparent 55%, rgba(5,5,8,0.55) 100%)",
            }}
          />

          {/* Number badge */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              minWidth: "28px",
              height: "28px",
              padding: "0 8px",
              borderRadius: "50px",
              background: "rgba(5,5,8,0.6)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(139,92,246,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Genre badge */}
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "4px 10px",
              borderRadius: "50px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              background: "rgba(5,5,8,0.6)",
              backdropFilter: "blur(6px)",
              color: "#06B6D4",
              border: "1px solid rgba(6,182,212,0.4)",
            }}
          >
            {beat.genre}
          </span>

          {/* Play button (center) — preview only, does NOT trigger the buy link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(beat);
            }}
            aria-label={isActive && isPlaying ? "Pausar" : "Reproducir"}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${hovered || isActive ? 1 : 0.85})`,
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              border: "2px solid rgba(255,255,255,0.25)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: isActive ? "0 0 30px rgba(168,85,247,0.9)" : "0 6px 20px rgba(0,0,0,0.5)",
              opacity: hovered || isActive ? 1 : 0.85,
              transition: "all 0.25s ease",
            }}
          >
            {isActive && isPlaying && (
              <div
                style={{
                  position: "absolute",
                  inset: "-6px",
                  borderRadius: "50%",
                  border: "2px solid rgba(168,85,247,0.6)",
                  animation: "pulse-ring 1.5s ease-out infinite",
                }}
              />
            )}
            {isActive && isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: "3px" }} />}
          </button>

          {/* Buy hint on hover (hidden while the playing waveform is shown) */}
          {hovered && !(isActive && isPlaying) && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "50px",
                background: "rgba(5,5,8,0.78)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(6,182,212,0.5)",
                color: "#06B6D4",
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              <ShoppingCart size={12} /> COMPRAR EN BEATSTARS
            </div>
          )}

          {/* Animated waveform overlay along the bottom when playing */}
          {isActive && isPlaying && (
            <div
              style={{
                position: "absolute",
                bottom: "8px",
                left: "10px",
                right: "10px",
                display: "flex",
                alignItems: "flex-end",
                gap: "2px",
                height: "22px",
              }}
            >
              {WAVE_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: "2px",
                    background: "linear-gradient(to top, #8B5CF6, #06B6D4)",
                    height: `${h}%`,
                    animation: `waveBar 0.6s ${i * 80}ms ease-in-out infinite`,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Beat name → product page */}
        <a
          href={beat.beatstarsUrl || BEATSTARS_FALLBACK}
          target="_blank"
          rel="noopener noreferrer"
          title={beat.name}
          style={{ textDecoration: "none" }}
        >
          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "16px",
              fontWeight: 700,
              color: "#F1F5F9",
              letterSpacing: "0.5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLHeadingElement).style.color = "#A855F7")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLHeadingElement).style.color = "#F1F5F9")}
          >
            {beat.name}
          </h3>
        </a>

        {/* Genre + BPM */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "50px",
              fontSize: "11px",
              fontWeight: 600,
              background: "rgba(139,92,246,0.15)",
              color: "#A855F7",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <Tag size={10} />
            {beat.genre}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "50px",
              fontSize: "11px",
              fontWeight: 600,
              background: "rgba(6,182,212,0.1)",
              color: "#06B6D4",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            <Music size={10} />
            {beat.bpm} BPM
          </span>
        </div>

        {/* Price + Buy button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#A855F7",
              textShadow: "0 0 10px rgba(168,85,247,0.5)",
            }}
          >
            {beat.price}
          </span>
          <a
            href={beat.beatstarsUrl || BEATSTARS_FALLBACK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 18px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 0 12px rgba(139,92,246,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 25px rgba(168,85,247,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 12px rgba(139,92,246,0.4)";
            }}
          >
            <ShoppingCart size={12} /> COMPRAR
          </a>
        </div>
      </div>
    </div>
  );
}
