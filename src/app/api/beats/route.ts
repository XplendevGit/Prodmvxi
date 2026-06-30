import { NextResponse } from "next/server";
import { getBeats } from "@/lib/beats";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  const page = Math.max(0, parseInt(searchParams.get("page") || "0", 10) || 0);
  const size = Math.min(100, Math.max(1, parseInt(searchParams.get("size") || "12", 10) || 12));

  const result = await getBeats({ all, page, size });
  return NextResponse.json(
    { beats: result.beats, page, total: result.total, hasMore: result.hasMore, mode: result.mode },
    { headers: CACHE_HEADERS }
  );
}
