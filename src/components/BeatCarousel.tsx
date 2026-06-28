"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BeatCard from "./BeatCard";
import { Beat } from "@/lib/beatFilters";

interface Props {
  beats: Beat[];
  loading?: boolean;
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlay: (beat: Beat) => void;
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#0D0D1A",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid rgba(139,92,246,0.1)",
      }}
    >
      <div className="skeleton" style={{ width: "100%", aspectRatio: "1/1", borderRadius: "12px", marginBottom: "14px" }} />
      <div className="skeleton" style={{ width: "70%", height: "18px", borderRadius: "4px", marginBottom: "12px" }} />
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <div className="skeleton" style={{ width: "60px", height: "22px", borderRadius: "50px" }} />
        <div className="skeleton" style={{ width: "70px", height: "22px", borderRadius: "50px" }} />
      </div>
      <div className="skeleton" style={{ height: "36px", borderRadius: "10px", marginBottom: "8px" }} />
      <div className="skeleton" style={{ height: "36px", borderRadius: "10px" }} />
    </div>
  );
}

export default function BeatCarousel({ beats, loading, currentBeat, isPlaying, onPlay }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const getCardWidth = useCallback(() => {
    if (!scrollRef.current) return 300;
    // 84vw card + 12px gap
    return scrollRef.current.offsetWidth * 0.84 + 12;
  }, []);

  const scrollToIdx = useCallback(
    (idx: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.min(Math.max(0, idx), beats.length - 1);
      isScrolling.current = true;
      el.scrollTo({ left: clamped * getCardWidth(), behavior: "smooth" });
      setActiveIdx(clamped);
      setTimeout(() => { isScrolling.current = false; }, 400);
    },
    [beats.length, getCardWidth]
  );

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isScrolling.current) return;
    const w = getCardWidth();
    if (!w) return;
    const idx = Math.round(scrollRef.current.scrollLeft / w);
    setActiveIdx(Math.min(Math.max(0, idx), beats.length - 1));
  }, [beats.length, getCardWidth]);

  // When currently playing beat changes externally (prev/next), scroll carousel to it
  useEffect(() => {
    if (!currentBeat) return;
    const idx = beats.findIndex((b) => b.id === currentBeat.id);
    if (idx >= 0 && idx !== activeIdx) scrollToIdx(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBeat?.id]);

  if (loading) {
    return (
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "12px", padding: "8px 24px 16px" }}>
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} style={{ minWidth: "84%", flexShrink: 0, opacity: 1 - i * 0.35 }}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!beats.length) return null;

  return (
    <div style={{ position: "relative", userSelect: "none", WebkitUserSelect: "none" }}>
      {/* ── Fade edge hints ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: "32px",
          width: "64px",
          background: "linear-gradient(to right, transparent, rgba(5,5,8,0.85))",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: "32px",
          width: "32px",
          background: "linear-gradient(to left, transparent, rgba(5,5,8,0.85))",
          pointerEvents: "none",
          zIndex: 4,
          opacity: activeIdx > 0 ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Scroll container ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="beat-carousel-scroll"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "8px 24px 12px",
          cursor: "grab",
        }}
      >
        {beats.map((beat, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={beat.id}
              style={{
                minWidth: "84%",
                maxWidth: "84%",
                scrollSnapAlign: "center",
                flexShrink: 0,
                transform: isActive ? "scale(1)" : "scale(0.94)",
                opacity: isActive ? 1 : 0.65,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                filter: isActive ? "none" : "blur(0.4px)",
              }}
            >
              <BeatCard
                beat={beat}
                index={i}
                isPlaying={isPlaying}
                isActive={currentBeat?.id === beat.id}
                onPlay={onPlay}
              />
            </div>
          );
        })}
      </div>

      {/* ── Navigation arrows ── */}
      {activeIdx > 0 && (
        <button
          onClick={() => scrollToIdx(activeIdx - 1)}
          aria-label="Anterior"
          style={{
            position: "absolute",
            left: "4px",
            top: "45%",
            transform: "translateY(-50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(139,92,246,0.6)",
            color: "#A855F7",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(139,92,246,0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(168,85,247,0.8)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(139,92,246,0.5)"; }}
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {activeIdx < beats.length - 1 && (
        <button
          onClick={() => scrollToIdx(activeIdx + 1)}
          aria-label="Siguiente"
          style={{
            position: "absolute",
            right: "4px",
            top: "45%",
            transform: "translateY(-50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(13,13,26,0.95)",
            border: "1px solid rgba(139,92,246,0.6)",
            color: "#A855F7",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(139,92,246,0.5)",
            backdropFilter: "blur(10px)",
            zIndex: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(168,85,247,0.8)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(139,92,246,0.5)"; }}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* ── Counter badge ── */}
      <div
        style={{
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(241,245,249,0.35)",
          letterSpacing: "1px",
          marginBottom: "8px",
        }}
      >
        <span style={{ color: "#A855F7" }}>{activeIdx + 1}</span>
        <span style={{ opacity: 0.4 }}> / {beats.length}</span>
      </div>

      {/* ── Dot indicators ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          paddingBottom: "4px",
        }}
      >
        {beats.map((_, i) => {
          const isActive = i === activeIdx;
          // Only show dots around current index (max 9 visible)
          const half = 4;
          if (beats.length > 9 && Math.abs(i - activeIdx) > half) return null;
          return (
            <button
              key={i}
              onClick={() => scrollToIdx(i)}
              aria-label={`Beat ${i + 1}`}
              style={{
                width: isActive ? "22px" : i === activeIdx - 1 || i === activeIdx + 1 ? "8px" : "5px",
                height: "6px",
                borderRadius: "3px",
                background: isActive
                  ? "linear-gradient(90deg, #A855F7, #06B6D4)"
                  : "rgba(139,92,246,0.28)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.35s ease",
                boxShadow: isActive ? "0 0 10px rgba(168,85,247,0.8), 0 0 20px rgba(6,182,212,0.4)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Hide scrollbar in webkit */}
      <style>{`.beat-carousel-scroll::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
