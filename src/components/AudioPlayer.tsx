"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Hls from "hls.js";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

interface Beat {
  id: string;
  name: string;
  bpm: string;
  genre: string;
  price: string;
  previewUrl: string | null;
  streamUrl?: string | null;
  waveformUrl?: string | null;
  artwork?: string | null;
  isHls?: boolean;
  isDemoMode?: boolean;
  isBeatstarsMode?: boolean;
}

const WAVE_BARS = 88;
const waveformCache = new Map<string, number[]>();

function downsampleWaveform(data: number[], n: number): number[] {
  const chunk = Math.floor(data.length / n) || 1;
  const bars: number[] = [];
  for (let i = 0; i < n; i++) {
    let max = 0;
    for (let j = 0; j < chunk; j++) {
      const v = Math.abs(data[i * chunk + j] || 0);
      if (v > max) max = v;
    }
    bars.push(max);
  }
  const peak = Math.max(...bars, 1);
  return bars.map((b) => Math.max(0.07, b / peak));
}

// Deterministic synthetic waveform — looks like real music, unique per beat
function generateWaveform(seed: string, n: number): number[] {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (((h << 5) + h) ^ seed.charCodeAt(i)) >>> 0;
  }
  const raw: number[] = [];
  for (let i = 0; i < n; i++) {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0);
    h = (Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0);
    raw.push((h >>> 0) / 0xffffffff);
  }
  // 3-pass smooth to make it look musical
  let s = [...raw];
  for (let pass = 0; pass < 3; pass++) {
    s = s.map((v, i) => {
      const a = s[Math.max(0, i - 2)];
      const b = s[Math.max(0, i - 1)];
      const c = v;
      const d = s[Math.min(n - 1, i + 1)];
      const e = s[Math.min(n - 1, i + 2)];
      return (a * 0.1 + b * 0.2 + c * 0.4 + d * 0.2 + e * 0.1);
    });
  }
  const min = Math.min(...s);
  const max = Math.max(...s);
  return s.map((v) => 0.08 + ((v - min) / (max - min || 1)) * 0.92);
}

interface AudioPlayerProps {
  currentBeat: Beat | null;
  beats: Beat[];
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  onBeatChange: (beat: Beat) => void;
}

