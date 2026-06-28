"use client";

interface VinylProps {
  size?: number;
  spinning?: boolean;
  label?: string;
  logoSrc?: string;
}

/**
 * Animated vinyl record. Spins continuously; spins faster + glows when `spinning`.
 * Pure CSS/SVG, no external assets.
 */
export default function Vinyl({
  size = 220,
  spinning = false,
  label = "PROD. MVXII",
  logoSrc = "/Logo_Maxi.jpeg",
}: VinylProps) {
  const center = size / 2;
  const labelR = center * 0.34;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        filter: spinning
          ? "drop-shadow(0 0 40px rgba(168,85,247,0.7))"
          : "drop-shadow(0 0 20px rgba(139,92,246,0.35))",
        transition: "filter 0.5s",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          animation: `vinylSpin ${spinning ? "1.8s" : "8s"} linear infinite`,
          transformOrigin: "center",
        }}
      >
        <defs>
          <radialGradient id="vinylBody" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="55%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#050508" />
          </radialGradient>
          <radialGradient id="vinylLabel" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="60%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#4C1D95" />
          </radialGradient>
          <linearGradient id="vinylShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.12)" />
          </linearGradient>
        </defs>

        {/* Disc body */}
        <circle cx={center} cy={center} r={center} fill="url(#vinylBody)" />

        {/* Grooves */}
        {Array.from({ length: 14 }, (_, i) => {
          const r = center - 10 - i * ((center - 50) / 14);
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="rgba(139,92,246,0.08)"
              strokeWidth={i % 3 === 0 ? 1.4 : 0.6}
            />
          );
        })}

        {/* Reflection sweep */}
        <circle cx={center} cy={center} r={center - 4} fill="url(#vinylShine)" />

        {/* Center label background */}
        <circle cx={center} cy={center} r={labelR} fill="url(#vinylLabel)" />

        {/* Maxi logo, clipped to the label circle (rotates with the disc) */}
        <defs>
          <clipPath id="labelClip">
            <circle cx={center} cy={center} r={labelR - 2} />
          </clipPath>
        </defs>
        <image
          href={logoSrc}
          x={center - (labelR - 2)}
          y={center - (labelR - 2)}
          width={(labelR - 2) * 2}
          height={(labelR - 2) * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#labelClip)"
        />

        {/* Label ring */}
        <circle
          cx={center}
          cy={center}
          r={labelR}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />

        {/* Spindle hole */}
        <circle cx={center} cy={center} r={size * 0.02} fill="#050508" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <title>{label}</title>
      </svg>

      {/* Tonearm */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          right: "2%",
          width: size * 0.42,
          height: size * 0.42,
          pointerEvents: "none",
          transform: spinning ? "rotate(0deg)" : "rotate(-18deg)",
          transformOrigin: "top right",
          transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#06B6D4",
            boxShadow: "0 0 10px rgba(6,182,212,0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "2px",
            height: "70%",
            background: "linear-gradient(180deg, #94A3B8, #475569)",
            transformOrigin: "top",
            transform: "rotate(35deg)",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}
