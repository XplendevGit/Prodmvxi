import { headers } from "next/headers";

// Renders one or more JSON-LD blocks. Server component — the markup ships in the
// initial HTML so crawlers and AI engines (GEO) read it without executing JS.
// Reads the per-request CSP nonce so the inline <script> passes the strict CSP.
export default async function StructuredData({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          nonce={nonce}
          // JSON.stringify output is safe to inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