const THUMB_BARS = [30, 70, 45, 90, 55, 80, 40, 65];

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  currentBeat,
  beats,
  isPlaying,
  onPlayingChange,
  onBeatChange,
}: AudioPlayerProps) {
  const [progress, setProgress] = useState(0); // 0–100
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragFrac, setDragFrac] = useState<number | null>(null);
  const [hoverFrac, setHoverFrac] = useState<number | null>(null);
  const [showVol, setShowVol] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const waveRef = useRef<HTMLDivElement>(null);
  isPlayingRef.current = isPlaying;

  // Synthetic waveform unique per beat (deterministic)
  const synthWaveform = useMemo(
    () => (currentBeat ? generateWaveform(currentBeat.id, WAVE_BARS) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBeat?.id]
  );

  const displayWaveform = waveform ?? synthWaveform;
  // While dragging: use dragFrac for instant feedback; otherwise use audio progress
  const displayFrac = isDragging && dragFrac !== null ? dragFrac : progress / 100;

  // ── Waveform data fetch ──────────────────────────────────────────────────
  useEffect(() => {
    const url = currentBeat?.waveformUrl;
    const id = currentBeat?.id;
    if (!url || !id) { setWaveform(null); return; }
    if (waveformCache.has(id)) { setWaveform(waveformCache.get(id)!); return; }
    let cancelled = false;
    setWaveform(null);
    fetch(url)
      .then((r) => r.json())
      .then((d: { data?: number[] }) => {
        if (cancelled || !Array.isArray(d.data)) return;
        const bars = downsampleWaveform(d.data, WAVE_BARS);
        waveformCache.set(id!, bars);
        setWaveform(bars);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [currentBeat?.id, currentBeat?.waveformUrl]);

  // ── Audio events ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => { onPlayingChange(false); setProgress(0); setCurrentTime(0); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onPlayingChange, isDragging]);

  // ── HLS / source ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat) return;
    const src = currentBeat.streamUrl || currentBeat.previewUrl || "";
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const isHls = currentBeat.isHls || src.endsWith(".m3u8");
    if (src && isHls) {
      if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        audio.src = src; audio.load();
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src); hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlayingRef.current) audio.play().catch(() => {});
        });
        hlsRef.current = hls;
      }
    } else if (src) {
      audio.src = src; audio.load();
    }
    setProgress(0); setCurrentTime(0); setDuration(0);
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [currentBeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {}); else audio.pause();
  }, [isPlaying, currentBeat]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // ── Seek helpers ──────────────────────────────────────────────────────────
  const getFrac = useCallback((clientX: number) => {
    const rect = waveRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }, []);

  const commitSeek = useCallback(
    (frac: number) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      audio.currentTime = frac * duration;
      setProgress(frac * 100);
      setCurrentTime(frac * duration);
    },
    [duration]
  );

  // ── Global drag listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      setDragFrac(getFrac(x));
    };
    const onUp = (e: MouseEvent | TouchEvent) => {
      const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      commitSeek(getFrac(x));
      setIsDragging(false);
      setDragFrac(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging, getFrac, commitSeek]);

  // ── Nav ───────────────────────────────────────────────────────────────────
  const handlePrev = () => {
    const idx = beats.findIndex((b) => b.id === currentBeat?.id);
    if (idx > 0) onBeatChange(beats[idx - 1]);
  };
  const handleNext = () => {
    const idx = beats.findIndex((b) => b.id === currentBeat?.id);
    if (idx < beats.length - 1) onBeatChange(beats[idx + 1]);
  };

  if (!currentBeat) return null;

  const pct = displayFrac * 100;
  const hoverTime = hoverFrac !== null ? hoverFrac * duration : null;

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          background: "rgba(5,5,8,0.97)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 -8px 48px rgba(139,92,246,0.18), 0 -1px 0 rgba(6,182,212,0.1)",
        }}
      >
        {/* ══ WAVEFORM SCRUBBER ══════════════════════════════════════════════ */}
        <div
          ref={waveRef}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            setDragFrac(getFrac(e.clientX));
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            setDragFrac(getFrac(e.touches[0].clientX));
          }}
          onMouseMove={(e) => setHoverFrac(getFrac(e.clientX))}
          onMouseLeave={() => setHoverFrac(null)}
          style={{
            position: "relative",
            height: "54px",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            WebkitUserSelect: "none",
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          {/* ── Base bars (unplayed) ── */}
          <div
            style={{
              position: "absolute",
              inset: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: "1.5px",
              pointerEvents: "none",
            }}
          >
            {displayWaveform.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.round(h * 100)}%`,
                  minHeight: "3px",
                  borderRadius: "2px",
                  background: "rgba(139,92,246,0.18)",
                }}
              />
            ))}
          </div>

          {/* ── Played bars (clip-path mask) ── */}
          <div
            style={{
              position: "absolute",
              inset: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: "1.5px",
              pointerEvents: "none",
              clipPath: `inset(0 ${100 - pct}% 0 0)`,
              transition: isDragging ? "none" : "clip-path 0.08s linear",
              willChange: "clip-path",
            }}
          >
            {displayWaveform.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.round(h * 100)}%`,
                  minHeight: "3px",
                  borderRadius: "2px",
                  background: `linear-gradient(180deg,
                    hsl(${195 - i * 0.5}deg 100% 60%) 0%,
                    hsl(${270 - i * 0.5}deg 80% 65%) 100%)`,
                  boxShadow: "0 0 4px rgba(6,182,212,0.5)",
                }}
              />
            ))}
          </div>

          {/* ── Hover ghost highlight ── */}
          {hoverFrac !== null && !isDragging && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `calc(${hoverFrac * 100}% + 16px)`,
                width: "1px",
                background: "rgba(255,255,255,0.25)",
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />
          )}

          {/* ── Glowing playhead ── */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `calc(${pct}% + 16px * ${1 - pct / 100})`,
              transform: "translate(-50%, -50%)",
              transition: isDragging ? "none" : "left 0.08s linear",
              pointerEvents: "none",
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer glow ring (when playing) */}
            {isPlaying && !isDragging && (
              <div
                style={{
                  position: "absolute",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(168,85,247,0.15)",
                  animation: "playhead-pulse 1.8s ease-out infinite",
                }}
              />
            )}
            {/* Line */}
            <div
              style={{
                position: "absolute",
                top: "-27px",
                bottom: "-27px",
                width: "2px",
                background: "linear-gradient(180deg, transparent, #A855F7 20%, #06B6D4 50%, #A855F7 80%, transparent)",
                boxShadow: "0 0 10px rgba(168,85,247,0.9), 0 0 20px rgba(6,182,212,0.5)",
                borderRadius: "2px",
              }}
            />
            {/* Center dot */}
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #fff 30%, #A855F7 70%)",
                boxShadow:
                  "0 0 0 2px rgba(168,85,247,0.4), 0 0 14px rgba(168,85,247,1), 0 0 28px rgba(6,182,212,0.6)",
                zIndex: 3,
              }}
            />
          </div>

          {/* ── Hover time tooltip ── */}
          {hoverFrac !== null && hoverTime !== null && duration > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                left: `calc(${hoverFrac * 100}% + 16px * ${1 - hoverFrac})`,
                transform: "translateX(-50%)",
                background: "rgba(13,13,26,0.92)",
                border: "1px solid rgba(139,92,246,0.4)",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "11px",
                fontWeight: 700,
                color: "#A855F7",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                letterSpacing: "0.5px",
                backdropFilter: "blur(8px)",
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* ══ CONTROLS ROW ═══════════════════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 20px 14px",
          }}
        >
          {/* Beat artwork + info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2D1B69, #4C1D95)",
                border: "1px solid rgba(139,92,246,0.4)",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {currentBeat.artwork ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentBeat.artwork}
                    alt={currentBeat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {isPlaying && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: "2px",
                        padding: "5px 3px",
                        background: "rgba(5,5,8,0.4)",
                      }}
                    >
                      {THUMB_BARS.slice(0, 4).map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: "3px",
                            height: `${h}%`,
                            borderRadius: "2px",
                            background: "#06B6D4",
                            animation: `waveBar 0.6s ${i * 100}ms ease-in-out infinite`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: "2px" }}>
                  {THUMB_BARS.slice(0, 5).map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: "3px",
                        height: `${h}%`,
                        borderRadius: "2px",
                        background: "#A855F7",
                        ...(isPlaying ? { animation: `waveBar 0.6s ${i * 100}ms ease-in-out infinite` } : {}),
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  letterSpacing: "0.3px",
                }}
              >
                {currentBeat.name}
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                <span style={{ fontSize: "11px", color: "rgba(241,245,249,0.45)" }}>
                  {currentBeat.genre} · {currentBeat.bpm} BPM
                </span>
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    background: "rgba(6,182,212,0.12)",
                    color: "#06B6D4",
                    border: "1px solid rgba(6,182,212,0.25)",
                  }}
                >
                  PREVIEW
                </span>
              </div>
            </div>
          </div>

          {/* Playback controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,245,249,0.5)", padding: "6px", borderRadius: "8px", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A855F7"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(241,245,249,0.5)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <SkipBack size={19} />
            </button>

            <button
              onClick={() => onPlayingChange(!isPlaying)}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: isPlaying
                  ? "0 0 24px rgba(139,92,246,0.8), 0 0 48px rgba(139,92,246,0.3)"
                  : "0 0 16px rgba(139,92,246,0.5)",
                transition: "box-shadow 0.3s",
                position: "relative",
                flexShrink: 0,
              }}
            >
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-5px",
                    borderRadius: "50%",
                    border: "2px solid rgba(168,85,247,0.35)",
                    animation: "pulse-ring 1.5s ease-out infinite",
                  }}
                />
              )}
              {isPlaying ? <Pause size={19} /> : <Play size={19} style={{ marginLeft: "2px" }} />}
            </button>

            <button
              onClick={handleNext}
              aria-label="Siguiente"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,245,249,0.5)", padding: "6px", borderRadius: "8px", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A855F7"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(241,245,249,0.5)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <SkipForward size={19} />
            </button>
          </div>

          {/* Time display */}
          <div
            style={{
              fontSize: "12px",
              color: "rgba(241,245,249,0.55)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              minWidth: "72px",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#A855F7", fontWeight: 700 }}>{formatTime(currentTime)}</span>
            <span style={{ opacity: 0.4 }}> / </span>
            {formatTime(duration)}
          </div>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }} className="vol-ctrl">
            <button
              onClick={() => { setMuted(!muted); setShowVol(!showVol); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: muted ? "rgba(241,245,249,0.3)" : "rgba(241,245,249,0.6)", padding: "6px", borderRadius: "8px", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A855F7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = muted ? "rgba(241,245,249,0.3)" : "rgba(241,245,249,0.6)"; }}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="vol-slider">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                style={{ width: "72px", accentColor: "#8B5CF6", cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes playhead-pulse {
            0%   { transform: scale(0.8); opacity: 0.8; }
            60%  { transform: scale(2.4); opacity: 0; }
            100% { transform: scale(2.4); opacity: 0; }
          }

          @media (max-width: 640px) {
            .vol-ctrl .vol-slider { display: none; }
          }
          @media (max-width: 480px) {
            .vol-ctrl { display: none !important; }
          }
        `}</style>
      </div>
    </>
  );
}
