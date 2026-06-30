"use client";

import Image from "next/image";
import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.54V6.79a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2.1C.7 15.5 1 17.5 1 17.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.7 21.7 12 21.7 12 21.7s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.3v-2c0-2.1-.3-4.3-.3-4.3zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: <InstagramIcon />, href: "https://www.instagram.com/prodmvxii", label: "Instagram", color: "#E1306C" },
  { icon: <TikTokIcon />, href: "https://www.tiktok.com/@prodmvxii", label: "TikTok", color: "#69C9D0" },
  { icon: <YouTubeIcon />, href: "https://www.youtube.com/@prodmvxii", label: "YouTube", color: "#FF0000" },
  { icon: <WhatsAppIcon />, href: "https://wa.me/56932907119?text=" + encodeURIComponent("¡Hola Prod. Mvxii! 👋 Quiero info sobre tus beats."), label: "WhatsApp", color: "#25D366" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#030305",
        borderTop: "1px solid rgba(139,92,246,0.15)",
        padding: "64px 24px 160px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <Image
                src="/Logo_Maxi.jpeg"
                alt="Prod. Mvxii — productor de beats, logo"
                width={48}
                height={48}
                style={{ borderRadius: "50%", filter: "drop-shadow(0 0 8px rgba(139,92,246,0.6))" }}
              />
              <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "2px", color: "#F1F5F9" }}>
                PROD. MVXII
              </span>
            </div>
            <p style={{ color: "rgba(241,245,249,0.45)", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
              Productor musical independiente. Beats originales de alta calidad para artistas emergentes y consolidados.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "10px" }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(241,245,249,0.5)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = s.color;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = s.color + "60";
                    (e.currentTarget as HTMLAnchorElement).style.background = s.color + "15";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(139,92,246,0.2)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139,92,246,0.08)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", color: "#A855F7", textTransform: "uppercase", marginBottom: "20px" }}>
              Navegación
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Beats", href: "/#beats" },
                { label: "Todos los beats", href: "/beats" },
                { label: "Licencias", href: "/#licencias" },
                { label: "Contacto", href: "/#contacto-form" },
                { label: "Términos y Condiciones", href: "/terminos" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{ color: "rgba(241,245,249,0.5)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)"; }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Purchase */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", color: "#A855F7", textTransform: "uppercase", marginBottom: "20px" }}>
              Comprar
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Tienda BeatStars", href: "https://www.beatstars.com/prodmvxii" },
                { label: "Licencia Basic", href: "https://www.beatstars.com/prodmvxii" },
                { label: "Licencia Standard", href: "https://www.beatstars.com/prodmvxii" },
                { label: "Licencia Premium", href: "https://www.beatstars.com/prodmvxii" },
                { label: "Licencia Exclusiva", href: "https://wa.me/56932907119" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "rgba(241,245,249,0.5)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)"; }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", color: "#A855F7", textTransform: "uppercase", marginBottom: "20px" }}>
              Contacto
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <a
                href="https://wa.me/56932907119"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(241,245,249,0.5)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#25D366"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)"; }}
              >
                <span style={{ color: "#25D366" }}><WhatsAppIcon /></span>
                +56 9 3290 7119
              </a>
              <a
                href="mailto:prodmvxi@gmail.com"
                style={{ color: "rgba(241,245,249,0.5)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)"; }}
              >
                prodmvxi@gmail.com
              </a>
              <a
                href="https://www.beatstars.com/prodmvxii"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(241,245,249,0.5)", fontSize: "13px", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.5)"; }}
              >
                beatstars.com/prodmvxii
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)", marginBottom: "28px" }} />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ color: "rgba(241,245,249,0.25)", fontSize: "12px", margin: 0 }}>
            © 2026 Prod. Mvxii · Todos los derechos reservados
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link
              href="/terminos"
              style={{ color: "rgba(241,245,249,0.3)", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.3)"; }}
            >
              Términos y Condiciones
            </Link>
            <a
              href="mailto:prodmvxi@gmail.com"
              style={{ color: "rgba(241,245,249,0.3)", fontSize: "12px", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A855F7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(241,245,249,0.3)"; }}
            >
              Privacidad
            </a>
          </div>
        </div>

        {/* Credits */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(139,92,246,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p style={{ fontSize: "10px", color: "rgba(241,245,249,0.18)", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>
            Desarrollado por
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <a
              href="https://xplendev.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 800, fontSize: "13px", letterSpacing: "3px", color: "rgba(6,182,212,0.55)", textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#06B6D4"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(6,182,212,0.55)"; }}
            >
              XPLENDEV
            </a>
            <span
              style={{
                fontSize: "18px",
                color: "rgba(139,92,246,0.4)",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              ×
            </span>
            <span
              style={{
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "3px",
                color: "rgba(168,85,247,0.55)",
                textTransform: "uppercase",
              }}
            >
              PROD. MVXII
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
