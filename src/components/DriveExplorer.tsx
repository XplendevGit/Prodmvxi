"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HardDrive, ChevronRight, ArrowLeft, Play, Pause,
  Music, FileText, ExternalLink,
} from "lucide-react";
import type { DriveItem, DriveListing } from "@/lib/googleDrive";
import type { Beat } from "@/lib/beatFilters";
import { usePlayer } from "./player/PlayerProvider";

interface Crumb {
  id: string;   // "" = root
  name: string;
}

const GENRES = ["Trap", "Hip-Hop", "Drill", "Afrobeat", "Reggaeton", "Reggaetón", "R&B", "Boom Bap", "Lo-Fi", "Dembow"];

/** Pretty-print an audio filename → { title, bpm, genre }. */
function parseAudio(filename: string): { title: string; bpm: string | null; genre: string | null } {
  const base = filename.replace(/\.[^.]+$/, "");
  const bpm = base.match(/(\d{2,3})\s*bpm/i)?.[1] ?? null;
  const genre = GENRES.find((g) => base.toLowerCase().includes(g.toLowerCase())) ?? null;
  const title = base
    .replace(/\s*[-·|]\s*\d{2,3}\s*bpm\s*/i, " ")
    .replace(new RegExp(`\\s*[-·|]\\s*(${GENRES.join("|")})\\s*`, "i"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { title: title || base, bpm, genre };
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / 1_000_000;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`;
}

/** Convert a Drive audio item into a Beat the shared AudioPlayer can stream. */
function driveItemToBeat(item: DriveItem): Beat {
  const meta = parseAudio(item.name);
  const url = `/api/drive/audio?id=${encodeURIComponent(item.id)}`;
  return {
    id: item.id,
    name: meta.title,
    bpm: meta.bpm ?? "—",
    genre: meta.genre ?? "Drive",
    price: "",
    previewUrl: url,
    streamUrl: url,
    isHls: false,
    waveformUrl: null,
    artwork: null,
  };
}

export default function DriveExplorer({ initialListing }: { initialListing?: DriveListing }) {
  const [path, setPath] = useState<Crumb[]>([{ id: "", name: initialListing?.folderName ?? "Beats" }]);
  const [items, setItems] = useState<DriveItem[]>(initialListing?.items ?? []);
  const [mode, setMode] = useState<"drive" | "demo" | null>(initialListing?.mode ?? null);
  const [loading, setLoading] = useState(!initialListing);
  const [error, setError] = useState(false);

  const player = usePlayer();
  const firstRun = useRef(true);
  const current = path[path.length - 1];

  // ── Fetch on navigation. The root folder ships from the server (initialListing)
  //    so the catalog renders instantly even in in-app browsers (no client fetch). ─
  useEffect(() => {
    const isFirst = firstRun.current;
    firstRun.current = false;
    if (isFirst && initialListing) return; // root already server-rendered

    let cancelled = false;
    setLoading(true);
    setError(false);
    const qs = current.id ? `?folderId=${encodeURIComponent(current.id)}` : "";
    fetch(`/api/drive${qs}`)
      .then((r) => r.json() as Promise<DriveListing>)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setMode(data.mode);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  const openFolder = useCallback((item: DriveItem) => {
    setPath((p) => [...p, { id: item.id, name: item.name }]);
  }, []);

  const goTo = useCallback((index: number) => {
    setPath((p) => p.slice(0, index + 1));
  }, []);

  const folders = items.filter((i) => i.type === "folder");
  const files = items.filter((i) => i.type !== "folder");

  // Play a Drive audio file through the SHARED bottom player (exactly like the
  // catalog beats), streamed via our /api/drive/audio proxy. The folder's audio
  // files become the prev/next queue. Only real Drive (not demo) can stream.
  const canPlay = mode === "drive";
  const handlePlayFile = useCallback(
    (item: DriveItem) => {
      if (!canPlay) return;
      const queue = files.filter((f) => f.type === "audio").map(driveItemToBeat);
      player.play(driveItemToBeat(item), queue);
    },
    [canPlay, files, player]
  );

  return (
    <section
      id="drive"
      style={{
        position: "relative",
        padding: "110px 20px 70px",
        background: "radial-gradient(ellipse at 50% 0%, #160a33 0%, #0a0618 45%, #050508 100%)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow accents */}
      <div className="drv-orb drv-orb-a" />
      <div className="drv-orb drv-orb-b" />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "7px 16px", borderRadius: "50px", marginBottom: "18px",
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)",
              color: "#A855F7", fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
            }}
          >
            <HardDrive size={14} />
            El estudio de Maxi
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 6vw, 60px)", fontWeight: 900, letterSpacing: "2px",
              color: "#F1F5F9", margin: "0 0 14px", textTransform: "uppercase",
              textShadow: "0 0 40px rgba(139,92,246,0.5)",
            }}
          >
            Carpeta de Beats
          </h2>
          <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "15px", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Explora el catálogo completo tal cual está organizado en el Drive de Prod. Mvxii.
            Entra a las carpetas y dale play a los beats.
          </p>
        </div>

        {/* ── Drive window chrome ── */}
        <div
          style={{
            background: "rgba(13,13,26,0.72)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "20px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Top bar: traffic lights + path + mode badge */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "13px 18px", borderBottom: "1px solid rgba(139,92,246,0.18)",
              background: "linear-gradient(180deg, rgba(139,92,246,0.08), transparent)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "7px", flexShrink: 0 }}>
              {["#EC4899", "#F59E0B", "#06B6D4"].map((c) => (
                <span key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}88` }} />
              ))}
            </div>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1, minWidth: 0, overflow: "hidden", flexWrap: "nowrap" }}>
              {path.map((crumb, i) => {
                const last = i === path.length - 1;
                return (
                  <span key={crumb.id || "root"} style={{ display: "inline-flex", alignItems: "center", gap: "4px", minWidth: 0 }}>
                    {i > 0 && <ChevronRight size={13} style={{ color: "rgba(241,245,249,0.3)", flexShrink: 0 }} />}
                    <button
                      onClick={() => !last && goTo(i)}
                      disabled={last}
                      className="drv-crumb"
                      style={{
                        background: "none", border: "none", padding: "3px 6px", borderRadius: "6px",
                        cursor: last ? "default" : "pointer",
                        color: last ? "#F1F5F9" : "rgba(168,85,247,0.85)",
                        fontWeight: last ? 700 : 600, fontSize: "13px",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "190px",
                      }}
                    >
                      {crumb.name}
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Mode badge — only the positive "live" state is ever shown publicly */}
            {mode === "drive" && (
              <span
                style={{
                  flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 11px", borderRadius: "50px", fontSize: "10px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                  background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.4)",
                }}
              >
                <span className="drv-live-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />
                En vivo · Drive
              </span>
            )}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid rgba(139,92,246,0.1)" }}>
            <button
              onClick={() => path.length > 1 && goTo(path.length - 2)}
              disabled={path.length <= 1}
              className="drv-back"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "none", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "8px",
                padding: "6px 12px", fontSize: "12px", fontWeight: 600,
                color: path.length <= 1 ? "rgba(241,245,249,0.25)" : "rgba(241,245,249,0.7)",
                cursor: path.length <= 1 ? "default" : "pointer", transition: "all 0.15s",
              }}
            >
              <ArrowLeft size={14} /> Atrás
            </button>
            <span style={{ fontSize: "12px", color: "rgba(241,245,249,0.4)" }}>
              {loading ? "Cargando…" : `${folders.length} carpeta${folders.length === 1 ? "" : "s"} · ${files.length} archivo${files.length === 1 ? "" : "s"}`}
            </span>
          </div>

          {/* ── Grid ── */}
          <div style={{ padding: "22px 18px 26px", minHeight: "260px" }}>
            {loading ? (
              <div className="drv-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="drv-skel" style={{ animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(241,245,249,0.5)" }}>
                No se pudo cargar la carpeta. Intenta de nuevo.
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(241,245,249,0.45)" }}>
                <Music size={34} style={{ opacity: 0.4, marginBottom: "12px" }} />
                <p style={{ margin: 0 }}>Esta carpeta está vacía.</p>
              </div>
            ) : (
              <div className="drv-grid">
                {folders.map((item) => (
                  <FolderCard key={item.id} item={item} onOpen={() => openFolder(item)} />
                ))}
                {files.map((item) => (
                  <FileCard
                    key={item.id}
                    item={item}
                    playing={player.currentBeat?.id === item.id && player.isPlaying}
                    canPlay={canPlay && item.type === "audio"}
                    onPlay={() => handlePlayFile(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .drv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
          gap: 16px;
        }
        @media (max-width: 520px) {
          .drv-grid { grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 12px; }
        }
        .drv-crumb:not(:disabled):hover { background: rgba(139,92,246,0.12); color: #C084FC; }
        .drv-back:not(:disabled):hover { border-color: rgba(139,92,246,0.6); background: rgba(139,92,246,0.1); color: #fff; }
        .drv-card {
          position: relative; border-radius: 14px; cursor: pointer;
          border: 1px solid rgba(139,92,246,0.18); background: rgba(20,16,40,0.5);
          padding: 18px 14px 14px; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          animation: drvIn 0.5s ease both;
        }
        .drv-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168,85,247,0.55);
          box-shadow: 0 14px 34px rgba(0,0,0,0.5), 0 0 26px rgba(139,92,246,0.3);
        }
        .drv-folder .drv-folico { transition: transform 0.25s ease; }
        .drv-folder:hover .drv-folico { transform: translateY(-3px) scale(1.04) rotate(-2deg); }
        .drv-playbtn { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .drv-card:hover .drv-playbtn { transform: scale(1.08); box-shadow: 0 0 22px rgba(168,85,247,0.85); }
        .drv-skel {
          height: 150px; border-radius: 14px;
          background: linear-gradient(110deg, rgba(139,92,246,0.06) 25%, rgba(139,92,246,0.16) 45%, rgba(139,92,246,0.06) 65%);
          background-size: 220% 100%; animation: drvShimmer 1.4s ease-in-out infinite;
        }
        .drv-live-dot { animation: drvPulse 1.6s ease-in-out infinite; }
        .drv-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; z-index: 0; }
        .drv-orb-a { width: 360px; height: 360px; background: rgba(139,92,246,0.16); top: -120px; left: -80px; }
        .drv-orb-b { width: 320px; height: 320px; background: rgba(6,182,212,0.12); bottom: -120px; right: -60px; }
        @keyframes drvIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drvShimmer { 0% { background-position: 220% 0; } 100% { background-position: -220% 0; } }
        @keyframes drvPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.5); } }
        @keyframes drvBars { 0%,100% { height: 28%; } 50% { height: 92%; } }
      `}</style>
    </section>
  );
}

// ── Folder card ──────────────────────────────────────────────────────────────
function FolderCard({ item, onOpen }: { item: DriveItem; onOpen: () => void }) {
  return (
    <div className="drv-card drv-folder" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
    >
      <div className="drv-folico" style={{ position: "relative", width: "76px", height: "60px", marginBottom: "12px" }}>
        {/* Folder back tab */}
        <div style={{ position: "absolute", top: 0, left: "6px", width: "38px", height: "14px", borderRadius: "6px 6px 0 0", background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }} />
        {/* Folder body */}
        <div style={{
          position: "absolute", top: "9px", left: 0, width: "76px", height: "51px", borderRadius: "8px",
          background: "linear-gradient(150deg, #A855F7 0%, #7C3AED 55%, #4C1D95 100%)",
          boxShadow: "0 6px 18px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Music size={20} style={{ color: "rgba(255,255,255,0.85)" }} />
        </div>
        {/* Glow shine */}
        <div style={{ position: "absolute", top: "9px", left: 0, width: "76px", height: "22px", borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent)" }} />
      </div>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#F1F5F9", width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.name}
      </div>
      <div style={{ fontSize: "10px", color: "rgba(168,85,247,0.7)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>
        Carpeta
      </div>
    </div>
  );
}

// ── File card (audio + generic) ──────────────────────────────────────────────
function FileCard({
  item, playing, canPlay, onPlay,
}: { item: DriveItem; playing: boolean; canPlay: boolean; onPlay: () => void }) {
  const isAudio = item.type === "audio";
  const meta = isAudio ? parseAudio(item.name) : null;

  return (
    <div className="drv-card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Visual header */}
      <div style={{
        position: "relative", height: "70px", borderRadius: "10px", marginBottom: "12px", overflow: "hidden",
        background: isAudio
          ? "linear-gradient(135deg, #2D1B69, #4C1D95)"
          : "linear-gradient(135deg, #1e293b, #0f172a)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {isAudio ? (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "32px" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} style={{
                width: "4px", borderRadius: "2px", background: i % 2 ? "#06B6D4" : "#A855F7",
                height: playing ? "28%" : `${30 + ((i * 17) % 60)}%`,
                animation: playing ? `drvBars 0.7s ${i * 90}ms ease-in-out infinite` : "none",
              }} />
            ))}
          </div>
        ) : (
          <FileText size={26} style={{ color: "rgba(241,245,249,0.55)" }} />
        )}

        {isAudio && (
          <button
            onClick={onPlay}
            aria-label={playing ? "Pausar" : "Reproducir"}
            title={canPlay ? "" : "Disponible al conectar Drive"}
            className="drv-playbtn"
            style={{
              position: "absolute", right: "8px", bottom: "8px",
              width: "32px", height: "32px", borderRadius: "50%", border: "none",
              cursor: canPlay ? "pointer" : "not-allowed", opacity: canPlay ? 1 : 0.55,
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 14px rgba(139,92,246,0.6)",
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} style={{ marginLeft: "2px" }} />}
          </button>
        )}
      </div>

      {/* Name */}
      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#F1F5F9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {meta ? meta.title : item.name}
      </div>

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px", flexWrap: "wrap" }}>
        {meta?.genre && (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#06B6D4", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "4px", padding: "1px 5px" }}>
            {meta.genre}
          </span>
        )}
        {meta?.bpm && (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#A855F7", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: "4px", padding: "1px 5px" }}>
            {meta.bpm} BPM
          </span>
        )}
        <span style={{ fontSize: "10px", color: "rgba(241,245,249,0.4)", marginLeft: "auto" }}>
          {formatSize(item.size)}
        </span>
      </div>

      {/* Open in Drive */}
      {item.viewUrl && (
        <a
          href={item.viewUrl} target="_blank" rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "9px", fontSize: "10.5px", color: "rgba(168,85,247,0.75)", textDecoration: "none" }}
        >
          <ExternalLink size={11} /> Abrir en Drive
        </a>
      )}
    </div>
  );
}
