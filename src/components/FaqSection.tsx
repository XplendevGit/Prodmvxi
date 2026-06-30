import type { FaqItem } from "@/lib/seo";

// Visible FAQ rendered server-side with native <details> so the answers live in
// the HTML (collapsed or not) — readable by Google rich results AND by AI engines
// (GEO). The same items feed the FAQPage JSON-LD in page.tsx.
export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Cómo comprar beats de Prod. Mvxii?",
    a: "Puedes escuchar el catálogo completo en este sitio y comprar cada beat directamente en BeatStars (beatstars.com/prodmvxii) o escribiendo por WhatsApp al +56 9 3290 7119. Elige la licencia que necesites (Basic, Standard, Premium o Exclusiva), paga de forma segura y descargas el beat al instante.",
  },
  {
    q: "¿Qué licencias de beats existen y cuál necesito?",
    a: "Hay cuatro licencias: Basic (MP3, desde 21,99 USD), Standard (MP3 + WAV, uso comercial), Premium (MP3 + WAV + Stems, la más popular) y Exclusiva (propiedad total del beat, precio a negociar). Si recién empiezas, la Basic o Standard suelen bastar; si buscas máxima calidad y stems para mezcla, elige Premium; si quieres ser el único dueño del beat, la Exclusiva.",
  },
  {
    q: "¿Los beats sirven para Spotify, YouTube y plataformas digitales?",
    a: "Sí. Con la licencia adecuada puedes publicar tu canción en Spotify, YouTube, Apple Music y todas las plataformas digitales, respetando los límites de streams y el crédito a Prod. Mvxii indicados en cada licencia. La licencia Exclusiva no requiere crédito.",
  },
  {
    q: "¿Hacen type beats al estilo de Cris MJ, Kidd Voodoo o Floyymenor?",
    a: "Sí. El catálogo incluye type beats inspirados en referentes del urbano chileno y latino como Cris MJ, Kidd Voodoo, Floyymenor, Jere Klein, Jairo Vera, Pailita y más. Puedes filtrar el catálogo por artista (type beat), género, estilo y BPM en la sección Beats.",
  },
  {
    q: "¿Qué géneros produce Prod. Mvxii?",
    a: "Prod. Mvxii produce trap, reggaetón, drill, afrobeat, hip-hop, boom bap, dembow y R&B, incluyendo subestilos como perreo, malianteo, old school y romántico. Es música urbana actual pensada para artistas emergentes y consolidados.",
  },
  {
    q: "¿Desde qué países puedo comprar los beats?",
    a: "Prod. Mvxii es un productor de Chile que vende beats online a artistas de todo el mundo: Chile, Latinoamérica, España, Estados Unidos y donde estés. La compra y descarga es 100% digital a través de BeatStars o WhatsApp.",
  },
  {
    q: "¿Puedo pedir un beat personalizado?",
    a: "Sí. Si buscas un beat a medida (custom) con un mood, BPM o estilo específico, escríbenos por WhatsApp al +56 9 3290 7119 o por el formulario de contacto y coordinamos tu beat personalizado.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      style={{
        padding: "90px 24px",
        background: "linear-gradient(180deg, #050508 0%, #0A0814 50%, #050508 100%)",
      }}
    >
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              color: "#A855F7",
              textTransform: "uppercase",
              fontWeight: 600,
              margin: "0 0 12px",
            }}
          >
            Preguntas frecuentes
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 900,
              letterSpacing: "2px",
              color: "#F1F5F9",
              margin: 0,
              textTransform: "uppercase",
              textShadow: "0 0 30px rgba(139,92,246,0.4)",
            }}
          >
            Sobre los beats de Prod. Mvxii
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              style={{
                background: "#0D0D1A",
                border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "14px",
                padding: "18px 22px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#F1F5F9",
                  listStyle: "none",
                }}
              >
                {item.q}
              </summary>
              <p
                style={{
                  marginTop: "14px",
                  marginBottom: 0,
                  color: "rgba(241,245,249,0.72)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
