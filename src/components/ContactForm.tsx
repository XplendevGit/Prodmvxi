"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";

function IgGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ⚠️ CAMBIA ESTE NÚMERO por el WhatsApp real de Maxi (formato internacional, solo dígitos)
// Ej: Chile +56 9 1234 5678  →  "56912345678"
const WHATSAPP_NUMBER = "56932907119";
const INSTAGRAM_USER = "prodmvxii";

const INTERESTS = ["Comprar un beat", "Beat personalizado", "Licencia exclusiva", "Colaboración", "Otro"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [message, setMessage] = useState("");

  const buildText = () => {
    const lines = [
      `¡Hola Prod. Mvxii! 👋`,
      name ? `Soy ${name}.` : "",
      `Tema: ${interest}.`,
      message ? `\n${message}` : "",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openInstagram = () => {
    // Instagram no permite pre-cargar el mensaje por URL: copiamos el texto y abrimos el DM
    try {
      navigator.clipboard.writeText(buildText());
    } catch {}
    window.open(`https://ig.me/m/${INSTAGRAM_USER}`, "_blank", "noopener,noreferrer");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "rgba(5,5,8,0.6)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#F1F5F9",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section
      id="contacto-form"
      style={{
        position: "relative",
        padding: "90px 24px",
        background: "linear-gradient(180deg, #050508, #0d0820 50%, #050508)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "620px", margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "50px",
              background: "rgba(37,211,102,0.15)",
              border: "1px solid rgba(37,211,102,0.4)",
              color: "#25D366",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "3px",
              marginBottom: "16px",
            }}
          >
            HABLEMOS
          </span>
          <h2
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "1px",
              color: "#F1F5F9",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
            }}
          >
            CON<span style={{ color: "#A855F7", textShadow: "0 0 30px rgba(168,85,247,0.6)" }}>TÁCTAME</span>
          </h2>
          <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "14px" }}>
            Escribe tu mensaje y te respondo directo por WhatsApp o Instagram.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(13,13,26,0.7)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "24px",
            padding: "32px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "rgba(241,245,249,0.6)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                TU NOMBRE
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "rgba(241,245,249,0.6)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                ¿QUÉ NECESITAS?
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {INTERESTS.map((it) => {
                  const active = it === interest;
                  return (
                    <button
                      key={it}
                      onClick={() => setInterest(it)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "50px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                        background: active ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "rgba(139,92,246,0.08)",
                        color: active ? "#fff" : "rgba(241,245,249,0.7)",
                        border: active ? "1px solid transparent" : "1px solid rgba(139,92,246,0.3)",
                        boxShadow: active ? "0 0 16px rgba(139,92,246,0.5)" : "none",
                        transition: "all 0.18s",
                      }}
                    >
                      {it}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "rgba(241,245,249,0.6)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                TU MENSAJE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntame qué tienes en mente…"
                rows={4}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
              />
            </div>

            {/* Send buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
              <button
                onClick={openWhatsApp}
                style={{
                  flex: "1 1 200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(37,211,102,0.45)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
              >
                <MessageCircle size={18} /> Enviar por WhatsApp
              </button>
              <button
                onClick={openInstagram}
                style={{
                  flex: "1 1 200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "16px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 0 24px rgba(225,48,108,0.4)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
              >
                <IgGlyph size={18} /> Enviar por Instagram
              </button>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(241,245,249,0.35)", textAlign: "center", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Send size={11} /> Se abrirá la app con tu mensaje listo para enviar
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
