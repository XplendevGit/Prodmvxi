"use client";

import { useState, useRef, useEffect } from "react";
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

const WAVE_BARS = 64;
// In-memory cache so each track's waveform is fetched at most once per session
const waveformCache = new Map<string, number[]>();

// Downsample a BeatStars audiowaveform JSON `data` array into N normalized bars (0–1)
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
  return bars.map((b) => Math.max(0.06, b / peak));
}

interface AudioPlayerProps {
  currentBeat: Beat | null;
  beats: Beat[];
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
  onBeatChange: (beat: Beat) => void;
}

const WAVE_HEIGHTS = [30, 70, 45, 90, 55, 80, 40, 65];

export default function AudioPlayer({
  currentBeat,
  beats,
  isPlaying,
  onPlayingChange,
  onBeatChange,
}: AudioPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Fetch + downsample the real waveform of the current beat (cached, one at a time)
  useEffect(() => {
    const url = currentBeat?.waveformUrl;
    const id = currentBeat?.id;
    if (!url || !id) {
      setWaveform(null);
      return;
    }
    if (waveformCache.has(id)) {
      setWaveform(waveformCache.get(id)!);
      return;
    }
    let cancelled = false;
    setWaveform(null);
    fetch(url)
      .then((r) => r.json())
      .then((d: { data?: number[] }) => {
        if (cancelled || !Array.isArray(d.data)) return;
        const bars = downsampleWaveform(d.data, WAVE_BARS);
        waveformCache.set(id, bars);
        setWaveform(bars);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentBeat?.id, currentBeat?.waveformUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMeta = () => setDuration(audio.duration);
    const onEnded = () => {
      onPlayingChange(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onPlayingChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentBeat) return;
    const src = currentBeat.streamUrl || currentBeat.previewUrl || "";

    // Clean up any previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHls = currentBeat.isHls || src.endsWith(".m3u8");

    if (src && isHls) {
      if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari / iOS: native HLS support
        audio.src = src;
        audio.load();
      } else if (Hls.isSupported()) {
        // Chrome / Firefox / Edge: use hls.js
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(audio);
        // Auto-play once the manifest is ready if playback was requested
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (isPlayingRef.current) audio.play().catch(() => {});
        });
        hlsRef.current = hls;
      }
    } else if (src) {
      // Direct audio file (Drive stream or demo)
      audio.src = src;
      audio.load();
    }

    setProgress(0);
    setCurrentTime(0);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentBeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentBeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * duration;
    setProgress(val);
  };

  // Seek by clicking anywhere on the waveform
  const handleWaveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = frac * duration;
    setProgress(frac * 100);
  };

  const handlePrev = () => {
    const idx = beats.findIndex((b) => b.id === currentBeat?.id);
    if (idx > 0) onBeatChange(beats[idx - 1]);
  };

  const handleNext = () => {
    const idx = beats.findIndex((b) => b.id === currentBeat?.id);
    if (idx < beats.length - 1) onBeatChange(beats[idx + 1]);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentBeat) return null;

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
          background: "rgba(5,5,8,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 -4px 40px rgba(139,92,246,0.2)",
          padding: "12px 24px",
        }}
      >
        {/* Real waveform (seekable) — falls back to a thin bar when unavailable */}
        {waveform ? (
          <div
            onClick={handleWaveClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              height: "40px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            {waveform.map((h, i) => {
              const barFrac = (i + 0.5) / waveform.length;
              const played = barFrac <= progress / 100;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.round(h * 100)}%`,
                    minHeight: "2px",
                    borderRadius: "1px",
                    background: played
                      ? "linear-gradient(180deg, #06B6D4, #8B5CF6)"
                      : "rgba(139,92,246,0.22)",
                    boxShadow: played ? "0 0 6px rgba(139,92,246,0.6)" : "none",
                    transition: "background 0.15s, box-shadow 0.15s",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "3px",
                background: "rgba(139,92,246,0.2)",
                borderRadius: "3px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: `${progress}%`,
                height: "3px",
                background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
                borderRadius: "3px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                boxShadow: "0 0 8px rgba(139,92,246,0.8)",
                transition: "width 0.1s linear",
              }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              style={{
                position: "relative",
                width: "100%",
                height: "16px",
                opacity: 0,
                cursor: "pointer",
                margin: 0,
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Beat info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #2D1B69, #4C1D95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(139,92,246,0.4)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {currentBeat.artwork ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentBeat.artwork}
                    alt={currentBeat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
                        padding: "5px",
                        background: "rgba(5,5,8,0.35)",
                      }}
                    >
                      {WAVE_HEIGHTS.slice(0, 4).map((h, i) => (
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
                <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "28px" }}>
                  {WAVE_HEIGHTS.slice(0, 5).map((h, i) => (
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
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentBeat.name}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "rgba(241,245,249,0.5)" }}>
                  {currentBeat.genre} • {currentBeat.bpm} BPM
                </span>
                <span
                  style={{
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    background: "rgba(6,182,212,0.15)",
                    color: "#06B6D4",
                    border: "1px solid rgba(6,182,212,0.3)",
                  }}
                >
                  PREVIEW
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={handlePrev}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,245,249,0.6)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#A855F7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,245,249,0.6)")}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={() => onPlayingChange(!isPlaying)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: "0 0 20px rgba(139,92,246,0.6)",
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              {isPlaying && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    borderRadius: "50%",
                    border: "2px solid rgba(168,85,247,0.4)",
                    animation: "pulse-ring 1.5s infinite",
                  }}
                />
              )}
              {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: "2px" }} />}
            </button>

            <button
              onClick={handleNext}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,245,249,0.6)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#A855F7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(241,245,249,0.6)")}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Time */}
          <div style={{ fontSize: "12px", color: "rgba(241,245,249,0.5)", fontFamily: "monospace", whiteSpace: "nowrap" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Volume */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="volume-control">
            <button
              onClick={() => setMuted(!muted)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,245,249,0.6)" }}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
              style={{ width: "80px", accentColor: "#8B5CF6" }}
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .volume-control { display: none !important; }
          }
        `}</style>
      </div>
    </>
  );
}
