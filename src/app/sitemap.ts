import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Served at /sitemap.xml. Currently lists the live, indexable routes.
// When the genre / type-beat landing pages (Phase 2) ship, map GENRE_LANDINGS
// and ARTISTS here so they are discovered automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/beats`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
