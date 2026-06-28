import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const TO_EMAIL = "prodmvxi@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, interest, message, consent } = body;

    if (!name || !phone || !email || !consent) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Sin clave configurada: loguear y responder OK igual (los datos se perderian)
      // Agregar RESEND_API_KEY en Cloudflare Pages → Settings → Environment variables
      console.warn("RESEND_API_KEY not set — email not sent");
      return NextResponse.json({ ok: true, warn: "email_not_configured" });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0D0D1A;color:#F1F5F9;padding:32px;border-radius:12px">
        <h2 style="color:#A855F7;margin:0 0 4px">Nuevo contacto — Prod. Mvxii</h2>
        <p style="color:#94A3B8;font-size:13px;margin:0 0 24px">Formulario del sitio web</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2);color:#94A3B8;width:140px">Nombre</td><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2);font-weight:700">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2);color:#94A3B8">Teléfono</td><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2)">${phone}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2);color:#94A3B8">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2)">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2);color:#94A3B8">Interés</td><td style="padding:10px 0;border-bottom:1px solid rgba(139,92,246,0.2)"><span style="background:rgba(168,85,247,0.2);color:#A855F7;padding:3px 10px;border-radius:50px;font-size:13px">${interest}</span></td></tr>
          ${message ? `<tr><td style="padding:10px 0;color:#94A3B8;vertical-align:top">Mensaje</td><td style="padding:10px 0">${message.replace(/\n/g, "<br>")}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:12px;color:#64748B">Consentimiento de marketing: ✓ Aceptado</p>
        <!-- TODO: Agregar aquí llamada a Google Sheets API para registrar el lead -->
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Prod. Mvxii Contact <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Nuevo contacto: ${name} — ${interest}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Error al enviar el correo." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact route error:", e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
