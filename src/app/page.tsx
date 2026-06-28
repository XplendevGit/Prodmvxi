import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SocialHero from "@/components/SocialHero";
import SpotifySection from "@/components/SpotifySection";
import BeatGrid from "@/components/BeatGrid";
import Licenses from "@/components/Licenses";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
      <Navigation />
      <Hero />
      <SocialHero />
      <SpotifySection />
      <BeatGrid />
      <Licenses />
      <ContactForm />
      <SocialLinks />

      {/* Footer */}
      <footer
        style={{
          background: "#030305",
          borderTop: "1px solid rgba(139,92,246,0.15)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Image
            src="/Logo_Maxi.jpeg"
            alt="Prod. Mvxii"
            width={60}
            height={60}
            style={{
              borderRadius: "50%",
              filter: "drop-shadow(0 0 10px rgba(139,92,246,0.6))",
            }}
          />

          <div
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(241,245,249,0.3)",
              textAlign: "center",
            }}
          >
            © 2024 Prod. Mvxii · Todos los derechos reservados
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "rgba(241,245,249,0.2)",
              textAlign: "center",
              letterSpacing: "1px",
            }}
          >
            Beats disponibles en{" "}
            <a
              href="https://www.beatstars.com/prodmvxii"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#8B5CF6", textDecoration: "none" }}
            >
              BeatStars.com/prodmvxii
            </a>
          </div>

          {/* Neon line */}
          <div
            style={{
              width: "200px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #8B5CF6, #06B6D4, transparent)",
              boxShadow: "0 0 10px rgba(139,92,246,0.5)",
            }}
          />
        </div>
      </footer>
    </div>
  );
}
