// ─────────────────────────────────────────────────────────────────────────────
// Central SEO / GEO configuration for Prod. Mvxii
// Single source of truth for: canonical site URL, business identity, keyword
// sets, structured-data (JSON-LD) builders, and the genre/type-beat taxonomies
// used to generate sitemap entries and landing-page metadata.
// ─────────────────────────────────────────────────────────────────────────────

/** Canonical production origin (no trailing slash). Override with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://prodmvxii.com"
).replace(/\/$/, "");

export const SITE_NAME = "Prod. Mvxii";

/** GA4 Measurement ID. Public by design (it ships in the client HTML), so a code
 *  default is safe; override per-env with NEXT_PUBLIC_GA_ID if ever needed. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-LH197LBY45";

/** Contact / brand facts reused across metadata + JSON-LD. */
export const BUSINESS = {
  name: "Prod. Mvxii",
  alternateNames: ["ProdMvxii", "Prod Mvxii", "Mvxii", "Maxi"],
  legalNoun: "Productor musical",
  email: "prodmvxi@gmail.com",
  whatsapp: "+56932907119",
  whatsappDisplay: "+56 9 3290 7119",
  country: "Chile",
  areaServed: ["Chile", "Latinoamérica", "España", "Estados Unidos", "Worldwide"],
  beatstars: "https://www.beatstars.com/prodmvxii",
  social: {
    instagram: "https://www.instagram.com/prodmvxii",
    youtube: "https://www.youtube.com/@prodmvxii",
    tiktok: "https://www.tiktok.com/@prodmvxii",
    beatstars: "https://www.beatstars.com/prodmvxii",
  },
} as const;

export const PRIMARY_GENRES = [
  "Trap",
  "Reggaetón",
  "Hip-Hop",
  "Drill",
  "Afrobeat",
  "R&B",
  "Dembow",
  "Boom Bap",
] as const;

// ── Keyword sets ─────────────────────────────────────────────────────────────
// Intentionally trilingual (type beat / instrumental / base-pista) + geo.
export const CORE_KEYWORDS: string[] = [
  // Transactional ES
  "comprar beats online",
  "comprar instrumentales",
  "comprar bases de rap",
  "comprar pistas de reggaeton",
  "beats para vender",
  "instrumentales para grabar",
  "beats sin tag",
  "beats sin marca de agua",
  "licencia exclusiva beat",
  "beats para rapear",
  // Genre ES/EN
  "beats de trap",
  "instrumentales de trap",
  "bases de rap",
  "pistas de reggaeton",
  "instrumental de drill",
  "afrobeat type beat",
  "reggaeton type beat",
  "trap type beat",
  "drill type beat",
  "type beat español",
  // Geo / scene
  "beats chile",
  "productor de beats chile",
  "reggaeton chileno",
  "type beat chileno",
  "instrumentales urbanos latam",
  "música urbana 2026",
  // Brand
  "prod mvxii",
  "prodmvxii",
  "prod mvxii beats",
];

// ── Genre landing taxonomy (slug → display + copy) ───────────────────────────
export interface GenreEntry {
  slug: string;
  label: string;
  title: string;
  description: string;
}

export const GENRE_LANDINGS: GenreEntry[] = [
  {
    slug: "trap",
    label: "Trap",
    title: "Beats de Trap | Instrumentales de Trap para Comprar",
    description:
      "Instrumentales de trap con 808s profundos y hi-hats modernos, listos para grabar. Type beats de trap por Prod. Mvxii.",
  },
  {
    slug: "reggaeton",
    label: "Reggaetón",
    title: "Beats de Reggaetón | Pistas de Perreo y Reggaetón Chileno",
    description:
      "Pistas de reggaetón y perreo con flow urbano latino. Instrumentales de reggaetón chileno por Prod. Mvxii, listas para tu próximo hit.",
  },
  {
    slug: "drill",
    label: "Drill",
    title: "Beats de Drill | Instrumentales de Drill para Comprar",
    description:
      "Instrumentales de drill oscuros y con sliding 808s. Drill type beats por Prod. Mvxii, listos para artistas urbanos.",
  },
  {
    slug: "afrobeat",
    label: "Afrobeat",
    title: "Beats de Afrobeat | Instrumentales Afrobeat & Afro",
    description:
      "Instrumentales de afrobeat y afro con ritmos cálidos y bailables. Afrobeat type beats por Prod. Mvxii.",
  },
  {
    slug: "hip-hop",
    label: "Hip-Hop",
    title: "Beats de Hip-Hop & Boom Bap | Bases de Rap",
    description:
      "Bases de rap y beats de hip-hop, del boom bap clásico al rap moderno. Instrumentales para rapear por Prod. Mvxii.",
  },
  {
    slug: "dembow",
    label: "Dembow",
    title: "Beats de Dembow | Instrumentales de Dembow",
    description:
      "Instrumentales de dembow con groove caribeño para artistas urbanos. Dembow type beats por Prod. Mvxii.",
  },
];

// ── JSON-LD builders ─────────────────────────────────────────────────────────
type Json = Record<string, unknown>;

const abs = (path = "") => `${SITE_URL}${path}`;

/** The producer as a MusicGroup entity — the anchor of the knowledge graph. */
export function musicGroupLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": abs("/#musicgroup"),
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateNames,
    url: SITE_URL,
    image: abs("/Logo_Maxi.jpeg"),
    logo: abs("/Logo_Maxi.jpeg"),
    genre: [...PRIMARY_GENRES],
    description:
      "Prod. Mvxii (Maxi) es un productor musical de Chile especializado en beats e instrumentales de trap, reggaetón, drill, afrobeat y hip-hop para artistas urbanos de Latinoamérica y el mundo.",
    foundingLocation: { "@type": "Place", name: BUSINESS.country },
    areaServed: BUSINESS.areaServed,
    email: BUSINESS.email,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.whatsapp,
      email: BUSINESS.email,
      areaServed: BUSINESS.areaServed,
      availableLanguage: ["es", "en"],
    },
    sameAs: Object.values(BUSINESS.social),
  };
}

/** WebSite entity (brand + language). */
export function webSiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es",
    publisher: { "@id": abs("/#musicgroup") },
  };
}

/** Beat-licensing offering with an AggregateOffer over the fixed tiers. */
export function licensesProductLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs("/#beats"),
    name: "Beats e instrumentales de Prod. Mvxii",
    description:
      "Beats originales de trap, reggaetón, drill y afrobeat con licencias Basic, Standard, Premium y Exclusiva. Listos para grabar y distribuir en Spotify, YouTube y plataformas digitales.",
    image: abs("/Logo_Maxi.jpeg"),
    brand: { "@type": "Brand", name: BUSINESS.name },
    category: "Music Production / Beats",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "21.99",
      highPrice: "49.99",
      offerCount: 4,
      availability: "https://schema.org/InStock",
      url: BUSINESS.beatstars,
    },
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPageLd(items: FaqItem[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbLd(
  trail: { name: string; path: string }[]
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}
