"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ShoppingCart } from "lucide-react";
import { WA_CONTACT_URL } from "@/lib/whatsapp";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Beats", href: "#beats" },
    { label: "Licencias", href: "#licencias" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openWhatsApp = () => {
    setMenuOpen(false);
    window.open(WA_CONTACT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(5,5,8,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(139,92,246,0.2)" : "none",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Image
              src="/Logo_Maxi.jpeg"
              alt="Prod. Mvxii"
              width={55}
              height={55}
              style={{ borderRadius: "50%", filter: "drop-shadow(0 0 8px rgba(139,92,246,0.8))" }}
            />
          </button>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="hidden-mobile">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#F1F5F9",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  position: "relative",
                  padding: "4px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#A855F7";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "#F1F5F9";
                }}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={openWhatsApp}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#25D366",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "4px 0",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = "#128C7E"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = "#25D366"; }}
            >
              Contacto
            </button>

            <a
              href="https://www.beatstars.com/prodmvxii"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "50px",
                background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 0 20px rgba(139,92,246,0.5)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(168,85,247,0.8)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(139,92,246,0.5)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              }}
            >
              <ShoppingCart size={14} />
              COMPRAR AHORA
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#F1F5F9",
              padding: "4px",
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "rgba(5,5,8,0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(139,92,246,0.2)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#F1F5F9",
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={openWhatsApp}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#25D366",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              textAlign: "left",
            }}
          >
            Contacto (WhatsApp)
          </button>
          <a
            href="https://www.beatstars.com/prodmvxii"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 24px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            COMPRAR AHORA
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
