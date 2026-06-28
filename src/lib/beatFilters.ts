// Curated filter taxonomy derived from the REAL tags of Maxi's 330 BeatStars beats.
// Each entry maps a display label → the lowercase tag substrings that identify it.

export interface Beat {
  id: string;
  name: string;
  bpm: string;
  bpmNum?: number | null;
  genre: string;
  tags?: string[];
  price: string;
  previewUrl: string | null;
  streamUrl?: string | null;
  isHls?: boolean;
  waveformUrl?: string | null;
  artwork?: string | null;
  duration?: number | null;
  beatstarsUrl?: string;
  isDemoMode?: boolean;
  isBeatstarsMode?: boolean;
}

// Sub-styles / vibes (label → matching tag keywords)
export const STYLES: { label: string; keys: string[] }[] = [
  { label: "Old School", keys: ["old school"] },
  { label: "Malianteo", keys: ["malianteo", "maliante"] },
  { label: "Perreo", keys: ["perreo"] },
  { label: "Romántico", keys: ["romantic", "romantico", "romántico", "love", "desamor"] },
  { label: "Chill", keys: ["chill"] },
  { label: "Dembow", keys: ["dembow", "afrodembow"] },
  { label: "Flow", keys: ["flow", "electroflow"] },
  { label: "Underground", keys: ["underground"] },
  { label: "Hard", keys: ["hard", "dark"] },
];

// Type-beat artists (label → matching tag keywords). Ordered by popularity in catalog.
export const ARTISTS: { label: string; keys: string[] }[] = [
  { label: "Cris MJ", keys: ["cris mj", "tobal mj"] },
  { label: "Kidd Voodoo", keys: ["kidd voodoo"] },
  { label: "Ñengo Flow", keys: ["engo flow", "ñengo flow", "nengo flow"] },
  { label: "Jere Klein", keys: ["jere klein"] },
  { label: "Jairo Vera", keys: ["jairo vera"] },
  { label: "Lucky Brown", keys: ["lucky brown"] },
  { label: "Floyymenor", keys: ["floyymenor", "floy menor"] },
  { label: "Sinaka", keys: ["sinaka"] },
  { label: "Galee Galee", keys: ["galee galee"] },
  { label: "Harry Nach", keys: ["harry nach"] },
  { label: "El Jordan 23", keys: ["el jordan 23", "jordan 23"] },
  { label: "Pailita", keys: ["pailita"] },
  { label: "Yan Block", keys: ["yan block"] },
  { label: "Yung Beef", keys: ["yung beef"] },
  { label: "Julianno Sosa", keys: ["julianno sosa", "juliano sosa"] },
  { label: "Young Cister", keys: ["young cister"] },
  { label: "Gino Mella", keys: ["gino mella"] },
  { label: "Pablo Chill-E", keys: ["pablo chill e", "pablo chille", "pablo chill-e"] },
  { label: "Tunechikidd", keys: ["tunechikidd", "tunechi kidd"] },
  { label: "Plan B", keys: ["plan b", "pan b"] },
  { label: "Roa", keys: ["roa"] },
];

export const BPM_RANGES: { label: string; min: number; max: number }[] = [
  { label: "Lento (≤90)", min: 0, max: 90 },
  { label: "Medio (91–100)", min: 91, max: 100 },
  { label: "Rápido (101–120)", min: 101, max: 120 },
  { label: "Muy rápido (120+)", min: 121, max: 9999 },
];

export type SortKey = "recientes" | "bpm-asc" | "bpm-desc" | "az";

function tagsOf(b: Beat): string[] {
  return (b.tags || []).map((t) => t.toLowerCase());
}

function matchesKeys(b: Beat, keys: string[]): boolean {
  const tags = tagsOf(b);
  const title = b.name.toLowerCase();
  return keys.some((k) => title.includes(k) || tags.some((t) => t.includes(k)));
}

export function beatMatchesStyle(b: Beat, styleLabel: string): boolean {
  const s = STYLES.find((x) => x.label === styleLabel);
  return s ? matchesKeys(b, s.keys) : true;
}

export function beatMatchesArtist(b: Beat, artistLabel: string): boolean {
  const a = ARTISTS.find((x) => x.label === artistLabel);
  return a ? matchesKeys(b, a.keys) : true;
}

// Count how many beats match each option, keeping only options that exist (count > 0)
export function countOptions<T extends { label: string; keys: string[] }>(
  beats: Beat[],
  options: T[]
): { label: string; count: number }[] {
  return options
    .map((o) => ({ label: o.label, count: beats.filter((b) => matchesKeys(b, o.keys)).length }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function bpmNumber(b: Beat): number {
  if (typeof b.bpmNum === "number") return b.bpmNum;
  const n = parseInt(b.bpm, 10);
  return isNaN(n) ? 0 : n;
}
