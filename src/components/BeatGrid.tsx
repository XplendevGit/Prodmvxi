"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import BeatCard from "./BeatCard";
import BeatCarousel from "./BeatCarousel";
import { usePlayer } from "./player/PlayerProvider";
import { Beat, beatMatchesStyle } from "@/lib/beatFilters";

interface BeatsResponse {
  beats: Beat[];
  total?: number;
  hasMore: boolean;
  mode: "beatstars" | "drive" | "demo";
}

const TEASER_SIZE = 8;
const QUICK_GENRES = ["Reggaeton", "Trap", "Hip-Hop", "Afrobeat"];

function SkeletonCard() {
  return (
    <div style={{ background: "#0D0D1A", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139,92,246,0.1)" }}>
      <div className="skeleton" style={{ width: "100%", aspectRatio: "1/1", borderRadius: "12px", marginBottom: "14px" }} />
      <div className="skeleton" style={{ width: "70%", height: "18px", borderRadius: "4px", marginBottom: "12px" }} />
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <div className="skeleton" style={{ width: "60px", height: "22px", borderRadius: "50px" }} />
        <div className="skeleton" style={{ width: "70px", height: "22px", borderRadius: "50px" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "60px", height: "24px", borderRadius: "4px" }} />
        <div className="skeleton" style={{ width: "80px", height: "32px", borderRadius: "50px" }} />
      </div>
    </div>
  );
}

interface BeatGridProps {
  /** Server-rendered teaser beats (in the HTML — works in in-app browsers + SEO). */
  initialBeats?: Beat[];
  initialMode?: "beatstars" | "drive" | "demo";
}

export default function BeatGrid({ initialBeats = [], initialMode }: BeatGridProps) {
  const player = usePlayer();
  const { currentBeat, isPlaying } = player;
  const [beats, setBeats] = useState<Beat[]>(initialBeats);
  const [loading, setLoading] = useState(initialBeats.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(initialMode === "demo");
  const [isBeatstarsMode, setIsBeatstarsMode] = useState(initialMode === "beatstars");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Upgrade the SSR teaser to the FULL catalog (for Old School split + counts).
  // If this fails (e.g. an in-app browser blocks the fetch) the SSR beats stay.
  useEffect(() => {
    fetch(`/api/beats?all=1`)
      .then((r) => r.json())
      .then((data: BeatsResponse) => {
        const list = data.beats ?? [];
        if (list.length > 0) {
          setBeats(list);
          setIsDemoMode(data.mode === "demo");
          setIsBeatstarsMode(data.mode === "beatstars");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        if (initialBeats.length === 0) setError("No se pudieron cargar los beats.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Feature a beat in the shared player once we have data (ready, not playing).
  useEffect(() => {
    if (beats.length > 0) {
      player.feature(beats[Math.floor(Math.random() * Math.min(beats.length, 8))], beats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beats]);

  const oldSchool = useMemo(() => beats.filter((b) => beatMatchesStyle(b, "Old School")), [beats]);

  const handlePlay = (beat: Beat) => player.play(beat, beats);

  const renderGrid = (list: Beat[]) => {
    if (mounted && isMobile) {
      return (
        <BeatCarousel
          beats={list.slice(0, TEASER_SIZE)}
          loading={loading}
          currentBeat={currentBeat}
          isPlaying={isPlaying}
          onPlay={handlePlay}
        />
      );
    }
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {loading
          ? Array.from({ length: TEASER_SIZE }, (_, i) => <SkeletonCard key={i} />)
          : list.slice(0, TEASER_SIZE).map((beat, index) => (
              <BeatCard
                key={beat.id}
                beat={beat}
                index={index}
                isPlaying={isPlaying}
                isActive={currentBeat?.id === beat.id}
                onPlay={handlePlay}
              />
            ))}
      </div>
    );
  };

  const VerTodos = ({ href, label }: { href: string; label: string }) => (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 40px",
          borderRadius: "50px",
          background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 800,
          letterSpacing: "2px",
          textTransform: "uppercase",
          textDecoration: "none",
          boxShadow: "0 0 30px rgba(139,92,246,0.5)",
        }}
      >
        {label} <ArrowRight size={18} />
      </Link>
    </div>
  );

  return (
    <section
      id="beats"
      style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto", paddingBottom: currentBeat ? "120px" : "80px" }}
    >
      {/* ===== Section header ===== */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 className="glitch-text" data-text="MIS BEATS" style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, letterSpacing: "4px", color: "#F1F5F9", margin: "0 0 12px 0", textTransform: "uppercase" }}>
          MIS <span style={{ color: "#A855F7", textShadow: "0 0 30px rgba(168,85,247,0.6)" }}>BEATS</span>
        </h2>
        <div style={{ width: "80px", height: "3px", background: "linear-gradient(90deg, #8B5CF6, #06B6D4)", margin: "0 auto 16px", borderRadius: "3px", boxShadow: "0 0 15px rgba(139,92,246,0.6)" }} />
        <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "14px", letterSpacing: "1px" }}>Una probada del catálogo — dale PLAY para escuchar</p>

        {currentBeat && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 20px",
              borderRadius: "50px",
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.35)",
              color: "#A855F7",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}>
              {isPlaying ? (
                <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  {[1, 2, 3].map((i) => (
                    <span key={i} style={{ display: "inline-block", width: "3px", height: `${6 + i * 3}px`, background: "#A855F7", borderRadius: "2px", animation: `waveBar 0.6s ${i * 120}ms ease-in-out infinite` }} />
                  ))}
                </span>
              ) : (
                <span>▶</span>
              )}
              {isPlaying ? "SONANDO:" : "LISTO:"} {currentBeat.name}
            </div>
          </div>
        )}
      </div>

      {/* Quick genre links → full explorer */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "48px" }}>
        {QUICK_GENRES.map((g) => (
          <Link
            key={g}
            href={`/beats?g=${encodeURIComponent(g)}`}
            style={{
              padding: "8px 18px",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              color: "rgba(241,245,249,0.7)",
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            {g}
          </Link>
        ))}
      </div>

      {error && (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(241,245,249,0.5)", fontSize: "16px" }}>{error}</div>
      )}

      {/* ===== OLD SCHOOL section ===== */}
      {(loading || oldSchool.length > 0) && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.12))",
                border: "1px solid rgba(245,158,11,0.45)",
                color: "#F59E0B",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "2px",
              }}
            >
              <Clock size={15} /> OLD SCHOOL
            </span>
            <span style={{ color: "rgba(241,245,249,0.45)", fontSize: "13px" }}>
              El sonido clásico del reggaetón {!loading && `· ${oldSchool.length} beats`}
            </span>
          </div>
          {renderGrid(oldSchool)}
        </div>
      )}

      {/* Single CTA → full catalog + search (optimizes vertical space) */}
      {!loading && beats.length > 0 && (
        <VerTodos href="/beats" label="Ver todas las canciones" />
      )}
    </section>
  );
}
