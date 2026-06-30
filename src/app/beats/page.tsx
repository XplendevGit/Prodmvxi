import type { Metadata } from "next";
import BeatsExplorer from "@/components/BeatsExplorer";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Catálogo de Beats — Comprar Trap, Reggaetón y Type Beats | Prod. Mvxii",
  description:
    "Catálogo completo de beats e instrumentales de Prod. Mvxii. Filtra por género, estilo, artista (type beat) y BPM. Reggaetón, trap, drill, old school y más, listos para comprar.",
  alternates: { canonical: "/beats" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/beats",
    siteName: "Prod. Mvxii",
    title: "Catálogo de Beats — Comprar Type Beats | Prod. Mvxii",
    description:
      "Instrumentales de trap, reggaetón y drill. Filtra por género, artista y BPM.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Catálogo de beats de Prod. Mvxii" }],
  },
};

export default function BeatsPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Beats", path: "/beats" },
        ])}
      />
      <BeatsExplorer />
      <Footer />
    </>
  );
}
