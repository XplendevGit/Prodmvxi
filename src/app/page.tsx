import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import DriveExplorer from "@/components/DriveExplorer";
import Hero from "@/components/Hero";
import BeatGrid from "@/components/BeatGrid";
import LazySection from "@/components/LazySection";
import StructuredData from "@/components/StructuredData";
import FaqSection, { FAQ_ITEMS } from "@/components/FaqSection";
import { licensesProductLd, faqPageLd } from "@/lib/seo";

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
      {/* Home structured data: beat-licensing product + FAQ (rich results + GEO) */}
      <StructuredData data={[licensesProductLd(), faqPageLd(FAQ_ITEMS)]} />

      {/* ── Above fold — always eager ─────────────────────────── */}
      <Navigation />
      <Hero />
      {/* Futuristic Google Drive folder explorer — right below the hero/portada */}
      <DriveExplorer />
      <BeatGrid />

      {/* ── Below fold — lazy-mounted + code-split ────────────── */}
      <LazySection placeholder="380px" rootMargin="600px 0px">
        <SocialHero />
      </LazySection>

      <LazySection placeholder="320px" rootMargin="600px 0px">
        <SpotifySection />
      </LazySection>

      {/* Licenses rendered eagerly — pricing/keyword text + internal links ship
          in the server HTML (matches the Product/Offer JSON-LD). */}
      <Licenses />

      {/* FAQ is rendered eagerly (not lazy-gated) so its answers ship in the
          server HTML — required for rich results + AI/GEO citation. */}
      <FaqSection />

      <LazySection placeholder="560px" rootMargin="700px 0px">
        <ContactForm />
      </LazySection>

      <LazySection placeholder="440px" rootMargin="600px 0px">
        <SocialLinks />
      </LazySection>

      {/* Footer rendered eagerly — sitewide internal links + NAP (contact) must
          be crawlable in the server HTML. */}
      <Footer />
    </div>
  );
}
