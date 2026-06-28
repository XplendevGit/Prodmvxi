export default function SetupPage() {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "monospace",
          background: "#050508",
          color: "#F1F5F9",
          padding: "40px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ color: "#A855F7", letterSpacing: "3px" }}>
          PROD. MVXII — SETUP
        </h1>
        <p style={{ color: "#94A3B8" }}>
          Conecta tu Google Drive para cargar los beats automáticamente.
        </p>

        <div
          style={{
            background: "#0D0D1A",
            border: "1px solid #8B5CF6",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "24px",
          }}
        >
          <h2 style={{ color: "#06B6D4", marginTop: 0 }}>
            PASO 1 — Agregar URI en Google Cloud Console
          </h2>
          <p style={{ color: "#94A3B8", lineHeight: 1.8 }}>
            Ve a{" "}
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#A855F7" }}
            >
              console.cloud.google.com/apis/credentials
            </a>
            <br />
            → Edita tu OAuth client
            <br />
            → En <strong style={{ color: "#F1F5F9" }}>
              &quot;URIs de redireccionamiento autorizados&quot;
            </strong>{" "}
            agrega exactamente esta URI:
          </p>
          <div
            style={{
              background: "#050508",
              border: "1px solid #2D1B69",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#06B6D4",
              fontSize: "14px",
              letterSpacing: "0.5px",
              marginTop: "8px",
            }}
          >
            http://localhost:3000/api/auth/callback
          </div>
          <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "8px" }}>
            Haz clic en SAVE y espera ~1 minuto antes de continuar.
          </p>
        </div>

        <div
          style={{
            background: "#0D0D1A",
            border: "1px solid #8B5CF6",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "16px",
          }}
        >
          <h2 style={{ color: "#06B6D4", marginTop: 0 }}>
            PASO 2 — Autorizar y obtener Refresh Token
          </h2>
          <p style={{ color: "#94A3B8" }}>
            Haz clic en el botón. Inicia sesión con la cuenta que tiene acceso a
            la carpeta BEATS (<strong style={{ color: "#F1F5F9" }}>prodmvxii@gmail.com</strong>).
          </p>
          <a
            href="/api/auth/url"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "2px",
              boxShadow: "0 0 30px rgba(139,92,246,0.5)",
              marginTop: "8px",
            }}
          >
            CONECTAR GOOGLE DRIVE →
          </a>
        </div>

        <div
          style={{
            background: "#0D0D1A",
            border: "1px solid #2D1B69",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "16px",
          }}
        >
          <h2 style={{ color: "#F59E0B", marginTop: 0 }}>
            PASO 3 — Pegar el Refresh Token
          </h2>
          <p style={{ color: "#94A3B8", lineHeight: 1.8 }}>
            Después de autorizar, verás el Refresh Token en pantalla.
            <br />
            Ábrelo y reemplaza en tu archivo <code style={{ color: "#06B6D4" }}>.env.local</code>:
          </p>
          <pre
            style={{
              background: "#050508",
              border: "1px solid #2D1B69",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "12px",
              color: "#A855F7",
              overflow: "auto",
            }}
          >
            {`GOOGLE_REFRESH_TOKEN=1//0g...tu_token_aqui`}
          </pre>
          <p style={{ color: "#94A3B8", fontSize: "12px" }}>
            Luego reinicia: <code style={{ color: "#06B6D4" }}>npm run dev</code>
          </p>
        </div>
      </body>
    </html>
  );
}
