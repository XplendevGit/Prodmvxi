// Renders one or more JSON-LD blocks. Server component — the markup ships in the
// initial HTML so crawlers and AI engines (GEO) read it without executing JS.
export default function StructuredData({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inline; CSP allows 'unsafe-inline' scripts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
