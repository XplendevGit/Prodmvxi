"use client";

import { useState } from "react";
import { Send, MessageCircle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const WHATSAPP_NUMBER = "56932907119";
const INSTAGRAM_USER = "prodmvxii";

const INTERESTS = ["Comprar un beat", "Beat personalizado", "Licencia exclusiva", "Colaboración", "Otro"];

type FormState = "idle" | "sending" | "success" | "error";

function IgGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(INTERESTS[0]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const buildText = () => {
    const lines = [
      `¡Hola Prod. Mvxii! 👋`,
      name ? `Soy ${name}.` : "",
      phone ? `Tel: ${phone}` : "",
      email ? `Email: ${email}` : "",
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
    try { navigator.clipboard.writeText(buildText()); } catch {}
    window.open(`https://ig.me/m/${INSTAGRAM_USER}`, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !consent) {
      setErrorMsg("Por favor completa todos los campos obligatorios y acepta el consentimiento.");
      setFormState("error");
      return;
    }
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, interest, message, consent }),
      });
      if (res.ok) {
        setFormState("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Hubo un error al enviar. Intenta por WhatsApp.");
        setFormState("error");
      }
    } catch {
      setErrorMsg("Error de red. Intenta contactarme por WhatsApp.");
      setFormState("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    background: "rgba(5,5,8,0.7)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#F1F5F9",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
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
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "50px",
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.35)",
              color: "#A855F7",
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
          <p style={{ color: "rgba(241,245,249,0.5)", fontSize: "14px", lineHeight: 1.6 }}>
            Déjame tus datos y te respondo personalmente. También puedes escribirme directo por WhatsApp.
          </p>
        </div>

        {/* Success state */}
        {formState === "success" ? (
          <div
            style={{
              background: "rgba(37,211,102,0.07)",
              border: "1px solid rgba(37,211,102,0.35)",
              borderRadius: "24px",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <CheckCircle2 size={52} style={{ color: "#25D366", margin: "0 auto 20px", display: "block" }} />
            <h3 style={{ color: "#F1F5F9", fontSize: "22px", fontWeight: 800, margin: "0 0 10px" }}>¡Mensaje enviado!</h3>
            <p style={{ color: "rgba(241,245,249,0.55)", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
              Recibí tu mensaje. Te respondo pronto a <strong style={{ color: "#A855F7" }}>{email}</strong> o por WhatsApp.
            </p>
            <button
              onClick={() => { setFormState("idle"); setName(""); setPhone(""); setEmail(""); setMessage(""); setConsent(false); }}
              style={{ padding: "10px 28px", borderRadius: "50px", background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#A855F7", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          /* Card */
          <form
            onSubmit={handleSubmit}
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
              {/* Name */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(241,245,249,0.55)", letterSpacing: "1.5px", display: "block", marginBottom: "7px" }}>
                  NOMBRE <span style={{ color: "#EC4899" }}>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                />
              </div>

              {/* Phone + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(241,245,249,0.55)", letterSpacing: "1.5px", display: "block", marginBottom: "7px" }}>
                    TELÉFONO <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(241,245,249,0.55)", letterSpacing: "1.5px", display: "block", marginBottom: "7px" }}>
                    CORREO <span style={{ color: "#EC4899" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                  />
                </div>
              </div>

              {/* Interest chips */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(241,245,249,0.55)", letterSpacing: "1.5px", display: "block", marginBottom: "10px" }}>
                  ¿QUÉ NECESITAS?
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {INTERESTS.map((it) => {
                    const active = it === interest;
                    return (
                      <button
                        key={it}
                        type="button"
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

              {/* Message */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "rgba(241,245,249,0.55)", letterSpacing: "1.5px", display: "block", marginBottom: "7px" }}>
                  MENSAJE
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntame qué tienes en mente…"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.8)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)")}
                />
              </div>

              {/* Consent */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: consent ? "rgba(139,92,246,0.07)" : "rgba(5,5,8,0.3)",
                  border: `1px solid ${consent ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.15)"}`,
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "#8B5CF6", width: "16px", height: "16px", flexShrink: 0, cursor: "pointer" }}
                />
                <span style={{ fontSize: "12px", color: "rgba(241,245,249,0.55)", lineHeight: 1.6 }}>
                  Acepto recibir información sobre nuevos beats, promociones y novedades de Prod. Mvxii por correo electrónico y WhatsApp. Puedo retirar mi consentimiento en cualquier momento.{" "}
                  <a href="/terminos" style={{ color: "#A855F7", textDecoration: "underline" }}>Ver Términos y Condiciones.</a>
                  <span style={{ color: "#EC4899" }}> *</span>
                </span>
              </label>

              {/* Error message */}
              {formState === "error" && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "10px", background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)", color: "#EC4899", fontSize: "13px" }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              {/* Submit buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "16px",
                    borderRadius: "14px",
                    background: formState === "sending"
                      ? "rgba(139,92,246,0.4)"
                      : "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    border: "none",
                    cursor: formState === "sending" ? "not-allowed" : "pointer",
                    boxShadow: formState === "sending" ? "none" : "0 0 24px rgba(139,92,246,0.45)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { if (formState !== "sending") (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                >
                  {formState === "sending"
                    ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Enviando…</>
                    : <><Send size={16} /> Enviar mensaje</>
                  }
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(37,211,102,0.08)",
                      color: "#25D366",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "1px solid rgba(37,211,102,0.3)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(37,211,102,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(37,211,102,0.08)"; }}
                  >
                    <MessageCircle size={15} /> WhatsApp directo
                  </button>
                  <button
                    type="button"
                    onClick={openInstagram}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(225,48,108,0.08)",
                      color: "#E1306C",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: "1px solid rgba(225,48,108,0.3)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(225,48,108,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(225,48,108,0.08)"; }}
                  >
                    <IgGlyph size={15} /> Instagram
                  </button>
                </div>
              </div>

              <p style={{ fontSize: "11px", color: "rgba(241,245,249,0.3)", textAlign: "center", lineHeight: 1.5 }}>
                Tus datos son tratados con privacidad. Ver{" "}
                <a href="/terminos" style={{ color: "rgba(168,85,247,0.7)", textDecoration: "none" }}>Términos y Condiciones</a>.
              </p>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
