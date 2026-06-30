// ─────────────────────────────────────────────────────────────────────────────
// Google Drive access layer (fetch-based, Cloudflare Workers compatible).
// Shared by the folder-explorer API. Lists ONE folder's children at a time so
// the UI can mirror Drive's structure exactly via lazy navigation.
// ─────────────────────────────────────────────────────────────────────────────

export const DRIVE_ROOT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || "1e9JZ8FmDP6ubVeBzMlalpAbHcTTiYBob";

export const DRIVE_FOLDER_MIME = "application/vnd.google-apps.folder";

const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
  "audio/flac", "audio/aiff", "audio/x-aiff", "audio/ogg", "audio/x-m4a",
]);
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".aiff", ".ogg", ".m4a"];

export type DriveItemType = "folder" | "audio" | "file";

export interface DriveItem {
  id: string;
  name: string;
  type: DriveItemType;
  mimeType: string;
  size: number | null;        // bytes (files only)
  modifiedTime: string | null;
  previewUrl: string | null;  // Drive iframe preview (audio/files)
  streamUrl: string | null;   // best-effort direct stream (audio)
  viewUrl: string | null;     // open in Drive
}

export interface DriveListing {
  mode: "drive" | "demo";
  folderId: string;
  folderName: string;
  items: DriveItem[];
}

function isAudio(name: string, mime: string): boolean {
  const n = name.toLowerCase();
  return AUDIO_MIME_TYPES.has(mime) || AUDIO_EXTENSIONS.some((e) => n.endsWith(e));
}

// ── OAuth: refresh-token → short-lived access token ──────────────────────────
export async function getDriveAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
  const valid =
    refreshToken.length > 20 &&
    !refreshToken.startsWith("PEGA_") &&
    refreshToken !== "tu_refresh_token_aqui";
  if (!clientId || !clientSecret || !valid) return null;

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
    const data = (await res.json()) as { access_token?: string };
    return data.access_token || null;
  } catch {
    return null;
  }
}

interface RawDriveFile {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
  size?: string | null;
  modifiedTime?: string | null;
  webViewLink?: string | null;
}

function mapDriveFile(f: RawDriveFile): DriveItem | null {
  if (!f.id || !f.name) return null;
  const mime = f.mimeType || "";
  const isFolder = mime === DRIVE_FOLDER_MIME;
  const audio = !isFolder && isAudio(f.name, mime);
  return {
    id: f.id,
    name: f.name,
    type: isFolder ? "folder" : audio ? "audio" : "file",
    mimeType: mime,
    size: f.size ? Number(f.size) : null,
    modifiedTime: f.modifiedTime || null,
    previewUrl: isFolder ? null : `https://drive.google.com/file/d/${f.id}/preview`,
    streamUrl: audio ? `https://docs.google.com/uc?export=open&id=${f.id}` : null,
    viewUrl: f.webViewLink || `https://drive.google.com/drive/folders/${f.id}`,
  };
}

/** List the immediate children (folders first) of a Drive folder. */
export async function listDriveFolder(
  accessToken: string,
  folderId: string
): Promise<DriveItem[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType,size,modifiedTime,webViewLink)",
    orderBy: "folder,name",
    pageSize: "200",
    // Support folders shared with the authorizing account + Shared Drives.
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { files?: RawDriveFile[] };
  return (data.files || []).map(mapDriveFile).filter((x): x is DriveItem => x !== null);
}

/** Fetch a folder's own name (for breadcrumb root label). */
export async function getDriveFolderName(
  accessToken: string,
  folderId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}?fields=name&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { name?: string };
    return data.name || null;
  } catch {
    return null;
  }
}

// ── Demo tree (used until a real GOOGLE_REFRESH_TOKEN is configured) ──────────
// A representative producer Drive so the visualizer looks great immediately.
function folder(id: string, name: string): DriveItem {
  return { id, name, type: "folder", mimeType: DRIVE_FOLDER_MIME, size: null, modifiedTime: null, previewUrl: null, streamUrl: null, viewUrl: null };
}
function audioFile(id: string, name: string, size: number): DriveItem {
  return { id, name, type: "audio", mimeType: "audio/mpeg", size, modifiedTime: null, previewUrl: null, streamUrl: null, viewUrl: null };
}

