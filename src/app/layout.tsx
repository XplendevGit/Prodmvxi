import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "#050508", color: "#F1F5F9" }}>
        {children}
      </body>
    </html>
  );
}
