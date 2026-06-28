import LicenseCard from "./LicenseCard";

const LICENSES = [
  {
    name: "BASIC",
    price: "$21.99",
    priceNote: "MP3 — licencia de entrada",
    color: "#94A3B8",
    glowColor: "#64748B",
    features: [
      { text: "Descarga MP3 (320kbps)", included: true },
      { text: "2,500 streams (Spotify, etc.)", included: true },
      { text: "500 descargas digitales", included: true },
      { text: "1 video musical", included: true },
      { text: "Distribución no comercial", included: true },
      { text: "Crédito requerido: Prod. Mvxii", included: true },
      { text: "Distribución comercial", included: false },
      { text: "Archivos WAV/Stems", included: false },
      { text: "Radio broadcasting", included: false },
    ],
    beatstarsUrl: "https://www.beatstars.com/prodmvxii",
  },
  {
    name: "STANDARD",
    price: "$32.99",
    priceNote: "MP3 + WAV — licencia comercial",
    color: "#06B6D4",
    glowColor: "#0891B2",
    features: [
      { text: "Descarga MP3 + WAV", included: true },
      { text: "150,000 streams", included: true },
      { text: "2,500 descargas digitales", included: true },
      { text: "1 video musical", included: true },
      { text: "Uso comercial permitido", included: true },
      { text: "Crédito requerido: Prod. Mvxii", included: true },
      { text: "Radio broadcasting limitado", included: true },
      { text: "Archivos Stems / Trackout", included: false },
      { text: "Propiedad exclusiva", included: false },
    ],
    beatstarsUrl: "https://www.beatstars.com/prodmvxii",
  },
  {
    name: "PREMIUM",
    price: "$49.99",
    priceNote: "MP3 + WAV + Stems — MÁS POPULAR",
    color: "#A855F7",
    glowColor: "#7C3AED",
    badge: "MÁS POPULAR",
    features: [
      { text: "Descarga MP3 + WAV + Stems", included: true },
      { text: "Streams ilimitados", included: true },
      { text: "Descargas ilimitadas", included: true },
      { text: "Videos musicales ilimitados", included: true },
      { text: "Uso comercial completo", included: true },
      { text: "Radio: hasta 500 emisoras", included: true },
      { text: "Distribución global", included: true },
      { text: "Crédito requerido: Prod. Mvxii", included: true },
      { text: "Propiedad exclusiva", included: false },
    ],
    beatstarsUrl: "https://www.beatstars.com/prodmvxii",
  },
  {
    name: "EXCLUSIVE",
    price: "Hacer oferta",
    priceNote: "Propiedad total — precio a negociar",
    color: "#F59E0B",
    glowColor: "#D97706",
    features: [
      { text: "Todos los archivos (MP3/WAV/Stems)", included: true },
      { text: "Streams y descargas ILIMITADOS", included: true },
      { text: "Propiedad total del beat", included: true },
      { text: "Sin crédito requerido", included: true },
      { text: "Eliminado de la tienda", included: true },
      { text: "Radio y TV ilimitados", included: true },
      { text: "Distribución global ilimitada", included: true },
      { text: "Sync licensing incluido", included: true },
      { text: "Soporte prioritario directo", included: true },
    ],
    beatstarsUrl: "https://www.beatstars.com/prodmvxii",
  },
];

export default function Licenses() {
  return (
    <section
      id="licencias"
      style={{
        padding: "100px 24px",
        background: "linear-gradient(180deg, #050508 0%, #0D0820 50%, #050508 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 20px",
              borderRadius: "50px",
              background: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#A855F7",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "20px",
            }}
          >
            BEATSTARS LICENSING
          </span>

          <h2
            className="glitch-text"
            data-text="LICENCIAS"
            style={{
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900,
              letterSpacing: "6px",
              color: "#F1F5F9",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              textShadow: "0 0 30px rgba(139,92,246,0.5)",
            }}
          >
            LICENCIAS
          </h2>

          <div
            style={{
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
              margin: "0 auto 20px",
              borderRadius: "3px",
            }}
          />

          <p
            style={{
              color: "rgba(241,245,249,0.5)",
              fontSize: "15px",
              maxWidth: "500px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Elige el plan perfecto para tu carrera musical.
            <br />
            Todos los beats disponibles en{" "}
            <a
              href="https://www.beatstars.com/prodmvxii"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#A855F7", textDecoration: "none" }}
            >
              BeatStars.com/prodmvxii
            </a>
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {LICENSES.map((tier, index) => (
            <LicenseCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "48px",
            color: "rgba(241,245,249,0.3)",
            fontSize: "12px",
            letterSpacing: "0.5px",
          }}
        >
          * Los precios son referenciales. Visita Beatstars para precios actualizados.
          Todos los beats incluyen licencia para uso personal mientras no se especifique lo contrario.
        </p>
      </div>
    </section>
  );
}
