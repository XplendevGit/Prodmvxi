import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// Geist Mono removed — not used in the visual design (saves ~40 KB of font data)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",      // text visible immediately with system font while Geist loads
  preload: true,
});

export const metadata: Metadata = {
  title: "Prod. Mvxii | Beats Profesionales",
  description:
    "Beats exclusivos de alta calidad por Prod. Mvxii. Trap, Hip-Hop, Drill, Afrobeat y más. Licencias Básica, Estándar, Premium y Exclusiva.",
  keywords: ["beats", "trap", "hip hop", "prod mvxii", "licencias", "música"],
  openGraph: {
    title: "Prod. Mvxii | Beats Profesionales",
    description: "Beats exclusivos de alta calidad",
    type: "website",
  },
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
        {children}
      </body>
    </html>
  );
}
