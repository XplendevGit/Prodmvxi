# Prod. Mvxii — Music Producer App

## Project Overview
Next.js 16 music portfolio app for producer "Maxi" (ProdMvxii). Displays beats from Google Drive, allows audio preview, shows license tiers, and links to social media.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- TypeScript
- Google Drive API v3
- lucide-react (icons)

## Environment Variables
Create or edit `.env.local` at the project root:

```
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_DRIVE_FOLDER_ID=1s77i1a4EbVydfsBdZCO9bqZ6sEU3AOAe
```

### Getting a Google API Key
1. Go to https://console.cloud.google.com/
2. Create a new project → Enable "Google Drive API"
3. APIs & Services → Credentials → Create Credentials → API Key
4. Restrict the key to "Drive API" only
5. Make the Drive folder "BEATS" public: right-click → Share → Anyone with link → Viewer
6. Restart the dev server after adding the key

Without the API key, the app runs in **DEMO MODE** showing 8 sample beats.

## Key Features
- Google Drive integration: beats auto-loaded from folder `1s77i1a4EbVydfsBdZCO9bqZ6sEU3AOAe`
- Audio preview player (HTML5 Audio + Google Drive streaming)
- License tiers: Básica ($9.99), Estándar ($24.99), Premium ($49.99), Exclusiva ($299.99)
- Futuristic UI: purple/black/cyan palette matching Prod. Mvxii logo
- Fully responsive (mobile-first)

## Running
```bash
npm run dev     # development → http://localhost:3000
npm run build   # production build
npm run start   # production server
npm run lint    # lint
```

## Project Structure
```
src/
  app/
    api/beats/route.ts   ← Google Drive API endpoint (returns demo data without API key)
    globals.css           ← Futuristic CSS animations + color tokens
    layout.tsx            ← Root layout + SEO metadata
    page.tsx              ← Main page assembly
  components/
    Navigation.tsx        ← Sticky navbar with logo, nav links, mobile menu
    Hero.tsx              ← 3D animated hero with equalizer + glitch text
    BeatGrid.tsx          ← Fetches beats, manages player state
    BeatCard.tsx          ← Individual beat card with waveform + play button
    AudioPlayer.tsx       ← Fixed bottom audio player
    Licenses.tsx          ← 4-tier license section
    LicenseCard.tsx       ← Individual license card with animated border
    SocialLinks.tsx       ← Social media grid (Instagram, YouTube, TikTok, Spotify, Beatstars, X)
public/
  Logo_Maxi.jpeg          ← Producer logo (copied from Downloads)
```

## Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050508` | Page bg |
| Primary | `#8B5CF6` | Main purple |
| Primary bright | `#A855F7` | Hover/active |
| Accent cyan | `#06B6D4` | Secondary accent |
| Accent pink | `#EC4899` | Glitch/highlight |
| Card dark | `#0D0D1A` | Card backgrounds |
| Deep purple | `#2D1B69` | Hero gradient |

## CSS Animations (globals.css)
- `glitch` / `glitch2` — text chromatic aberration effect on `.glitch-text`
- `equalizer` / `equalizerB` / `equalizerC` — audio bar animations (staggered)
- `float` — particle floating upward
- `glow` / `glowText` — neon pulsing glow
- `waveBar` — waveform bars bounce when playing
- `gradientShift` — animated gradient border rotation
- `fadeInUp` — cards/sections entrance animation
- `pulse-ring` — expanding ring on play button
- `shimmer` — skeleton loading animation

## Beats File Naming Convention
For optimal parsing, name files as:
```
BeatName - BPMbpm - Genre.mp3
```
Example: `Dark Trap 808 - 140bpm - Trap.mp3`

If no BPM/genre in filename, random values are assigned as fallback.

## License Tiers (BeatStars Reference)
All purchase buttons link to https://www.beatstars.com/prodmvxii
Update individual product URLs in `src/components/Licenses.tsx` → `beatstarsUrl` field.

## Social Media Handles (Update as needed)
Edit `src/components/SocialLinks.tsx` to update URLs/handles:
- Instagram: @prodmvxii
- YouTube: @prodmvxii
- TikTok: @prodmvxii
- Spotify: search "prod mvxii"
- BeatStars: beatstars.com/prodmvxii
- Twitter/X: @prodmvxii
