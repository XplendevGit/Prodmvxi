import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import BeatGrid from "@/components/BeatGrid";
import LazySection from "@/components/LazySection";

// ── Below-fold components ─────────────────────────────────────────────────────
// next/dynamic splits these into separate JS chunks that only download when
// the section is about to enter the viewport (combined with LazySection).
const SocialHero     = dynamic(() => import("@/components/SocialHero"));
const SpotifySection = dynamic(() => import("@/components/SpotifySection"));
const Licenses       = dynamic(() => import("@/components/Licenses"));
const ContactForm    = dynamic(() => import("@/components/ContactForm"));
const SocialLinks    = dynamic(() => import("@/components/SocialLinks"));
const Footer         = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
      {/* ── Above fold — always eager ─────────────────────────── */}
      <Navigation />
      <Hero />
      <BeatGrid />

      {/* ── Below fold — lazy-mounted + code-split ────────────── */}
      <LazySection placeholder="380px" rootMargin="600px 0px">
        <SocialHero />
      </LazySection>

      <LazySection placeholder="320px" rootMargin="600px 0px">
        <SpotifySection />
      </LazySection>

      <LazySection placeholder="820px" rootMargin="700px 0px">
        <Licenses />
      </LazySection>

      <LazySection placeholder="560px" rootMargin="700px 0px">
        <ContactForm />
      </LazySection>

      <LazySection placeholder="440px" rootMargin="600px 0px">
        <SocialLinks />
      </LazySection>

      <LazySection placeholder="320px" rootMargin="400px 0px">
        <Footer />
      </LazySection>
    </div>
  );
}
