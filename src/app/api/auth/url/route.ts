import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET en .env.local" },
      { status: 500 }
    );
  }

  // Derive the redirect URI from the request origin so it always matches the
  // domain in use (prodmvxii.com in prod, localhost in dev) — no env var needed.
  const origin = new URL(req.url).origin;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/callback`,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/drive.readonly",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
