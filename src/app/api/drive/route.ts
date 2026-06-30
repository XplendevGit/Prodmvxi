import { NextResponse } from "next/server";
import {
  DRIVE_ROOT_FOLDER_ID,
  getDriveAccessToken,
  listDriveFolder,
  getDriveFolderName,
  getDemoListing,
  type DriveListing,
} from "@/lib/googleDrive";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

// GET /api/drive?folderId=<id>
// Lists the immediate children (folders first, then files) of a Drive folder.
// Falls back to a representative demo tree until GOOGLE_REFRESH_TOKEN is set.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId") || DRIVE_ROOT_FOLDER_ID;

  const accessToken = await getDriveAccessToken();

  if (accessToken) {
    const [items, name] = await Promise.all([
      listDriveFolder(accessToken, folderId),
      getDriveFolderName(accessToken, folderId),
    ]);
    // Only treat as a real listing if Drive actually responded with content or a name.
    if (name !== null || items.length > 0) {
      const listing: DriveListing = {
        mode: "drive",
        folderId,
        folderName: name || "BEATS",
        items,
      };
      return NextResponse.json(listing, { headers: CACHE_HEADERS });
    }
  }

  // Fallback: demo tree
  return NextResponse.json(getDemoListing(folderId), { headers: CACHE_HEADERS });
}
