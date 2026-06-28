"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import BeatCard from "./BeatCard";
import BeatCarousel from "./BeatCarousel";
import AudioPlayer from "./AudioPlayer";
import AudioPlayerSkeleton from "./AudioPlayerSkeleton";
import WhatsAppFloat from "./WhatsAppFloat";
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

export default function BeatGrid() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isBeatstarsMode, setIsBeatstarsMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Load the full catalog once (cached) so we can split Old School vs general
  useEffect(() => {
    fetch(`/api/beats?all=1`)
      .then((r) => r.json())
      .then((data: BeatsResponse) => {
        const list = data.beats ?? [];
        setBeats(list);
        setIsDemoMode(data.mode === "demo");
        setIsBeatstarsMode(data.mode === "beatstars");
        if (list.length > 0) {
          const rndIdx = Math.floor(Math.random() * Math.min(list.length, 8));
          setCurrentBeat(list[rndIdx]);
          setIsPlaying(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los beats.");
        setLoading(false);
      });
  }, []);

  const oldSchool = useMemo(() => beats.filter((b) => beatMatchesStyle(b, "Old School")), [beats]);
  const general = beats;

  const handlePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) setIsPlaying(!isPlaying);
    else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const renderGrid = (list: Beat[]) => {
    if (isMobile) {
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

      {/* ===== OLD SCHOOL section (separated) ===== */}
      {(loading || oldSchool.length > 0) && (
        <div style={{ marginBottom: "72px" }}>
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
          {!loading && oldSchool.length > TEASER_SIZE && (
            <VerTodos href={`/beats?style=${encodeURIComponent("Old School")}`} label="Ver todos los Old School" />
          )}
        </div>
      )}

      {/* ===== General catalog teaser ===== */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span
            style={{
              padding: "8px 18px",
              borderRadius: "50px",
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.4)",
              color: "#A855F7",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "2px",
            }}
          >
            TODOS LOS BEATS
          </span>
          <span style={{ color: "rgba(241,245,249,0.45)", fontSize: "13px" }}>
            {!loading && `${general.length} disponibles`}
          </span>
        </div>
        {renderGrid(general)}
        {!loading && general.length > 0 && <VerTodos href="/beats" label="Ver todos los beats" />}
      </div>

      {loading ? (
        <AudioPlayerSkeleton />
      ) : (
        <AudioPlayer
          currentBeat={currentBeat}
          beats={beats}
          isPlaying={isPlaying}
          onPlayingChange={setIsPlaying}
          onBeatChange={(beat) => {
            setCurrentBeat(beat);
            setIsPlaying(true);
          }}
        />
      )}
      <WhatsAppFloat playerActive={!!currentBeat} />
    </section>
  );
}
