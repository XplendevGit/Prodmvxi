import { ImageResponse } from "next/og";

// Auto-generates the 1200×630 social share image at /opengraph-image.
// Inherited by every route that doesn't define its own.
export const alt = "Prod. Mvxii — Beats Profesionales de Trap, Reggaetón y Drill";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 40%, #2D1B69 0%, #1a0e3a 35%, #050508 75%)",
          color: "#F1F5F9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: 6,
            textShadow: "0 0 40px rgba(139,92,246,0.8)",
          }}
        >
          PROD. MVXII
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 38,
            letterSpacing: 4,
            color: "#A855F7",
            textTransform: "uppercase",
          }}
        >
          Beats · Trap · Reggaetón · Drill · Afrobeat
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 28,
            color: "rgba(241,245,249,0.6)",
          }}
        >
          Comprar beats e instrumentales online · prodmvxii.com
        </div>
      </div>
    ),
    { ...size }
  );
}
