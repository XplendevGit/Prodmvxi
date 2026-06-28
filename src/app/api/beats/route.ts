import { NextResponse } from "next/server";

const FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || "1s77i1a4EbVydfsBdZCO9bqZ6sEU3AOAe";
const BEATSTARS_USER = "prodmvxii";

const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/aiff",
  "audio/x-aiff",
  "audio/ogg",
  "audio/x-m4a",
]);

const AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".aiff", ".ogg", ".m4a"];

interface DriveFile {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
  size?: string | null;
  createdTime?: string | null;
  webViewLink?: string | null;
}

function parseBeatInfo(filename: string) {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, "");
  const bpmMatch = nameWithoutExt.match(/(\d{2,3})\s*bpm/i);
  const bpm = bpmMatch ? bpmMatch[1] : "130";

  const genres = ["Trap", "Hip-Hop", "Drill", "Afrobeat", "Reggaeton", "R&B", "Boom Bap", "Lo-Fi"];
  const genreMatch = genres.find((g) =>
    nameWithoutExt.toLowerCase().includes(g.toLowerCase())
  );
  const genre = genreMatch || "Hip-Hop";

  const cleanName = nameWithoutExt
    .replace(/\s*-\s*\d{2,3}\s*bpm\s*/i, "")
    .replace(/\s*-\s*(trap|hip.hop|drill|afrobeat|reggaeton|r&b|boom\s*bap|lo.fi)\s*/i, "")
    .trim();

  return { name: cleanName || nameWithoutExt, bpm, genre };
}

const DEMO_BEATS = [
  { id: "demo1", name: "Dark Trap 808", bpm: "140", genre: "Trap", price: "$24.99" },
  { id: "demo2", name: "Lo-Fi Dreams", bpm: "90", genre: "Lo-Fi", price: "$24.99" },
  { id: "demo3", name: "Afrobeat Vibes", bpm: "105", genre: "Afrobeat", price: "$24.99" },
  { id: "demo4", name: "Drill London", bpm: "142", genre: "Drill", price: "$24.99" },
  { id: "demo5", name: "Reggaeton Fire", bpm: "96", genre: "Reggaeton", price: "$24.99" },
  { id: "demo6", name: "Hip Hop Classic", bpm: "88", genre: "Hip-Hop", price: "$24.99" },
  { id: "demo7", name: "Melodic Trap", bpm: "145", genre: "Trap", price: "$24.99" },
  { id: "demo8", name: "Boom Bap Gold", bpm: "92", genre: "Boom Bap", price: "$24.99" },
];

function demoResponse() {
  return NextResponse.json({
    beats: DEMO_BEATS.map((b) => ({
      ...b,
      previewUrl: null,
      streamUrl: null,
      isDemoMode: true,
      isBeatstarsMode: false,
    })),
    page: 0,
    hasMore: false,
    mode: "demo",
  });
}

// ── Google Drive via REST API (fetch-based, Edge-compatible) ─────────────────
async function getGoogleAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { access_token?: string };
    return data.access_token || null;
  } catch {
    return null;
  }
}

async function getDriveFiles(accessToken: string, folderId: string): Promise<DriveFile[]> {
  try {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id,name,mimeType,size,createdTime,webViewLink)",
      pageSize: "100",
    });
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return [];
    const data = await res.json() as { files?: DriveFile[] };
    return data.files || [];
  } catch {
    return [];
  }
}

// ── BeatStars public GraphQL API ─────────────────────────────────────────────
const BEATSTARS_GRAPHQL = "https://core.prod.beatstars.net/graphql";

interface BsBundle {
  hls?: { url?: string; duration?: number } | null;
  stream?: { url?: string; duration?: number } | null;
  waveform?: { url?: string } | null;
}
interface BsArtwork {
  sizes?: { mini?: string; small?: string; medium?: string; large?: string } | null;
}
interface BsTrack {
  id: string;
  title: string;
  bundle?: BsBundle | null;
  metadata?: { tags?: string[]; bpm?: number; free?: boolean } | null;
  price?: number | null;
  seoMetadata?: { slug?: string } | null;
  artwork?: BsArtwork | null;
}

const GENRE_KEYWORDS: Record<string, string> = {
  trap: "Trap",
  drill: "Drill",
  reggaeton: "Reggaeton",
  reggae: "Reggaeton",
  afrobeat: "Afrobeat",
  afro: "Afrobeat",
  "hip hop": "Hip-Hop",
  "hip-hop": "Hip-Hop",
  rap: "Hip-Hop",
  "boom bap": "Boom Bap",
  "lo-fi": "Lo-Fi",
  lofi: "Lo-Fi",
  "r&b": "R&B",
  rnb: "R&B",
  dembow: "Dembow",
  perreo: "Reggaeton",
};

function detectGenre(tags: string[], title: string): string {
  const haystack = [...tags, title].join(" ").toLowerCase();
  for (const [keyword, genre] of Object.entries(GENRE_KEYWORDS)) {
    if (haystack.includes(keyword)) return genre;
  }
  return "Hip-Hop";
}

async function bsGraphql<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(BEATSTARS_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://www.beatstars.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as T) ?? null;
  } catch {
    return null;
  }
}

