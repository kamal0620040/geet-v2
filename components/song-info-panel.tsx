"use client";

import { AnimatePresence } from "framer-motion";
import { useMusicPlayer } from "@/lib/player-context";
import { SongDisplay, SongDisplaySkeleton } from "@/components/song-display";
import { Timeline, DurationControl } from "@/components/control/timeline";
import { RefObject } from "react";

interface SongInfoPanelProps {
  timelineRef: RefObject<DurationControl | undefined>;
}

export function SongInfoPanel({ timelineRef }: SongInfoPanelProps) {
  const { musicManager, loading, error, currentSong } = useMusicPlayer();

  return (
    <div className="w-full max-w-125 mt-6">
      <Timeline musicManager={musicManager ?? undefined} durationRef={timelineRef} />
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <SongDisplaySkeleton />
        ) : currentSong ? (
          <SongDisplay key={currentSong.id} song={currentSong} />
        ) : error ? (
          <p key="error" className="text-sm text-red-300 mt-4">{error}</p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
