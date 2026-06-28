import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const TO_EMAIL = "prodmvxi@gmail.com";
// Brevo (Sendinblue) transactional email API — free 300/day, no domain needed
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/** Escape HTML entities to prevent template injection */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}): string {
  const n = esc(data.name);
  const ph = esc(data.phone);
  const em = esc(data.email);
  const it = esc(data.interest);
  const msg = esc(data.message).replace(/\n/g, "<br>");
  // WhatsApp deep-link back to the contact using their number
  const digits = data.phone.replace(/[^0-9+]/g, "");
  const waReply = `https://wa.me/${digits}`;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nuevo Contacto — Prod. Mvxii</title>
</head>
<body style="margin:0;padding:0;background-color:#050508;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- ░░ OUTER WRAPPER ░░ -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
  style="background-color:#050508;min-width:100%;">
  <tr>
    <td align="center" style="padding:32px 12px 56px;">

      <!-- ░░ EMAIL CARD 580px ░░ -->
      <table width="580" cellpadding="0" cellspacing="0" border="0" role="presentation"
        style="width:100%;max-width:580px;">

        <!-- ╔══ TOP RAINBOW BAR ══╗ -->
        <tr>
          <td height="5" style="font-size:0;line-height:0;border-radius:12px 12px 0 0;overflow:hidden;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td width="33%" height="5" style="background-color:#8B5CF6;font-size:0;line-height:0;">&nbsp;</td>
                <td width="34%" height="5" style="background-color:#06B6D4;font-size:0;line-height:0;">&nbsp;</td>
                <td width="33%" height="5" style="background-color:#EC4899;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ╔══ HEADER BANNER ══╗ -->
        <tr>
          <td style="background-color:#100830;
                     border-left:1px solid #1e1060;
                     border-right:1px solid #1e1060;
                     padding:52px 48px 44px;
                     text-align:center;">

            <!-- Eyebrow -->
            <p style="margin:0 0 22px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:11px;font-weight:700;
                      letter-spacing:5px;color:#8B5CF6;
                      text-transform:uppercase;">
              ✦ &nbsp; PROD. MVXII &nbsp; ✦
            </p>

            <!-- Main title -->
            <h1 style="margin:0 0 6px;
                       font-family:Arial,Helvetica,sans-serif;
                       font-size:42px;font-weight:900;
                       letter-spacing:3px;color:#FFFFFF;
                       line-height:1.1;text-transform:uppercase;">
              NUEVO
            </h1>
            <h1 style="margin:0 0 28px;
                       font-family:Arial,Helvetica,sans-serif;
                       font-size:42px;font-weight:900;
                       letter-spacing:3px;color:#A855F7;
                       line-height:1.1;text-transform:uppercase;">
              CONTACTO
            </h1>

            <!-- Divider with diamond -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="max-width:300px;margin:0 auto 24px;">
              <tr>
                <td style="vertical-align:middle;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <td width="45%" height="1" style="background-color:#7C3AED;font-size:0;line-height:0;">&nbsp;</td>
                      <td style="padding:0 10px;text-align:center;
                                 font-family:Arial,sans-serif;font-size:12px;
                                 color:#06B6D4;">◆</td>
                      <td width="45%" height="1" style="background-color:#0891B2;font-size:0;line-height:0;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Subtitle -->
            <p style="margin:0;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:13px;color:#64748B;letter-spacing:1px;
                      line-height:1.6;">
              Un visitante de tu sitio web quiere<br>conectar contigo — responde pronto 🎯
            </p>

          </td>
        </tr>

        <!-- ╔══ BODY ══╗ -->
        <tr>
          <td style="background-color:#0D0D1A;
                     border-left:1px solid #16164a;
                     border-right:1px solid #16164a;
                     padding:40px 40px 36px;">

            <!-- Section label -->
            <p style="margin:0 0 18px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:10px;font-weight:700;
                      letter-spacing:3px;color:#334155;
                      text-transform:uppercase;">
              Información de contacto
            </p>

            <!-- ── NOMBRE ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:8px;">
              <tr>
                <td style="background-color:#13132B;
                           border-left:3px solid #8B5CF6;
                           padding:16px 22px;
                           border-radius:0 10px 10px 0;">
                  <p style="margin:0 0 4px;
                            font-family:Arial,sans-serif;
                            font-size:9px;font-weight:700;
                            letter-spacing:2px;color:#475569;
                            text-transform:uppercase;">Nombre</p>
                  <p style="margin:0;
                            font-family:Arial,Helvetica,sans-serif;
                            font-size:22px;font-weight:900;
                            color:#F1F5F9;letter-spacing:1px;">${n}</p>
                </td>
              </tr>
            </table>

            <!-- ── TELÉFONO + EMAIL (2 col) ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:8px;">
              <tr>
                <td width="48%" style="background-color:#13132B;
                                       border-left:3px solid #06B6D4;
                                       padding:14px 18px;
                                       border-radius:0 10px 10px 0;
                                       vertical-align:top;">
                  <p style="margin:0 0 4px;font-family:Arial,sans-serif;
                            font-size:9px;font-weight:700;letter-spacing:2px;
                            color:#475569;text-transform:uppercase;">Teléfono</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                            font-size:16px;font-weight:700;color:#F1F5F9;">${ph}</p>
                </td>
                <td width="4%" style="font-size:0;">&nbsp;</td>
                <td width="48%" style="background-color:#13132B;
                                       border-left:3px solid #06B6D4;
                                       padding:14px 18px;
                                       border-radius:0 10px 10px 0;
                                       vertical-align:top;">
                  <p style="margin:0 0 4px;font-family:Arial,sans-serif;
                            font-size:9px;font-weight:700;letter-spacing:2px;
                            color:#475569;text-transform:uppercase;">Email</p>
                  <a href="mailto:${em}"
                    style="font-family:Arial,Helvetica,sans-serif;
                           font-size:14px;font-weight:700;
                           color:#06B6D4;text-decoration:none;">${em}</a>
                </td>
              </tr>
            </table>

            <!-- ── INTERÉS ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:${data.message ? "8px" : "28px"};">
              <tr>
                <td style="background-color:#13132B;
                           border-left:3px solid #EC4899;
                           padding:14px 22px;
                           border-radius:0 10px 10px 0;">
                  <p style="margin:0 0 8px;font-family:Arial,sans-serif;
                            font-size:9px;font-weight:700;letter-spacing:2px;
                            color:#475569;text-transform:uppercase;">Interés</p>
                  <span style="display:inline-block;
                               background-color:#3b0d28;
                               border:1px solid #EC4899;
                               color:#EC4899;
                               font-family:Arial,sans-serif;
                               font-size:13px;font-weight:700;
                               padding:5px 18px;border-radius:50px;
                               letter-spacing:1px;">${it}</span>
                </td>
              </tr>
            </table>

            ${
              data.message
                ? `<!-- ── MENSAJE ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:28px;">
              <tr>
                <td style="background-color:#0A0A1F;
                           border:1px solid #1e1e5a;
                           border-left:3px solid #A855F7;
                           padding:20px 22px;
                           border-radius:0 10px 10px 0;">
                  <p style="margin:0 0 8px;font-family:Arial,sans-serif;
                            font-size:9px;font-weight:700;letter-spacing:2px;
                            color:#475569;text-transform:uppercase;">Mensaje</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                            font-size:14px;color:#CBD5E1;
                            line-height:1.75;">${msg}</p>
                </td>
              </tr>
            </table>`
                : ""
            }

            <!-- ── CONSENT ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:32px;">
              <tr>
                <td style="background-color:#0a1f0e;
                           border:1px solid #134d26;
                           padding:12px 20px;
                           border-radius:8px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;
                            font-size:12px;color:#4ADE80;line-height:1.5;">
                    ✓ &nbsp; <strong>Consentimiento aceptado</strong> — puede recibir
                    comunicaciones y promociones de Prod. Mvxii
                  </p>
                </td>
              </tr>
            </table>

            <!-- ── CTA BUTTONS ── -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" border="0" role="presentation">
                    <tr>
                      <!-- Reply by email -->
                      <td style="padding:0 5px 0 0;">
                        <a href="mailto:${em}?subject=Re: ${it} — Prod. Mvxii&body=Hola ${n},%0A%0A"
                          style="display:inline-block;
                                 background-color:#7C3AED;
                                 color:#FFFFFF;
                                 font-family:Arial,Helvetica,sans-serif;
                                 font-size:14px;font-weight:700;
                                 letter-spacing:1px;
                                 text-decoration:none;
                                 padding:15px 26px;
                                 border-radius:10px;
                                 border:2px solid #9333EA;">
                          ↩ &nbsp; Responder
                        </a>
                      </td>
                      <!-- WhatsApp -->
                      <td style="padding:0 0 0 5px;">
                        <a href="${waReply}"
                          style="display:inline-block;
                                 background-color:#0a2110;
                                 color:#25D366;
                                 font-family:Arial,Helvetica,sans-serif;
                                 font-size:14px;font-weight:700;
                                 letter-spacing:1px;
                                 text-decoration:none;
                                 padding:15px 26px;
                                 border-radius:10px;
                                 border:2px solid #25D366;">
                          💬 &nbsp; WhatsApp
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ╔══ GRADIENT SEPARATOR ══╗ -->
        <tr>
          <td style="background-color:#0D0D1A;
                     border-left:1px solid #16164a;
                     border-right:1px solid #16164a;
                     padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td width="50%" height="1" style="background-color:#8B5CF6;font-size:0;line-height:0;">&nbsp;</td>
                <td width="50%" height="1" style="background-color:#06B6D4;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ╔══ FOOTER ══╗ -->
        <tr>
          <td style="background-color:#080818;
                     border-left:1px solid #16164a;
                     border-right:1px solid #16164a;
                     border-bottom:1px solid #16164a;
                     padding:32px 40px 36px;
                     text-align:center;
                     border-radius:0 0 12px 12px;">

            <!-- Social pill links -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="https://instagram.com/prodmvxii"
                    style="display:inline-block;color:#A855F7;font-family:Arial,sans-serif;
                           font-size:11px;font-weight:700;letter-spacing:1px;
                           text-decoration:none;background-color:#1a0d2e;
                           border:1px solid #4c1d95;padding:6px 14px;
                           border-radius:50px;margin:0 4px;">Instagram</a>
                  <a href="https://tiktok.com/@prodmvxii"
                    style="display:inline-block;color:#A855F7;font-family:Arial,sans-serif;
                           font-size:11px;font-weight:700;letter-spacing:1px;
                           text-decoration:none;background-color:#1a0d2e;
                           border:1px solid #4c1d95;padding:6px 14px;
                           border-radius:50px;margin:0 4px;">TikTok</a>
                  <a href="https://beatstars.com/prodmvxii"
                    style="display:inline-block;color:#A855F7;font-family:Arial,sans-serif;
                           font-size:11px;font-weight:700;letter-spacing:1px;
                           text-decoration:none;background-color:#1a0d2e;
                           border:1px solid #4c1d95;padding:6px 14px;
                           border-radius:50px;margin:0 4px;">BeatStars</a>
                  <a href="https://youtube.com/@prodmvxii"
                    style="display:inline-block;color:#A855F7;font-family:Arial,sans-serif;
                           font-size:11px;font-weight:700;letter-spacing:1px;
                           text-decoration:none;background-color:#1a0d2e;
                           border:1px solid #4c1d95;padding:6px 14px;
                           border-radius:50px;margin:0 4px;">YouTube</a>
                </td>
              </tr>
            </table>

            <!-- Divider thin -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
              style="margin-bottom:20px;max-width:200px;margin-left:auto;margin-right:auto;">
              <tr>
                <td height="1" style="background-color:#1e1e3a;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>

            <!-- Brand union -->
            <p style="margin:0 0 4px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:9px;font-weight:700;
                      letter-spacing:3px;color:#1e293b;
                      text-transform:uppercase;">Desarrollado por</p>
            <p style="margin:0 0 20px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:13px;font-weight:800;
                      letter-spacing:3px;">
              <span style="color:#06B6D4;">XPLENDEV</span>
              <span style="color:#334155;"> &nbsp;×&nbsp; </span>
              <span style="color:#8B5CF6;">PROD. MVXII</span>
            </p>

            <!-- Copyright -->
            <p style="margin:0 0 4px;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:11px;color:#1e293b;">
              © 2026 Prod. Mvxii · Todos los derechos reservados
            </p>
            <p style="margin:0;
                      font-family:Arial,Helvetica,sans-serif;
                      font-size:10px;color:#0f172a;">
              Este email fue generado automáticamente desde tu sitio web
            </p>
          </td>
        </tr>

        <!-- ╔══ BOTTOM RAINBOW BAR ══╗ -->
        <tr>
          <td height="4" style="font-size:0;line-height:0;border-radius:0 0 4px 4px;overflow:hidden;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td width="33%" height="4" style="background-color:#EC4899;font-size:0;line-height:0;">&nbsp;</td>
                <td width="34%" height="4" style="background-color:#06B6D4;font-size:0;line-height:0;">&nbsp;</td>
                <td width="33%" height="4" style="background-color:#8B5CF6;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- ░░ /EMAIL CARD ░░ -->

    </td>
  </tr>
</table>
<!-- ░░ /OUTER WRAPPER ░░ -->

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, interest, message, consent } = body;

    if (!name || !phone || !email || !consent) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    // Input length limits — prevent oversized payloads and email-header injection
    if (
      name.length > 120 ||
      phone.length > 30 ||
      email.length > 254 ||
      (message && message.length > 2000)
    ) {
      return NextResponse.json({ error: "Un campo excede el tamaño permitido." }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "Formato de email inválido." }, { status: 400 });
    }

    // Validate interest is one of the known values (prevents injection into subject line)
    const ALLOWED_INTERESTS = ["Comprar un beat", "Beat personalizado", "Licencia exclusiva", "Colaboración", "Otro"];
    if (interest && !ALLOWED_INTERESTS.includes(interest)) {
      return NextResponse.json({ error: "Categoría de interés inválida." }, { status: 400 });
    }

    // ── Provider selection ────────────────────────────────────────────────
    // Priority: BREVO_API_KEY (no domain needed) → RESEND_API_KEY (needs domain)
    const brevoKey = process.env.BREVO_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!brevoKey && !resendKey) {
      console.warn("[contact] No email API key configured — email not sent");
      return NextResponse.json({ ok: true, warn: "email_not_configured" });
    }

    const html = buildHtml({ name, phone, email, interest, message: message ?? "" });
    const subject = `🎵 Nuevo contacto: ${name} — ${interest}`;

    try {
      if (brevoKey) {
        // ── Brevo (Sendinblue) ─────────────────────────────────────────────
        // Free 300 emails/day. Sender must be verified in Brevo dashboard
        // (Settings → Senders → Add email → verify via Gmail).
        const senderEmail = process.env.BREVO_SENDER_EMAIL ?? TO_EMAIL;

        const res = await fetch(BREVO_URL, {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: { name: "Prod. Mvxii Website", email: senderEmail },
            to: [{ email: TO_EMAIL, name: "Prod. Mvxii" }],
            replyTo: { email, name },
            subject,
            htmlContent: html,
          }),
        });

        const status = res.status;
        const txt = await res.text();

        if (!res.ok) {
          console.error(`[contact] Brevo ${status}:`, txt);
          return NextResponse.json(
            {
              error: `Error al enviar el email (Brevo ${status}). Verifica que el sender esté aprobado en brevo.com → Senders.`,
              detail: txt,
            },
            { status: 502 }
          );
        }
      } else if (resendKey) {
        // ── Resend (fallback, requires verified domain) ────────────────────
        const fromEmail =
          process.env.RESEND_FROM_EMAIL ?? "Prod. Mvxii <onboarding@resend.dev>";

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [TO_EMAIL],
            reply_to: email,
            subject,
            html,
          }),
        });

        const status = res.status;
        const txt = await res.text();

        if (!res.ok) {
          console.error(`[contact] Resend ${status}:`, txt);
          return NextResponse.json(
            {
              error: `Error al enviar el email (Resend ${status}). Verifica el dominio sender en resend.com/domains.`,
              detail: txt,
            },
            { status: 502 }
          );
        }
      }
    } catch (fetchErr) {
      console.error("[contact] fetch to email provider failed:", fetchErr);
      return NextResponse.json(
        { error: "No se pudo conectar con el servicio de email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Unexpected error:", e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
