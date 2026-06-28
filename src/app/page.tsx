import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SocialHero from "@/components/SocialHero";
import SpotifySection from "@/components/SpotifySection";
import BeatGrid from "@/components/BeatGrid";
import Licenses from "@/components/Licenses";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

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

      <Footer />
    </div>
  );
}