const TRACKS_QUERY = `query($memberId:String!,$page:Int,$size:Int){profileTracks(memberId:$memberId,page:$page,size:$size){content{id title bundle{stream{url duration} hls{url duration} waveform{url}} metadata{tags bpm free} price seoMetadata{slug} artwork{sizes{mini small medium large}}}}}`;

function mapTrack(t: BsTrack) {
  const hls = t.bundle?.hls?.url || null;
  if (!hls) return null;
  const tags = t.metadata?.tags || [];
  return {
    id: t.id,
    name: t.title,
    bpm: t.metadata?.bpm?.toString() || "130",
    bpmNum: typeof t.metadata?.bpm === "number" ? t.metadata.bpm : null,
    genre: detectGenre(tags, t.title),
    tags,
    price: t.price != null ? `$${Number(t.price).toFixed(2)}` : "$24.99",
    previewUrl: hls,
    streamUrl: hls,
    isHls: true,
    waveformUrl: t.bundle?.waveform?.url || null,
    artwork:
      t.artwork?.sizes?.medium ||
      t.artwork?.sizes?.small ||
      t.artwork?.sizes?.large ||
      t.artwork?.sizes?.mini ||
      null,
    duration: t.bundle?.hls?.duration || t.bundle?.stream?.duration || null,
    beatstarsUrl: t.seoMetadata?.slug
      ? `https://www.beatstars.com/beat/${t.seoMetadata.slug}`
      : `https://www.beatstars.com/${BEATSTARS_USER}`,
    isDemoMode: false,
    isBeatstarsMode: true,
  };
}

async function getMemberId(): Promise<string | null> {
  const profile = await bsGraphql<{ profileByUsername: { memberId: string } | null }>(
    `query($username:String!){profileByUsername(username:$username){memberId}}`,
    { username: BEATSTARS_USER }
  );
  return profile?.profileByUsername?.memberId || null;
}

async function beatstarsResponse(page: number, size: number): Promise<NextResponse | null> {
  const memberId = await getMemberId();
  if (!memberId) return null;

  const data = await bsGraphql<{ profileTracks: { content: BsTrack[] } | null }>(
    TRACKS_QUERY,
    { memberId, page, size }
  );

  const tracks = data?.profileTracks?.content || [];
  if (tracks.length === 0)
    return page === 0 ? null : NextResponse.json({ beats: [], page, hasMore: false, mode: "beatstars" });

  const beats = tracks.map(mapTrack).filter(Boolean);
  const hasMore = tracks.length === size;

  return NextResponse.json({ beats, page, hasMore, mode: "beatstars" });
}

async function beatstarsResponseAll(): Promise<NextResponse | null> {
  const memberId = await getMemberId();
  if (!memberId) return null;

  const PAGE = 100;
  const MAX_PAGES = 20;
  const all: BsTrack[] = [];

  for (let p = 0; p < MAX_PAGES; p++) {
    const data = await bsGraphql<{ profileTracks: { content: BsTrack[] } | null }>(
      TRACKS_QUERY,
      { memberId, page: p, size: PAGE }
    );
    const tracks = data?.profileTracks?.content || [];
    all.push(...tracks);
    if (tracks.length < PAGE) break;
  }

  if (all.length === 0) return null;

  const beats = all.map(mapTrack).filter(Boolean);
  return NextResponse.json({ beats, total: beats.length, hasMore: false, mode: "beatstars" });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fetchAll = searchParams.get("all") === "1";
  const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10) || 0);
  const size = Math.min(100, Math.max(1, parseInt(searchParams.get("size") || "12", 10) || 12));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const rawToken = process.env.GOOGLE_REFRESH_TOKEN || "";
  const hasValidToken =
    rawToken.length > 20 && !rawToken.startsWith("PEGA_") && rawToken !== "tu_refresh_token_aqui";

  // ── 1. Try Google Drive via OAuth (fetch-based) ───────────────────────────
  if (clientId && clientSecret && hasValidToken) {
    const accessToken = await getGoogleAccessToken(clientId, clientSecret, rawToken);
    if (accessToken) {
      const files = await getDriveFiles(accessToken, FOLDER_ID);
      const audioFiles = files.filter((f) => {
        const mime = f.mimeType || "";
        const name = (f.name || "").toLowerCase();
        return (
          AUDIO_MIME_TYPES.has(mime) ||
          AUDIO_EXTENSIONS.some((ext) => name.endsWith(ext))
        );
      });

      if (audioFiles.length > 0) {
        const beats = audioFiles.map((file) => {
          const { name, bpm, genre } = parseBeatInfo(file.name || "Beat");
          return {
            id: file.id,
            name,
            originalName: file.name,
            mimeType: file.mimeType,
            size: file.size,
            bpm,
            genre,
            price: "$24.99",
            previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
            streamUrl: `https://docs.google.com/uc?export=open&id=${file.id}`,
            viewUrl: file.webViewLink,
            isDemoMode: false,
            isBeatstarsMode: false,
          };
        });
        return NextResponse.json({ beats, page: 0, hasMore: false, mode: "drive" });
      }
    }
  }

  // ── 2. Fallback: BeatStars public API ─────────────────────────────────────
  const bsResult = fetchAll
    ? await beatstarsResponseAll()
    : await beatstarsResponse(page, size);
  if (bsResult) return bsResult;

  // ── 3. Last resort: static demo beats ─────────────────────────────────────
  return demoResponse();
}
