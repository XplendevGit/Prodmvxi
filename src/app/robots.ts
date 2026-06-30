import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Served at /robots.txt. NOTE: Cloudflare may inject a *managed* robots.txt
// ("Content Signals") at the zone level that overrides this one — if so, disable
// "Manage robots.txt" in the Cloudflare dashboard so this file takes effect.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/setup", "/api/"],
      },
      // ── GEO: explicitly welcome AI / generative search engines so they can
      // read and cite the site (ChatGPT, Perplexity, Claude, Google AI, etc.).
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-Web",
          "Anthropic-AI",
          "Google-Extended",
          "Applebot",
          "Applebot-Extended",
          "Amazonbot",
          "DuckDuckBot",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/setup", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
