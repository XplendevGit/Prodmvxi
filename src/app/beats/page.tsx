import type { Metadata } from "next";
import BeatsExplorer from "@/components/BeatsExplorer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Todos los Beats | Prod. Mvxii",
  description:
    "Catálogo completo de beats de Prod. Mvxii. Filtra por género, estilo, artista (type beat) y BPM. Reggaeton, Trap, Old School y más.",
};

export default function BeatsPage() {
  return (
    <>
      <BeatsExplorer />
      <Footer />
    </>
  );
}
