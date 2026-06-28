/**
 * Script para obtener el Google OAuth2 Refresh Token de una sola vez.
 *
 * USO:
 *   1. Asegúrate de que CLIENT_ID y CLIENT_SECRET estén en .env.local
 *   2. En Google Cloud Console → Credentials → tu OAuth Client → agrega
 *      "http://localhost:3001/callback" en "Authorized redirect URIs"
 *   3. Ejecuta:  node scripts/get-google-token.js
 *   4. Abre la URL que te muestra en el navegador (logueado con la cuenta de Google de Maxi)
 *   5. Acepta los permisos → serás redirigido a localhost:3001/callback
 *   6. El script imprime el REFRESH_TOKEN → pégalo en .env.local
 *
 * IMPORTANTE: el navegador debe estar logueado con la cuenta Google que
 * tiene acceso a la carpeta "BEATS" en Drive (la cuenta de Maxi).
 */

const http = require("http");
const { execSync } = require("child_process");
// Next.js lee .env.local automáticamente; si ejecutas este script standalone
// necesitas instalar dotenv: npm i -D dotenv
// eslint-disable-next-line @typescript-eslint/no-var-requires
try { require("dotenv").config({ path: ".env.local" }); } catch (_) {}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("ERROR: Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env.local");
  process.exit(1);
}

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth` +
  `?client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n=== PASO 1: Abre esta URL en tu navegador ===\n");
console.log(authUrl);
console.log("\n=================================================");
console.log("Esperando que completes el login en el navegador...\n");

// Intenta abrir el navegador automáticamente en Windows
try {
  execSync(`start "" "${authUrl}"`);
} catch (_) {
  // Si falla, el usuario copia la URL manualmente
}

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) {
    res.end("Esperando...");
    return;
  }

  const url = new URL(req.url, "http://localhost:3001");
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("Error: no se recibió el código de autorización.");
    server.close();
    return;
  }

  try {
    const body = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      console.error("\nError al obtener el token:", tokens.error, tokens.error_description);
      res.end("Error: " + tokens.error);
      server.close();
      return;
    }

    console.log("\n✅  ¡Token obtenido con éxito!\n");
    console.log("=== PASO 2: Copia esto en tu .env.local ===\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\n===========================================");
    console.log("Luego reinicia el servidor: npm run dev\n");

    res.end(`
      <html><body style="font-family:monospace;padding:32px;background:#111;color:#0f0;">
        <h2>✅ Token obtenido</h2>
        <p>Revisa la consola para copiar el GOOGLE_REFRESH_TOKEN.</p>
        <p>Pégalo en <code>.env.local</code> y reinicia el servidor.</p>
      </body></html>
    `);

    server.close();
  } catch (err) {
    console.error("Error de red:", err);
    res.end("Error de red al obtener el token.");
    server.close();
  }
});

server.listen(3001, () => {
  console.log("Servidor de callback escuchando en http://localhost:3001");
});
