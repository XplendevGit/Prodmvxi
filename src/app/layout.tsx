import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE_URL, SITE_NAME, CORE_KEYWORDS, GA_MEASUREMENT_ID, musicGroupLd, webSiteLd } from "@/lib/seo";

// Geist Mono removed — not used in the visual design (saves ~40 KB of font data)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",      // text visible immediately with system font while Geist loads
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Prod. Mvxii | Comprar Beats de Trap, Reggaetón, Drill y Afrobeat",
  description:
    "Beats e instrumentales de alta calidad por Prod. Mvxii, productor de Chile. Trap, reggaetón, drill, afrobeat, hip-hop y dembow. Type beats y bases listas para grabar, con licencias Basic, Standard, Premium y Exclusiva.",
  keywords: CORE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "music",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Prod. Mvxii | Comprar Beats de Trap, Reggaetón y Drill",
    description:
      "Beats e instrumentales urbanos listos para grabar. Type beats de trap, reggaetón, drill y afrobeat por Prod. Mvxii.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Prod. Mvxii — Beats de Trap, Reggaetón, Drill y Afrobeat" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prod. Mvxii | Comprar Beats Online",
    description:
      "Beats e instrumentales de trap, reggaetón, drill y afrobeat por Prod. Mvxii. Type beats listos para grabar.",
    images: ["/og.png"],
  },
  // To verify in Google Search Console, add the token here:
  // verification: { google: "TOKEN_DE_SEARCH_CONSOLE" },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to Google Fonts origin (fonts already handled by next/font,
            but this hint speeds up any remaining cross-origin font fetch) */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preconnect to Google Drive for beat artwork + audio thumbnails */}
        <link rel="preconnect" href="https://drive.google.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ background: "#050508", color: "#F1F5F9" }}
      >
        {/* Global structured data — identifies the producer entity + site (GEO + rich results) */}
        <StructuredData data={[musicGroupLd(), webSiteLd()]} />
        {/* GA4 — Measurement ID resolved from env with a public-by-design fallback */}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        {children}
      </body>
    </html>
  );
}
