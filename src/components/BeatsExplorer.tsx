"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, ArrowLeft, Music2, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import BeatCard from "./BeatCard";
import BeatCarousel from "./BeatCarousel";
import AudioPlayer from "./AudioPlayer";
import WhatsAppFloat from "./WhatsAppFloat";
import Vinyl from "./Vinyl";
import {
  Beat,
  STYLES,
  ARTISTS,
  BPM_RANGES,
  SortKey,
  beatMatchesStyle,
  beatMatchesArtist,
  countOptions,
  bpmNumber,
} from "@/lib/beatFilters";

const PAGE_SIZE = 24;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recientes", label: "Más recientes" },
  { key: "bpm-asc", label: "BPM más bajo" },
  { key: "bpm-desc", label: "BPM más alto" },
  { key: "az", label: "Nombre (A–Z)" },
];

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 15px",
        borderRadius: "50px",
        fontSize: "12.5px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.18s",
        background: active ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "rgba(139,92,246,0.07)",
        color: active ? "#fff" : "rgba(241,245,249,0.7)",
        border: active ? "1px solid transparent" : "1px solid rgba(139,92,246,0.25)",
        boxShadow: active ? "0 0 16px rgba(139,92,246,0.5)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(168,85,247,0.7)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.25)";
      }}
    >
      {label}
      {count != null && <span style={{ opacity: 0.55, fontSize: "10.5px", marginLeft: "5px" }}>{count}</span>}
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontSize: "10.5px",
          fontWeight: 700,
          letterSpacing: "2px",
          color: "rgba(241,245,249,0.4)",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{children}</div>
    </div>
  );
}

