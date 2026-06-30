// ─────────────────────────────────────────────────────────────────────────────
// Beats data layer (server-side). Single source of truth for the catalog so it
// can be consumed both by the /api/beats route AND server-rendered into the page
// (no client fetch required → works in in-app browsers + improves SEO).
// Source priority: Google Drive (flat audio) → BeatStars public API → demo.
// ─────────────────────────────────────────────────────────────────────────────
import { DRIVE_ROOT_FOLDER_ID, getDriveAccessToken } from "@/lib/googleDrive";

const BEATSTARS_USER = "prodmvxii";

const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
  "audio/flac", "audio/aiff", "audio/x-aiff", "audio/ogg", "audio/x-m4a",
]);
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".aiff", ".ogg", ".m4a"];

export type BeatMode = "drive" | "beatstars" | "demo";

export interface BeatsResult {
  beats: Record<string, unknown>[];
  mode: BeatMode;
  hasMore: boolean;
  total?: number;
}

function parseBeatInfo(filename: string) {
  const nameWithoutExt = filename.replace(/\.[^.]+$/, "");
  const bpm = nameWithoutExt.match(/(\d{2,3})\s*bpm/i)?.[1] ?? "130";
  const genres = ["Trap", "Hip-Hop", "Drill", "Afrobeat", "Reggaeton", "R&B", "Boom Bap", "Lo-Fi"];
  const genre = genres.find((g) => nameWithoutExt.toLowerCase().includes(g.toLowerCase())) || "Hip-Hop";
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

function demoResult(): BeatsResult {
  return {
    beats: DEMO_BEATS.map((b) => ({ ...b, previewUrl: null, streamUrl: null, isDemoMode: true, isBeatstarsMode: false })),
    mode: "demo",
    hasMore: false,
  };
}

// ── Google Drive (flat audio in the root folder) ─────────────────────────────
interface DriveFile {
  id?: string | null; name?: string | null; mimeType?: string | null;
  size?: string | null; createdTime?: string | null; webViewLink?: string | null;
}

async function getDriveAudioFiles(accessToken: string, folderId: string): Promise<DriveFile[]> {
  try {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id,name,mimeType,size,createdTime,webViewLink)",
      pageSize: "100",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { files?: DriveFile[] };
    return data.files || [];
  } catch {
    return [];
  }
}

// ── BeatStars public GraphQL API ─────────────────────────────────────────────
const BEATSTARS_GRAPHQL = "https://core.prod.beatstars.net/graphql";

interface BsTrack {
  id: string; title: string;
  bundle?: { hls?: { url?: string; duration?: number } | null; stream?: { url?: string; duration?: number } | null; waveform?: { url?: string } | null } | null;
  metadata?: { tags?: string[]; bpm?: number; free?: boolean } | null;
  price?: number | null;
  seoMetadata?: { slug?: string } | null;
  artwork?: { sizes?: { mini?: string; small?: string; medium?: string; large?: string } | null } | null;
}

const GENRE_KEYWORDS: Record<string, string> = {
  trap: "Trap", drill: "Drill", reggaeton: "Reggaeton", reggae: "Reggaeton",
  afrobeat: "Afrobeat", afro: "Afrobeat", "hip hop": "Hip-Hop", "hip-hop": "Hip-Hop",
  rap: "Hip-Hop", "boom bap": "Boom Bap", "lo-fi": "Lo-Fi", lofi: "Lo-Fi",
  "r&b": "R&B", rnb: "R&B", dembow: "Dembow", perreo: "Reggaeton",
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
      headers: { "Content-Type": "application/json", Origin: "https://www.beatstars.com", "User-Agent": "Mozilla/5.0" },
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
    artwork: t.artwork?.sizes?.medium || t.artwork?.sizes?.small || t.artwork?.sizes?.large || t.artwork?.sizes?.mini || null,
    duration: t.bundle?.hls?.duration || t.bundle?.stream?.duration || null,
    beatstarsUrl: t.seoMetadata?.slug ? `https://www.beatstars.com/beat/${t.seoMetadata.slug}` : `https://www.beatstars.com/${BEATSTARS_USER}`,
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

async function beatstarsAll(): Promise<BeatsResult | null> {
  const memberId = await getMemberId();
  if (!memberId) return null;
  const PAGE = 100, MAX_PAGES = 20;
  const all: BsTrack[] = [];
  for (let p = 0; p < MAX_PAGES; p++) {
    const data = await bsGraphql<{ profileTracks: { content: BsTrack[] } | null }>(TRACKS_QUERY, { memberId, page: p, size: PAGE });
    const tracks = data?.profileTracks?.content || [];
    all.push(...tracks);
    if (tracks.length < PAGE) break;
  }
  if (all.length === 0) return null;
  const beats = all.map(mapTrack).filter(Boolean) as Record<string, unknown>[];
  return { beats, mode: "beatstars", hasMore: false, total: beats.length };
}

async function beatstarsPage(page: number, size: number): Promise<BeatsResult | null> {
  const memberId = await getMemberId();
  if (!memberId) return null;
  const data = await bsGraphql<{ profileTracks: { content: BsTrack[] } | null }>(TRACKS_QUERY, { memberId, page, size });
  const tracks = data?.profileTracks?.content || [];
  if (tracks.length === 0) return page === 0 ? null : { beats: [], mode: "beatstars", hasMore: false };
  const beats = tracks.map(mapTrack).filter(Boolean) as Record<string, unknown>[];
  return { beats, mode: "beatstars", hasMore: tracks.length === size };
}

// ── Public entry point ───────────────────────────────────────────────────────
export async function getBeats(opts: { all?: boolean; page?: number; size?: number } = {}): Promise<BeatsResult> {
  const { all = false } = opts;
  const page = Math.max(0, opts.page ?? 0);
  const size = Math.min(100, Math.max(1, opts.size ?? 12));

  // 1. Google Drive (flat audio in the root folder) — only if a token is configured.
  const accessToken = await getDriveAccessToken();
  if (accessToken) {
    const files = await getDriveAudioFiles(accessToken, DRIVE_ROOT_FOLDER_ID);
    const audioFiles = files.filter((f) => {
      const mime = f.mimeType || "";
      const name = (f.name || "").toLowerCase();
      return AUDIO_MIME_TYPES.has(mime) || AUDIO_EXTENSIONS.some((ext) => name.endsWith(ext));
    });
    if (audioFiles.length > 0) {
      const beats = audioFiles.map((file) => {
        const info = parseBeatInfo(file.name || "Beat");
        return {
          id: file.id, name: info.name, originalName: file.name, mimeType: file.mimeType,
          size: file.size, bpm: info.bpm, genre: info.genre, price: "$24.99",
          previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          streamUrl: `https://docs.google.com/uc?export=open&id=${file.id}`,
          viewUrl: file.webViewLink, isDemoMode: false, isBeatstarsMode: false,
        };
      });
      return { beats, mode: "drive", hasMore: false };
    }
  }

  // 2. BeatStars public API
  const bs = all ? await beatstarsAll() : await beatstarsPage(page, size);
  if (bs) return bs;

  // 3. Demo fallback
  return demoResult();
}
