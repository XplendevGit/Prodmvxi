import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prod. Mvxii — Beats Profesionales",
    short_name: "Prod. Mvxii",
    description:
      "Beats e instrumentales de trap, reggaetón, drill y afrobeat por Prod. Mvxii. Comprar online con licencias Basic, Standard, Premium y Exclusiva.",
    start_url: "/",
    display: "standalone",
    background_color: "#050508",
    theme_color: "#8B5CF6",
    lang: "es",
    categories: ["music", "entertainment", "shopping"],
    icons: [
      { src: "/Logo_Maxi.jpeg", sizes: "512x512", type: "image/jpeg" },
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
  };
}
