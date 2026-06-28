"use client";

import { useEffect, useRef, useMemo } from "react";

/* ─── Cycling status messages ─────────────────────────────────────── */
const MESSAGES = [
  "INICIANDO SISTEMA",
  "CARGANDO BEATS   ",
  "ANALIZANDO AUDIO ",
  "PREPARANDO STUDIO",
  "CASI LISTO  ...  ",
];

/* ─── Deterministic waveform shape for the skeleton ──────────────── */
const WAVE = [
  0.35, 0.52, 0.78, 0.61, 0.90, 0.70, 0.44, 0.83, 0.56, 0.74,
  0.64, 0.47, 0.92, 0.53, 0.68, 0.85, 0.39, 0.60, 0.95, 0.51,
  0.76, 0.49, 0.87, 0.62, 0.79, 0.54, 0.43, 0.72, 0.58, 0.88,
  0.66, 0.45, 0.81, 0.57, 0.70, 0.93, 0.48, 0.63, 0.84, 0.55,
];

export default function AudioPlayerSkeleton() {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const scanLineRef  = useRef<HTMLDivElement>(null);
  const msgRef       = useRef<HTMLSpanElement>(null);
  const dotRef       = useRef<HTMLSpanElement>(null);

  /* ─── 60-fps scan animation (no React re-renders) ────────────────── */
  useEffect(() => {
    let raf: number;
    let t0: number | null = null;
    const SWEEP   = 2000; // ms per full sweep
    const MSG_INT = 1700; // ms per message
    let lastMsg = 0;
    let msgIdx  = 0;
    let dotCount = 0;

    const tick = (ts: number) => {
      if (t0 === null) { t0 = ts; lastMsg = ts; }

      /* Scan position 0-100 */
      const pct = ((ts - t0) % SWEEP) / SWEEP * 100;
      const p   = (v: number) => `${Math.min(100, Math.max(0, v)).toFixed(1)}%`;

      /* Update overlay gradient (mix-blend-mode: screen lights up the bars) */
      if (overlayRef.current) {
        overlayRef.current.style.background = [
          "linear-gradient(90deg,",
          "transparent 0%,",
          `rgba(139,92,246,0.04) ${p(pct - 22)},`,
          `rgba(139,92,246,0.22) ${p(pct - 11)},`,
          `rgba(6,182,212,0.55)  ${p(pct - 3.5)},`,
          `rgba(255,255,255,0.96) ${p(pct)},`,
          `rgba(168,85,247,0.55) ${p(pct + 3.5)},`,
          `rgba(168,85,247,0.20) ${p(pct + 11)},`,
          `transparent ${p(pct + 22)}`,
          ")",
        ].join(" ");
      }

      /* Move the sharp scan line div */
      if (scanLineRef.current) {
        scanLineRef.current.style.left = `${pct.toFixed(1)}%`;
      }

      /* Cycle message every MSG_INT ms */
      if (ts - lastMsg > MSG_INT) {
        msgIdx    = (msgIdx + 1) % MESSAGES.length;
        dotCount  = (dotCount + 1) % 4;
        if (msgRef.current) msgRef.current.textContent = MESSAGES[msgIdx];
        if (dotRef.current) dotRef.current.textContent = "·".repeat(dotCount + 1);
        lastMsg = ts;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* 80 bars using the repeating waveform pattern */
  const bars = useMemo(
    () => Array.from({ length: 80 }, (_, i) => WAVE[i % WAVE.length]),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: "rgba(5,5,8,0.97)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(139,92,246,0.2)",
        boxShadow: [
          "0 -6px 80px rgba(139,92,246,0.16)",
          "0 -1px 0   rgba(6,182,212,0.12)",
        ].join(","),
        animation: "skPlayerGlow 3s ease-in-out infinite",
      }}
    >

      {/* ══ RAINBOW SWEEP TOP BAR ══════════════════════════════════════ */}
      <div style={{ height: "2px", overflow: "hidden" }}>
        <div style={{
          width: "200%", height: "100%",
          background: "linear-gradient(90deg,#8B5CF6,#06B6D4,#EC4899,#A855F7,#8B5CF6,#06B6D4)",
          animation: "skRainbow 2.5s linear infinite",
        }} />
      </div>

      {/* ══ MAIN CONTENT ROW ═══════════════════════════════════════════ */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "13px 20px 15px",
        gap: "18px",
      }}>

        {/* ── LEFT: Studio status ──────────────────────────────────── */}
        <div
          className="sk-player-left"
          style={{ width: "168px", flexShrink: 0 }}
        >
          {/* EQ bars */}
          <div style={{
            display: "flex", alignItems: "flex-end",
            gap: "3px", height: "22px", marginBottom: "9px",
          }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{
                width: "4px", borderRadius: "2px",
                background: i % 2 === 0
                  ? "linear-gradient(180deg,#06B6D4,#8B5CF6)"
                  : "linear-gradient(180deg,#A855F7,#6D28D9)",
                animation: `equalizerB 0.75s ${i * 0.08}s ease-in-out infinite`,
              }} />
            ))}
          </div>

          {/* Brand line */}
          <div style={{
            fontSize: "9px", letterSpacing: "3px",
            color: "#8B5CF6", fontWeight: 800,
            textTransform: "uppercase", marginBottom: "5px",
          }}>
            ▶ PROD. MVXII
          </div>

          {/* Cycling status */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span ref={dotRef} style={{
              color: "#06B6D4", fontSize: "11px", fontWeight: 900,
              fontFamily: "monospace", letterSpacing: "1px",
              animation: "skDotBlink 0.6s step-end infinite",
            }}>·</span>
            <span ref={msgRef} style={{
              display: "block", fontSize: "9px", letterSpacing: "1.5px",
              color: "rgba(241,245,249,0.32)", fontWeight: 600,
              textTransform: "uppercase", fontFamily: "monospace",
            }}>
              {MESSAGES[0]}
            </span>
          </div>
        </div>

        {/* ── CENTER: Waveform scan zone ───────────────────────────── */}
        <div style={{ flex: 1, position: "relative", height: "52px" }}>

          {/* Base bars (dim) */}
          <div style={{
            position: "absolute", inset: "0",
            display: "flex", alignItems: "center", gap: "1.5px",
          }}>
            {bars.map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${Math.round(h * 100)}%`,
                background: "rgba(139,92,246,0.13)",
                borderRadius: "1px",
              }} />
            ))}
          </div>

          {/* Glow overlay — mix-blend-mode:screen lights up bars as scan passes */}
          <div
            ref={overlayRef}
            style={{
              position: "absolute", inset: 0,
              mixBlendMode: "screen",
              pointerEvents: "none",
              borderRadius: "2px",
            }}
          />

          {/* Sharp scan line */}
          <div
            ref={scanLineRef}
            style={{
              position: "absolute",
              top: "-6px", bottom: "-6px",
              width: "2px",
              left: "0%",
              background: "linear-gradient(180deg,transparent,#A855F7 20%,#fff 50%,#06B6D4 80%,transparent)",
              boxShadow: "0 0 8px rgba(168,85,247,0.9),0 0 20px rgba(6,182,212,0.5)",
              pointerEvents: "none",
            }}
          />

          {/* Progress rail — animated shimmer below waveform */}
          <div style={{
            position: "absolute", bottom: "-9px",
            left: 0, right: 0, height: "2px",
            background: "rgba(139,92,246,0.09)",
            borderRadius: "1px", overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: "35%",
              background: "linear-gradient(90deg,transparent,#A855F7,#06B6D4,transparent)",
              animation: "skRailSweep 1.8s linear infinite",
            }} />
          </div>
        </div>

        {/* ── RIGHT: Controls skeleton ─────────────────────────────── */}
        <div
          className="sk-player-right"
          style={{
            width: "130px", flexShrink: 0,
            display: "flex", alignItems: "center",
            justifyContent: "flex-end", gap: "13px",
          }}
        >
          {/* Prev */}
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.14)",
            animation: "skPulse 2.2s 0.3s ease-in-out infinite",
          }} />

          {/* Play button — triple expanding rings */}
          <div style={{ position: "relative", width: "46px", height: "46px", flexShrink: 0 }}>
            {/* Ring 1 — outermost */}
            <div style={{
              position: "absolute", inset: "0", borderRadius: "50%",
              border: "1.5px solid rgba(168,85,247,0.45)",
              animation: "skRing 2s 0s ease-out infinite",
            }} />
            {/* Ring 2 */}
            <div style={{
              position: "absolute", inset: "4px", borderRadius: "50%",
              border: "1.5px solid rgba(6,182,212,0.35)",
              animation: "skRing 2s 0.55s ease-out infinite",
            }} />
            {/* Ring 3 — innermost */}
            <div style={{
              position: "absolute", inset: "9px", borderRadius: "50%",
              border: "1.5px solid rgba(168,85,247,0.25)",
              animation: "skRing 2s 1.1s ease-out infinite",
            }} />
            {/* Core glow */}
            <div style={{
              position: "absolute", inset: "13px", borderRadius: "50%",
              background: "radial-gradient(circle,rgba(168,85,247,0.35),rgba(6,182,212,0.1))",
              animation: "skPulse 1.8s ease-in-out infinite",
            }} />
          </div>

          {/* Next */}
          <div style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: "rgba(139,92,246,0.07)",
            border: "1px solid rgba(139,92,246,0.14)",
            animation: "skPulse 2.2s 0.6s ease-in-out infinite",
          }} />
        </div>
      </div>

      {/* ══ KEYFRAMES ══════════════════════════════════════════════════ */}
      <style>{`
        @keyframes skRainbow {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes skRailSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes skPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.85; }
        }
        @keyframes skRing {
          0%   { transform: scale(1);    opacity: 0.75; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        @keyframes skDotBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0.2; }
        }
        @keyframes skPlayerGlow {
          0%, 100% { box-shadow: 0 -6px 80px rgba(139,92,246,0.16), 0 -1px 0 rgba(6,182,212,0.12); }
          50%       { box-shadow: 0 -6px 100px rgba(139,92,246,0.28), 0 -1px 0 rgba(6,182,212,0.22); }
        }

        /* Responsive: hide text column on small screens */
        @media (max-width: 560px) {
          .sk-player-left  { display: none !important; }
          .sk-player-right { width: auto !important; }
        }
      `}</style>
    </div>
  );
}
