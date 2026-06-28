"use client";

const SPOTIFY_PLAYLIST_ID = "1sV6fGJWBKIoZtVeH8Wc9H";
const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;

export default function SpotifySection() {
  return (
    <section
      id="spotify"
      style={{
        position: "relative",
        padding: "90px 24px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #050508, #07120c 50%, #050508)",
      }}
    >
      {/* Green glow accents (Spotify vibe) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 15% 30%, rgba(29,185,84,0.10), transparent 40%), radial-gradient(circle at 85% 70%, rgba(6,182,212,0.08), transparent 45%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Text side */}
          <div style={{ flex: "1 1 320px", minWidth: "300px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "50px",
                background: "rgba(29,185,84,0.15)",
                border: "1px solid rgba(29,185,84,0.4)",
                color: "#1DB954",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "2px",
                marginBottom: "20px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              LOS MÁS ESCUCHADOS
            </div>

            <h2
              style={{
                fontSize: "clamp(32px, 5.5vw, 56px)",
                fontWeight: 900,
                letterSpacing: "1px",
                color: "#F1F5F9",
                margin: "0 0 16px 0",
                lineHeight: 1.05,
                textTransform: "uppercase",
              }}
            >
              ÉXITOS EN{" "}
              <span style={{ color: "#1DB954", textShadow: "0 0 30px rgba(29,185,84,0.5)" }}>SPOTIFY</span>
            </h2>

            <p style={{ color: "rgba(241,245,249,0.55)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "440px" }}>
              Los beats de Prod. Mvxii que están sonando en todos lados. Dale play a la
              playlist con los temas más conocidos y reproducidos.
            </p>

            <a
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                borderRadius: "50px",
                background: "#1DB954",
                color: "#04130a",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 0 30px rgba(29,185,84,0.5)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 45px rgba(29,185,84,0.8)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(29,185,84,0.5)";
              }}
            >
              ▶ Abrir en Spotify
            </a>
          </div>

          {/* Embedded playlist */}
          <div
            style={{
              flex: "1 1 360px",
              minWidth: "300px",
              maxWidth: "440px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 0 50px rgba(29,185,84,0.25), 0 20px 50px rgba(0,0,0,0.5)",
              border: "1px solid rgba(29,185,84,0.25)",
            }}
          >
            <iframe
              title="Spotify — Prod. Mvxii"
              src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="420"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ display: "block", borderRadius: "16px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
