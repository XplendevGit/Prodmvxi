import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Applies strong security headers to every HTML page response. The static
// `public/_headers` only covers static assets on Cloudflare Workers — pages
// rendered by the Worker need this middleware. Uses a per-request nonce so the
// CSP can forbid arbitrary inline scripts (strong XSS protection) while still
// allowing Next.js' own scripts, Google Analytics, and JSON-LD.
export function middleware(request: NextRequest) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    // React inline style attributes + <style> tags require 'unsafe-inline' for styles.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `media-src 'self' blob: https:`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `connect-src 'self' https://api.brevo.com https://core.prod.beatstars.net https://www.googleapis.com https://oauth2.googleapis.com https://fonts.googleapis.com https://fonts.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://docs.google.com https://drive.google.com https://lh3.googleusercontent.com`,
    `frame-src https://open.spotify.com https://drive.google.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  return response;
}

export const config = {
  // Apply to pages only; skip API routes and static assets (own headers).
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|og.png|Logo_Maxi.jpeg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
