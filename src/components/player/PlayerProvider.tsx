"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { Beat } from "@/lib/beatFilters";

interface PlayerContextValue {
  currentBeat: Beat | null;
  isPlaying: boolean;
  /** Play a beat (and optionally set the prev/next queue). Toggles if it's the same beat. */
  play: (beat: Beat, queue?: Beat[]) => void;
  /** Pre-select a beat in the player WITHOUT starting playback (only if nothing is selected). */
  feature: (beat: Beat, queue?: Beat[]) => void;
  setPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
}

/**
 * Single source of truth for the bottom audio player on the home page. Renders
 * ONE <AudioPlayer> + the WhatsApp float, so both the catalog (BeatGrid) and the
 * Drive folder (DriveExplorer) play through the exact same player.
 */
export default function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Beat[]>([]);

  const play = useCallback(
    (beat: Beat, q?: Beat[]) => {
      if (q) setQueue(q);
      if (currentBeat?.id === beat.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentBeat(beat);
        setIsPlaying(true);
      }
    },
    [currentBeat]
  );

  const feature = useCallback((beat: Beat, q?: Beat[]) => {
    if (q) setQueue(q);
    setCurrentBeat((prev) => prev ?? beat); // don't override an active selection
  }, []);

  return (
    <PlayerContext.Provider value={{ currentBeat, isPlaying, play, feature, setPlaying: setIsPlaying }}>
      {children}
      {currentBeat && (
        <AudioPlayer
          currentBeat={currentBeat}
          beats={queue}
          isPlaying={isPlaying}
          onPlayingChange={setIsPlaying}
          onBeatChange={(b) => {
            setCurrentBeat(b);
            setIsPlaying(true);
          }}
        />
      )}
      <WhatsAppFloat playerActive={!!currentBeat} />
    </PlayerContext.Provider>
  );
}