const DEMO: Record<string, { name: string; items: DriveItem[] }> = {
  root: {
    name: "BEATS — Prod. Mvxii",
    items: [
      folder("d_regg", "Reggaetón"),
      folder("d_trap", "Trap"),
      folder("d_drill", "Drill"),
      folder("d_afro", "Afrobeat"),
      folder("d_packs", "Packs Exclusivos"),
      audioFile("a_r0", "Intro Mvxii - 92bpm - Reggaeton.mp3", 4210000),
    ],
  },
  d_regg: {
    name: "Reggaetón",
    items: [
      folder("d_regg_os", "Old School"),
      audioFile("a_r1", "Perreo Intenso - 96bpm - Reggaeton.mp3", 5120000),
      audioFile("a_r2", "Malianteo Dark - 94bpm - Reggaeton.mp3", 4980000),
      audioFile("a_r3", "Cris MJ Type Beat - 98bpm.mp3", 5340000),
    ],
  },
  d_regg_os: {
    name: "Old School",
    items: [
      audioFile("a_r4", "Clasico 2008 - 95bpm - Reggaeton.mp3", 4720000),
      audioFile("a_r5", "Dembow Viejo - 100bpm.mp3", 4410000),
    ],
  },
  d_trap: {
    name: "Trap",
    items: [
      audioFile("a_t1", "Dark 808 - 140bpm - Trap.mp3", 5510000),
      audioFile("a_t2", "Melodic Trap - 145bpm.mp3", 5230000),
      audioFile("a_t3", "Hard Trap - 138bpm - Trap.mp3", 4990000),
    ],
  },
  d_drill: {
    name: "Drill",
    items: [
      audioFile("a_d1", "London Drill - 142bpm - Drill.mp3", 5050000),
      audioFile("a_d2", "Sliding 808 - 144bpm.mp3", 4870000),
    ],
  },
  d_afro: {
    name: "Afrobeat",
    items: [
      audioFile("a_af1", "Afro Vibes - 105bpm - Afrobeat.mp3", 4630000),
      audioFile("a_af2", "Amapiano Smooth - 112bpm.mp3", 4410000),
    ],
  },
  d_packs: {
    name: "Packs Exclusivos",
    items: [
      folder("d_packs_2026", "Pack 2026"),
      audioFile("a_p0", "Exclusivo Premium - 150bpm.mp3", 6120000),
    ],
  },
  d_packs_2026: {
    name: "Pack 2026",
    items: [
      audioFile("a_p1", "Hit Maker - 128bpm.mp3", 5710000),
      audioFile("a_p2", "Radio Ready - 100bpm.mp3", 5390000),
      audioFile("a_p3", "Viral TikTok - 130bpm.mp3", 5010000),
    ],
  },
};

export function getDemoListing(folderId: string): DriveListing {
  const key = DEMO[folderId] ? folderId : "root";
  const node = DEMO[key];
  return { mode: "demo", folderId: key, folderName: node.name, items: node.items };
}

/**
 * Resolve a folder listing (real Drive when a token is configured, else demo).
 * Shared by the /api/drive route and the server-rendered DriveExplorer so the
 * root folder ships in the HTML (works in in-app browsers + SEO).
 */
export async function getDriveListing(folderId: string): Promise<DriveListing> {
  const id = folderId || DRIVE_ROOT_FOLDER_ID;
  const accessToken = await getDriveAccessToken();
  if (accessToken) {
    const [items, name] = await Promise.all([
      listDriveFolder(accessToken, id),
      getDriveFolderName(accessToken, id),
    ]);
    if (name !== null || items.length > 0) {
      return { mode: "drive", folderId: id, folderName: name || "BEATS", items };
    }
  }
  return getDemoListing(id);
}
