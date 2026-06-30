import { getDriveAccessToken } from "@/lib/googleDrive";

// GET /api/drive/audio?id=<fileId>
// Streams a Drive audio file through our authenticated Worker so it plays in the
// site's own player (same-origin, reliable, supports seeking via Range). Files
// stay private — they're never exposed publicly. Only audio content is served.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^[A-Za-z0-9_-]{10,}$/.test(id)) {
    return new Response("Bad request", { status: 400 });
  }

  const token = await getDriveAccessToken();
  if (!token) return new Response("Drive not configured", { status: 503 });

  const range = req.headers.get("range");
  const driveRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${token}`, ...(range ? { Range: range } : {}) } }
  );

  if (!driveRes.ok && driveRes.status !== 206) {
    const status = driveRes.status === 401 || driveRes.status === 403 ? 403 : 404;
    return new Response("Not available", { status });
  }

  // Defense-in-depth: only serve audio (or undetermined binary), never docs/images.
  const ct = driveRes.headers.get("content-type") || "application/octet-stream";
  if (!(ct.startsWith("audio/") || ct === "application/octet-stream")) {
    return new Response("Forbidden", { status: 403 });
  }

  // Buffer the (range) slice and return a complete response with a definite
  // Content-Length. This is far more reliable for <audio> elements than piping
  // a subrequest stream through, and audio previews are only a few MB.
  const buf = await driveRes.arrayBuffer();

  const headers = new Headers();
  headers.set("content-type", ct.startsWith("audio/") ? ct : "audio/mpeg");
  headers.set("content-length", String(buf.byteLength));
  const contentRange = driveRes.headers.get("content-range");
  if (contentRange) headers.set("content-range", contentRange);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "private, max-age=3600");

  return new Response(buf, { status: driveRes.status, headers });
}
