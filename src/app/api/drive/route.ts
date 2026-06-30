import { NextResponse } from "next/server";
import { DRIVE_ROOT_FOLDER_ID, getDriveListing } from "@/lib/googleDrive";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

// GET /api/drive?folderId=<id>
// Lists the immediate children (folders first, then files) of a Drive folder.
// Falls back to a representative demo tree until GOOGLE_REFRESH_TOKEN is set.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") || DRIVE_ROOT_FOLDER_ID;
  const listing = await getDriveListing(folderId);
  return NextResponse.json(listing, { headers: CACHE_HEADERS });
}
