import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Prod. Mvxii",
  description: "Términos y condiciones de uso del sitio y de las licencias de beats de Prod. Mvxii.",
  alternates: { canonical: "/terminos" },
};

const LAST_UPDATED = "28 de junio de 2026";

export default function TerminosPage() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh", color: "#F1F5F9" }}>
      <StructuredData
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Términos y Condiciones", path: "/terminos" },
        ])}
      />
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #0D0820, #050508)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          padding: "80px 24px 48px",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "rgba(241,245,249,0.5)",
            fontSize: "13px",
            textDecoration: "none",
            marginBottom: "32px",
            transition: "color 0.2s",
          }}
        >
          ← Volver al inicio
        </Link>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 900,
            letterSpacing: "4px",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Términos y{" "}
          <span style={{ color: "#A855F7", textShadow: "0 0 30px rgba(168,85,247,0.6)" }}>
            Condiciones
          </span>
        </h1>
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #8B5CF6, #06B6D4)",
            margin: "0 auto 16px",
            borderRadius: "3px",
          }}
        />
        <p style={{ color: "rgba(241,245,249,0.4)", fontSize: "13px" }}>
          Última actualización: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "60px 24px 100px" }}>
        <style>{`
          .tc-section { margin-bottom: 48px; }
          .tc-section h2 {
            font-size: 18px; font-weight: 800; color: #A855F7;
            letter-spacing: 1px; text-transform: uppercase;
            margin: 0 0 16px; padding-bottom: 10px;
            border-bottom: 1px solid rgba(139,92,246,0.2);
          }
          .tc-section p, .tc-section li {
            color: rgba(241,245,249,0.65); font-size: 14px; line-height: 1.8;
          }
          .tc-section ul { padding-left: 20px; margin: 12px 0; }
          .tc-section li { margin-bottom: 8px; }
          .tc-section a { color: #A855F7; text-decoration: none; }
          .tc-section a:hover { text-decoration: underline; }
          .tc-highlight {
            background: rgba(139,92,246,0.08);
            border: 1px solid rgba(139,92,246,0.2);
            border-radius: 12px;
            padding: 16px 20px;
            margin: 16px 0;
          }
        `}</style>

        <div className="tc-section">
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio web de <strong>Prod. Mvxii</strong> (en adelante "el Sitio"), usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le rogamos que no utilice el Sitio.
          </p>
        </div>

        <div className="tc-section">
          <h2>2. Propiedad intelectual</h2>
          <p>
            Todos los beats, instrumentales, producciones musicales y demás contenido publicado en este Sitio son propiedad exclusiva de <strong>Prod. Mvxii</strong> y están protegidos por las leyes de derechos de autor vigentes en Chile y tratados internacionales.
          </p>
          <ul>
            <li>El acceso al Sitio no otorga ningún derecho de uso, reproducción o distribución de los beats sin la adquisición de la licencia correspondiente.</li>
            <li>Las previsualizaciones (previews) son exclusivamente para evaluación y no pueden ser usadas en producciones propias.</li>
            <li>Queda prohibida la descarga, extracción, redistribución o uso comercial de cualquier contenido sin licencia válida.</li>
          </ul>
        </div>

        <div className="tc-section">
          <h2>3. Licencias de beats</h2>
          <p>La compra de una licencia otorga derechos de uso limitados según el tipo adquirido:</p>
          <div className="tc-highlight">
            <ul>
              <li><strong>Licencia Basic:</strong> Uso no comercial, hasta 2.500 streams, 1 video musical, crédito obligatorio.</li>
              <li><strong>Licencia Standard:</strong> Uso comercial, hasta 150.000 streams, distribución digital limitada.</li>
              <li><strong>Licencia Premium:</strong> Uso comercial completo, streams y descargas ilimitados, hasta 500 emisoras de radio.</li>
              <li><strong>Licencia Exclusiva:</strong> Propiedad total del beat, eliminación de la tienda, sin crédito requerido. Precio a negociar directamente.</li>
            </ul>
          </div>
          <p>
            Las licencias se adquieren a través de <a href="https://www.beatstars.com/prodmvxii" target="_blank" rel="noopener noreferrer">BeatStars.com/prodmvxii</a> o directamente vía WhatsApp. La compra implica la aceptación de los términos de uso del beat.
          </p>
        </div>

        <div className="tc-section">
          <h2>4. Política de reembolsos</h2>
          <p>
            Dado que los beats son productos digitales descargables, <strong>no se aceptan devoluciones</strong> una vez que el archivo ha sido entregado. En caso de problemas técnicos con la descarga, contáctanos por WhatsApp al <a href="https://wa.me/56932907119">+56 9 3290 7119</a> y resolveremos el inconveniente.
          </p>
        </div>

        <div className="tc-section">
          <h2>5. Uso del formulario de contacto</h2>
          <p>
            Al enviar el formulario de contacto en este Sitio, usted acepta que sus datos (nombre, teléfono, correo electrónico y mensaje) sean almacenados y utilizados para:
          </p>
          <ul>
            <li>Responder a su consulta sobre beats o licencias.</li>
            <li>Enviar información sobre promociones, lanzamientos y novedades de Prod. Mvxii (solo si otorgó su consentimiento explícito).</li>
          </ul>
          <p>
            Sus datos no serán vendidos ni compartidos con terceros. Puede solicitar la eliminación de sus datos en cualquier momento escribiendo a <a href="mailto:prodmvxi@gmail.com">prodmvxi@gmail.com</a>.
          </p>
        </div>

        <div className="tc-section">
          <h2>6. Limitación de responsabilidad</h2>
          <p>
            Prod. Mvxii no se responsabiliza por el uso inadecuado de los beats adquiridos, ni por problemas técnicos derivados de plataformas de terceros (BeatStars, Spotify, YouTube, etc.). El comprador asume la responsabilidad de cumplir con las restricciones de cada licencia.
          </p>
        </div>

        <div className="tc-section">
          <h2>7. Modificaciones</h2>
          <p>
            Prod. Mvxii se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor al publicarse en este Sitio. El uso continuado del Sitio implica la aceptación de los términos vigentes.
          </p>
        </div>

        <div className="tc-section">
          <h2>8. Ley aplicable</h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República de Chile. Cualquier controversia será sometida a los tribunales ordinarios de justicia competentes.
          </p>
        </div>

        <div className="tc-section">
          <h2>9. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos:</p>
          <ul>
            <li>Email: <a href="mailto:prodmvxi@gmail.com">prodmvxi@gmail.com</a></li>
            <li>WhatsApp: <a href="https://wa.me/56932907119">+56 9 3290 7119</a></li>
            <li>BeatStars: <a href="https://www.beatstars.com/prodmvxii" target="_blank" rel="noopener noreferrer">beatstars.com/prodmvxii</a></li>
          </ul>
        </div>
      </div>

      {/* Footer simple */}
      <div
        style={{
          borderTop: "1px solid rgba(139,92,246,0.15)",
          padding: "32px 24px",
          textAlign: "center",
          color: "rgba(241,245,249,0.3)",
          fontSize: "12px",
        }}
      >
        © 2026 Prod. Mvxii · Todos los derechos reservados ·{" "}
        <Link href="/" style={{ color: "#8B5CF6", textDecoration: "none" }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
