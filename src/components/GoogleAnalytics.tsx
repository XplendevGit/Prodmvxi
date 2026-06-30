"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// GA4 with App-Router SPA page-view tracking. Renders nothing (and loads no
// script) unless a Measurement ID is provided, so it's a safe no-op until
// NEXT_PUBLIC_GA_ID is set in the environment.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GoogleAnalytics({ gaId, nonce }: { gaId?: string; nonce?: string }) {
  const pathname = usePathname();

  // Fire a page_view on client-side route changes (the initial load is handled
  // by the config call in the inline script below).
  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    window.gtag("config", gaId, { page_path: pathname });
  }, [pathname, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
