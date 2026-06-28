import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px">
        <h2 style="color:#EC4899">Error de Google: ${error}</h2>
        <p>Verifica que agregaste correctamente la URI en Google Cloud Console.</p>
      </body></html>`,
      { headers: { "content-type": "text/html" } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px">
        <h2 style="color:#EC4899">No se recibió código de autorización.</h2>
      </body></html>`,
      { headers: { "content-type": "text/html" } }
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/auth/callback`;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(
        `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px">
          <h2 style="color:#EC4899">Error al intercambiar el código</h2>
          <pre style="color:#94A3B8">${errText}</pre>
          <a href="/setup" style="color:#06B6D4">← Volver a Setup</a>
        </body></html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    const tokens = await res.json() as { refresh_token?: string; access_token?: string };
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return new NextResponse(
        `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px">
          <h2 style="color:#F59E0B">⚠️ No se generó Refresh Token</h2>
          <p>Esto ocurre si ya autorizaste antes. Ve a
          <a href="https://myaccount.google.com/permissions" target="_blank" style="color:#8B5CF6">
          myaccount.google.com/permissions</a>,
          revoca el acceso a tu app y vuelve a intentarlo.</p>
          <a href="/setup" style="color:#06B6D4">← Volver a Setup</a>
        </body></html>`,
        { headers: { "content-type": "text/html" } }
      );
    }

    return new NextResponse(
      `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px;max-width:800px;margin:0 auto">
        <h1 style="color:#A855F7;letter-spacing:3px">✅ CONECTADO EXITOSAMENTE</h1>
        <p style="color:#94A3B8">Copia este Refresh Token y agrégalo como variable de entorno en Cloudflare Pages</p>
        <div style="background:#0D0D1A;border:1px solid #8B5CF6;border-radius:8px;padding:20px;margin:20px 0">
          <p style="color:#94A3B8;font-size:12px;margin:0 0 8px 0">GOOGLE_REFRESH_TOKEN=</p>
          <p id="token" style="color:#A855F7;word-break:break-all;font-size:13px;margin:0">${refreshToken}</p>
        </div>
        <button onclick="navigator.clipboard.writeText('${refreshToken}').then(()=>this.textContent='✅ Copiado!')"
          style="background:linear-gradient(135deg,#8B5CF6,#6D28D9);color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;letter-spacing:1px">
          COPIAR REFRESH TOKEN
        </button>
        <hr style="border-color:#1a1a2e;margin:30px 0"/>
        <h3 style="color:#06B6D4">Qué hacer ahora:</h3>
        <ol style="color:#94A3B8;line-height:2">
          <li>Ve a tu proyecto en Cloudflare Pages → Settings → Environment variables</li>
          <li>Agrega <code style="color:#F1F5F9">GOOGLE_REFRESH_TOKEN</code> con el token de arriba</li>
          <li>Redespliega el proyecto</li>
        </ol>
      </body></html>`,
      { headers: { "content-type": "text/html" } }
    );
  } catch (err) {
    return new NextResponse(
      `<html><body style="font-family:monospace;background:#050508;color:#F1F5F9;padding:40px">
        <h2 style="color:#EC4899">Error al intercambiar el código</h2>
        <pre style="color:#94A3B8">${String(err)}</pre>
        <a href="/setup" style="color:#06B6D4">← Volver a Setup</a>
      </body></html>`,
      { headers: { "content-type": "text/html" } }
    );
  }
}