export default function BeatsExplorer() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [bpmRange, setBpmRange] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recientes");
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    // Pre-select genre (?g=) or style (?style=) when arriving from the home links
    try {
      const params = new URLSearchParams(window.location.search);
      const g = params.get("g");
      const st = params.get("style");
      if (g) setGenre(g);
      if (st) setStyle(st);
    } catch {}

    fetch(`/api/beats?all=1`)
      .then((r) => r.json())
      .then((data) => {
        const list = data.beats ?? [];
        setBeats(list);
        if (list.length > 0) {
          const rndIdx = Math.floor(Math.random() * Math.min(list.length, 8));
          setCurrentBeat(list[rndIdx]);
          setIsPlaying(false);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Reset visible window whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, genre, style, artist, bpmRange, sort]);

  // Genre options with counts
  const genreOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of beats) counts.set(b.genre, (counts.get(b.genre) || 0) + 1);
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [beats]);

  const styleOptions = useMemo(() => countOptions(beats, STYLES), [beats]);
  const artistOptions = useMemo(() => countOptions(beats, ARTISTS), [beats]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = beats.filter((b) => {
      if (genre && b.genre !== genre) return false;
      if (style && !beatMatchesStyle(b, style)) return false;
      if (artist && !beatMatchesArtist(b, artist)) return false;
      if (bpmRange) {
        const r = BPM_RANGES.find((x) => x.label === bpmRange);
        if (r) {
          const n = bpmNumber(b);
          if (n < r.min || n > r.max) return false;
        }
      }
      if (q) {
        const hay = (b.name + " " + (b.tags || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list];
    switch (sort) {
      case "bpm-asc":
        list.sort((a, b) => bpmNumber(a) - bpmNumber(b));
        break;
      case "bpm-desc":
        list.sort((a, b) => bpmNumber(b) - bpmNumber(a));
        break;
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      // "recientes" keeps API order (newest first)
    }
    return list;
  }, [beats, genre, style, artist, bpmRange, search, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeCount =
    (genre ? 1 : 0) + (style ? 1 : 0) + (artist ? 1 : 0) + (bpmRange ? 1 : 0) + (search ? 1 : 0);

  const clearAll = () => {
    setGenre(null);
    setStyle(null);
    setArtist(null);
    setBpmRange(null);
    setSearch("");
  };

  const handlePlay = (beat: Beat) => {
    if (currentBeat?.id === beat.id) setIsPlaying(!isPlaying);
    else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };

  const shownArtists = showAllArtists ? artistOptions : artistOptions.slice(0, 8);

  return (
    <div style={{ background: "#050508", minHeight: "100vh", paddingBottom: currentBeat ? "100px" : 0 }}>
      {/* ===== HERO ===== */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "40px 24px 60px",
          background:
            "linear-gradient(120deg, #050508, #160a2e, #0a0a14, #1a0b2e)",
          backgroundSize: "300% 300%",
          animation: "auroraShift 18s ease infinite",
          borderBottom: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        {/* Back link */}
        <div style={{ maxWidth: "1280px", margin: "0 auto 24px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "rgba(241,245,249,0.6)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            <ArrowLeft size={16} /> VOLVER AL INICIO
          </Link>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Vinyl — front & center, the focal point */}
          <div style={{ animation: "scaleIn 0.6s ease both", marginBottom: "28px" }}>
            <Vinyl size={260} spinning={isPlaying} />
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "50px",
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.3)",
              color: "#A855F7",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "16px",
            }}
          >
            CATÁLOGO COMPLETO
          </div>
          <h1
            className="glitch-text"
            data-text="TODOS LOS BEATS"
            style={{
              fontSize: "clamp(40px, 8vw, 84px)",
              fontWeight: 900,
              letterSpacing: "2px",
              color: "#F1F5F9",
              margin: "0 0 12px 0",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            TODOS LOS{" "}
            <span style={{ color: "#A855F7", textShadow: "0 0 40px rgba(168,85,247,0.7)" }}>BEATS</span>
          </h1>
          <p style={{ color: "rgba(241,245,249,0.55)", fontSize: "15px", marginBottom: "28px" }}>
            {loading
              ? "Cargando el arsenal completo de Prod. Mvxii…"
              : `${beats.length} beats listos para tu próximo hit. Filtra por género, estilo, artista o BPM.`}
          </p>

          {/* Enhanced search */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "560px",
            }}
          >
            {/* Animated glow ring */}
            <div
              style={{
                position: "absolute",
                inset: "-2px",
                borderRadius: "50px",
                background: "linear-gradient(90deg, #8B5CF6, #06B6D4, #EC4899, #8B5CF6)",
                backgroundSize: "300% 100%",
                opacity: searchFocused ? 1 : 0,
                filter: "blur(8px)",
                animation: searchFocused ? "auroraShift 4s linear infinite" : "none",
                transition: "opacity 0.3s",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 22px",
                borderRadius: "50px",
                background: "rgba(13,13,26,0.92)",
                border: `1px solid ${searchFocused ? "rgba(168,85,247,0.8)" : "rgba(139,92,246,0.35)"}`,
                backdropFilter: "blur(10px)",
                transition: "border-color 0.3s",
              }}
            >
              <Search size={20} color={searchFocused ? "#06B6D4" : "#A855F7"} style={{ transition: "color 0.3s", flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Busca por nombre, artista (Cris MJ, Kidd Voodoo…) o estilo…"
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#F1F5F9",
                  fontSize: "15px",
                  minWidth: 0,
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "rgba(236,72,153,0.15)",
                    border: "none",
                    cursor: "pointer",
                    color: "#EC4899",
                    display: "flex",
                    borderRadius: "50%",
                    padding: "5px",
                    flexShrink: 0,
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILTERS + GRID ===== */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Filter panel */}
        <div
          style={{
            background: "rgba(13,13,26,0.6)",
            border: "1px solid rgba(139,92,246,0.18)",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "32px",
            animation: "slideDown 0.5s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#F1F5F9", fontWeight: 700, letterSpacing: "1px", fontSize: "14px" }}>
              <SlidersHorizontal size={18} color="#A855F7" /> FILTROS
              {activeCount > 0 && (
                <span style={{ fontSize: "11px", color: "#06B6D4", fontWeight: 600 }}>({activeCount} activos)</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              {/* Custom sort combobox */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: sortOpen
                      ? "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(6,182,212,0.15))"
                      : "rgba(139,92,246,0.1)",
                    color: "#F1F5F9",
                    border: `1px solid ${sortOpen ? "rgba(168,85,247,0.7)" : "rgba(139,92,246,0.3)"}`,
                    borderRadius: "50px",
                    padding: "9px 16px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: sortOpen ? "0 0 18px rgba(139,92,246,0.4)" : "none",
                  }}
                >
                  <ArrowUpDown size={14} color="#A855F7" />
                  {SORTS.find((s) => s.key === sort)?.label}
                  <ChevronDown
                    size={15}
                    style={{ transform: sortOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  />
                </button>

                {sortOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: "200px",
                      background: "rgba(13,13,26,0.98)",
                      border: "1px solid rgba(139,92,246,0.35)",
                      borderRadius: "14px",
                      padding: "6px",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.2)",
                      backdropFilter: "blur(16px)",
                      zIndex: 50,
                      animation: "scaleIn 0.15s ease both",
                      transformOrigin: "top right",
                    }}
                  >
                    {SORTS.map((s) => {
                      const active = s.key === sort;
                      return (
                        <button
                          key={s.key}
                          onClick={() => {
                            setSort(s.key);
                            setSortOpen(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            background: active ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "transparent",
                            color: active ? "#fff" : "rgba(241,245,249,0.75)",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: active ? 700 : 500,
                            textAlign: "left",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                          }}
                        >
                          {s.label}
                          {active && <Check size={15} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {activeCount > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#EC4899",
                    fontSize: "12.5px",
                    fontWeight: 700,
                  }}
                >
                  <X size={14} /> Limpiar
                </button>
              )}
            </div>
          </div>

          {!loading && (
            <>
              <FilterGroup title="Género">
                {genreOptions.map((g) => (
                  <Chip key={g.label} label={g.label} count={g.count} active={genre === g.label} onClick={() => setGenre(genre === g.label ? null : g.label)} />
                ))}
              </FilterGroup>

              {styleOptions.length > 0 && (
                <FilterGroup title="Estilo / Vibe">
                  {styleOptions.map((s) => (
                    <Chip key={s.label} label={s.label} count={s.count} active={style === s.label} onClick={() => setStyle(style === s.label ? null : s.label)} />
                  ))}
                </FilterGroup>
              )}

              {artistOptions.length > 0 && (
                <FilterGroup title="Type Beat (Artista)">
                  {shownArtists.map((a) => (
                    <Chip key={a.label} label={a.label} count={a.count} active={artist === a.label} onClick={() => setArtist(artist === a.label ? null : a.label)} />
                  ))}
                  {artistOptions.length > 8 && (
                    <button
                      onClick={() => setShowAllArtists((v) => !v)}
                      style={{
                        padding: "7px 15px",
                        borderRadius: "50px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                        background: "none",
                        color: "#06B6D4",
                        border: "1px dashed rgba(6,182,212,0.4)",
                      }}
                    >
                      {showAllArtists ? "− Menos" : `+ ${artistOptions.length - 8} más`}
                    </button>
                  )}
                </FilterGroup>
              )}

              <FilterGroup title="BPM">
                {BPM_RANGES.map((r) => (
                  <Chip key={r.label} label={r.label} active={bpmRange === r.label} onClick={() => setBpmRange(bpmRange === r.label ? null : r.label)} />
                ))}
              </FilterGroup>
            </>
          )}
        </div>

        {/* Result count */}
        {!loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", color: "rgba(241,245,249,0.6)", fontSize: "14px" }}>
            <Music2 size={16} color="#A855F7" />
            <strong style={{ color: "#F1F5F9" }}>{filtered.length}</strong> beats encontrados
            {activeCount > 0 && <span style={{ color: "rgba(241,245,249,0.35)" }}>· filtrados de {beats.length}</span>}
          </div>
        )}

        {/* Grid / Carousel */}
        {isMobile ? (
          <BeatCarousel
            beats={visible}
            loading={loading}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onPlay={handlePlay}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "20px" }}>
            {loading
              ? Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="skeleton" style={{ height: "260px", borderRadius: "16px" }} />
                ))
              : visible.map((beat, index) => (
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
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(241,245,249,0.5)" }}>
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>Ningún beat coincide con esos filtros 🎧</p>
            <button onClick={clearAll} style={{ color: "#A855F7", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700 }}>
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Load more */}
        {!loading && hasMore && (
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <p style={{ color: "rgba(241,245,249,0.4)", fontSize: "13px", marginBottom: "18px" }}>
              Mostrando {visible.length} de {filtered.length}
            </p>
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              style={{
                padding: "14px 44px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 25px rgba(139,92,246,0.5)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(168,85,247,0.8)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 25px rgba(139,92,246,0.5)")}
            >
              Ver más beats
            </button>
          </div>
        )}
      </section>

      <AudioPlayer
        currentBeat={currentBeat}
        beats={filtered}
        isPlaying={isPlaying}
        onPlayingChange={setIsPlaying}
        onBeatChange={(beat) => {
          setCurrentBeat(beat);
          setIsPlaying(true);
        }}
      />
      <WhatsAppFloat playerActive={!!currentBeat} />
    </div>
  );
}
